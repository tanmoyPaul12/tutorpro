import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  UserCheck, Award, Calendar, CheckCircle2, IndianRupee, 
  Clock, Shield, Phone, Sparkles, BookOpen 
} from 'lucide-react';

export default function ParentPortalView() {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default to Rahul Das (std_rahul_01)
    fetch('/api/parent/student/std_rahul_01', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div style={{ padding: '30px', textAlign: 'center' }}>Loading Parent Transparency Portal...</div>;
  }

  const student = data?.student || {};
  const attendance = data?.attendance || {};
  const fees = data?.fees || [];
  const tests = data?.tests || [];
  const upcomingClasses = data?.upcomingClasses || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Simulation Info Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(139, 92, 246, 0.1))',
        border: '1px solid var(--primary-border)',
        borderRadius: '16px',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>
              Parent Transparency Portal Simulation
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Logged in as parent: <strong>{student.parentName || 'Amit Das'}</strong> (Father of {student.name || 'Rahul Das'})
            </div>
          </div>
        </div>
        <span className="badge badge-success">Live Read-Only View</span>
      </div>

      {/* Student Profile Card */}
      <div className="card" style={{ padding: '26px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #06b6d4)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800
            }}>
              {student.name ? student.name.charAt(0) : 'R'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{student.name || 'Rahul Das'}</h2>
                <span className="badge badge-primary">{student.classGrade || 'Class 10'}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
                Batch: <strong>{student.batchName}</strong> • Roll No: {student.rollNo || '10-M-01'}
              </p>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface-hover)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: 'var(--text-muted)' }}>Instructor / Academy</div>
            <div style={{ fontWeight: 700 }}>{student.tutorName || 'Instructor'}</div>
            <div style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>{student.academyName || 'Tuition Academy'}</div>
          </div>
        </div>
      </div>

      {/* Grid: Attendance & Test Scores */}
      <div className="dashboard-grid-equal">
        {/* Attendance Widget */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="var(--success)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Attendance Record</h3>
            </div>
            <span className="badge badge-success">High Consistency</span>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Overall Attendance Rate</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--success)' }}>{attendance.percentage || 91}%</strong>
            </div>

            {/* Visual ASCII / Bar Progress */}
            <div style={{ height: '10px', background: 'var(--bg-surface-hover)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${attendance.percentage || 91}%`,
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                borderRadius: '6px'
              }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Attended {attendance.attended || 11} of {attendance.totalSessions || 12} classes this semester.
            </div>
          </div>

          {/* Recent Attendance Timeline */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Recent Sessions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { date: '08 Oct 2026', status: 'PRESENT', topic: 'Quadratic Equations' },
                { date: '06 Oct 2026', status: 'PRESENT', topic: 'Polynomial Factorization' },
                { date: '04 Oct 2026', status: 'PRESENT', topic: 'Doubt Solving Class' }
              ].map((log, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-hover)',
                  fontSize: '0.8125rem'
                }}>
                  <span>{log.date} ({log.topic})</span>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>✓ Present</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tests & Scorecard Widget */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Tests & Scores</h3>
            </div>
            <span className="badge badge-primary">Rank #2 in Batch</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tests.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent tests recorded.</div>
            ) : (
              tests.map((t, idx) => (
                <div key={idx} style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{t.title}</div>
                    <span className="badge badge-success">Rank #{t.rank}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Score: <strong>{t.marksObtained} / {t.totalMarks}</strong></span>
                    <strong style={{ color: 'var(--primary)' }}>{t.percentage}%</strong>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Teacher Note: "{t.feedback || 'Great problem-solving skills'}"
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Grid: Fees Ledger & Upcoming Classes */}
      <div className="dashboard-grid-equal">
        {/* Fee Receipts & Status */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IndianRupee size={18} color="#10b981" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Tuition Fee Receipts</h3>
            </div>
            <span className="badge badge-success">No Pending Dues</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fees.map(f => (
              <div key={f._id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem'
              }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{f.month}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Receipt: {f.receiptNumber || 'TP-2026-101'} • via {f.paymentMode}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{f.amount}</div>
                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>✓ Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--secondary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Upcoming Class Schedule</h3>
            </div>
            <span className="badge badge-primary">Next Class Today</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingClasses.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem'
              }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.topic}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.venue}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.date}</div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
