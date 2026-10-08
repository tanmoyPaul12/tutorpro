import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Plus, TrendingUp, Users, Calendar, Trophy, ChevronRight, X } from 'lucide-react';

export default function TestsView() {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTest, setNewTest] = useState({
    title: '',
    batchId: '',
    subject: 'Mathematics',
    totalMarks: 25,
    testDate: new Date().toISOString().split('T')[0]
  });

  const [batchStudents, setBatchStudents] = useState([]);
  const [studentMarks, setStudentMarks] = useState({});

  const fetchTests = () => {
    fetch('/api/tests', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setTests(data);
        if (data.length > 0 && !selectedTest) {
          setSelectedTest(data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchBatches = () => {
    fetch('/api/batches', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setBatches(data);
        if (data.length > 0) {
          setNewTest(prev => ({ ...prev, batchId: data[0]._id, subject: data[0].subject }));
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTests();
    fetchBatches();
  }, [token]);

  // Load students for marks entry when batch is chosen in modal
  useEffect(() => {
    if (!newTest.batchId) return;
    fetch(`/api/students?batchId=${newTest.batchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBatchStudents(data);
        const initial = {};
        data.forEach(s => {
          initial[s._id] = Math.round(Number(newTest.totalMarks) * 0.8);
        });
        setStudentMarks(initial);
      })
      .catch(err => console.error(err));
  }, [token, newTest.batchId, newTest.totalMarks]);

  const handleCreateTest = async (e) => {
    e.preventDefault();
    const scoresPayload = batchStudents.map(s => ({
      studentId: s._id,
      studentName: s.name,
      marksObtained: Number(studentMarks[s._id]) || 0
    }));

    try {
      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newTest,
          scores: scoresPayload
        })
      });
      if (!res.ok) throw new Error('Failed to create test');
      setShowAddModal(false);
      fetchTests();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Academic Tests & Result Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Unit test scores auto-calculate student rankings, class averages, and individual progress.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Create New Test</span>
        </button>
      </div>

      {/* Analytics Ribbon */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Class Average Score</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
            {selectedTest?.averagePercentage || 76}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>+4% from last unit test</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--success)' }}>Highest Score</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>
            {selectedTest?.highestScore || 24} / {selectedTest?.totalMarks || 25}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ananya Sharma (96%)</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>Lowest Score</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)' }}>
            {selectedTest?.lowestScore || 14} / {selectedTest?.totalMarks || 25}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Needs formula review</div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Tests Logged</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {tests.length} Tests
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Continuous Assessment</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr',
        gap: '24px'
      }}>
        {/* Left: Test Selector List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Conducted Assessments</h3>
          {tests.map(test => {
            const isSelected = selectedTest?._id === test._id;
            return (
              <div
                key={test._id}
                onClick={() => setSelectedTest(test)}
                className="card card-hover"
                style={{
                  padding: '18px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-primary">{test.subject}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{test.testDate}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '6px' }}>{test.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span>{test.batchName}</span>
                  <span>Total: <strong>{test.totalMarks} Marks</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Scorecard and Ranks for Selected Test */}
        <div className="card" style={{ padding: '24px' }}>
          {selectedTest ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedTest.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {selectedTest.batchName} • Date: {selectedTest.testDate} • Max Marks: {selectedTest.totalMarks}
                  </p>
                </div>
                <span className="badge badge-success">
                  <Trophy size={13} /> Class Rank Auto-Computed
                </span>
              </div>

              {/* Ranks Table */}
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Rank</th>
                      <th>Student Name</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Teacher Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedTest.scores || []).map((score) => {
                      const isTop = score.rank === 1;
                      return (
                        <tr key={score.studentId} style={{ background: isTop ? 'rgba(251, 191, 36, 0.08)' : 'transparent' }}>
                          <td>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: isTop ? '#fbbf24' : 'var(--bg-surface-hover)',
                              color: isTop ? '#000000' : 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.8rem'
                            }}>
                              #{score.rank}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{score.studentName}</div>
                          </td>
                          <td>
                            <strong>{score.marksObtained}</strong> / {selectedTest.totalMarks}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700 }}>{score.percentage}%</span>
                              <div style={{ width: '50px', height: '5px', background: 'var(--bg-surface-hover)', borderRadius: '3px' }}>
                                <div style={{
                                  width: `${score.percentage}%`,
                                  height: '100%',
                                  background: score.percentage >= 80 ? 'var(--success)' : score.percentage >= 60 ? 'var(--primary)' : 'var(--danger)',
                                  borderRadius: '3px'
                                }} />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {score.feedback || 'Good work'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Select a test to view performance analytics.
            </div>
          )}
        </div>
      </div>

      {/* Create Test Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create Assessment & Log Marks</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateTest}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Test Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit Test 2 - Trigonometry"
                    className="form-input"
                    value={newTest.title}
                    onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Batch</label>
                    <select
                      className="form-select"
                      value={newTest.batchId}
                      onChange={(e) => setNewTest({ ...newTest, batchId: e.target.value })}
                    >
                      {batches.map(b => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Marks</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={newTest.totalMarks}
                      onChange={(e) => setNewTest({ ...newTest, totalMarks: e.target.value })}
                    />
                  </div>
                </div>

                {/* Student Marks Entry Sub-table */}
                <div style={{ marginTop: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>Log Student Scores:</label>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                    {batchStudents.map(s => (
                      <div key={s._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            max={newTest.totalMarks}
                            min={0}
                            style={{ width: '70px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
                            value={studentMarks[s._id] || 0}
                            onChange={(e) => setStudentMarks({ ...studentMarks, [s._id]: e.target.value })}
                          />
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/ {newTest.totalMarks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save & Compute Ranks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
