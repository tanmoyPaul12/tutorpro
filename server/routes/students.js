import express from 'express';
import { getStore, saveStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all students
router.get('/', authMiddleware, (req, res) => {
  const store = getStore();
  const { batchId, search } = req.query;
  const tutorId = req.user.id;

  let list = store.students.filter(s => s.tutorId === tutorId || s.tutorId === 'tutor_tanmoy_001');

  if (batchId && batchId !== 'ALL') {
    list = list.filter(s => s.batchId === batchId);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.parentName.toLowerCase().includes(q) || 
      s.rollNo.toLowerCase().includes(q) ||
      s.parentPhone.includes(q)
    );
  }

  // Enrich with batchName and current month fee status
  const currentMonth = 'October 2026';
  const enriched = list.map(student => {
    const batch = store.batches.find(b => b._id === student.batchId);
    const feeRecord = store.fees.find(f => f.studentId === student._id && f.month === currentMonth);
    
    // Calculate simple attendance percentage
    const allAttendance = store.attendance.filter(a => a.batchId === student.batchId);
    let totalPresent = 0;
    let totalSessions = 0;
    allAttendance.forEach(att => {
      const rec = att.records.find(r => r.studentId === student._id);
      if (rec) {
        totalSessions++;
        if (rec.status === 'PRESENT' || rec.status === 'LATE') totalPresent++;
      }
    });
    const attendancePct = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 92;

    return {
      ...student,
      batchName: batch ? batch.name : 'Unassigned',
      batchSubject: batch ? batch.subject : '',
      feeStatus: feeRecord ? feeRecord.status : 'PENDING',
      attendancePercentage: attendancePct
    };
  });

  res.json(enriched);
});

// POST add student
router.post('/', authMiddleware, (req, res) => {
  const { name, batchId, classGrade, parentName, parentPhone, parentEmail, monthlyFee, rollNo } = req.body;
  if (!name || !batchId || !parentName || !parentPhone) {
    return res.status(400).json({ message: 'Name, batch, parent name, and parent phone are required.' });
  }

  const store = getStore();
  const batch = store.batches.find(b => b._id === batchId);
  const feeAmount = Number(monthlyFee) || (batch ? batch.monthlyFee : 1200);

  const newStudent = {
    _id: `std_${Date.now()}`,
    tutorId: req.user.id,
    batchId,
    name,
    rollNo: rollNo || `ROLL-${Math.floor(100 + Math.random() * 900)}`,
    classGrade: classGrade || (batch ? batch.classGrade : 'Class 10'),
    parentName,
    parentPhone,
    parentEmail: parentEmail || '',
    monthlyFee: feeAmount,
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  };

  store.students.push(newStudent);

  // Auto-generate fee record for current month
  const currentMonth = 'October 2026';
  store.fees.push({
    _id: `fee_${Date.now()}`,
    tutorId: req.user.id,
    studentId: newStudent._id,
    batchId: newStudent.batchId,
    month: currentMonth,
    amount: feeAmount,
    status: 'PENDING',
    dueDate: '2026-10-10',
    paymentMode: 'PENDING',
    receiptNumber: '',
    reminderCount: 0
  });

  saveStore();

  res.status(201).json({
    ...newStudent,
    batchName: batch ? batch.name : '',
    feeStatus: 'PENDING',
    attendancePercentage: 100
  });
});

// PUT update student
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();
  const index = store.students.findIndex(s => s._id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  store.students[index] = {
    ...store.students[index],
    ...req.body,
    monthlyFee: Number(req.body.monthlyFee) || store.students[index].monthlyFee
  };

  saveStore();
  res.json(store.students[index]);
});

// DELETE student
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();
  store.students = store.students.filter(s => s._id !== id);
  saveStore();
  res.json({ message: 'Student deleted successfully.' });
});

export default router;
