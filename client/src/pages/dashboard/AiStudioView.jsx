import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, BookOpen, Printer, CheckCircle2, ChevronDown, 
  ChevronUp, FileText, Award, Calendar, RefreshCw, Send, Check 
} from 'lucide-react';

export default function AiStudioView({ onNavigateTab }) {
  const { token, user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({
    subject: 'Mathematics',
    classGrade: 'Class 10',
    topic: 'Quadratic Equations & Roots',
    difficulty: 'Board Standard',
    totalMarks: 25,
    targetBatchId: ''
  });

  const [generating, setGenerating] = useState(false);
  const [paper, setPaper] = useState(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  useEffect(() => {
    fetch('/api/batches', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setBatches(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          setForm(prev => ({ ...prev, targetBatchId: data[0]._id }));
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setGenerating(true);
    setSavedSuccess('');
    try {
      const res = await fetch('/api/ai/generate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Generation failed');
      setPaper(data);
    } catch (err) {
      alert('AI Generation error: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Auto-generate initial sample paper on mount if none
  useEffect(() => {
    handleGenerate();
  }, [token]);

  const handleSaveToTests = async () => {
    if (!paper) return;
    try {
      const targetBatch = batches.find(b => b._id === form.targetBatchId) || batches[0];
      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: paper.title,
          batchId: targetBatch ? targetBatch._id : 'batch_10_maths',
          subject: paper.subject,
          totalMarks: paper.totalMarks,
          testDate: new Date().toISOString().split('T')[0],
          scores: []
        })
      });
      if (!res.ok) throw new Error('Failed to save test');
      setSavedSuccess(`🎉 "${paper.title}" saved to Tests & Results! You can now log student marks.`);
      setTimeout(() => setSavedSuccess(''), 5000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Question Paper & Test Generator</h2>
            <span className="badge" style={{ background: '#EEEDFE', color: '#534AB7', fontWeight: 700, fontSize: '0.72rem' }}>
              Phase 3 AI Engine
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Instant board-standard test paper synthesis with tiered MCQs, short answers, numerical derivations, and automated marking schemes.
          </p>
        </div>

        {paper && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.82rem' }}
            >
              <Printer size={15} />
              <span>Print Question Paper</span>
            </button>

            <button
              onClick={handleSaveToTests}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.82rem' }}
            >
              <Check size={15} />
              <span>Save as Dashboard Unit Test</span>
            </button>
          </div>
        )}
      </div>

      {savedSuccess && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          background: 'var(--success-light)',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{savedSuccess}</span>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('tests')}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--success)', fontSize: '0.8rem', textDecoration: 'underline' }}
          >
            Go to Tests & Results →
          </button>
        </div>
      )}

      {/* Generator Controls Card */}
      <div className="card" style={{ padding: '22px' }}>
        <form onSubmit={handleGenerate}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            alignItems: 'flex-end'
          }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Subject</label>
              <select
                className="form-select"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Grade / Standard</label>
              <select
                className="form-select"
                value={form.classGrade}
                onChange={(e) => setForm({ ...form, classGrade: e.target.value })}
              >
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10 (Board)</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12 (Board)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Chapter / Topic</label>
              <input
                type="text"
                className="form-input"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g. Quadratic Equations"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Difficulty Level</label>
              <select
                className="form-select"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option value="Board Standard">CBSE/ICSE Board Standard</option>
                <option value="Easy">Foundation / Revision</option>
                <option value="Hard">Advanced / Olympiad</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Total Marks</label>
              <select
                className="form-select"
                value={form.totalMarks}
                onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
              >
                <option value="25">25 Marks (Weekly Test)</option>
                <option value="50">50 Marks (Mid-Term Mock)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={generating}
                className="btn btn-primary"
                style={{ width: '100%', height: '42px', padding: '0 16px' }}
              >
                <Sparkles size={16} />
                <span>{generating ? 'Synthesizing...' : 'Generate Test Paper'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Generated Paper View */}
      {generating ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Synthesizing Board Standard Paper...
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            Compiling balanced cognitive sections, objective MCQs, derivations, and step-wise marking rubrics.
          </p>
        </div>
      ) : paper ? (
        <div className="card" style={{ padding: '36px', background: 'var(--bg-surface)' }}>
          {/* Paper Header (Formal Examination Style) */}
          <div style={{
            textAlign: 'center',
            borderBottom: '2px solid var(--border-subtle)',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              {user?.academyName || "TutorPro Academy"} • EVALUATION SERIES 2026
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '8px 0 4px', color: 'var(--text-primary)' }}>
              {paper.title}
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Time Allowed: <strong>{paper.timeAllowed}</strong></span>
              <span>•</span>
              <span>Maximum Marks: <strong>{paper.totalMarks}</strong></span>
              <span>•</span>
              <span>Standard: <strong>{paper.difficulty}</strong></span>
            </div>
          </div>

          {/* General Instructions */}
          <div style={{
            background: 'var(--bg-app)',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '28px',
            fontSize: '0.82rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--text-primary)' }}>General Instructions:</strong>
            <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {(paper.instructions || []).map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
          </div>

          {/* Sections & Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {(paper.sections || []).map((sec, secIdx) => (
              <div key={secIdx}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '8px',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {sec.name}
                  </h3>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    [{sec.totalSectionMarks} Marks]
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sec.questions.map((q) => (
                    <div key={q.id} style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      <strong style={{ minWidth: '24px', color: 'var(--text-primary)' }}>Q{q.qNo}.</strong>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {q.question}
                        </div>

                        {/* If Multiple Choice Options */}
                        {q.options && (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '8px',
                            marginTop: '10px'
                          }}>
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  background: 'var(--bg-app)',
                                  border: '1px solid var(--border-subtle)',
                                  fontSize: '0.82rem'
                                }}
                              >
                                <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        [{q.marks}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Answer Key Toggle & Content */}
          <div style={{ marginTop: '40px', borderTop: '2px dashed var(--border-subtle)', paddingTop: '24px' }}>
            <button
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '14px 20px', borderRadius: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={18} color="var(--primary)" />
                <span style={{ fontWeight: 800 }}>Teacher's Marking Rubric & Answer Key</span>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>Confidential</span>
              </div>
              {showAnswerKey ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showAnswerKey && (
              <div style={{
                marginTop: '16px',
                padding: '20px',
                background: 'var(--bg-app)',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {(paper.answerKey || []).map((ak) => (
                  <div key={ak.qNo} style={{ fontSize: '0.85rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong>Q{ak.qNo} ({ak.type}):</strong>
                      {ak.correctAnswer && (
                        <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                          Correct: {ak.correctAnswer}
                        </span>
                      )}
                    </div>
                    {ak.explanation && (
                      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.8rem' }}>
                        {ak.explanation}
                      </p>
                    )}
                    {ak.modelSolution && (
                      <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {ak.modelSolution}
                      </p>
                    )}
                    {ak.rubric && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', fontStyle: 'italic' }}>
                        Marking Rubric: {ak.rubric}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
