import express from 'express';
import { getStore, saveStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all fee records with filters
router.get('/', authMiddleware, (req, res) => {
  const store = getStore();
  const { month = 'October 2026', status, batchId } = req.query;
  const tutorId = req.user.id;

  let list = store.fees.filter(f => f.tutorId === tutorId || f.tutorId === 'tutor_tanmoy_001');

  if (month && month !== 'ALL') {
    list = list.filter(f => f.month === month);
  }

  if (status && status !== 'ALL') {
    list = list.filter(f => f.status === status);
  }

  if (batchId && batchId !== 'ALL') {
    list = list.filter(f => f.batchId === batchId);
  }

  // Enrich with student and batch details
  const enriched = list.map(fee => {
    const student = store.students.find(s => s._id === fee.studentId);
    const batch = store.batches.find(b => b._id === fee.batchId);
    return {
      ...fee,
      studentName: student ? student.name : 'Unknown Student',
      rollNo: student ? student.rollNo : '',
      parentName: student ? student.parentName : '',
      parentPhone: student ? student.parentPhone : '',
      parentEmail: student ? student.parentEmail : '',
      batchName: batch ? batch.name : 'Unassigned',
      classGrade: student ? student.classGrade : ''
    };
  });

  // Calculate summary statistics
  const totalAmount = enriched.reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = enriched.filter(f => f.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = enriched.filter(f => f.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);

  res.json({
    summary: {
      totalAmount,
      paidAmount,
      pendingAmount,
      totalCount: enriched.length,
      paidCount: enriched.filter(f => f.status === 'PAID').length,
      pendingCount: enriched.filter(f => f.status === 'PENDING').length
    },
    fees: enriched
  });
});

// POST Mark fee as paid
router.post('/:id/pay', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { paymentMode = 'UPI', receiptNumber } = req.body;
  const store = getStore();

  const fee = store.fees.find(f => f._id === id);
  if (!fee) {
    return res.status(404).json({ message: 'Fee record not found.' });
  }

  fee.status = 'PAID';
  fee.paymentMode = paymentMode;
  fee.paidDate = new Date().toISOString().split('T')[0];
  fee.receiptNumber = receiptNumber || `TP-${Date.now().toString().slice(-6)}`;

  saveStore();
  res.json({ message: 'Fee payment recorded successfully!', fee });
});

// POST Send WhatsApp Reminder
router.post('/:id/remind', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();

  const fee = store.fees.find(f => f._id === id);
  if (!fee) {
    return res.status(404).json({ message: 'Fee record not found.' });
  }

  const student = store.students.find(s => s._id === fee.studentId);
  const tutor = store.users.find(u => u._id === fee.tutorId) || { academyName: "Tanmoy's Academy" };

  if (!student) {
    return res.status(404).json({ message: 'Associated student not found.' });
  }

  fee.reminderCount = (fee.reminderCount || 0) + 1;
  fee.lastReminderSentAt = new Date().toISOString().split('T')[0];
  saveStore();

  const reminderText = `Dear ${student.parentName}, this is a gentle reminder from ${tutor.academyName || 'TutorPro'} that the tuition fee of ₹${fee.amount} for ${student.name} (${fee.month}) is currently pending. Kindly clear the dues at your earliest convenience via UPI/Cash. Thank you!`;
  
  const cleanPhone = student.parentPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(reminderText)}`;

  res.json({
    success: true,
    message: 'Reminder generated and logged.',
    reminderCount: fee.reminderCount,
    studentName: student.name,
    parentName: student.parentName,
    phone: student.parentPhone,
    text: reminderText,
    whatsappUrl
  });
});

export default router;
