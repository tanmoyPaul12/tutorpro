import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Plus, Search, Filter, Phone, Mail, CheckCircle2, 
  AlertCircle, Edit2, Trash2, X, MessageSquare 
} from 'lucide-react';

export default function StudentsView({ onOpenWhatsAppModal }) {
  const { token, user } = useAuth();
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: '',
    batchId: '',
    classGrade: 'Class 10',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    monthlyFee: 1200
  });

  const fetchStudents = () => {
    const url = `/api/students?batchId=${selectedBatch}&search=${encodeURIComponent(search)}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const fetchBatches = () => {
    fetch('/api/batches', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setBatches(data);
        if (data.length > 0 && !newStudent.batchId) {
          setNewStudent(prev => ({ ...prev, batchId: data[0]._id }));
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBatches();
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [token, selectedBatch, search]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newStudent)
      });
      if (!res.ok) throw new Error('Failed to add student');
      setShowAddModal(false);
      setNewStudent({
        name: '',
        batchId: batches[0]?._id || '',
        classGrade: 'Class 10',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        monthlyFee: 1200
      });
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    try {
      await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Student Management Directory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage student records, batch assignments, parent contacts, and fee status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        background: 'var(--bg-surface)',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by student name, roll no, or parent phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Batch Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="form-select"
            style={{ minWidth: '200px' }}
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="ALL">All Batches ({students.length})</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student & Roll No</th>
              <th>Class & Batch</th>
              <th>Parent Details</th>
              <th>Monthly Fee</th>
              <th>Attendance</th>
              <th>October Fee</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              students.map(std => (
                <tr key={std._id}>
                  {/* Student Name */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}>
                        {std.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{std.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {std.rollNo || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Batch */}
                  <td>
                    <div style={{ fontWeight: 600 }}>{std.batchName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{std.classGrade}</div>
                  </td>

                  {/* Parent Details */}
                  <td>
                    <div>{std.parentName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Phone size={11} /> +91 {std.parentPhone}
                    </div>
                  </td>

                  {/* Fee */}
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>₹{std.monthlyFee?.toLocaleString('en-IN')}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ month</div>
                  </td>

                  {/* Attendance */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700 }}>{std.attendancePercentage || 92}%</span>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>Good</span>
                    </div>
                  </td>

                  {/* Fee Status */}
                  <td>
                    {std.feeStatus === 'PAID' ? (
                      <span className="badge badge-success">✓ Paid</span>
                    ) : (
                      <span className="badge badge-warning">⏳ Pending</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => onOpenWhatsAppModal({
                          studentName: std.name,
                          parentName: std.parentName,
                          phone: std.parentPhone,
                          text: `Dear ${std.parentName}, this is an update from ${user?.academyName || (user?.name ? `${user.name}'s Academy` : 'our Academy')} regarding ${std.name}. Current attendance: ${std.attendancePercentage}%. Feel free to reach out with any queries.`,
                          whatsappUrl: `https://wa.me/91${std.parentPhone}?text=${encodeURIComponent(`Dear ${std.parentName}, this is an update regarding ${std.name}.`)}`,
                          type: 'COMMUNICATION'
                        })}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px', borderRadius: '8px' }}
                        title="Send WhatsApp Message"
                      >
                        <MessageSquare size={14} color="#10b981" />
                      </button>

                      <button
                        onClick={() => handleDelete(std._id)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '6px', borderRadius: '8px' }}
                        title="Delete Student"
                      >
                        <Trash2 size={14} color="var(--danger)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Enroll New Student</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suman Roy"
                    className="form-input"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Assign to Batch *</label>
                    <select
                      className="form-select"
                      required
                      value={newStudent.batchId}
                      onChange={(e) => setNewStudent({ ...newStudent, batchId: e.target.value })}
                    >
                      {batches.map(b => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Class Grade</label>
                    <select
                      className="form-select"
                      value={newStudent.classGrade}
                      onChange={(e) => setNewStudent({ ...newStudent, classGrade: e.target.value })}
                    >
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pradip Roy"
                      className="form-input"
                      value={newStudent.parentName}
                      onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Parent WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543219"
                      className="form-input"
                      value={newStudent.parentPhone}
                      onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Tuition Fee (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newStudent.monthlyFee}
                    onChange={(e) => setNewStudent({ ...newStudent, monthlyFee: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
