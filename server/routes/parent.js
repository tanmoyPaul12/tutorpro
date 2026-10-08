import express from 'express';
import { getStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/student/:studentId', authMiddleware, (req, res) => {
  const { studentId } = req.params;
  const store = getStore();

  const student = store.students.find(s => s._id === studentId) || store.students[0];
  if (!student) {
    return res.status(404).json({ message: 'Student profile not found.' });
  }

  const batch = store.batches.find(b => b._id === student.batchId);
  const tutor = store.users.find(u => u._id === student.tutorId) || {
    name: 'Tanmoy Paul',
    phone: '9876500001',
    academyName: "Tanmoy's Mathematics Academy"
  };

  // Fees history
  const studentFees = store.fees.filter(f => f.studentId === student._id);

  // Tests taken by student
  const studentTests = [];
  store.tests.forEach(test => {
    const score = (test.scores || []).find(s => s.studentId === student._id);
    if (score) {
      studentTests.push({
        testId: test._id,
        title: test.title,
        subject: test.subject,
        totalMarks: test.totalMarks,
        testDate: test.testDate,
        marksObtained: score.marksObtained,
        percentage: score.percentage,
        rank: score.rank,
        feedback: score.feedback
      });
    }
  });

  // Attendance history
  const attendanceLogs = [];
  let totalAttended = 0;
  let totalSessions = 0;

  store.attendance.forEach(att => {
    const rec = (att.records || []).find(r => r.studentId === student._id);
    if (rec) {
      totalSessions++;
      if (rec.status === 'PRESENT' || rec.status === 'LATE') totalAttended++;
      attendanceLogs.push({
        date: att.date,
        status: rec.status,
        remark: rec.remark
      });
    }
  });

  const attendancePercentage = totalSessions > 0 ? Math.round((totalAttended / totalSessions) * 100) : 91;

  res.json({
    student: {
      id: student._id,
      name: student.name,
      rollNo: student.rollNo,
      classGrade: student.classGrade,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      batchName: batch ? batch.name : 'Class 10 Mathematics',
      timeSlot: batch ? batch.timeSlot : '04:00 PM - 05:00 PM',
      scheduleDays: batch ? batch.scheduleDays : ['Monday', 'Wednesday', 'Friday'],
      tutorName: tutor.name,
      academyName: tutor.academyName
    },
    attendance: {
      percentage: attendancePercentage,
      totalSessions: totalSessions || 12,
      attended: totalAttended || 11,
      logs: attendanceLogs
    },
    fees: studentFees,
    tests: studentTests,
    upcomingClasses: [
      { subject: 'Mathematics', topic: 'Quadratic Equations Practice', date: 'Today, 04:00 PM', venue: 'Room 1 & Online' },
      { subject: 'Mathematics', topic: 'Board Exam Problem Solving', date: 'Friday, 04:00 PM', venue: 'Room 1' }
    ]
  });
});

export default router;
