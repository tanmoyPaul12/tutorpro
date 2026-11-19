import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Plus, Mail, Phone, Building2, Star, Trash2, X, Check, BookOpen } from 'lucide-react';

export default function FacultyView() {
  const { token } = useAuth();
  const [faculty, setFaculty] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    role: 'Senior Faculty - Mathematics',
    email: '',
    phone: '',
    branchId: '',
    assignedBatches: []
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/institute/faculty', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/institute/branches', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/batches', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([facData, branchData, batchData]) => {
        setFaculty(Array.isArray(facData) ? facData : []);
        setBranches(Array.isArray(branchData) ? branchData : []);
        setBatches(Array.isArray(batchData) ? batchData : []);
        if (branchData.length > 0 && !newFaculty.branchId) {
          setNewFaculty(prev => ({ ...prev, branchId: branchData[0]._id }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load faculty data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/institute/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newFaculty)
      });
      if (!res.ok) throw new Error('Failed to add faculty member');
      setShowAddModal(false);
      setNewFaculty({
        name: '',
        role: 'Senior Faculty - Mathematics',
        email: '',
        phone: '',
        branchId: branches[0]?._id || '',
        assignedBatches: []
      });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm('Are you sure you want to remove this faculty record?')) return;
    try {
      const res = await fetch(`/api/institute/faculty/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete faculty');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleBatch = (batchId) => {
    setNewFaculty(prev => {
      const exists = prev.assignedBatches.includes(batchId);
      if (exists) {
        return { ...prev, assignedBatches: prev.assignedBatches.filter(b => b !== batchId) };
      } else {
        return { ...prev, assignedBatches: [...prev.assignedBatches, batchId] };
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Faculty & Academic Staff Directory</h2>
            <span className="badge" style={{ background: '#E1F5EE', color: '#0F6E56', fontWeight: 700, fontSize: '0.72rem' }}>
              Institute Plan Exclusive
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage instructors, batch assignments, subject specializations, and student feedback across all branches.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading faculty registry...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {faculty.map(fac => {
            return (
              <div key={fac._id} className="card card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 800
                    }}>
                      {fac.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{fac.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{fac.role}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Star size={13} fill="#d97706" color="#d97706" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706' }}>{fac.rating || 4.8}★</span>
                        <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '1px 5px', marginLeft: '4px' }}>
                          {fac.status || 'ACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteFaculty(fac._id)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '6px', color: 'var(--danger)' }}
                    title="Remove Faculty"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={15} color="var(--primary)" />
                    <span>Campus: <strong>{fac.branchName || 'All Campuses'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={15} color="var(--text-muted)" />
                    <span>{fac.email}</span>
                  </div>
                  {fac.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={15} color="var(--text-muted)" />
                      <span>+91 {fac.phone}</span>
                    </div>
                  )}
                </div>

                {/* Assigned Batches */}
                <div style={{
                  background: 'var(--bg-app)',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  marginTop: 'auto'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                    ASSIGNED BATCHES
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(fac.assignedBatches || []).length === 0 ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No batches assigned yet</span>
                    ) : (
                      fac.assignedBatches.map(bId => {
                        const bObj = batches.find(b => b._id === bId);
                        return (
                          <span key={bId} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            {bObj ? bObj.name : bId}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add Faculty Member</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddFaculty}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Gupta"
                    className="form-input"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Academic Role / Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Faculty - Physics"
                      className="form-input"
                      value={newFaculty.role}
                      onChange={(e) => setNewFaculty({ ...newFaculty, role: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Campus Branch</label>
                    <select
                      className="form-select"
                      value={newFaculty.branchId}
                      onChange={(e) => setNewFaculty({ ...newFaculty, branchId: e.target.value })}
                    >
                      {branches.map(br => (
                        <option key={br._id} value={br._id}>{br.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh.gupta@tutorpro.com"
                      className="form-input"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9830112233"
                      className="form-input"
                      value={newFaculty.phone}
                      onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign to Teaching Batches</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    {batches.map(batch => {
                      const selected = newFaculty.assignedBatches.includes(batch._id);
                      return (
                        <button
                          key={batch._id}
                          type="button"
                          onClick={() => toggleBatch(batch._id)}
                          className={selected ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                          style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                        >
                          {batch.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Enroll Faculty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
