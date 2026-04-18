import React, { useState, useEffect, useCallback } from 'react';
import { executiveAPI, stationsAPI } from '../lib/api';
import './Executive.css';
import { 
  Download, 
  FileText,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  DollarSign,
  Clock,
  AlertTriangle,
  Users,
  MapPin,
  Gauge,
  Wallet,
  BarChart3,
  Timer,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const MiniSparkline = ({ data, color = 'purple', width = 200, height = 40 }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg className="mini-sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`sparklineGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={`var(--gradient-${color})`} stopOpacity="0.8" />
          <stop offset="100%" stopColor={`var(--gradient-${color})`} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <polygon className="sparkline-area" points={areaPoints} />
      <polyline className="sparkline-path" points={points} />
    </svg>
  );
};

const MiniBarChart = ({ data, color = 'blue' }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data);
  
  return (
    <div className="mini-bar-chart">
      {data.map((value, idx) => (
        <div
          key={idx}
          className={`mini-bar ${color}`}
          style={{ height: `${(value / max) * 100}%` }}
          title={value.toString()}
        />
      ))}
    </div>
  );
};

const ModernKpiCard = ({ 
  title, 
  value, 
  unit = '', 
  delta, 
  color = 'purple', 
  icon: Icon,
  sparklineData = null,
  barChartData = null
}) => {
  const deltaValue = parseFloat(delta);
  const isPositive = deltaValue >= 0;

  return (
    <div className={`kpi-card-modern ${color}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="kpi-icon-container">
            <Icon className="text-white" size={24} />
          </div>
          
          <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </h3>
          
          <div className="kpi-value">
            {value}{unit && <span className="text-sm ml-1 opacity-70">{unit}</span>}
          </div>

          {delta && (
            <div className={`kpi-delta ${isPositive ? 'positive' : 'negative'} mt-2`}>
              {isPositive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              <span>{delta}</span>
            </div>
          )}

          {barChartData && <MiniBarChart data={barChartData} color={color} />}
        </div>
      </div>
      
      {sparklineData && <MiniSparkline data={sparklineData} color={color} />}
    </div>
  );
};

const CircularProgress = ({ percentage, label, color = 'purple' }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(229, 231, 235, 0.3)"
          strokeWidth="8"
        />
        <circle
          className="progress-ring-circle"
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={`url(#gradient-${color})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
      </svg>
      <div className="circular-progress-text">
        <div className="text-lg font-bold">{percentage}%</div>
        {label && <div className="text-xs text-gray-500">{label}</div>}
      </div>
    </div>
  );
};

const Executive = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [projectHealth, setProjectHealth] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [citiesSummary, setCitiesSummary] = useState(null);
  const [opsHealth, setOpsHealth] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const isMobile = false; // Simplified for production

  const generateSparklineData = useCallback((baseValue, variance, trend = 'stable') => {
    return Array.from({ length: 30 }, (_, i) => {
      let value = baseValue;
      if (trend === 'up') {
        value += (i / 30) * variance;
      } else if (trend === 'down') {
        value -= (i / 30) * variance;
      }
      value += (Math.random() - 0.5) * variance * 0.3;
      return { value: Math.max(0, value) };
    });
  }, []);

  const generateBarData = useCallback((baseValue, count = 12) => {
    return Array.from({ length: count }, () => 
      Math.max(0, baseValue * (0.7 + Math.random() * 0.6))
    );
  }, []);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const results = await Promise.allSettled([
        executiveAPI.getKPIs(),
        executiveAPI.getAlerts(),
        executiveAPI.getProjectHealth(),
        executiveAPI.getFinancial(),
        stationsAPI.getCitiesSummary(),
        executiveAPI.getOpsHealth(),
      ]);

      if (results[0].status === 'fulfilled') {
        setKpis(results[0].value.data.kpis || results[0].value.data);
      }
      if (results[1].status === 'fulfilled') {
        setAlerts(results[1].value.data || { alerts: [] });
      } else {
        setAlerts({ alerts: [] });
      }
      if (results[2].status === 'fulfilled') {
        const phData = results[2].value.data;
        setProjectHealth(phData.phases ? phData : { ...phData, phases: [] });
      } else {
        setProjectHealth({ phases: [] });
      }
      if (results[3].status === 'fulfilled') {
        setFinancial(results[3].value.data);
      }
      if (results[4].status === 'fulfilled') {
        setCitiesSummary(results[4].value.data);
      }
      if (results[5].status === 'fulfilled') {
        const opsData = results[5].value.data;
        if (opsData && !opsData.tiles) {
          setOpsHealth({ tiles: [] });
        } else {
          setOpsHealth(opsData);
        }
      } else {
        setOpsHealth({ tiles: [] });
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching executive data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="executive-dashboard">
        <div className="glass-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="executive-dashboard">
        <div className="glass-header text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-200 mb-4">Please try refreshing the page.</p>
          <button
            onClick={() => fetchData()}
            className="btn-glass"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Mobile view simplified for production

  return (
      <div className="executive-dashboard" data-testid="executive-dashboard">
        <header className="glass-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  Executive Command Center 🇮🇳
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  Real-time EV infrastructure analytics • Last updated: {lastUpdate?.toLocaleTimeString() || 'Never'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="btn-glass"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                <span className="ml-2">Refresh</span>
              </button>
              <button className="btn-glass">
                <Download size={16} />
                <span className="ml-2">Export</span>
              </button>
              <button className="btn-glass" style={{ background: 'rgba(102, 126, 234, 0.4)' }}>
                <FileText size={16} />
                <span className="ml-2">Board Pack</span>
              </button>
            </div>
          </div>
        </header>

        <div className="kpi-grid-compact">
          <ModernKpiCard
            title="Network Uptime"
            value={kpis.uptime_percent}
            unit="%"
            delta="+1.2%"
            color="green"
            icon={Activity}
            sparklineData={generateSparklineData(kpis.uptime_percent, 5, 'up')}
          />
          
          <ModernKpiCard
            title="MTTR"
            value={kpis.mttr_hours || 7}
            unit="hrs"
            delta="-0.5"
            color="blue"
            icon={Timer}
            sparklineData={generateSparklineData(kpis.mttr_hours || 7, 2, 'down')}
          />
          
          <ModernKpiCard
            title="Sessions MTD"
            value={(kpis.sessions_mtd / 1000).toFixed(1)}
            unit="k"
            delta="+12%"
            color="purple"
            icon={Zap}
            barChartData={generateBarData(kpis.sessions_mtd / 12)}
          />
          
          <ModernKpiCard
            title="Revenue MTD"
            value={`₹${(kpis.revenue_mtd / 100000).toFixed(1)}`}
            unit="L"
            delta="+8%"
            color="orange"
            icon={DollarSign}
            barChartData={generateBarData(kpis.revenue_mtd / 12)}
          />
          
          <ModernKpiCard
            title="High Tickets"
            value={kpis.open_high_tickets}
            delta={kpis.open_high_tickets > 15 ? '+3' : '-2'}
            color={kpis.open_high_tickets > 15 ? 'red' : 'cyan'}
            icon={AlertTriangle}
            sparklineData={generateSparklineData(kpis.open_high_tickets, 5, 'stable')}
          />

          <ModernKpiCard
            title="AC Utilization"
            value={kpis.utilization_ac_90d}
            unit="%"
            color="teal"
            icon={Gauge}
            sparklineData={generateSparklineData(kpis.utilization_ac_90d, 8, 'up')}
          />
          
          <ModernKpiCard
            title="DC Utilization"
            value={kpis.utilization_dc_90d}
            unit="%"
            color="indigo"
            icon={Gauge}
            sparklineData={generateSparklineData(kpis.utilization_dc_90d, 10, 'up')}
          />
          
          <ModernKpiCard
            title="Payouts On-time"
            value={kpis.payouts_ontime_percent}
            unit="%"
            delta="+2%"
            color={kpis.payouts_ontime_percent >= 98 ? 'green' : 'amber'}
            icon={Wallet}
            sparklineData={generateSparklineData(kpis.payouts_ontime_percent, 3, 'stable')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="section-glass">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Health</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">PMO rollout progress - 6 phases</p>
              </div>
              <BarChart3 className="text-purple-500" size={24} />
            </div>
            
            {projectHealth && projectHealth.phases && (
              <div className="space-y-4">
                {projectHealth.phases.map((phase, idx) => (
                  <div key={idx} className="metric-tile">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {phase.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          {phase.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {phase.completion}%
                        </span>
                      </div>
                    </div>
                    <div className="phase-progress purple">
                      <div
                        className="phase-progress-fill"
                        style={{ width: `${phase.completion}%` }}
                        role="progressbar"
                        aria-valuenow={phase.completion}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${phase.name} progress: ${phase.completion}%`}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="metric-tile border-l-4 border-amber-500">
                  <div className="flex items-center justify-between">
                    <span className="stat-label">Project Slippage</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">
                        {projectHealth.slippage_days} days
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{projectHealth.slippage_cost_cr}Cr impact
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="section-glass">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Performance</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">P&L Mini Waterfall - MTD</p>
              </div>
              <DollarSign className="text-green-500" size={24} />
            </div>
            
            {financial && (
              <div className="space-y-4">
                <div className="stat-grid">
                  <div className="metric-tile">
                    <div className="stat-label">Gross Revenue</div>
                    <div className="stat-value">₹{financial.gross_revenue_cr}Cr</div>
                  </div>
                  <div className="metric-tile">
                    <div className="stat-label">Net Revenue</div>
                    <div className="stat-value text-green-600">₹{financial.net_revenue_cr}Cr</div>
                  </div>
                  <div className="metric-tile">
                    <div className="stat-label">Credits Issued</div>
                    <div className="stat-value text-red-600">-₹{financial.credits_issued_cr}Cr</div>
                  </div>
                  <div className="metric-tile">
                    <div className="stat-label">EBITDA %</div>
                    <div className="stat-value">{financial.ebitda_percent}%</div>
                  </div>
                </div>
                
                <div className="chart-container">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Revenue Flow Breakdown</div>
                  <div className="flex h-6 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                      style={{ width: `${(financial.net_revenue_cr / financial.gross_revenue_cr) * 100}%` }}
                      title={`Net: ${((financial.net_revenue_cr / financial.gross_revenue_cr) * 100).toFixed(1)}%`}
                    />
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                      style={{ width: `${(financial.credits_issued_cr / financial.gross_revenue_cr) * 100}%` }}
                      title={`Credits: ${((financial.credits_issued_cr / financial.gross_revenue_cr) * 100).toFixed(1)}%`}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-green-600 font-medium">
                      Net {((financial.net_revenue_cr / financial.gross_revenue_cr) * 100).toFixed(1)}%
                    </span>
                    <span className="text-red-600 font-medium">
                      Credits {((financial.credits_issued_cr / financial.gross_revenue_cr) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="metric-tile text-center">
                    <CircularProgress percentage={financial.ebitda_percent} label="EBITDA" color="green" />
                  </div>
                  <div className="metric-tile text-center">
                    <CircularProgress 
                      percentage={((financial.net_revenue_cr / financial.gross_revenue_cr) * 100).toFixed(0)} 
                      label="Net %" 
                      color="blue" 
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {alerts && alerts.alerts && alerts.alerts.length > 0 && (
          <section className="section-glass">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Alerts</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {alerts.alerts.length} alerts requiring attention
                </p>
              </div>
              <AlertTriangle className="text-amber-500" size={24} />
            </div>
            
            <div className="space-y-3" role="log" aria-live="polite">
              {alerts.alerts.slice(0, 5).map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`alert-card-modern ${alert.severity}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                      {alert.severity}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center text-sm text-white/70 py-6">
          <div className="flex items-center justify-center gap-4">
            <span>Powered by URGAA Platform</span>
            <span>•</span>
            <span>Refreshes every 5 minutes</span>
            <span>•</span>
            <span>Last sync: {lastUpdate?.toLocaleTimeString() || 'Never'}</span>
          </div>
        </footer>
      </div>
  );
};

export default Executive;
