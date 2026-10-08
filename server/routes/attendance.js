import express from 'express';
import { getStore, saveStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET attendance for a batch & date
router.get('/', authMiddleware, (req, res) => {
  const { batchId, date } = req.query;
  const store = getStore();
  const tutorId = req.user.id;
  const queryDate = date || new Date().toISOString().split('T')[0];

  if (!batchId) {
    return res.status(400).json({ message: 'batchId is required.' });
  }

  // Find existing session
  const existing = store.attendance.find(a => a.batchId === batchId && a.date === queryDate);

  // Get active students in this batch
  const studentsInBatch = store.students.filter(s => s.batchId === batchId && s.status === 'ACTIVE');

  if (existing) {
    return res.json({
      isNew: false,
      attendanceId: existing._id,
      date: existing.date,
      batchId: existing.batchId,
      records: existing.records
    });
  }

  // Generate blank roll-call roster
  const blankRecords = studentsInBatch.map(s => ({
    studentId: s._id,
    studentName: s.name,
    parentName: s.parentName,
    parentPhone: s.parentPhone,
    status: 'PRESENT',
    remark: '',
    alertSent: false
  }));

  res.json({
    isNew: true,
    attendanceId: null,
    date: queryDate,
    batchId,
    records: blankRecords
  });
});

// POST save attendance
router.post('/', authMiddleware, (req, res) => {
  const { batchId, date, records } = req.body;
  if (!batchId || !date || !records) {
    return res.status(400).json({ message: 'batchId, date, and records are required.' });
  }

  const store = getStore();
  const existingIndex = store.attendance.findIndex(a => a.batchId === batchId && a.date === date);

  const payload = {
    _id: existingIndex !== -1 ? store.attendance[existingIndex]._id : `att_${Date.now()}`,
    tutorId: req.user.id,
    batchId,
    date,
    records,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex !== -1) {
    store.attendance[existingIndex] = payload;
  } else {
    store.attendance.push(payload);
  }

  saveStore();
  res.json({ message: 'Attendance recorded successfully.', data: payload });
});

// POST trigger automated absent notification
router.post('/alert', authMiddleware, (req, res) => {
  const { studentId, batchId, date, customMessage } = req.body;
  const store = getStore();
  const student = store.students.find(s => s._id === studentId);
  const batch = store.batches.find(b => b._id === batchId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  const batchName = batch ? batch.name : 'Tuition Class';
  const displayDate = date || new Date().toISOString().split('T')[0];

  const defaultMsg = `Dear ${student.parentName}, your child ${student.name} was marked ABSENT for ${batchName} on ${displayDate}. Kindly contact the academy if you were unaware. - TutorPro Alert`;
  const messageText = customMessage || defaultMsg;
  const cleanPhone = student.parentPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;

  // Mark in attendance record if exists
  const att = store.attendance.find(a => a.batchId === batchId && a.date === displayDate);
  if (att) {
    const rec = att.records.find(r => r.studentId === studentId);
    if (rec) {
      rec.alertSent = true;
      saveStore();
    }
  }

  res.json({
    success: true,
    studentName: student.name,
    parentName: student.parentName,
    phone: student.parentPhone,
    message: messageText,
    whatsappUrl,
    timestamp: new Date().toISOString()
  });
});

export default router;
