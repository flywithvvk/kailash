import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../data/departmentsData';
import { DEPARTMENT_ICONS, UI_ICONS } from '../data/departmentIcons';

const NewKailashDashboard = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showGaneshaModal, setShowGaneshaModal] = useState(false);
  const [ganeshaCommand, setGaneshaCommand] = useState('');
  const [ganeshaProcessing, setGaneshaProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [recentCommands, setRecentCommands] = useState([]);
  const [commandPriority, setCommandPriority] = useState('medium');
  const [commandDeadline, setCommandDeadline] = useState('');
  
  const [shivData] = useState({
    mode: 'Meditation',
    threatsToday: 0,
    lastIntervention: 'Never',
    systemHealth: 98,
    layers: [
      { name: 'Authentication', status: 'Active' },
      { name: 'API Health', status: 'Active' },
      { name: 'System Load', status: 'Active' },
      { name: 'Data Integrity', status: 'Active' },
      { name: 'Network Security', status: 'Active' }
    ]
  });

  const [parvatiData] = useState({
    harmonyScore: 92,
    trend: 'improving',
    workloadBalance: 95,
    lastRebalancing: '2h ago',
    dimensions: [
      { name: 'Task Distribution', score: 90 },
      { name: 'Agent Utilization', score: 88 },
      { name: 'Response Time', score: 92 },
      { name: 'Completion Rate', score: 95 },
      { name: 'Conflict Resolution', score: 87 }
    ]
  });

  const [kpiData, setKpiData] = useState({
    departments: 20,
    tasks: 127,
    tasksTrend: 12,
    issues: 3,
    issuesTrend: -2,
    harmony: 92
  });

  const [recentActivity] = useState([
    { time: '2 min ago', activity: 'Task assigned to KAMADEVA', type: 'teal' },
    { time: '15 min ago', activity: 'SHIV: Security scan OK', type: 'green' },
    { time: '1 hour ago', activity: 'PARVATI rebalanced tasks', type: 'yellow' },
    { time: '3 hours ago', activity: 'Task completed by KUBERA', type: 'green' }
  ]);

  const handleGaneshaCommand = async () => {
    if (!ganeshaCommand.trim()) return;
    setGaneshaProcessing(true);
    setProcessingStep(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessingStep(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessingStep(3);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const taskId = `TASK-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
    const newCommand = {
      id: taskId,
      command: ganeshaCommand,
      priority: commandPriority,
      status: 'completed',
      timestamp: new Date().toISOString()
    };
    setRecentCommands(prev => [newCommand, ...prev.slice(0, 2)]);
    setKpiData(prev => ({
      ...prev,
      tasks: prev.tasks + 1,
      tasksTrend: prev.tasksTrend + 1
    }));
    
    setGaneshaCommand('');
    setCommandPriority('medium');
    setCommandDeadline('');
    setGaneshaProcessing(false);
    setProcessingStep(0);
    setShowGaneshaModal(false);
    alert(`Task ${taskId} created successfully!`);
  };

  const renderIcon = (svgString) => React.createElement('span', { dangerouslySetInnerHTML: { __html: svgString } });

  if (!selectedDepartment) {
    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50' },
      // Header - Typography: text-3xl font-black for title, text-xs font-medium uppercase for subtitle
      React.createElement('header', { 
        className: 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-5 fixed top-0 left-0 right-0 z-50 shadow-sm'
      },
        React.createElement('div', { className: 'flex items-center justify-between max-w-[2000px] mx-auto' },
          React.createElement('div', { className: 'flex items-center gap-6' },
            React.createElement('div', { className: 'relative' },
              React.createElement('div', { className: 'absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-lg blur opacity-25' }),
              React.createElement('div', { className: 'relative' },
                // Title: text-3xl (30px) font-black (900) tracking-tight
                React.createElement('h1', { 
                  className: 'text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 tracking-tight leading-none'
                }, 'KAILASH'),
                // Subtitle: text-xs (12px) font-medium (500) tracking-wide uppercase
                React.createElement('p', { className: 'text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5' }, 'Command Center')
              )
            )
          ),
          React.createElement('div', { className: 'flex-1 max-w-xl mx-12' },
            React.createElement('div', { className: 'relative group' },
              React.createElement('div', { className: 'absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300' }),
              React.createElement('div', { className: 'relative' },
                React.createElement('div', { className: 'absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-hover:text-orange-600' },
                  renderIcon(UI_ICONS.SEARCH)
                ),
                // Search input: text-base (16px) font-normal (400)
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Search departments, tasks, analytics...',
                  className: 'w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-normal text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md'
                })
              )
            )
          ),
          React.createElement('div', { className: 'flex items-center gap-4' },
            // GANESHA Button: text-base (16px) font-bold (700)
            React.createElement('div', { className: 'relative group' },
              React.createElement('div', { className: 'absolute -inset-1 bg-gradient-to-r from-red-600 to-red-700 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300' }),
              React.createElement('button', {
                onClick: () => setShowGaneshaModal(true),
                className: 'relative px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
              }, 'GANESHA')
            ),
            React.createElement('button', { 
              className: 'relative p-3 text-gray-600 hover:text-orange-600 transition-all duration-300 hover:bg-orange-50 rounded-xl group'
            },
              renderIcon(UI_ICONS.BELL),
              React.createElement('span', { className: 'absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse ring-4 ring-white' })
            ),
            React.createElement('div', { className: 'flex items-center gap-3 pl-4 border-l border-gray-200' },
              React.createElement('div', { className: 'p-2.5 bg-gradient-to-br from-orange-100 to-purple-100 rounded-xl' },
                renderIcon(UI_ICONS.USER)
              ),
              React.createElement('div', null,
                // User name: text-sm (14px) font-semibold (600)
                React.createElement('div', { className: 'text-sm font-semibold text-gray-900' }, 'Vivek Gupta'),
                // User role: text-xs (12px) font-normal (400)
                React.createElement('div', { className: 'text-xs font-normal text-gray-500' }, 'Chief Executive Officer')
              )
            )
          )
        )
      ),
      
      React.createElement('div', { className: 'flex pt-24' },
        // Sidebar
        React.createElement('aside', { 
          className: 'fixed left-0 top-24 bottom-0 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 overflow-y-auto shadow-xl'
        },
          React.createElement('div', { className: 'p-6' },
            React.createElement('div', { className: 'mb-6' },
              // Sidebar header: text-lg (18px) font-black (900) tracking-tight
              React.createElement('h2', { 
                className: 'text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600 tracking-tight mb-2'
              }, 'DEPARTMENTS'),
              // Sidebar subtext: text-xs (12px) font-normal (400)
              React.createElement('p', { className: 'text-xs font-normal text-gray-500' }, '20 Active Teams')
            ),
            React.createElement('div', { className: 'space-y-2' },
              DEPARTMENTS.map(dept =>
                React.createElement('button', {
                  key: dept.id,
                  onClick: () => setSelectedDepartment(dept),
                  className: 'w-full group relative'
                },
                  React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-r from-orange-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-all duration-300' }),
                  React.createElement('div', { className: 'relative flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-300 group-hover:bg-white group-hover:shadow-md border-l-4 border-transparent group-hover:border-orange-600' },
                    React.createElement('div', { className: 'p-2 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-300' },
                      React.createElement('span', { className: 'text-orange-600' },
                        renderIcon(DEPARTMENT_ICONS[dept.id.toUpperCase()] || DEPARTMENT_ICONS.GANESHA)
                      )
                    ),
                    React.createElement('div', { className: 'flex-1 text-left' },
                      // Department name: text-sm (14px) font-semibold (600)
                      React.createElement('span', { className: 'text-sm font-semibold block' }, dept.name),
                      // Task count: text-xs (12px) font-normal (400)
                      React.createElement('span', { className: 'text-xs font-normal text-gray-500' }, dept.activeTasks + ' active tasks')
                    ),
                    React.createElement('div', { className: 'w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-100' })
                  )
                )
              )
            )
          )
        ),
        
        // Main Content
        React.createElement('main', { className: 'ml-72 flex-1 p-8 max-w-[1800px]' },
          // SHIV and PARVATI Panels
          React.createElement('div', { className: 'grid grid-cols-2 gap-8 mb-8' },
            // SHIV Panel
            React.createElement('div', { className: 'relative group' },
              React.createElement('div', { className: 'absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500' }),
              React.createElement('div', { className: 'relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1' },
                React.createElement('div', { className: 'flex items-start justify-between mb-8' },
                  React.createElement('div', { className: 'flex items-center gap-5' },
                    React.createElement('div', { className: 'p-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl' },
                      React.createElement('div', { className: 'text-red-600 transform transition-transform group-hover:scale-110' },
                        renderIcon(UI_ICONS.SHIELD)
                      )
                    ),
                    React.createElement('div', null,
                      // Panel title: text-2xl (24px) font-black (900)
                      React.createElement('h2', { className: 'text-2xl font-black text-red-600 mb-1' }, 'SHIV GUARDIAN'),
                      // Panel subtitle: text-sm (14px) font-medium (500)
                      React.createElement('p', { className: 'text-sm font-medium text-gray-500' }, 'Security & Monitoring')
                    )
                  ),
                  // Status badge: text-xs (12px) font-bold (700) uppercase tracking-wide
                  React.createElement('div', { className: 'px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide' }, 
                    shivData.mode
                  )
                ),
                React.createElement('div', { className: 'space-y-6' },
                  React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
                    React.createElement('div', { className: 'p-4 bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl' },
                      // Metric label: text-xs (12px) font-medium (500)
                      React.createElement('div', { className: 'text-xs font-medium text-gray-500 mb-1' }, 'Threats Today'),
                      // Metric value: text-3xl (30px) font-black (900)
                      React.createElement('div', { className: 'text-3xl font-black text-gray-900' }, shivData.threatsToday)
                    ),
                    React.createElement('div', { className: 'p-4 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl' },
                      React.createElement('div', { className: 'text-xs font-medium text-gray-500 mb-1' }, 'System Health'),
                      React.createElement('div', { className: 'text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600' }, 
                        shivData.systemHealth + '%'
                      )
                    )
                  ),
                  React.createElement('div', null,
                    React.createElement('div', { className: 'relative h-3 bg-gray-100 rounded-full overflow-hidden' },
                      React.createElement('div', {
                        className: 'absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 rounded-full transition-all duration-1000 ease-out',
                        style: { width: `${shivData.systemHealth}%` }
                      }),
                      React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse' })
                    )
                  ),
                  React.createElement('div', { className: 'pt-6 border-t border-gray-100' },
                    // Section header: text-xs (12px) font-bold (700) uppercase tracking-wide
                    React.createElement('h3', { className: 'text-xs font-bold text-gray-900 uppercase tracking-wide mb-4' }, 'Monitoring Layers'),
                    React.createElement('div', { className: 'space-y-3' },
                      shivData.layers.map((layer, idx) =>
                        React.createElement('div', {
                          key: idx,
                          className: 'flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-transparent rounded-xl hover:from-green-100 transition-colors duration-300'
                        },
                          React.createElement('div', { className: 'flex items-center gap-3' },
                            React.createElement('div', { className: 'text-green-600' },
                              renderIcon(UI_ICONS.CHECK)
                            ),
                            // Layer name: text-sm (14px) font-medium (500)
                            React.createElement('span', { className: 'text-sm font-medium text-gray-700' }, layer.name)
                          ),
                          // Layer status: text-xs (12px) font-bold (700)
                          React.createElement('span', { className: 'text-xs font-bold text-green-600 px-3 py-1 bg-green-100 rounded-full' }, layer.status)
                        )
                      )
                    )
                  )
                )
              )
            ),
            
            // PARVATI Panel
            React.createElement('div', { className: 'relative group' },
              React.createElement('div', { className: 'absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500' }),
              React.createElement('div', { className: 'relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1' },
                React.createElement('div', { className: 'flex items-start justify-between mb-8' },
                  React.createElement('div', { className: 'flex items-center gap-5' },
                    React.createElement('div', { className: 'p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl' },
                      React.createElement('div', { className: 'text-pink-600 transform transition-transform group-hover:scale-110' },
                        renderIcon(UI_ICONS.BALANCE)
                      )
                    ),
                    React.createElement('div', null,
                      // Panel title: text-2xl (24px) font-black (900)
                      React.createElement('h2', { className: 'text-2xl font-black text-pink-600 mb-1' }, 'PARVATI HARMONY'),
                      // Panel subtitle: text-sm (14px) font-medium (500)
                      React.createElement('p', { className: 'text-sm font-medium text-gray-500' }, 'Workload Balance')
                    )
                  )
                ),
                React.createElement('div', { className: 'text-center mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl' },
                  // Hero number: text-6xl (60px) font-black (900)
                  React.createElement('div', { className: 'text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2 leading-none' }, 
                    parvatiData.harmonyScore
                  ),
                  // Label: text-sm (14px) font-medium (500)
                  React.createElement('div', { className: 'text-sm font-medium text-gray-600 mb-2' }, 'Harmony Score / 100'),
                  // Trend badge: text-xs (12px) font-bold (700)
                  React.createElement('div', { className: 'inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs font-bold' },
                    React.createElement('span', null, parvatiData.trend),
                    React.createElement('span', null, '↑')
                  )
                ),
                React.createElement('div', { className: 'space-y-4' },
                  parvatiData.dimensions.map((dim, idx) =>
                    React.createElement('div', { key: idx },
                      React.createElement('div', { className: 'flex justify-between text-xs mb-2' },
                        // Dimension name: text-xs (12px) font-medium (500)
                        React.createElement('span', { className: 'font-medium text-gray-600' }, dim.name),
                        // Dimension value: text-xs (12px) font-bold (700)
                        React.createElement('span', { className: 'font-bold text-gray-900' }, dim.score + '%')
                      ),
                      React.createElement('div', { className: 'relative h-2.5 bg-gray-100 rounded-full overflow-hidden' },
                        React.createElement('div', {
                          className: 'absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-1000 ease-out',
                          style: { width: `${dim.score}%` }
                        })
                      )
                    )
                  )
                )
              )
            )
          ),
          
          // KPI Cards
          React.createElement('div', { className: 'grid grid-cols-4 gap-6 mb-8' },
            [
              { label: 'DEPARTMENTS', value: kpiData.departments, suffix: '', trend: 'Active', color: 'orange' },
              { label: 'TASKS', value: kpiData.tasks, suffix: '', trend: `↑ +${kpiData.tasksTrend}`, color: 'blue' },
              { label: 'ISSUES', value: kpiData.issues, suffix: '', trend: `↓ ${kpiData.issuesTrend}`, color: 'red' },
              { label: 'HARMONY', value: kpiData.harmony, suffix: '/100', trend: '↑', color: 'green' }
            ].map((kpi, idx) =>
              React.createElement('div', { 
                key: idx,
                className: 'relative group'
              },
                React.createElement('div', { className: `absolute -inset-0.5 bg-gradient-to-r from-${kpi.color}-600 to-${kpi.color}-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500` }),
                React.createElement('div', { className: 'relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1' },
                  // KPI label: text-xs (12px) font-bold (700) uppercase tracking-wider
                  React.createElement('div', { className: 'text-xs font-bold text-gray-500 uppercase tracking-wider mb-3' }, kpi.label),
                  // KPI value: text-4xl (36px) font-black (900)
                  React.createElement('div', { className: 'text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600 mb-2 leading-none' }, 
                    kpi.value + kpi.suffix
                  ),
                  // Trend: text-xs (12px) font-bold (700)
                  React.createElement('div', { 
                    className: `text-xs font-bold ${kpi.trend.includes('↑') || kpi.trend.includes('↓') ? 'text-green-600' : 'text-gray-600'}`
                  }, kpi.trend)
                )
              )
            )
          ),
          
          // Recent Activity
          React.createElement('div', { className: 'relative group mb-8' },
            React.createElement('div', { className: 'absolute -inset-1 bg-gradient-to-r from-g4g-blue to-cyan-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition duration-500' }),
            React.createElement('div', { className: 'relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500' },
              // Section title: text-xl (20px) font-black (900)
              React.createElement('h3', { className: 'text-xl font-black text-gray-900 mb-6 flex items-center gap-3' }, 
                'RECENT ACTIVITY',
                // Badge: text-xs (12px) font-bold (700)
                React.createElement('span', { className: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold' }, 
                  recentActivity.length + ' updates'
                )
              ),
              React.createElement('div', { className: 'space-y-4' },
                recentActivity.map((activity, idx) =>
                  React.createElement('div', {
                    key: idx,
                    className: 'flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-orange-50 transition-all duration-300 group/item'
                  },
                    React.createElement('div', {
                      className: `w-3 h-3 rounded-full ${
                        activity.type === 'teal' ? 'bg-teal-500 ring-4 ring-teal-100' :
                        activity.type === 'green' ? 'bg-green-500 ring-4 ring-green-100' :
                        activity.type === 'yellow' ? 'bg-yellow-500 ring-4 ring-yellow-100' : 
                        'bg-gray-500 ring-4 ring-gray-100'
                      } group-hover/item:scale-125 transition-transform`
                    }),
                    // Timestamp: text-xs (12px) font-medium (500)
                    React.createElement('span', { className: 'text-xs font-medium text-gray-500 w-20' }, activity.time),
                    // Activity text: text-sm (14px) font-medium (500)
                    React.createElement('span', { className: 'text-sm font-medium text-gray-900 flex-1 group-hover/item:text-orange-600 transition-colors' }, 
                      activity.activity
                    )
                  )
                )
              )
            )
          ),
          
          // Department Health Grid
          React.createElement('div', { className: 'relative group' },
            React.createElement('div', { className: 'absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition duration-500' }),
            React.createElement('div', { className: 'relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500' },
              // Section title: text-xl (20px) font-black (900)
              React.createElement('h3', { className: 'text-xl font-black text-gray-900 mb-6' }, 'DEPARTMENT HEALTH'),
              React.createElement('div', { className: 'grid grid-cols-5 gap-5' },
                DEPARTMENTS.map(dept =>
                  React.createElement('button', {
                    key: dept.id,
                    onClick: () => setSelectedDepartment(dept),
                    className: 'group/card relative'
                  },
                    React.createElement('div', { className: 'absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-0 group-hover/card:opacity-30 transition duration-300' }),
                    React.createElement('div', { className: 'relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl' },
                      React.createElement('div', { className: 'flex items-center justify-between mb-3' },
                        React.createElement('div', { className: 'p-2.5 bg-gradient-to-br from-orange-100 to-purple-100 rounded-xl group-hover/card:scale-110 transition-transform' },
                          React.createElement('span', { className: 'text-orange-600' },
                            renderIcon(DEPARTMENT_ICONS[dept.id.toUpperCase()] || DEPARTMENT_ICONS.GANESHA)
                          )
                        ),
                        React.createElement('div', {
                          className: `w-2.5 h-2.5 rounded-full ${dept.status === 'active' ? 'bg-green-500 ring-4 ring-green-100' : 'bg-gray-400'} animate-pulse`
                        })
                      ),
                      // Department name: text-xs (12px) font-bold (700)
                      React.createElement('div', { className: 'text-xs font-bold text-gray-900 mb-2 truncate group-hover/card:text-orange-600 transition-colors' }, 
                        dept.name
                      ),
                      React.createElement('div', { className: 'relative h-2 bg-gray-100 rounded-full overflow-hidden mb-2' },
                        React.createElement('div', {
                          className: 'absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full transition-all duration-500',
                          style: { width: `${dept.workload}%` }
                        })
                      ),
                      React.createElement('div', { className: 'flex items-center justify-between' },
                        // Task count: text-xs (12px) font-normal (400)
                        React.createElement('span', { className: 'text-xs font-normal text-gray-500' }, dept.activeTasks + ' tasks'),
                        // Workload percentage: text-xs (12px) font-bold (700)
                        React.createElement('span', { className: 'text-xs font-bold text-orange-600' }, dept.workload + '%')
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ),
      
      // GANESHA Modal
      showGaneshaModal && React.createElement('div', {
        className: 'fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300',
        onClick: () => !ganeshaProcessing && setShowGaneshaModal(false)
      },
        React.createElement('div', {
          className: 'relative w-full max-w-3xl animate-in zoom-in duration-300',
          onClick: e => e.stopPropagation()
        },
          React.createElement('div', { className: 'absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 rounded-3xl blur-2xl opacity-50' }),
          React.createElement('div', { className: 'relative bg-white rounded-3xl shadow-2xl p-10 border border-gray-100' },
            React.createElement('div', { className: 'flex items-start justify-between mb-8' },
              React.createElement('div', { className: 'flex items-center gap-5' },
                React.createElement('div', { className: 'p-4 bg-gradient-to-br from-orange-100 to-purple-100 rounded-2xl' },
                  React.createElement('div', { className: 'text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600' },
                    renderIcon(DEPARTMENT_ICONS.GANESHA)
                  )
                ),
                React.createElement('div', null,
                  // Modal title: text-3xl (30px) font-black (900)
                  React.createElement('h2', { className: 'text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 mb-1 leading-none' }, 
                    'GANESHA'
                  ),
                  // Modal subtitle: text-sm (14px) font-medium (500)
                  React.createElement('p', { className: 'text-sm font-medium text-gray-500' }, 'AI Command Center')
                )
              ),
              React.createElement('button', {
                onClick: () => setShowGaneshaModal(false),
                className: 'p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all',
                disabled: ganeshaProcessing
              },
                renderIcon(UI_ICONS.CLOSE)
              )
            ),
            
            ganeshaProcessing ?
              React.createElement('div', { className: 'py-16 text-center' },
                // Processing text: text-2xl (24px) font-bold (700)
                React.createElement('div', { className: 'mb-8 text-2xl font-bold text-gray-900' },
                  processingStep === 1 && 'Parsing command...',
                  processingStep === 2 && 'Routing to departments...',
                  processingStep === 3 && 'Task created successfully!'
                ),
                React.createElement('div', { className: 'flex justify-center gap-3' },
                  React.createElement('div', { className: 'w-4 h-4 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full animate-bounce' }),
                  React.createElement('div', {
                    className: 'w-4 h-4 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full animate-bounce',
                    style: { animationDelay: '0.1s' }
                  }),
                  React.createElement('div', {
                    className: 'w-4 h-4 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full animate-bounce',
                    style: { animationDelay: '0.2s' }
                  })
                )
              ) :
              React.createElement(React.Fragment, null,
                React.createElement('div', { className: 'mb-6' },
                  // Form label: text-sm (14px) font-bold (700)
                  React.createElement('label', { className: 'block text-sm font-bold text-gray-700 mb-3' }, 'Enter your command or request:'),
                  // Textarea: text-base (16px) font-normal (400)
                  React.createElement('textarea', {
                    value: ganeshaCommand,
                    onChange: (e) => setGaneshaCommand(e.target.value),
                    placeholder: 'Ask GANESHA anything...',
                    rows: 6,
                    className: 'w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-normal text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 hover:bg-white'
                  })
                ),
                React.createElement('div', { className: 'grid grid-cols-2 gap-5 mb-8' },
                  React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-bold text-gray-700 mb-3' }, 'Priority:'),
                    // Select: text-base (16px) font-medium (500)
                    React.createElement('select', {
                      value: commandPriority,
                      onChange: (e) => setCommandPriority(e.target.value),
                      className: 'w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 hover:bg-white'
                    },
                      React.createElement('option', { value: 'low' }, 'Low'),
                      React.createElement('option', { value: 'medium' }, 'Medium'),
                      React.createElement('option', { value: 'high' }, 'High'),
                      React.createElement('option', { value: 'urgent' }, 'Urgent')
                    )
                  ),
                  React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-bold text-gray-700 mb-3' }, 'Deadline:'),
                    React.createElement('input', {
                      type: 'date',
                      value: commandDeadline,
                      onChange: (e) => setCommandDeadline(e.target.value),
                      className: 'w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 hover:bg-white'
                    })
                  )
                ),
                React.createElement('div', { className: 'flex gap-4 mb-8' },
                  React.createElement('div', { className: 'flex-1 relative group' },
                    React.createElement('div', { className: 'absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300' }),
                    // Button: text-base (16px) font-bold (700)
                    React.createElement('button', {
                      onClick: handleGaneshaCommand,
                      disabled: !ganeshaCommand.trim(),
                      className: 'relative w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-purple-600 text-white text-base font-bold rounded-2xl hover:from-orange-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105 active:scale-95'
                    }, 'EXECUTE COMMAND')
                  ),
                  React.createElement('button', {
                    onClick: () => { setGaneshaCommand(''); setCommandPriority('medium'); setCommandDeadline(''); },
                    className: 'px-8 py-4 bg-gray-100 text-gray-700 text-base font-bold rounded-2xl hover:bg-gray-200 transition-all duration-300'
                  }, 'CLEAR')
                ),
                recentCommands.length > 0 && React.createElement('div', { className: 'border-t border-gray-200 pt-6 mb-6' },
                  // Section heading: text-sm (14px) font-bold (700)
                  React.createElement('h3', { className: 'text-sm font-bold text-gray-900 mb-4' }, 'Recent Commands:'),
                  React.createElement('div', { className: 'space-y-2' },
                    recentCommands.map((cmd, idx) =>
                      React.createElement('div', {
                        key: idx,
                        className: 'flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs hover:bg-orange-50 transition-colors'
                      },
                        // Command text: text-xs (12px) font-medium (500)
                        React.createElement('span', { className: 'flex-1 truncate font-medium text-gray-700' }, cmd.command),
                        // Task ID: text-xs (12px) font-bold (700)
                        React.createElement('span', { className: 'font-bold text-teal-600 ml-2' }, cmd.id)
                      )
                    )
                  )
                ),
                React.createElement('div', { className: 'border-t border-gray-200 pt-6' },
                  React.createElement('h3', { className: 'text-sm font-bold text-gray-900 mb-3' }, 'Examples:'),
                  // Example items: text-xs (12px) font-normal (400)
                  React.createElement('div', { className: 'space-y-2 text-xs font-normal text-gray-600' },
                    React.createElement('div', { className: 'flex items-start gap-2' },
                      React.createElement('span', { className: 'text-orange-600 mt-0.5' }, '•'),
                      React.createElement('span', null, '"Assign social media campaign to KAMADEVA"')
                    ),
                    React.createElement('div', { className: 'flex items-start gap-2' },
                      React.createElement('span', { className: 'text-orange-600 mt-0.5' }, '•'),
                      React.createElement('span', null, '"Show URJAA revenue for last 7 days"')
                    ),
                    React.createElement('div', { className: 'flex items-start gap-2' },
                      React.createElement('span', { className: 'text-orange-600 mt-0.5' }, '•'),
                      React.createElement('span', null, '"Create quarterly report task for all depts"')
                    )
                  )
                )
              )
          )
        )
      )
    );
  }

  // Department Detail View
  return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50' },
    React.createElement('div', { className: 'p-8 text-center' },
      React.createElement('h2', { className: 'text-2xl font-black text-gray-900 mb-4' }, 'Department Detail View'),
      React.createElement('p', { className: 'text-sm font-medium text-gray-600' }, 'Coming soon with same typography specifications')
    )
  );
};

export default NewKailashDashboard;
