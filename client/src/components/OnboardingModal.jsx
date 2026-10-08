import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle2, ArrowRight, Sparkles, Building, BookOpen, Users, Calendar } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { updateOnboarding, user, token, switchDemoPersona } = useAuth();

  const [formData, setFormData] = useState({
    academyName: user?.academyName || "Tanmoy's Mathematics Academy",
    subject: "Mathematics",
    studentCountTarget: 30,
    batchName: "Class 10 Mathematics",
    classGrade: "Class 10",
    monthlyFee: 1200,
    timeSlot: "04:00 PM - 05:00 PM",
    scheduleDays: ["Monday", "Wednesday", "Friday"],
    loadDemoStudents: true
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      if (!token) {
        await switchDemoPersona('tutor');
      }
      await updateOnboarding({
        academyName: formData.academyName,
        subject: formData.subject,
        studentCountTarget: formData.studentCountTarget,
        initialBatch: {
          name: formData.batchName,
          subject: formData.subject,
          classGrade: formData.classGrade,
          monthlyFee: formData.monthlyFee,
          timeSlot: formData.timeSlot,
          scheduleDays: formData.scheduleDays
        }
      });
      setStep(4); // celebration screen
    } catch (err) {
      alert('Error updating onboarding: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        {/* Step Indicator Header */}
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.04em' }}>
              {step <= 3 ? `STEP ${step} OF 3` : 'ONBOARDING COMPLETE'}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {step === 1 && "What's your tuition profile?"}
              {step === 2 && "Create your first batch"}
              {step === 3 && "Student onboarding"}
              {step === 4 && "🎉 You're ready to roll!"}
            </h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'var(--border-subtle)', width: '100%' }}>
          <div style={{
            height: '100%',
            background: 'var(--primary)',
            width: `${(step / 4) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Step Content */}
        <div className="modal-body">
          {/* STEP 1: Academy & Subject */}
          {step === 1 && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
                Welcome to TutorPro 👋 Let's set up your tuition profile in 2 minutes.
              </p>

              <div className="form-group">
                <label className="form-label">What's your tuition/coaching name?</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.academyName}
                  onChange={(e) => setFormData({ ...formData, academyName: e.target.value })}
                  placeholder="e.g. Tanmoy's Mathematics Academy"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Subject</label>
                <select
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Science (PCB)">Science (PCB)</option>
                  <option value="Commerce & Accounts">Commerce & Accounts</option>
                  <option value="All Subjects">All Subjects</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">How many students do you currently have?</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.studentCountTarget}
                  onChange={(e) => setFormData({ ...formData, studentCountTarget: e.target.value })}
                  placeholder="30"
                />
              </div>
            </div>
          )}

          {/* STEP 2: First Batch Setup */}
          {step === 2 && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
                Batches help you organize schedules, attendance roll-calls, and monthly fee brackets.
              </p>

              <div className="form-group">
                <label className="form-label">Batch Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  placeholder="e.g. Class 10 Mathematics"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Target Class / Grade</label>
                  <select
                    className="form-select"
                    value={formData.classGrade}
                    onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="JEE / NEET">JEE / NEET</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    placeholder="1200"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Class Timing</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  placeholder="04:00 PM - 05:00 PM"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Student Onboarding */}
          {step === 3 && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
                How would you like to populate your initial student roster?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div
                  onClick={() => setFormData({ ...formData, loadDemoStudents: true })}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: formData.loadDemoStudents ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: formData.loadDemoStudents ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Sparkles size={20} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      ⚡ Pre-populate Realistic Indian Coaching Data (Recommended for Viva)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Includes Rahul Das, Ananya Sharma, Rohan Gupta, test scores, attendance & fees.
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, loadDemoStudents: false })}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: !formData.loadDemoStudents ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: !formData.loadDemoStudents ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Users size={20} color="var(--text-secondary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      Start Clean & Add Students Manually Later
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      You can add students one by one or import via CSV inside the dashboard.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Celebration */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '2rem'
              }}>
                🎉
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                Your TutorPro Dashboard is Ready!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '380px', margin: '0 auto 24px' }}>
                Your batches, students, schedule, fee ledger, and parent portal access have been configured successfully.
              </p>

              <button
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', padding: '14px' }}
              >
                <span>Enter TutorPro Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step <= 3 && (
          <div className="modal-footer">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary btn-sm"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="btn btn-primary"
            >
              <span>{submitting ? 'Setting Up...' : (step === 3 ? 'Finish Setup' : 'Continue')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
