import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  IndianRupee, Send, CheckCircle2, Clock, Filter, 
  Receipt, Download, MessageSquare, AlertCircle, Check 
} from 'lucide-react';

export default function FeesView({ onOpenWhatsAppModal }) {
  const { token } = useAuth();
  const [feesData, setFeesData] = useState({ fees: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState('October 2026');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [payModalFee, setPayModalFee] = useState(null);
  const [payMode, setPayMode] = useState('UPI');

  const fetchFees = () => {
    setLoading(true);
    fetch(`/api/fees?month=${encodeURIComponent(month)}&status=${statusFilter}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFeesData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFees();
  }, [token, month, statusFilter]);

  const handleSendReminder = async (feeId) => {
    try {
      const res = await fetch(`/api/fees/${feeId}/remind`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Trigger the WhatsApp Preview Modal
      onOpenWhatsAppModal({
        studentName: data.studentName,
        parentName: data.parentName,
        phone: data.phone,
        text: data.text,
        whatsappUrl: data.whatsappUrl,
        type: 'FEE_REMINDER'
      });

      fetchFees();
    } catch (err) {
      alert('Error sending reminder: ' + err.message);
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!payModalFee) return;

    try {
      const res = await fetch(`/api/fees/${payModalFee._id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMode: payMode,
          receiptNumber: `TP-${Date.now().toString().slice(-6)}`
        })
      });
      if (!res.ok) throw new Error('Payment recording failed');
      setPayModalFee(null);
      fetchFees();
    } catch (err) {
      alert(err.message);
    }
  };

  const summary = feesData.summary || {};
  const feesList = feesData.fees || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Fee Management & Collection Ledger</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Track monthly tuition receivables, record UPI/cash collections, and send automated WhatsApp reminders.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="form-select"
            style={{ width: '170px' }}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="October 2026">October 2026</option>
            <option value="September 2026">September 2026</option>
            <option value="ALL">All Months</option>
          </select>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Expected */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Total Expected Fees</span>
            <IndianRupee size={16} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            ₹{summary.totalAmount?.toLocaleString('en-IN') || '0'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {summary.totalCount || 0} total enrolled students
          </div>
        </div>

        {/* Collected Fees */}
        <div className="card" style={{ padding: '20px', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--success)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Collected Fees</span>
            <CheckCircle2 size={16} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
            ₹{summary.paidAmount?.toLocaleString('en-IN') || '0'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: 600 }}>
            {summary.paidCount || 0} students cleared dues
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="card" style={{ padding: '20px', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--warning)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Pending Receivables</span>
            <AlertCircle size={16} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>
            ₹{summary.pendingAmount?.toLocaleString('en-IN') || '0'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '4px', fontWeight: 600 }}>
            {summary.pendingCount || 0} unpaid students
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
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={statusFilter === 'ALL' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
          >
            All Students ({feesList.length})
          </button>
          <button
            onClick={() => setStatusFilter('PAID')}
            className={statusFilter === 'PAID' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
          >
            ✓ Paid
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={statusFilter === 'PENDING' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
          >
            ⏳ Pending
          </button>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Month: <strong>{month}</strong>
        </span>
      </div>

      {/* Fee Records Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Batch</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Mode / Receipt</th>
              <th>Reminders</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading fee ledger...
                </td>
              </tr>
            ) : feesList.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No fee records found.
                </td>
              </tr>
            ) : (
              feesList.map(fee => {
                const isPaid = fee.status === 'PAID';
                return (
                  <tr key={fee._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{fee.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Parent: {fee.parentName} (+91 {fee.parentPhone})
                      </div>
                    </td>
                    <td>
                      <div>{fee.batchName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fee.classGrade}</div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                        ₹{fee.amount?.toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td>
                      {isPaid ? (
                        <span className="badge badge-success">✓ Paid</span>
                      ) : (
                        <span className="badge badge-warning">✗ Pending</span>
                      )}
                    </td>
                    <td>
                      {isPaid ? (
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{fee.paymentMode}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {fee.receiptNumber}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      {fee.reminderCount > 0 ? (
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {fee.reminderCount} sent
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None sent</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {!isPaid ? (
                          <>
                            <button
                              onClick={() => setPayModalFee(fee)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              <Check size={14} />
                              <span>Mark Paid</span>
                            </button>

                            <button
                              onClick={() => handleSendReminder(fee._id)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: '#10b981', color: '#10b981' }}
                              title="Generate 1-Click WhatsApp Reminder"
                            >
                              <MessageSquare size={14} />
                              <span>Send Reminder</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => alert(`Receipt #${fee.receiptNumber} verified. ₹${fee.amount} received via ${fee.paymentMode}.`)}
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '0.78rem' }}
                          >
                            <Receipt size={14} />
                            <span>Receipt</span>
                          </button>
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

      {/* Mark As Paid Modal */}
      {payModalFee && (
        <div className="modal-overlay" onClick={() => setPayModalFee(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Record Fee Collection</h3>
              <button onClick={() => setPayModalFee(null)}>✕</button>
            </div>

            <form onSubmit={handleConfirmPayment}>
              <div className="modal-body">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
                  Confirm payment of <strong>₹{payModalFee.amount}</strong> for <strong>{payModalFee.studentName}</strong> ({payModalFee.month}).
                </p>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                  >
                    <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                    <option value="CASH">Cash in Hand</option>
                    <option value="BANK_TRANSFER">Bank NetBanking / NEFT</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setPayModalFee(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
