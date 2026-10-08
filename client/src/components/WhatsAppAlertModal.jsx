import React from 'react';
import { X, MessageCircle, Send, CheckCircle2, ExternalLink } from 'lucide-react';

export default function WhatsAppAlertModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const { studentName, parentName, phone, text, whatsappUrl, type = 'FEE_REMINDER' } = data;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {type === 'ATTENDANCE_ALERT' ? 'Attendance Alert Generated' : 'Fee Reminder Generated'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Automated Parent Communication System
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Target Info */}
          <div style={{
            background: 'var(--bg-surface-hover)',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '0.875rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Recipient:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{parentName} (Parent)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Student:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{studentName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>WhatsApp Number:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>+91 {phone}</span>
            </div>
          </div>

          {/* Message Preview (WhatsApp Chat Bubble styling) */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '8px' }}>Dispatched Message Template</label>
            <div style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '16px',
              position: 'relative'
            }}>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                borderTopLeftRadius: '2px',
                padding: '14px',
                fontSize: '0.875rem',
                lineHeight: 1.55,
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {text}
                <div style={{ textAlign: 'right', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Just now • Delivered ✓✓
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            fontSize: '0.8125rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={16} />
            <span>Logged in TutorPro communication audit ledger.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Open in WhatsApp Web</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
