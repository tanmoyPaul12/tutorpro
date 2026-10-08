import express from 'express';
import { getStore, saveStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all tests
router.get('/', authMiddleware, (req, res) => {
  const store = getStore();
  const { batchId } = req.query;
  const tutorId = req.user.id;

  let list = store.tests.filter(t => t.tutorId === tutorId || t.tutorId === 'tutor_tanmoy_001');

  if (batchId && batchId !== 'ALL') {
    list = list.filter(t => t.batchId === batchId);
  }

  const enriched = list.map(test => {
    const batch = store.batches.find(b => b._id === test.batchId);
    const scores = test.scores || [];
    
    let highest = 0;
    let lowest = test.totalMarks;
    let totalScore = 0;

    if (scores.length > 0) {
      scores.forEach(s => {
        if (s.marksObtained > highest) highest = s.marksObtained;
        if (s.marksObtained < lowest) lowest = s.marksObtained;
        totalScore += s.marksObtained;
      });
    } else {
      lowest = 0;
    }

    const average = scores.length > 0 ? (totalScore / scores.length).toFixed(1) : 0;
    const averagePercentage = scores.length > 0 ? Math.round((average / test.totalMarks) * 100) : 0;

    return {
      ...test,
      batchName: batch ? batch.name : 'General',
      studentCount: scores.length,
      highestScore: highest,
      lowestScore: lowest,
      averageScore: Number(average),
      averagePercentage
    };
  });

  res.json(enriched);
});

// GET single test by ID
router.get('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const store = getStore();
  const test = store.tests.find(t => t._id === id);

  if (!test) {
    return res.status(404).json({ message: 'Test not found.' });
  }

  const batch = store.batches.find(b => b._id === test.batchId);
  res.json({
    ...test,
    batchName: batch ? batch.name : 'General'
  });
});

// POST create test
router.post('/', authMiddleware, (req, res) => {
  const { title, batchId, subject, totalMarks, testDate, scores = [] } = req.body;
  if (!title || !batchId || !totalMarks) {
    return res.status(400).json({ message: 'Title, batch, and total marks are required.' });
  }

  const store = getStore();
  const batch = store.batches.find(b => b._id === batchId);

  // Auto-calculate percentage and sort to calculate ranks
  const processedScores = scores.map(s => {
    const student = store.students.find(std => std._id === s.studentId);
    const marks = Number(s.marksObtained) || 0;
    const pct = Math.round((marks / Number(totalMarks)) * 100);
    return {
      studentId: s.studentId,
      studentName: student ? student.name : s.studentName,
      marksObtained: marks,
      percentage: pct,
      feedback: s.feedback || (pct >= 80 ? 'Excellent performance' : pct >= 60 ? 'Good effort' : 'Needs attention')
    };
  });

  // Sort descending by marks to assign rank
  processedScores.sort((a, b) => b.marksObtained - a.marksObtained);
  processedScores.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  const newTest = {
    _id: `test_${Date.now()}`,
    tutorId: req.user.id,
    batchId,
    title,
    subject: subject || (batch ? batch.subject : 'General'),
    totalMarks: Number(totalMarks),
    testDate: testDate || new Date().toISOString().split('T')[0],
    scores: processedScores,
    createdAt: new Date().toISOString()
  };

  store.tests.push(newTest);
  saveStore();

  res.status(201).json(newTest);
});

export default router;
