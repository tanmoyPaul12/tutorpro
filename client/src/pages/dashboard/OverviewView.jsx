import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Calendar, CheckCircle2, IndianRupee, AlertCircle, 
  ArrowUpRight, Clock, Plus, Send, Award, Bell
} from 'lucide-react';

export default function OverviewView({ onNavigateTab }) {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard:', err);
        setLoading(false);
      });
  }, [token]);

  const metrics = data?.metrics || {
    totalStudents: 84,
    activeBatches: 6,
    todayClassesCount: 3,
    revenueCollected: 48500,
    pendingFees: 7200,
    attendanceRate: 91
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner & Quick Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(6, 182, 212, 0.08))',
        border: '1px solid var(--primary-border)',
        borderRadius: '20px',
        padding: '24px 28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.4rem' }}>👋</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              Welcome back, {user?.name || 'Tutor'}!
            </h2>
            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
              Academy Active
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Here is your tuition business operations summary for today, 08 Oct 2026.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="btn btn-primary btn-sm"
          >
            <CheckCircle2 size={16} />
            <span>Take Today's Attendance</span>
          </button>
          <button
            onClick={() => onNavigateTab('fees')}
            className="btn btn-secondary btn-sm"
          >
            <Send size={16} />
            <span>Send Fee Reminders</span>
          </button>
          <button
            onClick={() => onNavigateTab('students')}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Students */}
        <div className="card card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Total Students</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.totalStudents}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
            +6 enrolled this month
          </div>
        </div>

        {/* Active Batches */}
        <div className="card card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Active Batches</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--secondary)' }}>
              <Calendar size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.activeBatches}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Class 9 to 12
          </div>
        </div>

        {/* Today's Classes */}
        <div className="card card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Today's Classes</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent)' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.todayClassesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 600 }}>
            Next starts 4:00 PM
          </div>
        </div>

        {/* Fees This Month */}
        <div className="card card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Fees Collected</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
              <IndianRupee size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{metrics.revenueCollected?.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
            88% collection rate
          </div>
        </div>

        {/* Pending Fees */}
        <div className="card card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Pending Fees</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>
            ₹{metrics.pendingFees?.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '4px', fontWeight: 600 }}>
            Action required
          </div>
        </div>

        {/* Overall Attendance */}
        <div className="card card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Attendance</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.attendanceRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
            High consistency
          </div>
        </div>
      </div>

      {/* Two Column Layout: Schedule & Revenue Chart */}
      <div className="dashboard-grid-2col">
        {/* Today's Classes Schedule */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Today's Classes Schedule</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Thursday, 08 October 2026</p>
            </div>
            <button onClick={() => onNavigateTab('batches')} className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
              View Timetable →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { time: '4:00 PM - 5:00 PM', batch: 'Class 10 Mathematics', subject: 'Quadratic Equations', room: 'Batch A • Room 1', count: 20, status: 'Ready to Start' },
              { time: '5:30 PM - 6:30 PM', batch: 'Class 12 Physics', subject: 'Current Electricity Numericals', room: 'Physics Lab • 16 Students', count: 16, status: 'Upcoming' },
              { time: '7:00 PM - 8:00 PM', batch: 'Class 11 Mathematics', subject: 'Trigonometric Functions', room: 'Online Live • 24 Students', count: 24, status: 'Scheduled' }
            ].map((cls, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: idx === 0 ? 'var(--primary)' : 'var(--bg-surface)',
                    color: idx === 0 ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    textAlign: 'center'
                  }}>
                    {cls.time.split(' - ')[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cls.batch}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {cls.subject} • {cls.room}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('attendance')}
                  className={idx === 0 ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                >
                  {idx === 0 ? 'Start & Roll Call' : 'Roster'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Communication Stream */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Activity</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Automated SaaS logs</p>
            </div>
            <span className="badge badge-primary">Real-time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: IndianRupee, color: '#10b981', title: 'Fee Paid via UPI', desc: 'Rahul Das paid ₹1,200 (Receipt #101)', time: '10 mins ago' },
              { icon: Bell, color: '#f59e0b', title: 'WhatsApp Absent Alert', desc: 'Sent to Rohan Gupta’s parent (Rajesh)', time: '1 hour ago' },
              { icon: CheckCircle2, color: 'var(--primary)', title: 'Attendance Completed', desc: 'Class 10 Mathematics: 92% present', time: '1 hour ago' },
              { icon: Award, color: '#8b5cf6', title: 'Unit Test Results Saved', desc: 'Ananya Sharma ranked #1 (96%)', time: 'Yesterday' }
            ].map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-hover)',
                    color: act.color,
                    marginTop: '2px'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{act.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.desc}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>{act.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
