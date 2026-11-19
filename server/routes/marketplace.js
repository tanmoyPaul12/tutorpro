import express from 'express';
import { getStore, saveStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all public marketplace tutors (Publicly accessible)
router.get('/tutors', (req, res) => {
  const store = getStore();
  const { subject, grade, mode, city, maxPrice, search } = req.query;

  let list = (store.marketplaceTutors || []).filter(t => t.isPublic);

  if (subject && subject !== 'ALL') {
    const s = subject.toLowerCase();
    list = list.filter(t => t.subject.toLowerCase().includes(s));
  }

  if (grade && grade !== 'ALL') {
    list = list.filter(t => (t.grades || []).includes(grade));
  }

  if (mode && mode !== 'ALL') {
    const m = mode.toLowerCase();
    list = list.filter(t => t.mode.toLowerCase().includes(m));
  }

  if (city && city !== 'ALL') {
    const c = city.toLowerCase();
    list = list.filter(t => t.city.toLowerCase().includes(c));
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max) && max > 0) {
      list = list.filter(t => t.hourlyRate <= max);
    }
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.subject.toLowerCase().includes(q) ||
      t.bio.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

// GET single tutor public profile by ID or tutorId
router.get('/tutors/:id', (req, res) => {
  const { id } = req.params;
  const store = getStore();

  const tutor = (store.marketplaceTutors || []).find(t => t._id === id || t.tutorId === id);
  if (!tutor) {
    return res.status(404).json({ message: 'Tutor not found in marketplace directory.' });
  }

  // Find tutor batches for schedule guidance
  const batches = (store.batches || [])
    .filter(b => b.tutorId === tutor.tutorId)
    .map(b => ({
      name: b.name,
      subject: b.subject,
      classGrade: b.classGrade,
      scheduleDays: b.scheduleDays,
      timeSlot: b.timeSlot
    }));

  res.json({
    ...tutor,
    batches
  });
});

// POST book demo class (Publicly accessible for parents)
router.post('/book-demo', (req, res) => {
  const {
    tutorId,
    parentName,
    parentPhone,
    studentName,
    grade,
    subject,
    preferredDate,
    timeSlot,
    notes
  } = req.body;

  if (!tutorId || !parentName || !parentPhone || !studentName) {
    return res.status(400).json({ message: 'Tutor ID, parent name, phone, and student name are required.' });
  }

  const store = getStore();
  const tutor = (store.marketplaceTutors || []).find(t => t.tutorId === tutorId || t._id === tutorId);
  const demoFee = tutor ? tutor.demoFee : 200;
  const platformFee = Math.round(demoFee * 0.05); // 5% marketplace commission
  const tutorPayout = demoFee - platformFee;

  const newBooking = {
    _id: `demo_${Date.now()}`,
    tutorId: tutor ? tutor.tutorId : tutorId,
    tutorName: tutor ? tutor.name : 'Tutor',
    parentName,
    parentPhone,
    studentName,
    grade: grade || 'Class 10',
    subject: subject || (tutor ? tutor.subject : 'General'),
    preferredDate: preferredDate || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || '05:00 PM - 06:00 PM',
    status: 'PENDING',
    demoFee,
    platformFee,
    tutorPayout,
    notes: notes || 'Demo class booking via TutorPro Marketplace',
    createdAt: new Date().toISOString()
  };

  if (!store.demoBookings) {
    store.demoBookings = [];
  }
  store.demoBookings.unshift(newBooking);
  saveStore();

  res.status(201).json({
    message: 'Demo class booked successfully! The tutor will contact you to confirm.',
    booking: newBooking
  });
});

// GET tutor's incoming demo leads (Tutor Dashboard)
router.get('/my-leads', authMiddleware, (req, res) => {
  const store = getStore();
  const tutorId = req.user.id;

  const leads = (store.demoBookings || []).filter(b => 
    b.tutorId === tutorId || b.tutorId === 'tutor_tanmoy_001'
  );

  const totalCommissionGenerated = leads.reduce((acc, curr) => acc + (curr.platformFee || 10), 0);
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'CONVERTED').length;

  res.json({
    summary: {
      totalLeads,
      convertedLeads,
      totalCommissionGenerated
    },
    leads
  });
});

// PATCH update lead status (CONFIRMED, COMPLETED, CANCELLED)
router.patch('/leads/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const store = getStore();

  const booking = (store.demoBookings || []).find(b => b._id === id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking lead not found.' });
  }

  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  saveStore();

  res.json({ message: `Demo lead marked as ${status}`, booking });
});

// POST convert demo lead into regular student
router.post('/leads/:id/convert', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { batchId, monthlyFee } = req.body;
  const store = getStore();

  const booking = (store.demoBookings || []).find(b => b._id === id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking lead not found.' });
  }

  const batch = store.batches.find(b => b._id === batchId) || store.batches[0];
  const feeAmount = Number(monthlyFee) || (batch ? batch.monthlyFee : 1200);

  // Create student
  const newStudent = {
    _id: `std_${Date.now()}`,
    tutorId: req.user.id,
    batchId: batch ? batch._id : 'batch_10_maths',
    name: booking.studentName,
    rollNo: `TP-${Date.now().toString().slice(-4)}`,
    classGrade: booking.grade || (batch ? batch.classGrade : 'Class 10'),
    parentName: booking.parentName,
    parentPhone: booking.parentPhone,
    parentEmail: '',
    monthlyFee: feeAmount,
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  };

  store.students.push(newStudent);

  // Generate current month fee entry
  const currentMonth = 'October 2026';
  store.fees.push({
    _id: `fee_${Date.now()}`,
    tutorId: req.user.id,
    studentId: newStudent._id,
    batchId: newStudent.batchId,
    month: currentMonth,
    amount: feeAmount,
    status: 'PENDING',
    paymentMode: 'PENDING',
    receiptNumber: '',
    reminderCount: 0,
    createdAt: new Date().toISOString()
  });

  // Mark booking as converted
  booking.status = 'CONVERTED';
  booking.convertedStudentId = newStudent._id;
  booking.updatedAt = new Date().toISOString();

  saveStore();

  res.status(201).json({
    message: `🎉 ${booking.studentName} has been enrolled into ${batch ? batch.name : 'tuition batch'}!`,
    student: newStudent,
    booking
  });
});

// PUT update tutor's public marketplace profile
router.put('/profile', authMiddleware, (req, res) => {
  const store = getStore();
  const tutorId = req.user.id;

  let profile = (store.marketplaceTutors || []).find(t => t.tutorId === tutorId || t.tutorId === 'tutor_tanmoy_001');

  if (!profile) {
    profile = {
      _id: `mkt_${Date.now()}`,
      tutorId,
      name: req.user.name || 'Tutor',
      title: 'Tuition Faculty',
      avatarEmoji: '👨‍🏫',
      subject: req.user.subject || 'All Subjects',
      grades: ['Class 9', 'Class 10'],
      city: 'Kolkata',
      mode: 'Hybrid',
      experienceYears: 5,
      hourlyRate: 500,
      demoFee: 200,
      rating: 5.0,
      reviewCount: 1,
      bio: '',
      highlights: ['Personal Attention', 'Weekly Tests'],
      verified: true,
      isPublic: true
    };
    if (!store.marketplaceTutors) store.marketplaceTutors = [];
    store.marketplaceTutors.push(profile);
  }

  const {
    title,
    subject,
    grades,
    city,
    mode,
    hourlyRate,
    demoFee,
    bio,
    highlights,
    isPublic
  } = req.body;

  if (title !== undefined) profile.title = title;
  if (subject !== undefined) profile.subject = subject;
  if (grades !== undefined) profile.grades = grades;
  if (city !== undefined) profile.city = city;
  if (mode !== undefined) profile.mode = mode;
  if (hourlyRate !== undefined) profile.hourlyRate = Number(hourlyRate) || profile.hourlyRate;
  if (demoFee !== undefined) profile.demoFee = Number(demoFee) || profile.demoFee;
  if (bio !== undefined) profile.bio = bio;
  if (highlights !== undefined) profile.highlights = highlights;
  if (isPublic !== undefined) profile.isPublic = isPublic;

  saveStore();
  res.json({ message: 'Marketplace profile updated successfully.', profile });
});

export default router;
