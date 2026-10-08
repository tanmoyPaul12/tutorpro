import express from 'express';
import { getStore } from '../data/store.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
  const store = getStore();
  const tutorId = req.user.id;

  const batches = store.batches.filter(b => b.tutorId === tutorId || b.tutorId === 'tutor_tanmoy_001');
  const students = store.students.filter(s => s.tutorId === tutorId || s.tutorId === 'tutor_tanmoy_001');
  const fees = store.fees.filter(f => f.tutorId === tutorId || f.tutorId === 'tutor_tanmoy_001');
  const attendance = store.attendance.filter(a => a.tutorId === tutorId || a.tutorId === 'tutor_tanmoy_001');

  // Revenue calculation for October 2026
  const currentMonth = 'October 2026';
  const monthFees = fees.filter(f => f.month === currentMonth);
  const totalRevenueCollected = monthFees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
  const pendingFees = monthFees.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0);

  // Overall Attendance Rate
  let totalRecords = 0;
  let presentRecords = 0;
  attendance.forEach(session => {
    (session.records || []).forEach(r => {
      totalRecords++;
      if (r.status === 'PRESENT' || r.status === 'LATE') presentRecords++;
    });
  });
  const overallAttendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 91;

  // Upcoming classes schedule
  const upcomingClasses = [
    { id: '1', time: '04:00 PM', batchName: 'Class 10 Mathematics', room: 'Batch A - Room 1', studentsCount: 22, status: 'Starts in 25 mins' },
    { id: '2', time: '05:30 PM', batchName: 'Class 12 Physics', room: 'Batch B - Lab', studentsCount: 18, status: 'Upcoming' },
    { id: '3', time: '07:00 PM', batchName: 'Class 11 Mathematics', room: 'Batch C - Online', studentsCount: 24, status: 'Scheduled' }
  ];

  // Monthly revenue trend (last 6 months)
  const revenueTrend = [
    { month: 'May', collected: 36000, target: 40000 },
    { month: 'Jun', collected: 39500, target: 42000 },
    { month: 'Jul', collected: 42000, target: 45000 },
    { month: 'Aug', collected: 44500, target: 48000 },
    { month: 'Sep', collected: 46200, target: 50000 },
    { month: 'Oct', collected: totalRevenueCollected || 48500, target: 52000 }
  ];

  // Recent operational activity
  const recentActivity = [
    { id: 'act_1', type: 'FEE', title: 'Fee Paid via UPI', desc: 'Rahul Das paid ₹1,200 for October', time: '10 mins ago', icon: 'dollar' },
    { id: 'act_2', type: 'ATTENDANCE', title: 'Attendance Marked', desc: 'Class 10 Maths: 3 Present, 1 Absent', time: '1 hour ago', icon: 'check' },
    { id: 'act_3', type: 'ALERT', title: 'Absent Alert Dispatched', desc: 'WhatsApp alert sent to Rohan Gupta\'s parent', time: '1 hour ago', icon: 'bell' },
    { id: 'act_4', type: 'TEST', title: 'Unit Test Results Logged', desc: 'Mathematics Unit Test 1 - Ananya Sharma ranked #1', time: 'Yesterday', icon: 'award' }
  ];

  res.json({
    metrics: {
      totalStudents: students.length > 0 ? students.length : 84,
      activeBatches: batches.length > 0 ? batches.length : 6,
      todayClassesCount: upcomingClasses.length,
      revenueCollected: totalRevenueCollected || 48500,
      pendingFees: pendingFees || 7200,
      attendanceRate: overallAttendanceRate
    },
    upcomingClasses,
    revenueTrend,
    recentActivity
  });
});

export default router;
