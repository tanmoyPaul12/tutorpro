import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, Batch, Student, Attendance, Fee, Test } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Check if MongoDB is connected
export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Seed dataset
const getInitialData = () => {
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  const tutorId = 'tutor_tanmoy_001';
  const parentId = 'parent_amit_001';

  const batches = [
    {
      _id: 'batch_10_maths',
      tutorId,
      name: 'Class 10 Mathematics (Board Batch)',
      subject: 'Mathematics',
      classGrade: 'Class 10',
      scheduleDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlot: '04:00 PM - 05:00 PM',
      monthlyFee: 1200,
      capacity: 25,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'batch_12_physics',
      tutorId,
      name: 'Class 12 Physics (Board & CUET)',
      subject: 'Physics',
      classGrade: 'Class 12',
      scheduleDays: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlot: '05:30 PM - 06:30 PM',
      monthlyFee: 1500,
      capacity: 20,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'batch_11_maths',
      tutorId,
      name: 'Class 11 Mathematics (Foundation)',
      subject: 'Mathematics',
      classGrade: 'Class 11',
      scheduleDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlot: '07:00 PM - 08:00 PM',
      monthlyFee: 1400,
      capacity: 30,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'batch_9_science',
      tutorId,
      name: 'Class 9 Science (Junior Batch)',
      subject: 'Science',
      classGrade: 'Class 9',
      scheduleDays: ['Tuesday', 'Thursday'],
      timeSlot: '04:00 PM - 05:00 PM',
      monthlyFee: 1000,
      capacity: 15,
      createdAt: new Date().toISOString()
    }
  ];

  const students = [
    {
      _id: 'std_rahul_01',
      tutorId,
      batchId: 'batch_10_maths',
      name: 'Rahul Das',
      rollNo: '10-M-01',
      classGrade: 'Class 10',
      parentName: 'Amit Das',
      parentPhone: '9876543210',
      parentEmail: 'amit.das@gmail.com',
      monthlyFee: 1200,
      joiningDate: '2026-06-01',
      status: 'ACTIVE'
    },
    {
      _id: 'std_ananya_02',
      tutorId,
      batchId: 'batch_10_maths',
      name: 'Ananya Sharma',
      rollNo: '10-M-02',
      classGrade: 'Class 10',
      parentName: 'Suresh Sharma',
      parentPhone: '9876543211',
      parentEmail: 'suresh.sharma@gmail.com',
      monthlyFee: 1200,
      joiningDate: '2026-06-05',
      status: 'ACTIVE'
    },
    {
      _id: 'std_rohan_03',
      tutorId,
      batchId: 'batch_10_maths',
      name: 'Rohan Gupta',
      rollNo: '10-M-03',
      classGrade: 'Class 10',
      parentName: 'Rajesh Gupta',
      parentPhone: '9876543212',
      parentEmail: 'rajesh.gupta@gmail.com',
      monthlyFee: 1200,
      joiningDate: '2026-06-10',
      status: 'ACTIVE'
    },
    {
      _id: 'std_priya_04',
      tutorId,
      batchId: 'batch_10_maths',
      name: 'Priya Patel',
      rollNo: '10-M-04',
      classGrade: 'Class 10',
      parentName: 'Manoj Patel',
      parentPhone: '9876543213',
      parentEmail: 'manoj.patel@gmail.com',
      monthlyFee: 1200,
      joiningDate: '2026-06-15',
      status: 'ACTIVE'
    },
    {
      _id: 'std_vikram_05',
      tutorId,
      batchId: 'batch_12_physics',
      name: 'Vikram Roy',
      rollNo: '12-P-01',
      classGrade: 'Class 12',
      parentName: 'Debasis Roy',
      parentPhone: '9876543214',
      parentEmail: 'debasis.roy@gmail.com',
      monthlyFee: 1500,
      joiningDate: '2026-05-15',
      status: 'ACTIVE'
    },
    {
      _id: 'std_sneha_06',
      tutorId,
      batchId: 'batch_12_physics',
      name: 'Sneha Sen',
      rollNo: '12-P-02',
      classGrade: 'Class 12',
      parentName: 'Subhas Sen',
      parentPhone: '9876543215',
      parentEmail: 'subhas.sen@gmail.com',
      monthlyFee: 1500,
      joiningDate: '2026-05-20',
      status: 'ACTIVE'
    },
    {
      _id: 'std_arjun_07',
      tutorId,
      batchId: 'batch_11_maths',
      name: 'Arjun Verma',
      rollNo: '11-M-01',
      classGrade: 'Class 11',
      parentName: 'Rakesh Verma',
      parentPhone: '9876543216',
      parentEmail: 'rakesh.verma@gmail.com',
      monthlyFee: 1400,
      joiningDate: '2026-07-01',
      status: 'ACTIVE'
    },
    {
      _id: 'std_pooja_08',
      tutorId,
      batchId: 'batch_11_maths',
      name: 'Pooja Mukherjee',
      rollNo: '11-M-02',
      classGrade: 'Class 11',
      parentName: 'Alok Mukherjee',
      parentPhone: '9876543217',
      parentEmail: 'alok.m@gmail.com',
      monthlyFee: 1400,
      joiningDate: '2026-07-05',
      status: 'ACTIVE'
    },
    {
      _id: 'std_kabir_09',
      tutorId,
      batchId: 'batch_9_science',
      name: 'Kabir Bose',
      rollNo: '9-S-01',
      classGrade: 'Class 9',
      parentName: 'Sayan Bose',
      parentPhone: '9876543218',
      parentEmail: 'sayan.bose@gmail.com',
      monthlyFee: 1000,
      joiningDate: '2026-07-10',
      status: 'ACTIVE'
    },
    {
      _id: 'std_riya_10',
      tutorId,
      batchId: 'batch_9_science',
      name: 'Riya Mondal',
      rollNo: '9-S-02',
      classGrade: 'Class 9',
      parentName: 'Tapan Mondal',
      parentPhone: '9876543219',
      parentEmail: 'tapan.m@gmail.com',
      monthlyFee: 1000,
      joiningDate: '2026-07-12',
      status: 'ACTIVE'
    }
  ];

  const today = new Date().toISOString().split('T')[0];

  const attendance = [
    {
      _id: 'att_001',
      tutorId,
      batchId: 'batch_10_maths',
      date: today,
      records: [
        { studentId: 'std_rahul_01', studentName: 'Rahul Das', status: 'PRESENT', remark: 'On time', alertSent: false },
        { studentId: 'std_ananya_02', studentName: 'Ananya Sharma', status: 'PRESENT', remark: 'Active participant', alertSent: false },
        { studentId: 'std_rohan_03', studentName: 'Rohan Gupta', status: 'ABSENT', remark: 'Uninformed absence', alertSent: true },
        { studentId: 'std_priya_04', studentName: 'Priya Patel', status: 'PRESENT', remark: 'On time', alertSent: false }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  const fees = [
    {
      _id: 'fee_01',
      tutorId,
      studentId: 'std_rahul_01',
      batchId: 'batch_10_maths',
      month: 'October 2026',
      amount: 1200,
      status: 'PAID',
      dueDate: '2026-10-10',
      paidDate: '2026-10-04',
      paymentMode: 'UPI',
      receiptNumber: 'TP-2026-101',
      reminderCount: 0
    },
    {
      _id: 'fee_02',
      tutorId,
      studentId: 'std_ananya_02',
      batchId: 'batch_10_maths',
      month: 'October 2026',
      amount: 1200,
      status: 'PAID',
      dueDate: '2026-10-10',
      paidDate: '2026-10-02',
      paymentMode: 'CASH',
      receiptNumber: 'TP-2026-102',
      reminderCount: 0
    },
    {
      _id: 'fee_03',
      tutorId,
      studentId: 'std_rohan_03',
      batchId: 'batch_10_maths',
      month: 'October 2026',
      amount: 1200,
      status: 'PENDING',
      dueDate: '2026-10-05',
      paymentMode: 'PENDING',
      receiptNumber: '',
      reminderCount: 1,
      lastReminderSentAt: '2026-10-06'
    },
    {
      _id: 'fee_04',
      tutorId,
      studentId: 'std_priya_04',
      batchId: 'batch_10_maths',
      month: 'October 2026',
      amount: 1200,
      status: 'PAID',
      dueDate: '2026-10-10',
      paidDate: '2026-10-05',
      paymentMode: 'UPI',
      receiptNumber: 'TP-2026-104',
      reminderCount: 0
    },
    {
      _id: 'fee_05',
      tutorId,
      studentId: 'std_vikram_05',
      batchId: 'batch_12_physics',
      month: 'October 2026',
      amount: 1500,
      status: 'PAID',
      dueDate: '2026-10-10',
      paidDate: '2026-10-03',
      paymentMode: 'UPI',
      receiptNumber: 'TP-2026-105',
      reminderCount: 0
    },
    {
      _id: 'fee_06',
      tutorId,
      studentId: 'std_sneha_06',
      batchId: 'batch_12_physics',
      month: 'October 2026',
      amount: 1500,
      status: 'PENDING',
      dueDate: '2026-10-05',
      paymentMode: 'PENDING',
      receiptNumber: '',
      reminderCount: 0
    },
    {
      _id: 'fee_07',
      tutorId,
      studentId: 'std_arjun_07',
      batchId: 'batch_11_maths',
      month: 'October 2026',
      amount: 1400,
      status: 'PAID',
      dueDate: '2026-10-10',
      paidDate: '2026-10-06',
      paymentMode: 'UPI',
      receiptNumber: 'TP-2026-107',
      reminderCount: 0
    },
    {
      _id: 'fee_08',
      tutorId,
      studentId: 'std_pooja_08',
      batchId: 'batch_11_maths',
      month: 'October 2026',
      amount: 1400,
      status: 'PENDING',
      dueDate: '2026-10-08',
      paymentMode: 'PENDING',
      receiptNumber: '',
      reminderCount: 0
    },
    {
      _id: 'fee_09',
      tutorId,
      studentId: 'std_kabir_09',
      batchId: 'batch_9_science',
      month: 'October 2026',
      amount: 1000,
      status: 'PAID',
      dueDate: '2026-10-10',
      paidDate: '2026-10-05',
      paymentMode: 'CASH',
      receiptNumber: 'TP-2026-109',
      reminderCount: 0
    },
    {
      _id: 'fee_10',
      tutorId,
      studentId: 'std_riya_10',
      batchId: 'batch_9_science',
      month: 'October 2026',
      amount: 1000,
      status: 'PAID',
      dueDate: '2026-10-10',
      paidDate: '2026-10-07',
      paymentMode: 'UPI',
      receiptNumber: 'TP-2026-110',
      reminderCount: 0
    }
  ];

  const tests = [
    {
      _id: 'test_101',
      tutorId,
      batchId: 'batch_10_maths',
      title: 'Mathematics Unit Test 1 - Quadratic Equations',
      subject: 'Mathematics',
      totalMarks: 25,
      testDate: '2026-09-28',
      scores: [
        { studentId: 'std_rahul_01', studentName: 'Rahul Das', marksObtained: 22, percentage: 88, rank: 2, feedback: 'Great problem-solving skills' },
        { studentId: 'std_ananya_02', studentName: 'Ananya Sharma', marksObtained: 24, percentage: 96, rank: 1, feedback: 'Flawless execution' },
        { studentId: 'std_rohan_03', studentName: 'Rohan Gupta', marksObtained: 14, percentage: 56, rank: 4, feedback: 'Need to revise quadratic formula' },
        { studentId: 'std_priya_04', studentName: 'Priya Patel', marksObtained: 20, percentage: 80, rank: 3, feedback: 'Good conceptual grasp' }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'test_102',
      tutorId,
      batchId: 'batch_12_physics',
      title: 'Physics Chapter 2 - Current Electricity',
      subject: 'Physics',
      totalMarks: 50,
      testDate: '2026-09-30',
      scores: [
        { studentId: 'std_vikram_05', studentName: 'Vikram Roy', marksObtained: 44, percentage: 88, rank: 1, feedback: 'Excellent numerical solving' },
        { studentId: 'std_sneha_06', studentName: 'Sneha Sen', marksObtained: 39, percentage: 78, rank: 2, feedback: 'Strong derivation work' }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  const users = [
    {
      _id: tutorId,
      name: 'Tanmoy Paul',
      email: 'tanmoy@tutorpro.com',
      password: hashedPassword,
      role: 'TUTOR',
      phone: '9876500001',
      academyName: "Tanmoy's Mathematics Academy",
      subject: 'Mathematics & Physics',
      studentCountTarget: 50,
      subscriptionPlan: 'STARTER',
      onboardingCompleted: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: parentId,
      name: 'Amit Das',
      email: 'amit.das@gmail.com',
      password: hashedPassword,
      role: 'PARENT',
      phone: '9876543210',
      academyName: "Tanmoy's Mathematics Academy",
      studentId: 'std_rahul_01',
      onboardingCompleted: true,
      createdAt: new Date().toISOString()
    }
  ];

  return { users, batches, students, attendance, fees, tests };
};

// In-memory / file cache
let dataStore = null;

export const loadStore = () => {
  if (dataStore) return dataStore;
  try {
    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      dataStore = JSON.parse(fileData);
    } else {
      dataStore = getInitialData();
      saveStore();
    }
  } catch (err) {
    console.error('Error loading db.json, using fresh in-memory data:', err);
    dataStore = getInitialData();
  }
  return dataStore;
};

export const saveStore = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dataStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
};

export const getStore = () => {
  return loadStore();
};
