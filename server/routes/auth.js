import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getStore, saveStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tutorpro_secret_key_college_project_2026';

// Register
router.post('/register', (req, res) => {
  const { name, email, password, phone, role = 'TUTOR', academyName, userType } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const store = getStore();
  const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }

  const newUser = {
    _id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    phone: phone || '',
    role: role || 'TUTOR',
    userType: userType || 'INDIVIDUAL_TUTOR',
    academyName: academyName || `${name}'s Academy`,
    subject: 'All Subjects',
    studentCountTarget: 30,
    subscriptionPlan: 'STARTER',
    onboardingCompleted: false,
    createdAt: new Date().toISOString()
  };

  store.users.push(newUser);
  saveStore();

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ token, user: userSafe });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const store = getStore();
  const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userSafe } = user;
  res.json({ token, user: userSafe });
});

// Get Current User
router.get('/me', authMiddleware, (req, res) => {
  const store = getStore();
  const user = store.users.find(u => u._id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe });
});

// Complete Onboarding
router.post('/onboarding', authMiddleware, (req, res) => {
  const { academyName, subject, studentCountTarget, initialBatch } = req.body;
  const store = getStore();
  const user = store.users.find(u => u._id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.academyName = academyName || user.academyName;
  user.subject = subject || user.subject;
  user.studentCountTarget = Number(studentCountTarget) || user.studentCountTarget;
  user.onboardingCompleted = true;

  if (initialBatch && initialBatch.name) {
    const newBatch = {
      _id: `batch_${Date.now()}`,
      tutorId: user._id,
      name: initialBatch.name,
      subject: initialBatch.subject || user.subject,
      classGrade: initialBatch.classGrade || 'Class 10',
      scheduleDays: initialBatch.scheduleDays || ['Monday', 'Wednesday', 'Friday'],
      timeSlot: initialBatch.timeSlot || '04:00 PM - 05:00 PM',
      monthlyFee: Number(initialBatch.monthlyFee) || 1200,
      capacity: 25,
      createdAt: new Date().toISOString()
    };
    store.batches.push(newBatch);
  }

  saveStore();
  const { password: _, ...userSafe } = user;
  res.json({ message: 'Onboarding completed successfully!', user: userSafe });
});

// Update Subscription Plan
router.post('/plan', authMiddleware, (req, res) => {
  const { plan } = req.body;
  const store = getStore();
  const user = store.users.find(u => u._id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.subscriptionPlan = plan;
  saveStore();
  const { password: _, ...userSafe } = user;
  res.json({ message: `Plan updated to ${plan}`, user: userSafe });
});

// Switch Demo Personas (Instant one-click evaluation switcher)
router.post('/switch-demo', (req, res) => {
  const { persona } = req.body; // 'tutor' or 'parent'
  const store = getStore();

  let targetUser;
  if (persona === 'parent') {
    targetUser = store.users.find(u => u.role === 'PARENT');
  } else {
    targetUser = store.users.find(u => u.role === 'TUTOR');
  }

  if (!targetUser) {
    return res.status(404).json({ message: 'Demo persona not found.' });
  }

  const token = jwt.sign(
    { id: targetUser._id, email: targetUser.email, role: targetUser.role, name: targetUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userSafe } = targetUser;
  res.json({ token, user: userSafe });
});

export default router;
