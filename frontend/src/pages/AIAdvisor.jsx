import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Award,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  Send,
  Bot,
  User,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import apiService from '../services/api';
import { Loading, ErrorMessage } from '../components/Loading';

export const AIAdvisor = () => {
  const [activeTab, setActiveTab] = useState('strategy'); // 'strategy' | 'chat'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customParams, setCustomParams] = useState({
    revenue: 12500000,
    profit: 3250000,
    orders: 15240,
    customers: 8420,
    churn_rate: 8.2,
    sales_growth: 12.4,
    profit_growth: 9.8
  });
  const [showTuner, setShowTuner] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your AI Business Decision Advisor. You can ask me any question about your revenue performance, regional sales, category profitability, or customer churn risks.",
      time: 'Just now',
      category: 'System Briefing'
    }
  ]);
  const chatEndRef = useRef(null);

  const fetchAdvice = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAdvisor(params);
      setData(res);
    } catch (err) {
      console.error('Advisor error:', err);
      setError(err.message || 'Failed to generate AI Advisor intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleTuneSubmit = (e) => {
    e.preventDefault();
    fetchAdvice(customParams);
  };

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await apiService.chatAdvisor(textToSend);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.answer,
        category: response.category || 'Decision Intelligence',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "Unable to process advisor query at this moment. Please verify backend connectivity.",
        category: 'Diagnostic Error',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const presetQuestions = [
    "Why did profit decrease?",
    "Which region is performing best?",
    "Which category has the highest sales?",
    "Which customers are at risk?",
    "What should I do to improve profit?"
  ];

  const getHealthColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#38bdf8';
    if (score >= 40) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="content-area animate-fade-in">
      {/* Header & Navigation */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(56, 189, 248, 0.12))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              AI Business Decision Advisor
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Turn your business data into actionable decisions, executive SWOT strategy, and risk mitigation.
            </p>
          </div>
        </div>

        {/* Tab & Action Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div className="tab-group" style={{ display: 'flex', background: 'var(--bg-app)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('strategy')}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: '600',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: activeTab === 'strategy' ? 'var(--accent-blue)' : 'transparent',
                color: activeTab === 'strategy' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition)'
              }}
            >
              <Award size={14} /> Strategic Diagnostic
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: '600',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: activeTab === 'chat' ? 'var(--accent-blue)' : 'transparent',
                color: activeTab === 'chat' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition)'
              }}
            >
              <MessageSquare size={14} /> AI Assistant Q&A
            </button>
          </div>

          {activeTab === 'strategy' && (
            <>
              <button
                onClick={() => setShowTuner(prev => !prev)}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Sliders size={14} /> {showTuner ? 'Hide Tuner' : 'Parameter Tuner'}
              </button>
              <button
                onClick={() => fetchAdvice(showTuner ? customParams : {})}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <RefreshCw size={14} /> Recompute
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === 'strategy' ? (
        <>
          {/* Optional Scenario Tuner */}
          {showTuner && (
            <div className="glass-panel animate-fade-in" style={{ padding: '22px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
                Simulate Business Conditions
              </h4>
              <form onSubmit={handleTuneSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Revenue (₹)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={customParams.revenue}
                      onChange={e => setCustomParams(p => ({ ...p, revenue: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Profit (₹)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={customParams.profit}
                      onChange={e => setCustomParams(p => ({ ...p, profit: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sales Growth (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      value={customParams.sales_growth}
                      onChange={e => setCustomParams(p => ({ ...p, sales_growth: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Churn Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      value={customParams.churn_rate}
                      onChange={e => setCustomParams(p => ({ ...p, churn_rate: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.84rem' }}>
                  Run Scenario Analysis
                </button>
              </form>
            </div>
          )}

          {loading && <Loading text="Consulting AI neural heuristics and computing Business Health Score..." fullPage />}
          {error && <ErrorMessage message={error} onRetry={() => fetchAdvice()} />}

          {!loading && !error && data && (
            <>
              {/* Business Health Score Hero Card */}
              <div className="glass-panel" style={{
                padding: '28px',
                marginBottom: '24px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '32px',
                alignItems: 'center'
              }}>
                {/* Score Ring Display */}
                <div style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, var(--bg-card) 60%, transparent 62%), conic-gradient(${getHealthColor(data.health_score.score)} ${data.health_score.score * 3.6}deg, var(--bg-muted) 0deg)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 24px ${getHealthColor(data.health_score.score)}33`
                }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>
                    {data.health_score.score}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    / 100
                  </span>
                </div>

                {/* Health Score Details & Pillar Breakdown */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="badge" style={{ backgroundColor: `${getHealthColor(data.health_score.score)}22`, color: getHealthColor(data.health_score.score), fontSize: '0.85rem', padding: '4px 12px' }}>
                      {data.health_score.grade}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {data.health_score.status}
                    </h3>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                    {data.executive_summary}
                  </p>

                  {/* 5-Pillar Score Badges */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Margin Pillar: </span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>{data.health_score.profit_margin_score}/25</strong>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Growth Velocity: </span>
                      <strong style={{ color: 'var(--accent-blue)' }}>{data.health_score.growth_score}/25</strong>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Retention Index: </span>
                      <strong style={{ color: 'var(--accent-indigo)' }}>{data.health_score.retention_score}/25</strong>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Operations: </span>
                      <strong style={{ color: 'var(--accent-amber)' }}>{data.health_score.inventory_score}/15</strong>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Marketing ROI: </span>
                      <strong style={{ color: 'var(--accent-cyan)' }}>{data.health_score.marketing_efficiency_score}/10</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* SWOT 4-Quadrant Layout */}
              <div className="charts-grid-2" style={{ marginBottom: '24px' }}>
                {/* 1. AI INSIGHTS ("What is happening?") */}
                <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-blue)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Sparkles size={20} color="var(--accent-blue)" />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        AI Insights
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>What is happening across business channels?</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.insights.map((ins, idx) => (
                      <div key={idx} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h5 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>{ins.title}</h5>
                          <span className="badge badge-blue">{ins.category}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{ins.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. RECOMMENDATIONS ("What should the business do?") */}
                <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-emerald)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Lightbulb size={20} color="var(--accent-emerald)" />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Strategic Recommendations
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>What actions should leadership execute next?</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.recommendations.map((rec, idx) => (
                      <div key={idx} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h5 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>{rec.title}</h5>
                          <span className="badge badge-emerald">{rec.priority} Priority</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{rec.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="charts-grid-2">
                {/* 3. WARNINGS ("What needs attention?") */}
                <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-rose)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <AlertTriangle size={20} color="var(--accent-rose)" />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Critical Warnings & Vulnerabilities
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>What metrics require immediate risk control?</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.warnings.map((warn, idx) => (
                      <div key={idx} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h5 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>{warn.area}</h5>
                          <span className="badge badge-rose">{warn.severity} Exposure</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{warn.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. OPPORTUNITIES ("Where can the business grow?") */}
                <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-amber)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <TrendingUp size={20} color="var(--accent-amber)" />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        High-Growth Opportunities
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Where can revenue and expansion be unlocked?</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.opportunities.map((opp, idx) => (
                      <div key={idx} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h5 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>{opp.title}</h5>
                          <span className="badge badge-amber">{opp.potential}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{opp.strategy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        /* Interactive AI Business Chat Assistant Tab */
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  AI Decision Intelligence Assistant
                </h4>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Connected to Real-Time Telemetry & Heuristic Rules Engine
                </span>
              </div>
            </div>
            <span className="badge badge-blue">Data-Driven Assistant</span>
          </div>

          {/* Preset Question Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-app)' }}
              >
                <Sparkles size={12} style={{ color: 'var(--accent-blue)', marginRight: '4px' }} />
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '6px', marginBottom: '16px' }}>
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {msg.sender === 'assistant' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, marginTop: '2px' }}>
                    <Bot size={16} />
                  </div>
                )}

                <div style={{
                  background: msg.sender === 'user' ? 'var(--accent-blue)' : 'var(--bg-app)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.category && (
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--accent-blue)', marginBottom: '4px', textTransform: 'uppercase' }}>
                      {msg.category}
                    </div>
                  )}
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </p>
                  <div style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
                    {msg.time}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0, marginTop: '2px' }}>
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <Bot size={16} />
                </div>
                <div style={{ background: 'var(--bg-app)', padding: '12px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Analyzing dataset telemetry...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              className="input-field"
              placeholder="Ask the AI Advisor (e.g. 'Why did profit decrease?' or 'Which region is best?')..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={chatLoading || !chatInput.trim()}
              style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={16} />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
