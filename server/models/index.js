import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['TUTOR', 'PARENT', 'STUDENT'], default: 'TUTOR' },
  phone: { type: String, default: '' },
  academyName: { type: String, default: 'My Tuition Academy' },
  subject: { type: String, default: 'All Subjects' },
  studentCountTarget: { type: Number, default: 30 },
  subscriptionPlan: { type: String, enum: ['FREE', 'STARTER', 'PRO', 'INSTITUTE'], default: 'STARTER' },
  onboardingCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const batchSchema = new mongoose.Schema({
  tutorId: { type: String, required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  classGrade: { type: String, required: true },
  scheduleDays: [{ type: String }],
  timeSlot: { type: String, required: true },
  monthlyFee: { type: Number, required: true },
  capacity: { type: Number, default: 30 },
  createdAt: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  tutorId: { type: String, required: true },
  batchId: { type: String, required: true },
  name: { type: String, required: true },
  rollNo: { type: String, default: '' },
  classGrade: { type: String, required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String, default: '' },
  monthlyFee: { type: Number, required: true },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
});

const attendanceSchema = new mongoose.Schema({
  tutorId: { type: String, required: true },
  batchId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  records: [{
    studentId: { type: String, required: true },
    studentName: { type: String, default: '' },
    status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE'], default: 'PRESENT' },
    remark: { type: String, default: '' },
    alertSent: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

const feeSchema = new mongoose.Schema({
  tutorId: { type: String, required: true },
  studentId: { type: String, required: true },
  batchId: { type: String, required: true },
  month: { type: String, required: true }, // e.g. "October 2026"
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PAID', 'PENDING', 'OVERDUE'], default: 'PENDING' },
  dueDate: { type: Date },
  paidDate: { type: Date },
  paymentMode: { type: String, enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'PENDING'], default: 'PENDING' },
  receiptNumber: { type: String, default: '' },
  reminderCount: { type: Number, default: 0 },
  lastReminderSentAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const testSchema = new mongoose.Schema({
  tutorId: { type: String, required: true },
  batchId: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  testDate: { type: String, required: true }, // YYYY-MM-DD
  scores: [{
    studentId: { type: String, required: true },
    studentName: { type: String, default: '' },
    marksObtained: { type: Number, required: true },
    percentage: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    feedback: { type: String, default: '' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);
export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
export const Fee = mongoose.models.Fee || mongoose.model('Fee', feeSchema);
export const Test = mongoose.models.Test || mongoose.model('Test', testSchema);
