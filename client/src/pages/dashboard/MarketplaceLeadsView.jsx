import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, CheckCircle2, Clock, IndianRupee, Phone, Calendar, 
  MessageSquare, Sparkles, UserPlus, X, Filter, Globe, Edit3, Save 
} from 'lucide-react';

export default function MarketplaceLeadsView({ onOpenWhatsAppModal }) {
  const { token, user } = useAuth();
  const [data, setData] = useState({ summary: {}, leads: [] });
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [profile, setProfile] = useState({
    title: 'Senior Mathematics & Physics Specialist',
    subject: 'Mathematics & Physics',
    hourlyRate: 600,
    demoFee: 200,
    bio: '',
    isPublic: true
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Enroll Modal state
  const [enrollModalBooking, setEnrollModalBooking] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [monthlyFee, setMonthlyFee] = useState(1200);

  const fetchLeads = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/marketplace/my-leads', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/batches', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([leadsData, batchesData]) => {
        setData(leadsData || { summary: {}, leads: [] });
        setBatches(Array.isArray(batchesData) ? batchesData : []);
        if (batchesData.length > 0 && !selectedBatchId) {
          setSelectedBatchId(batchesData[0]._id);
          setMonthlyFee(batchesData[0].monthlyFee || 1200);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load marketplace leads:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
  }, [token]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/marketplace/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update booking status');
      fetchLeads();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConvertLead = async (e) => {
    e.preventDefault();
    if (!enrollModalBooking) return;

    try {
      const res = await fetch(`/api/marketplace/leads/${enrollModalBooking._id}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          batchId: selectedBatchId,
          monthlyFee: Number(monthlyFee)
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);

      alert(resData.message);
      setEnrollModalBooking(null);
      fetchLeads();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/marketplace/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error('Failed to update marketplace profile');
      setProfileSuccess('Public marketplace listing updated successfully!');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const summary = data.summary || {};
  let leadsList = data.leads || [];

  if (filterStatus !== 'ALL') {
    leadsList = leadsList.filter(l => l.status === filterStatus);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Marketplace Leads & Student Acquisition</h2>
          <span className="badge" style={{ background: '#EEEDFE', color: '#534AB7', fontWeight: 700, fontSize: '0.72rem' }}>
            Phase 2 Marketplace Engine
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
          Receive demo class bookings from parents discovering your profile on the public marketplace. 5% platform commission automatically calculated.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Leads */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Total Inbound Demo Leads</span>
            <Users size={16} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {summary.totalLeads || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Parents requesting demo sessions
          </div>
        </div>

        {/* Converted Students */}
        <div className="card" style={{ padding: '20px', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Converted to Students</span>
            <CheckCircle2 size={16} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
            {summary.convertedLeads || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
            Enrolled directly into regular batches
          </div>
        </div>

        {/* Marketplace Commission */}
        <div className="card" style={{ padding: '20px', borderColor: 'rgba(79, 70, 229, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>TutorPro Platform Commission</span>
            <IndianRupee size={16} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
            ₹{summary.totalCommissionGenerated || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            5% commission on paid trial classes
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-surface)',
        padding: '12px 18px',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'CONVERTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={filterStatus === st ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ fontSize: '0.78rem' }}
            >
              {st === 'ALL' ? `All Leads (${data.leads?.length || 0})` : st}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing <strong>{leadsList.length}</strong> inquiries
        </span>
      </div>

      {/* Leads Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Parent & Student</th>
              <th>Grade & Subject</th>
              <th>Preferred Date / Time</th>
              <th>Demo Fee & Commission</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading demo inquiries...
                </td>
              </tr>
            ) : leadsList.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No marketplace demo requests found for this filter.
                </td>
              </tr>
            ) : (
              leadsList.map(lead => {
                const isConverted = lead.status === 'CONVERTED';
                const isPending = lead.status === 'PENDING';

                return (
                  <tr key={lead._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{lead.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Parent: {lead.parentName} (+91 {lead.parentPhone})
                      </div>
                      {lead.notes && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
                          "{lead.notes}"
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{lead.subject}</div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {lead.grade}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{lead.preferredDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.timeSlot}</div>
                    </td>

                    <td>
                      <div>
                        <strong>₹{lead.demoFee}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                          (5% fee: ₹{lead.platformFee})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>
                        Tutor payout: ₹{lead.tutorPayout}
                      </div>
                    </td>

                    <td>
                      {lead.status === 'CONVERTED' ? (
                        <span className="badge badge-success">✓ Enrolled Student</span>
                      ) : lead.status === 'CONFIRMED' ? (
                        <span className="badge badge-primary">Slot Confirmed</span>
                      ) : lead.status === 'COMPLETED' ? (
                        <span className="badge badge-neutral">Demo Completed</span>
                      ) : (
                        <span className="badge badge-warning">Pending Review</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* WhatsApp Parent Button */}
                        <button
                          onClick={() => onOpenWhatsAppModal({
                            studentName: lead.studentName,
                            parentName: lead.parentName,
                            phone: lead.parentPhone,
                            text: `Dear ${lead.parentName}, thank you for requesting a demo class for ${lead.studentName} (${lead.subject}, ${lead.grade}). We look forward to seeing you on ${lead.preferredDate} at ${lead.timeSlot}.`,
                            whatsappUrl: `https://wa.me/91${lead.parentPhone}?text=${encodeURIComponent(`Dear ${lead.parentName}, thank you for requesting a demo class for ${lead.studentName}.`)}`,
                            type: 'COMMUNICATION'
                          })}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          title="Message Parent on WhatsApp"
                        >
                          <MessageSquare size={13} color="#10b981" />
                          <span>WhatsApp</span>
                        </button>

                        {isPending && (
                          <button
                            onClick={() => handleUpdateStatus(lead._id, 'CONFIRMED')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          >
                            Confirm Slot
                          </button>
                        )}

                        {!isConverted ? (
                          <button
                            onClick={() => setEnrollModalBooking(lead)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', background: '#0F6E56', borderColor: '#0F6E56' }}
                            title="Enroll as regular student"
                          >
                            <UserPlus size={13} />
                            <span>Enroll Student</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>✓ Enrolled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Convert Lead to Student Modal */}
      {enrollModalBooking && (
        <div className="modal-overlay" onClick={() => setEnrollModalBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Enroll Marketplace Lead</h3>
              <button onClick={() => setEnrollModalBooking(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleConvertLead}>
              <div className="modal-body">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Convert demo attendee <strong>{enrollModalBooking.studentName}</strong> (Parent: {enrollModalBooking.parentName}) into a regular enrolled student.
                </p>

                <div className="form-group">
                  <label className="form-label">Assign to Classroom Batch *</label>
                  <select
                    className="form-select"
                    required
                    value={selectedBatchId}
                    onChange={(e) => {
                      setSelectedBatchId(e.target.value);
                      const b = batches.find(x => x._id === e.target.value);
                      if (b) setMonthlyFee(b.monthlyFee || 1200);
                    }}
                  >
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.classGrade}) - ₹{b.monthlyFee}/mo
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Tuition Fee (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEnrollModalBooking(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#0F6E56', borderColor: '#0F6E56' }}>
                  Confirm & Enroll in Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
