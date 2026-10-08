import express from 'express';
import { getStore, saveStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all batches
router.get('/', authMiddleware, (req, res) => {
  const store = getStore();
  const tutorId = req.user.id;

  const batches = store.batches
    .filter(b => b.tutorId === tutorId || b.tutorId === 'tutor_tanmoy_001')
    .map(batch => {
      const studentCount = store.students.filter(s => s.batchId === batch._id && s.status === 'ACTIVE').length;
      return {
        ...batch,
        studentCount
      };
    });

  res.json(batches);
});

// POST new batch
router.post('/', authMiddleware, (req, res) => {
  const { name, subject, classGrade, scheduleDays, timeSlot, monthlyFee, capacity } = req.body;
  if (!name || !subject || !classGrade) {
    return res.status(400).json({ message: 'Batch name, subject, and class grade are required.' });
  }

  const store = getStore();
  const newBatch = {
    _id: `batch_${Date.now()}`,
    tutorId: req.user.id,
    name,
    subject,
    classGrade,
    scheduleDays: scheduleDays || ['Monday', 'Wednesday', 'Friday'],
    timeSlot: timeSlot || '04:00 PM - 05:00 PM',
    monthlyFee: Number(monthlyFee) || 1200,
    capacity: Number(capacity) || 25,
    createdAt: new Date().toISOString()
  };

  store.batches.push(newBatch);
  saveStore();
  res.status(201).json({ ...newBatch, studentCount: 0 });
});

// PUT update batch
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();
  const index = store.batches.findIndex(b => b._id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Batch not found.' });
  }

  store.batches[index] = {
    ...store.batches[index],
    ...req.body,
    monthlyFee: Number(req.body.monthlyFee) || store.batches[index].monthlyFee,
    capacity: Number(req.body.capacity) || store.batches[index].capacity
  };

  saveStore();
  const studentCount = store.students.filter(s => s.batchId === id && s.status === 'ACTIVE').length;
  res.json({ ...store.batches[index], studentCount });
});

// DELETE batch
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();
  store.batches = store.batches.filter(b => b._id !== id);
  saveStore();
  res.json({ message: 'Batch deleted successfully.' });
});

export default router;
