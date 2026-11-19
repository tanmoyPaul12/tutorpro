import express from 'express';
import { getStore, saveStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ==================== BRANCHES ====================

// GET all branches
router.get('/branches', authMiddleware, (req, res) => {
  const store = getStore();
  const tutorId = req.user.id;

  const branches = (store.branches || []).filter(b => 
    b.tutorId === tutorId || b.tutorId === 'tutor_tanmoy_001'
  );

  // Enrich with current batch & student count per branch
  const enriched = branches.map(branch => {
    const branchBatches = (store.batches || []).filter(b => b.branchId === branch._id);
    const branchBatchIds = branchBatches.map(b => b._id);
    const branchStudents = (store.students || []).filter(s => branchBatchIds.includes(s.batchId));

    return {
      ...branch,
      batchCount: branchBatches.length,
      activeStudents: branchStudents.length
    };
  });

  res.json(enriched);
});

// POST new branch
router.post('/branches', authMiddleware, (req, res) => {
  const { name, code, city, address, phone, studentCapacity } = req.body;
  if (!name || !city) {
    return res.status(400).json({ message: 'Branch name and city are required.' });
  }

  const store = getStore();
  if (!store.branches) store.branches = [];

  const newBranch = {
    _id: `branch_${Date.now()}`,
    tutorId: req.user.id,
    name,
    code: code || `BR-0${store.branches.length + 1}`,
    city,
    address: address || '',
    phone: phone || '',
    studentCapacity: Number(studentCapacity) || 300,
    createdAt: new Date().toISOString()
  };

  store.branches.push(newBranch);
  saveStore();

  res.status(201).json({ ...newBranch, batchCount: 0, activeStudents: 0 });
});

// PUT update branch
router.put('/branches/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();

  const branch = (store.branches || []).find(b => b._id === id);
  if (!branch) {
    return res.status(404).json({ message: 'Branch not found.' });
  }

  const { name, code, city, address, phone, studentCapacity } = req.body;
  if (name !== undefined) branch.name = name;
  if (code !== undefined) branch.code = code;
  if (city !== undefined) branch.city = city;
  if (address !== undefined) branch.address = address;
  if (phone !== undefined) branch.phone = phone;
  if (studentCapacity !== undefined) branch.studentCapacity = Number(studentCapacity) || branch.studentCapacity;

  saveStore();
  res.json(branch);
});

// DELETE branch
router.delete('/branches/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();

  store.branches = (store.branches || []).filter(b => b._id !== id);
  saveStore();

  res.json({ message: 'Branch removed successfully.' });
});

// ==================== FACULTY ====================

// GET all faculty
router.get('/faculty', authMiddleware, (req, res) => {
  const store = getStore();
  const tutorId = req.user.id;

  const facultyList = (store.faculty || []).filter(f => 
    f.instituteId === tutorId || f.instituteId === 'tutor_tanmoy_001'
  );

  // Enrich with branch names
  const enriched = facultyList.map(f => {
    const branch = (store.branches || []).find(b => b._id === f.branchId);
    return {
      ...f,
      branchName: branch ? branch.name : 'All Campuses'
    };
  });

  res.json(enriched);
});

// POST add faculty
router.post('/faculty', authMiddleware, (req, res) => {
  const { name, role, email, phone, branchId, assignedBatches, rating } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, email, and academic role are required.' });
  }

  const store = getStore();
  if (!store.faculty) store.faculty = [];

  const newFaculty = {
    _id: `fac_${Date.now()}`,
    instituteId: req.user.id,
    name,
    role,
    email,
    phone: phone || '',
    branchId: branchId || 'branch_kolkata_south',
    assignedBatches: assignedBatches || [],
    rating: Number(rating) || 4.8,
    status: 'ACTIVE',
    joinedDate: new Date().toISOString().split('T')[0]
  };

  store.faculty.push(newFaculty);
  saveStore();

  const branch = (store.branches || []).find(b => b._id === newFaculty.branchId);
  res.status(201).json({ ...newFaculty, branchName: branch ? branch.name : 'All Campuses' });
});

// PUT update faculty
router.put('/faculty/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();

  const fac = (store.faculty || []).find(f => f._id === id);
  if (!fac) {
    return res.status(404).json({ message: 'Faculty member not found.' });
  }

  const { name, role, email, phone, branchId, assignedBatches, status } = req.body;
  if (name !== undefined) fac.name = name;
  if (role !== undefined) fac.role = role;
  if (email !== undefined) fac.email = email;
  if (phone !== undefined) fac.phone = phone;
  if (branchId !== undefined) fac.branchId = branchId;
  if (assignedBatches !== undefined) fac.assignedBatches = assignedBatches;
  if (status !== undefined) fac.status = status;

  saveStore();
  res.json(fac);
});

// DELETE faculty
router.delete('/faculty/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();

  store.faculty = (store.faculty || []).filter(f => f._id !== id);
  saveStore();

  res.json({ message: 'Faculty member removed successfully.' });
});

// ==================== BRANDING ====================

// GET branding settings
router.get('/settings', authMiddleware, (req, res) => {
  const store = getStore();
  const branding = store.branding || {
    instituteId: req.user.id,
    logoUrl: '',
    tagline: 'Empowering Next-Gen Scholars through Conceptual Mastery',
    primaryColor: '#4f46e5',
    customDomain: 'academy.tutorpro.in',
    announcement: 'Welcome to our Academy Portal'
  };

  res.json(branding);
});

// PUT update branding settings
router.put('/settings', authMiddleware, (req, res) => {
  const store = getStore();
  const { logoUrl, tagline, primaryColor, customDomain, announcement } = req.body;

  store.branding = {
    ...store.branding,
    instituteId: req.user.id,
    logoUrl: logoUrl !== undefined ? logoUrl : store.branding?.logoUrl || '',
    tagline: tagline !== undefined ? tagline : store.branding?.tagline || '',
    primaryColor: primaryColor !== undefined ? primaryColor : store.branding?.primaryColor || '#4f46e5',
    customDomain: customDomain !== undefined ? customDomain : store.branding?.customDomain || '',
    announcement: announcement !== undefined ? announcement : store.branding?.announcement || ''
  };

  saveStore();
  res.json({ message: 'Custom institute branding updated successfully.', branding: store.branding });
});

export default router;
