import React, { useState, useEffect } from 'react';
import { 
  X, Search, Filter, Star, CheckCircle2, ShieldCheck, 
  MapPin, Calendar, Clock, IndianRupee, Sparkles, BookOpen, Send 
} from 'lucide-react';

export default function MarketplaceModal({ isOpen, onClose, preselectedTutorId = null }) {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');

  // Booking Modal State
  const [bookingTutor, setBookingTutor] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    parentName: '',
    parentPhone: '',
    studentName: '',
    grade: 'Class 10',
    subject: 'Mathematics',
    preferredDate: new Date().toISOString().split('T')[0],
    timeSlot: '05:00 PM - 06:00 PM',
    notes: ''
  });

  const fetchTutors = () => {
    setLoading(true);
    let url = `/api/marketplace/tutors?subject=${subjectFilter}&grade=${gradeFilter}&mode=${modeFilter}&search=${encodeURIComponent(search)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTutors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load marketplace tutors:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchTutors();
      setBookingSuccess(null);
    }
  }, [isOpen, subjectFilter, gradeFilter, modeFilter, search]);

  useEffect(() => {
    if (preselectedTutorId && tutors.length > 0) {
      const found = tutors.find(t => t.tutorId === preselectedTutorId || t._id === preselectedTutorId);
      if (found) {
        setBookingTutor(found);
      }
    }
  }, [preselectedTutorId, tutors]);

  if (!isOpen) return null;

  const handleOpenBooking = (tutor) => {
    setBookingTutor(tutor);
    setBookingForm(prev => ({
      ...prev,
      subject: tutor.subject.split('&')[0].trim() || 'Mathematics'
    }));
  };

  const handleBookDemoSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/marketplace/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId: bookingTutor.tutorId || bookingTutor._id,
          ...bookingForm
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setBookingSuccess(data.booking);
      setBookingTutor(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1000px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(139, 92, 246, 0.08))',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🌟</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                TutorPro Verified Tutor Marketplace
              </h2>
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                5% Commission Model Live
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              Discover verified master tutors, compare credentials & parent reviews, and book live trial classes.
            </p>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          padding: '16px 28px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
              placeholder="Search by tutor name, subject, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: '150px', fontSize: '0.82rem' }}
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="ALL">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>

            <select
              className="form-select"
              style={{ width: '130px', fontSize: '0.82rem' }}
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="ALL">All Grades</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
              <option value="JEE / NEET">JEE / NEET</option>
            </select>

            <select
              className="form-select"
              style={{ width: '140px', fontSize: '0.82rem' }}
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
            >
              <option value="ALL">All Modes</option>
              <option value="Online">Online Live</option>
              <option value="Hybrid">Hybrid / Center</option>
            </select>
          </div>
        </div>

        {/* Success Banner if booking just completed */}
        {bookingSuccess && (
          <div style={{
            margin: '20px 28px 0',
            padding: '16px 20px',
            borderRadius: '14px',
            background: 'var(--success-light)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={22} color="var(--success)" />
              <div>
                <strong style={{ color: 'var(--success)', fontSize: '0.92rem' }}>
                  Demo Class Booked with {bookingSuccess.tutorName}!
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Booking ID: <strong>{bookingSuccess._id}</strong> • Preferred Slot: {bookingSuccess.preferredDate} ({bookingSuccess.timeSlot}). The tutor will message your WhatsApp at +91 {bookingSuccess.parentPhone}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setBookingSuccess(null)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tutors Grid */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading verified tutors...
            </div>
          ) : tutors.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No tutors found matching your search criteria.
            </div>
          ) : (
            tutors.map(tutor => (
              <div key={tutor._id} className="card card-hover" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Tutor Profile Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#EEEDFE',
                    color: '#534AB7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    flexShrink: 0
                  }}>
                    {tutor.avatarEmoji || '👨‍🏫'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tutor.name}
                      </h4>
                      {tutor.verified && (
                        <ShieldCheck size={16} color="#0F6E56" title="Verified TutorPro Mentor" />
                      )}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
                      {tutor.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#854F0B', fontSize: '0.8rem', fontWeight: 700 }}>
                        <Star size={13} fill="#854F0B" /> {tutor.rating || 4.9}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        ({tutor.reviewCount || 40} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject & Grade tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    {tutor.subject}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {tutor.city} • {tutor.mode}
                  </span>
                </div>

                {/* Highlights */}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                  {tutor.bio || 'Dedicated educator mentoring board aspirants with proven conceptual shortcuts.'}
                </p>

                {/* Key stats row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                  padding: '10px 12px',
                  background: 'var(--bg-app)',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Experience:</span>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{tutor.experienceYears} Years</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Students Taught:</span>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{tutor.studentsTaught || '150+'}</strong>
                  </div>
                </div>

                {/* Fee & Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Demo Class Rate</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{tutor.demoFee || 200}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(tutor)}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    Book Demo Class
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Demo Booking Sub-Modal */}
        {bookingTutor && (
          <div className="modal-overlay" onClick={() => setBookingTutor(null)} style={{ zIndex: 110 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    Book Demo Class with {bookingTutor.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Subject: {bookingTutor.subject} • Fee: ₹{bookingTutor.demoFee || 200}
                  </p>
                </div>
                <button onClick={() => setBookingTutor(null)}><X size={20} /></button>
              </div>

              <form onSubmit={handleBookDemoSubmit}>
                <div className="modal-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alok Das"
                        className="form-input"
                        value={bookingForm.parentName}
                        onChange={(e) => setBookingForm({ ...bookingForm, parentName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">WhatsApp Mobile *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        className="form-input"
                        value={bookingForm.parentPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, parentPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Student Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohit Das"
                        className="form-input"
                        value={bookingForm.studentName}
                        onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Class Grade</label>
                      <select
                        className="form-select"
                        value={bookingForm.grade}
                        onChange={(e) => setBookingForm({ ...bookingForm, grade: e.target.value })}
                      >
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                        <option value="JEE / NEET">JEE / NEET</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Preferred Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Preferred Time Slot</label>
                      <select
                        className="form-select"
                        value={bookingForm.timeSlot}
                        onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                      >
                        <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                        <option value="05:30 PM - 06:30 PM">05:30 PM - 06:30 PM</option>
                        <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specific Weak Topics or Doubts</label>
                    <input
                      type="text"
                      placeholder="e.g. Trigonometry identities & board problem solving"
                      className="form-input"
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    />
                  </div>

                  {/* Fee Breakdown with 5% Commission Note */}
                  <div style={{
                    background: 'var(--bg-app)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Demo Class Fee:</span>
                      <strong>₹{bookingTutor.demoFee || 200}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>TutorPro Platform Commission (5%):</span>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        ₹{Math.round((bookingTutor.demoFee || 200) * 0.05)} Included
                      </span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Total Payable at Session:</span>
                      <span style={{ color: 'var(--primary)' }}>₹{bookingTutor.demoFee || 200}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setBookingTutor(null)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                    {submitting ? 'Confirming...' : 'Confirm Demo Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
