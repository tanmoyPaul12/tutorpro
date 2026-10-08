import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, Users, Clock, IndianRupee, Trash2, X, Check } from 'lucide-react';

export default function BatchesView() {
  const { token } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'timetable'

  const [newBatch, setNewBatch] = useState({
    name: '',
    subject: 'Mathematics',
    classGrade: 'Class 10',
    scheduleDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlot: '04:00 PM - 05:00 PM',
    monthlyFee: 1200,
    capacity: 25
  });

  const fetchBatches = () => {
    fetch('/api/batches', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setBatches(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBatches();
  }, [token]);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newBatch)
      });
      if (!res.ok) throw new Error('Failed to create batch');
      setShowAddModal(false);
      setNewBatch({
        name: '',
        subject: 'Mathematics',
        classGrade: 'Class 10',
        scheduleDays: ['Monday', 'Wednesday', 'Friday'],
        timeSlot: '04:00 PM - 05:00 PM',
        monthlyFee: 1200,
        capacity: 25
      });
      fetchBatches();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleDay = (day) => {
    setNewBatch(prev => {
      const exists = prev.scheduleDays.includes(day);
      if (exists) {
        return { ...prev, scheduleDays: prev.scheduleDays.filter(d => d !== day) };
      } else {
        return { ...prev, scheduleDays: [...prev.scheduleDays, day] };
      }
    });
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Batches & Timetable Schedule</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage classroom batches, grade tracks, weekly slots, and student capacity limits.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--bg-surface)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => setViewMode('cards')}
              className={viewMode === 'cards' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ fontSize: '0.8rem' }}
            >
              Batch Cards
            </button>
            <button
              onClick={() => setViewMode('timetable')}
              className={viewMode === 'timetable' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ fontSize: '0.8rem' }}
            >
              Weekly Timetable
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Create Batch</span>
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {batches.map(batch => {
            const studentCount = batch.studentCount || 0;
            const capacity = batch.capacity || 25;
            const capacityPct = Math.min(100, Math.round((studentCount / capacity) * 100));

            return (
              <div key={batch._id} className="card card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                      {batch.classGrade}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{batch.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{batch.subject}</p>
                  </div>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <Calendar size={18} />
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Clock size={15} color="var(--primary)" />
                    <span>{batch.timeSlot}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Calendar size={15} color="var(--secondary)" />
                    <span>{(batch.scheduleDays || []).join(', ')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <IndianRupee size={15} color="#10b981" />
                    <span><strong>₹{batch.monthlyFee?.toLocaleString('en-IN')}</strong> / month per student</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Batch Enrolled:</span>
                    <strong>{studentCount} / {capacity} Students</strong>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: capacityPct > 80 ? 'var(--warning)' : 'var(--primary)',
                      width: `${capacityPct}%`
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Weekly Timetable View */
        <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Weekly Class Schedule Matrix</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(160px, 1fr))',
            gap: '12px'
          }}>
            {daysOfWeek.map(day => {
              const dayBatches = batches.filter(b => (b.scheduleDays || []).includes(day));
              return (
                <div key={day} style={{
                  background: 'var(--bg-surface-hover)',
                  borderRadius: '12px',
                  padding: '14px 12px',
                  border: '1px solid var(--border-subtle)',
                  minHeight: '220px'
                }}>
                  <div style={{
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    paddingBottom: '8px',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '10px',
                    color: 'var(--text-primary)'
                  }}>
                    {day}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dayBatches.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
                        No classes
                      </div>
                    ) : (
                      dayBatches.map(b => (
                        <div key={b._id} style={{
                          background: 'var(--bg-surface)',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.78rem'
                        }}>
                          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{b.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '2px' }}>{b.timeSlot}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create New Batch</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Batch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 10 Board Revision"
                    className="form-input"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newBatch.subject}
                      onChange={(e) => setNewBatch({ ...newBatch, subject: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class Grade</label>
                    <select
                      className="form-select"
                      value={newBatch.classGrade}
                      onChange={(e) => setNewBatch({ ...newBatch, classGrade: e.target.value })}
                    >
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="JEE / NEET">JEE / NEET</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Schedule Days</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    {daysOfWeek.map(day => {
                      const selected = newBatch.scheduleDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={selected ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                          style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Class Time Slot</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newBatch.timeSlot}
                      onChange={(e) => setNewBatch({ ...newBatch, timeSlot: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Fee (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newBatch.monthlyFee}
                      onChange={(e) => setNewBatch({ ...newBatch, monthlyFee: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
