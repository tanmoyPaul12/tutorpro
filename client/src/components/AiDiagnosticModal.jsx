import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, Sparkles, TrendingUp, CheckCircle2, AlertTriangle, 
  MessageCircle, Award, Calendar, BookOpen, Send 
} from 'lucide-react';

export default function AiDiagnosticModal({ isOpen, onClose, studentId, onOpenWhatsAppModal }) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !studentId) return;

    setLoading(true);
    fetch('/api/ai/diagnose-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ studentId })
    })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to run AI diagnostic:', err);
        setLoading(false);
      });
  }, [isOpen, studentId, token]);

  if (!isOpen) return null;

  const handleSendWhatsApp = () => {
    if (!data) return;
    onClose();
    onOpenWhatsAppModal({
      studentName: data.student.name,
      parentName: data.student.parentName,
      phone: data.student.parentPhone,
      text: data.whatsappSnippet,
      whatsappUrl: `https://wa.me/91${data.student.parentPhone}?text=${encodeURIComponent(data.whatsappSnippet)}`,
      type: 'AI_DIAGNOSTIC_REPORT'
    });
  };

  const student = data?.student || {};
  const metrics = data?.metrics || {};

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Header */}
        <div className="modal-header" style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(139, 92, 246, 0.08))',
          padding: '20px 24px',
          margin: '-24px -24px 20px -24px',
          borderBottom: '1px solid var(--border-subtle)',
          borderRadius: '16px 16px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                AI Academic Diagnostic Report
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Automated Student Competency & Consistency Analyzer
              </p>
            </div>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Sparkles size={24} className="animate-spin" style={{ margin: '0 auto 8px', color: 'var(--primary)' }} />
            Evaluating student attendance consistency & test score patterns...
          </div>
        ) : data ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Student & Status Card */}
            <div style={{
              background: 'var(--bg-app)',
              padding: '16px 20px',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{student.name}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {student.classGrade} • Batch: {student.batchName} • Roll: {student.rollNo || 'N/A'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge" style={{ background: `${data.badgeColor}20`, color: data.badgeColor, fontWeight: 800, fontSize: '0.75rem' }}>
                  {data.performanceTier}
                </span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Risk Level: <strong>{data.riskLevel}</strong>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{
                background: 'var(--bg-surface)',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: metrics.attendancePct >= 85 ? 'var(--success)' : 'var(--warning)' }}>
                  {metrics.attendancePct}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {metrics.totalSessions} sessions logged
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Unit Test Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {metrics.avgTestPct}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Across all chapter evaluations
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Strengths */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span>Key Strengths</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {(data.strengths || []).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                  <AlertTriangle size={16} />
                  <span>Weak / Vulnerable Areas</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {(data.weaknesses || []).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div style={{
              background: 'var(--bg-app)',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem'
            }}>
              <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Targeted AI Improvement Steps:
              </strong>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {(data.recommendations || []).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <button onClick={onClose} className="btn btn-secondary btn-sm">
                Close
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="btn btn-primary btn-sm"
                style={{ background: '#10b981', borderColor: '#10b981' }}
              >
                <MessageCircle size={15} />
                <span>Send AI Diagnostic via WhatsApp</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
