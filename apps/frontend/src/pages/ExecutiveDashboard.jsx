import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Heart, Activity, TrendingUp, Users, Server, 
  AlertTriangle, CheckCircle, Clock, Zap, Database, Brain,
  ChevronRight, RefreshCw, ExternalLink
} from 'lucide-react';
import './ExecutiveDashboard.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ExecutiveDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/executive`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = JSON.parse(responseText);
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="exec-dashboard loading-state">
        <div className="loading-spinner">
          <RefreshCw className="animate-spin" size={48} />
          <p>Loading Executive Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exec-dashboard error-state">
        <AlertTriangle size={48} />
        <p>Error: {error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  const { kpis, guardians, data_sources, problems_solved, departments } = dashboardData || {};

  return (
    <div className="exec-dashboard">
      {/* Header */}
      <div className="exec-header">
        <div className="exec-header-left">
          <h1 className="exec-title">KAILASH AEGIS HUB</h1>
          <p className="exec-subtitle">Executive Command Center — Go4Garage</p>
        </div>
        <div className="exec-header-right">
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <RefreshCw size={18} /> Refresh
          </button>
          <Link to="/ganesha" className="ganesha-link">
            <Brain size={18} /> Ask GANESHA
          </Link>
        </div>
      </div>

      {/* GUARDIAN SECTION */}
      <div className="guardian-section">
        {/* SHIV Card */}
        <div className="guardian-card shiv-card">
          <div className="guardian-header">
            <div className="guardian-icon shiv-icon">
              <Shield size={24} />
            </div>
            <div className="guardian-info">
              <h3>SHIV</h3>
              <p>System Integrity Guardian</p>
            </div>
            <span className={`guardian-status ${guardians?.shiv?.mode || 'observing'}`}>
              {(guardians?.shiv?.mode || 'OBSERVING').toUpperCase()}
            </span>
          </div>
          
          <div className="guardian-metrics">
            <div className="metric-box">
              <span className="metric-value">{guardians?.shiv?.anomalies_detected || 0}</span>
              <span className="metric-label">Anomalies Today</span>
            </div>
            <div className="metric-box success">
              <span className="metric-value">{guardians?.shiv?.auto_resolved || 0}</span>
              <span className="metric-label">Auto-Resolved</span>
            </div>
            <div className="metric-box">
              <span className="metric-value">{guardians?.shiv?.system_health || 98}%</span>
              <span className="metric-label">System Health</span>
            </div>
          </div>
          
          <div className="guardian-footer">
            <span className="last-alert">
              <Clock size={14} /> Last Alert: {guardians?.shiv?.last_alert || 'None in 24h'}
            </span>
          </div>
        </div>

        {/* PARVATI Card */}
        <div className="guardian-card parvati-card">
          <div className="guardian-header">
            <div className="guardian-icon parvati-icon">
              <Heart size={24} />
            </div>
            <div className="guardian-info">
              <h3>PARVATI</h3>
              <p>Organizational Harmony</p>
            </div>
            <div className="harmony-score">
              <span className="score-value">{guardians?.parvati?.harmony_score || 78}</span>
              <span className="score-label">Harmony Score</span>
            </div>
          </div>
          
          <div className="guardian-metrics four-col">
            <div className="metric-box">
              <span className="metric-value">{guardians?.parvati?.workload_balance || 85}%</span>
              <span className="metric-label">Workload</span>
            </div>
            <div className="metric-box">
              <span className="metric-value">{guardians?.parvati?.conflicts || 0}</span>
              <span className="metric-label">Conflicts</span>
            </div>
            <div className="metric-box">
              <span className="metric-value">{guardians?.parvati?.response_quality || 92}%</span>
              <span className="metric-label">Quality</span>
            </div>
            <div className="metric-box">
              <span className="metric-value">{guardians?.parvati?.ceo_satisfaction || 88}%</span>
              <span className="metric-label">CEO Sat.</span>
            </div>
          </div>
        </div>
      </div>

      {/* MASTER KPI CARDS */}
      <div className="kpi-section">
        <KPICard 
          title="Company Health" 
          value={`${kpis?.company_health?.value || 85}%`}
          trend={kpis?.company_health?.trend || '+5%'}
          status={kpis?.company_health?.status || 'green'}
          icon={<Activity size={20} />}
        />
        <KPICard 
          title="Total Revenue" 
          value={`₹${((kpis?.total_revenue?.value || 4250000) / 100000).toFixed(1)}L`}
          trend={kpis?.total_revenue?.trend || '+12%'}
          status={kpis?.total_revenue?.status || 'green'}
          icon={<TrendingUp size={20} />}
        />
        <KPICard 
          title="Active Users" 
          value={(kpis?.active_users?.value || 15234).toLocaleString()}
          trend={kpis?.active_users?.trend || '+8%'}
          status={kpis?.active_users?.status || 'green'}
          icon={<Users size={20} />}
        />
        <KPICard 
          title="System Uptime" 
          value={`${kpis?.system_uptime?.value || 99.7}%`}
          trend={kpis?.system_uptime?.trend || '→0%'}
          status={kpis?.system_uptime?.status || 'green'}
          icon={<Server size={20} />}
        />
        <KPICard 
          title="Auto-Resolved" 
          value={`${kpis?.auto_resolved?.value || 75}%`}
          subtext="No human needed"
          trend={kpis?.auto_resolved?.trend || '+3%'}
          status={kpis?.auto_resolved?.status || 'green'}
          icon={<Zap size={20} />}
        />
        <KPICard 
          title="Alerts Today" 
          value={kpis?.alerts_today?.value || 3}
          trend={kpis?.alerts_today?.trend || '-2'}
          status={kpis?.alerts_today?.status || 'yellow'}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      {/* DATA SOURCE SUMMARY */}
      <div className="data-sources-section">
        <h2 className="section-title">
          <Database size={20} /> Data Intelligence Summary
        </h2>
        
        <div className="data-sources-grid">
          {/* INTERNAL DATA */}
          <div className="data-source-card internal">
            <h3>
              <span className="source-dot internal"></span>
              INTERNAL DATA (Company Operations)
            </h3>
            <div className="source-list">
              {(data_sources?.internal || []).map((source, idx) => (
                <DataSourceRow key={idx} {...source} />
              ))}
            </div>
          </div>
          
          {/* EXTERNAL DATA */}
          <div className="data-source-card external">
            <h3>
              <span className="source-dot external"></span>
              EXTERNAL DATA (Product Intelligence)
            </h3>
            <div className="source-list">
              {(data_sources?.external || []).map((source, idx) => (
                <DataSourceRow key={idx} {...source} isLive={source.status === 'live'} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEMS SOLVED SHOWCASE */}
      <div className="problems-section">
        <h2 className="section-title light">
          <Brain size={20} /> AI-Powered Problem Resolution
        </h2>
        
        <div className="problems-grid">
          {(problems_solved || []).map((problem, idx) => (
            <ProblemSolvedCard key={idx} {...problem} />
          ))}
        </div>
      </div>

      {/* DEPARTMENT QUICK ACCESS */}
      <div className="departments-section">
        <div className="dept-card">
          <h3>
            <span className="source-dot internal"></span>
            Internal Departments ({departments?.internal?.length || 15})
          </h3>
          <div className="dept-grid">
            {(departments?.internal || []).map((dept, idx) => (
              <Link to={`/department/${dept.toLowerCase()}`} key={idx} className="dept-mini-card internal">
                {dept}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="dept-card">
          <h3>
            <span className="source-dot external"></span>
            External Departments ({departments?.external?.length || 5})
          </h3>
          <div className="dept-grid">
            {(departments?.external || []).map((dept, idx) => (
              <Link to={`/department/${dept.name.toLowerCase()}`} key={idx} className="dept-mini-card external">
                <span className="dept-name">{dept.name}</span>
                <span className="dept-product">{dept.product}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const KPICard = ({ title, value, trend, status, icon, subtext }) => (
  <div className={`kpi-card status-${status}`}>
    <div className="kpi-header">
      <span className="kpi-icon">{icon}</span>
      <span className={`kpi-trend ${trend?.startsWith('+') ? 'up' : trend?.startsWith('-') ? 'down' : 'neutral'}`}>
        {trend}
      </span>
    </div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-title">{title}</div>
    {subtext && <div className="kpi-subtext">{subtext}</div>}
  </div>
);

const DataSourceRow = ({ source, type, status, last_sync, isLive }) => (
  <div className="source-row">
    <div className="source-info">
      <span className="source-name">{source}</span>
      <span className="source-type">({type})</span>
    </div>
    <div className="source-status">
      <span className={`status-dot ${isLive ? 'live' : 'synced'}`}></span>
      <span className="sync-time">{last_sync}</span>
    </div>
  </div>
);

const ProblemSolvedCard = ({ product, problem, solution, savings }) => (
  <div className="problem-card">
    <span className="problem-product">{product}</span>
    <h4 className="problem-title">{problem}</h4>
    <p className="problem-solution">{solution}</p>
    <p className="problem-savings">{savings}</p>
  </div>
);

export default ExecutiveDashboard;
