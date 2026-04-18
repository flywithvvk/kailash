import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Wrench, Coins, Sun, Zap, Wind, Target, Flame, Scale, 
  Users, BookOpen, Package, Compass, Microscope, Moon, 
  Shield, Handshake, Building2, Monitor, Globe, Heart,
  User, Settings
} from 'lucide-react';

// Icon mapping for departments (Lucide icons instead of emojis)
const DEPT_ICONS = {
  'VISHWAKARMA': Wrench,
  'LAKSHMI': Coins,
  'SURYA': Sun,
  'INDRA': Zap,
  'VAYU': Wind,
  'YAMA': Target,
  'AGNI': Flame,
  'VARUNA': Scale,
  'BRAHMA': Users,
  'SARASWATI': BookOpen,
  'KUBERA': Package,
  'GANESHA_DEPT': Compass,
  'SHUKRA': Microscope,
  'CHANDRA': Moon,
  'RAHU': Shield,
  'KETU': Handshake,
  'HANUMAN': Building2,
  'ASHWINI': Monitor,
  'BHUMI': Globe,
  'KAMA': Heart
};

// All 20 Departments Data (using icon keys instead of emojis)
const getAllDepartments = () => [
  // Row 1: Core Operations
  { id: 'VISHWAKARMA', name: 'Technology & Engineering', icon: 'VISHWAKARMA', status: 'operational', tasks: 12 },
  { id: 'LAKSHMI', name: 'Finance & Accounting', icon: 'LAKSHMI', status: 'operational', tasks: 8 },
  { id: 'SURYA', name: 'URJAA Operations & Delivery', icon: 'SURYA', status: 'operational', tasks: 15 },
  { id: 'INDRA', name: 'Sales & Business Development', icon: 'INDRA', status: 'operational', tasks: 6 },
  
  // Row 2: Customer & Market
  { id: 'VAYU', name: 'Marketing & Communications', icon: 'VAYU', status: 'operational', tasks: 4 },
  { id: 'YAMA', name: 'Customer Service & Support', icon: 'YAMA', status: 'operational', tasks: 9 },
  { id: 'AGNI', name: 'Quality & Compliance', icon: 'AGNI', status: 'operational', tasks: 3 },
  { id: 'VARUNA', name: 'Customer Success', icon: 'VARUNA', status: 'operational', tasks: 2 },
  
  // Row 3: People & Culture
  { id: 'BRAHMA', name: 'Product Innovation', icon: 'BRAHMA', status: 'operational', tasks: 5 },
  { id: 'SARASWATI', name: 'Training & Development', icon: 'SARASWATI', status: 'operational', tasks: 7 },
  { id: 'KUBERA', name: 'Procurement & Supply Chain', icon: 'KUBERA', status: 'operational', tasks: 6 },
  { id: 'GANESHA_DEPT', name: 'Strategic Planning', icon: 'GANESHA_DEPT', status: 'operational', tasks: 4 },
  
  // Row 4: Innovation & Growth
  { id: 'SHUKRA', name: 'Research & Innovation', icon: 'SHUKRA', status: 'operational', tasks: 8 },
  { id: 'CHANDRA', name: 'Analytics & Insights', icon: 'CHANDRA', status: 'operational', tasks: 5 },
  { id: 'RAHU', name: 'Risk Management', icon: 'RAHU', status: 'operational', tasks: 3 },
  { id: 'KETU', name: 'Partnerships & Alliances', icon: 'KETU', status: 'operational', tasks: 2 },
  
  // Row 5: Infrastructure & Support
  { id: 'HANUMAN', name: 'Facilities & Infrastructure', icon: 'HANUMAN', status: 'operational', tasks: 4 },
  { id: 'ASHWINI', name: 'IT & Systems', icon: 'ASHWINI', status: 'operational', tasks: 10 },
  { id: 'BHUMI', name: 'Sustainability & Environment', icon: 'BHUMI', status: 'operational', tasks: 3 },
  { id: 'KAMA', name: 'Employee Engagement', icon: 'KAMA', status: 'operational', tasks: 2 }
];

// Helper to render department icon
const DeptIcon = ({ iconKey, className = "w-5 h-5" }) => {
  const IconComponent = DEPT_ICONS[iconKey];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <Compass className={className} />;
};

const KailashDashboard = () => {
  const navigate = useNavigate();
  // No separate authentication needed - using AEGISHUB session
  const [isAuthenticated] = useState(true); // Auto-authenticated via AEGISHUB
  const sessionToken = localStorage.getItem('aegis_session_token') || 'mock-token'; // Use AEGISHUB token
  
  // Chat state
  const [messages, setMessages] = useState([{
    type: 'system',
    content: 'Namaste! GANESHA here. I am ready to assist you. What would you like to do?',
    timestamp: new Date()
  }]);
  const [inputCommand, setInputCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [shivStatus, setShivStatus] = useState(null);
  const [parvatiStatus, setParvatiStatus] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  
  const chatEndRef = useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Additional monitoring state
  const [shivThreats, setShivThreats] = useState([]);
  const [parvatiHarmony, setParvatiHarmony] = useState(null);
  const [parvatiWorkload, setParvatiWorkload] = useState([]);
  
  // Department state
  const [departmentsData, setDepartmentsData] = useState([]);

  // Fetch dashboard data every 30 seconds
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Fetch monitoring data every 5 seconds for real-time updates
  useEffect(() => {
    if (isAuthenticated) {
      fetchMonitoringData();
      const interval = setInterval(fetchMonitoringData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${sessionToken}` };
      
      const [dashboardRes, shivRes, parvatiRes, deptsRes, tasksRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/kailash/dashboard/overview`, { headers }),
        axios.get(`${BACKEND_URL}/api/kailash/shiv/status`, { headers }),
        axios.get(`${BACKEND_URL}/api/kailash/parvati/status`, { headers }),
        axios.get(`${BACKEND_URL}/api/kailash/departments`, { headers }),
        axios.get(`${BACKEND_URL}/api/kailash/tasks?status=in_progress&limit=10`, { headers })
      ]);
      
      setDashboardData(dashboardRes.data);
      setShivStatus(shivRes.data);
      setParvatiStatus(parvatiRes.data);
      setDepartments(deptsRes.data.departments || []);
      setActiveTasks(tasksRes.data.tasks || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Fetch monitoring data (SHIV threats, PARVATI harmony, departments)
  const fetchMonitoringData = async () => {
    try {
      const headers = { Authorization: `Bearer ${sessionToken}` };
      
      const [threatsRes, harmonyRes, workloadRes, deptsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/kailash/shiv/threats?hours=24`, { headers }),
        axios.get(`${BACKEND_URL}/api/kailash/parvati/harmony`, { headers }),
        axios.get(`${BACKEND_URL}/api/kailash/parvati/workload`, { headers }),
        axios.get(`${BACKEND_URL}/api/kailash/departments`, { headers })
      ]);
      
      setShivThreats(threatsRes.data.threats || []);
      setParvatiHarmony(harmonyRes.data);
      setParvatiWorkload(workloadRes.data.departments || []);
      setDepartmentsData(deptsRes.data.departments || []);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    }
  };

  // Send command to GANESHA
  const handleSendCommand = async () => {
    if (!inputCommand.trim() || isProcessing) return;
    
    const userMessage = {
      type: 'user',
      content: inputCommand,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputCommand('');
    setIsProcessing(true);
    
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/kailash/ganesha/command`,
        { command: inputCommand },
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );
      
      const ganeshaMessage = {
        type: 'ganesha',
        content: response.data.ganesha_response || response.data.message,
        command_id: response.data.command_id,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, ganeshaMessage]);
      
      // Poll for command completion
      if (response.data.command_id) {
        pollCommandStatus(response.data.command_id);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Error processing command: ' + (error.response?.data?.error?.message || error.message),
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Poll command status until completed
  const pollCommandStatus = async (commandId) => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;
    
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/kailash/ganesha/command/${commandId}`,
          { headers: { Authorization: `Bearer ${sessionToken}` } }
        );
        
        if (response.data.status === 'completed') {
          clearInterval(poll);
          
          setMessages(prev => [...prev, {
            type: 'result',
            content: formatResult(response.data.result),
            timestamp: new Date()
          }]);
          
          // Refresh dashboard data
          fetchDashboardData();
        } else if (response.data.status === 'failed') {
          clearInterval(poll);
          
          setMessages(prev => [...prev, {
            type: 'error',
            content: 'Command failed: ' + (response.data.result?.errors?.join(', ') || 'Unknown error'),
            timestamp: new Date()
          }]);
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(poll);
          setMessages(prev => [...prev, {
            type: 'system',
            content: 'Command is taking longer than expected. I\'ll notify you when it\'s ready.',
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('Error polling command status:', error);
      }
    }, 5000); // Poll every 5 seconds
  };

  // Format result data for display
  const formatResult = (result) => {
    if (!result || !result.success) return 'No data available';
    
    // If it's simple data, stringify it nicely
    if (typeof result.output_data === 'object') {
      return JSON.stringify(result.output_data, null, 2);
    }
    
    return result.output_data?.toString() || 'Task completed successfully';
  };

  // Handle Enter key in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCommand();
    }
  };

  // MAIN DASHBOARD - No separate login needed, using AEGISHUB authentication
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-g4g-blue to-purple-600">
              KAILASH Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">AI-Powered Organization Management</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - System Status */}
        <div className="lg:col-span-1 space-y-6">
          {/* SHIV Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-red-600">SHIV</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                shivStatus?.mode === 'meditation' ? 'bg-green-100 text-green-700' : 
                shivStatus?.mode === 'alert' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {shivStatus?.mode || 'Loading...'}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Threats Today:</span>
                <span className="font-semibold">{shivStatus?.threats_detected_today || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Threats:</span>
                <span className={`font-semibold ${(shivStatus?.active_threats || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {shivStatus?.active_threats || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Interventions:</span>
                <span className="font-semibold">{shivStatus?.interventions_today || 0}</span>
              </div>
              
              {/* Recent Threats */}
              {shivThreats.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Recent Threats:</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {shivThreats.slice(0, 3).map((threat, idx) => (
                      <div key={idx} className={`text-xs p-2 rounded ${
                        threat.level === 'CRITICAL' ? 'bg-red-50 border border-red-200' :
                        threat.level === 'HIGH' ? 'bg-orange-50 border border-orange-200' :
                        'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <div className="font-semibold">{threat.level}: {threat.type}</div>
                        <div className="text-gray-600 truncate">{threat.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PARVATI Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-pink-600">PARVATI</h2>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  (parvatiHarmony?.overall_score || parvatiStatus?.current_harmony_score || 0) >= 80 ? 'text-green-600' :
                  (parvatiHarmony?.overall_score || parvatiStatus?.current_harmony_score || 0) >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {parvatiHarmony?.overall_score || parvatiStatus?.current_harmony_score || 0}
                </div>
                <div className="text-xs text-gray-500">
                  {parvatiHarmony?.trend || parvatiStatus?.trend || 'stable'}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Workload Balance</span>
                  <span>{parvatiHarmony?.breakdown?.workload_balance || parvatiStatus?.score_breakdown?.workload_balance || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${parvatiHarmony?.breakdown?.workload_balance || parvatiStatus?.score_breakdown?.workload_balance || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Task Completion</span>
                  <span>{parvatiHarmony?.breakdown?.task_completion_rate || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${parvatiHarmony?.breakdown?.task_completion_rate || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Agent Health</span>
                  <span>{parvatiHarmony?.breakdown?.agent_health || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${parvatiHarmony?.breakdown?.agent_health || 0}%` }}
                  />
                </div>
              </div>
              
              {/* Rebalancing Info */}
              {parvatiStatus && (
                <div className="mt-3 pt-3 border-t text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rebalancing Today:</span>
                    <span className="font-semibold">{parvatiStatus.rebalancing_actions_today || 0}</span>
                  </div>
                </div>
              )}
              
              {/* Top Workloaded Departments */}
              {parvatiWorkload.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Top Workload:</div>
                  <div className="space-y-1">
                    {parvatiWorkload
                      .sort((a, b) => b.active_tasks - a.active_tasks)
                      .slice(0, 3)
                      .map((dept, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-600 truncate">{dept.department}</span>
                          <span className={`font-semibold ${
                            dept.status === 'high' ? 'text-red-600' :
                            dept.status === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {dept.active_tasks} tasks
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Metrics - Square KPI Cards */}
          {dashboardData?.business_metrics && (
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <h2 className="text-sm font-bold mb-3 text-gray-700">Today&apos;s Metrics</h2>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="text-xs text-emerald-600 font-medium">URJAA Revenue</div>
                  <div className="text-xl font-bold text-emerald-700">
                    ₹{(dashboardData.business_metrics.urjaa?.revenue_today || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-g4g-blue/5 border border-g4g-blue/10">
                  <div className="text-xs text-g4g-blue font-medium">Go4Garage Bookings</div>
                  <div className="text-xl font-bold text-g4g-blue">
                    {dashboardData.business_metrics.go4garage?.bookings_today || 0}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="text-xs text-purple-600 font-medium">IGNITION Users</div>
                  <div className="text-xl font-bold text-purple-700">
                    {dashboardData.business_metrics.ignition?.active_users || 0}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All 20 Departments Grid - Compact */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2 text-gray-700">
              <Building2 className="w-4 h-4 text-g4g-blue" />
              All Departments ({getAllDepartments().length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {getAllDepartments().map(dept => (
                <div key={dept.id} className="border border-gray-100 rounded-lg p-2 hover:border-g4g-blue hover:shadow-sm transition bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-md bg-g4g-blue/10 flex items-center justify-center flex-shrink-0">
                      <DeptIcon iconKey={dept.icon} className="w-3.5 h-3.5 text-g4g-blue" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-xs text-g4g-blue truncate">{dept.id}</h3>
                      <p className="text-[10px] text-gray-500 truncate">{dept.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">{dept.tasks} tasks</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${dept.status === 'operational' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column - GANESHA Chat */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-g4g-blue flex items-center justify-center">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-g4g-blue">GANESHA</h2>
                <p className="text-sm text-gray-600">Your Executive Assistant</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] sm:max-w-2xl rounded-lg p-3 sm:p-4 ${
                  msg.type === 'user' ? 'bg-g4g-blue text-white' :
                  msg.type === 'ganesha' ? 'bg-gray-100 text-gray-900' :
                  msg.type === 'result' ? 'bg-green-50 border border-green-200 text-gray-900' :
                  msg.type === 'error' ? 'bg-red-50 border border-red-200 text-red-900' :
                  'bg-blue-50 border border-blue-200 text-gray-900'
                }`}>
                  {msg.type === 'result' ? (
                    <pre className="text-xs sm:text-sm whitespace-pre-wrap font-mono overflow-x-auto">{msg.content}</pre>
                  ) : (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <div className={`text-[10px] sm:text-xs mt-2 opacity-70`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-3 sm:p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask GANESHA anything..."
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendCommand}
                disabled={isProcessing || !inputCommand.trim()}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-purple-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Press Enter to send</span>
              {activeTasks.length > 0 && (
                <span>{activeTasks.length} tasks in progress</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KailashDashboard;