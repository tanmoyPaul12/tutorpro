import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Plus, Users, MapPin, Phone, Calendar, Trash2, X, Check, ShieldCheck } from 'lucide-react';

export default function BranchesView() {
  const { token } = useAuth();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    code: '',
    city: 'Kolkata',
    address: '',
    phone: '',
    studentCapacity: 300
  });

  const fetchBranches = () => {
    setLoading(true);
    fetch('/api/institute/branches', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBranches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load branches:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBranches();
  }, [token]);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/institute/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newBranch)
      });
      if (!res.ok) throw new Error('Failed to create branch');
      setShowAddModal(false);
      setNewBranch({
        name: '',
        code: '',
        city: 'Kolkata',
        address: '',
        phone: '',
        studentCapacity: 300
      });
      fetchBranches();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteBranch = async (id) => {
    if (!window.confirm('Are you sure you want to remove this branch campus?')) return;
    try {
      const res = await fetch(`/api/institute/branches/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete branch');
      fetchBranches();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Multi-Branch Campus Operations</h2>
            <span className="badge" style={{ background: '#E1F5EE', color: '#0F6E56', fontWeight: 700, fontSize: '0.72rem' }}>
              Institute Plan Exclusive
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Oversee classroom facilities, student allocation, and faculty distribution across geographic centers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Branch Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading academy campuses...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {branches.map(branch => {
            const capacityPct = Math.min(100, Math.round(((branch.activeStudents || 0) / (branch.studentCapacity || 300)) * 100));

            return (
              <div key={branch._id} className="card card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(14, 116, 144, 0.15))',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building2 size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{branch.name}</h3>
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem', marginTop: '2px' }}>
                        Code: {branch.code || 'MAIN'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteBranch(branch._id)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '6px', color: 'var(--danger)' }}
                    title="Delete Campus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{branch.address || branch.city}</span>
                  </div>
                  {branch.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={15} color="var(--text-muted)" />
                      <span>{branch.phone}</span>
                    </div>
                  )}
                </div>

                {/* Capacity & Batches stats */}
                <div style={{
                  background: 'var(--bg-app)',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Classroom Load</span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {branch.activeStudents || 0} / {branch.studentCapacity} students ({capacityPct}%)
                    </strong>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--border-subtle)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${capacityPct}%`,
                      height: '100%',
                      background: capacityPct > 80 ? 'var(--warning)' : 'var(--primary)',
                      borderRadius: '4px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    <span>Active Batches: <strong>{branch.batchCount || 0}</strong></span>
                    <span>City: <strong>{branch.city}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Establish New Campus Branch</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateBranch}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Branch Campus Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Delhi Science Hub"
                    className="form-input"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Branch Code</label>
                    <input
                      type="text"
                      placeholder="e.g. ND-03"
                      className="form-input"
                      value={newBranch.code}
                      onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi / Kolkata"
                      className="form-input"
                      value={newBranch.city}
                      onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Campus Physical Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 42 Ring Road, Near Metro Gate 2"
                    className="form-input"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 00004"
                      className="form-input"
                      value={newBranch.phone}
                      onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Student Capacity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newBranch.studentCapacity}
                      onChange={(e) => setNewBranch({ ...newBranch, studentCapacity: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create Campus Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
