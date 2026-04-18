import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, CheckCircle, AlertCircle, Activity, TrendingUp, Compass, User, Settings, Info, AlertTriangle } from 'lucide-react';

export const GaneshaOrchestrator = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState(null);
  const messagesEndRef = useRef(null);
  
  const [status, setStatus] = useState({
    ganesha: 'ready',
    emergent: 'idle',
    overall: 'ready'
  });
  
  useEffect(() => {
    loadWelcomeMessage();
    loadStats();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const loadWelcomeMessage = () => {
    setMessages([{
      id: Date.now(),
      type: 'system',
      content: `**Namaste! I am GANESHA, your AI orchestrator.**

I coordinate with development agents to build features efficiently and save you 80%+ on credits.

**What I do:**
• Design complete architecture before building
• Create optimized prompts for code agents
• Review all code for quality and security
• Fix issues automatically
• Provide strategic guidance

**Try these:**
• "Build Phase 4 real-time notifications"
• "Review current code quality"
• "What should I work on next?"
• "Show project status"

How may I assist you today?`,
      timestamp: new Date()
    }]);
  };
  
  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ganesha/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const addMessage = (type, content, metadata = {}) => {
    const message = {
      id: Date.now() + Math.random(),
      type,
      content,
      metadata,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input;
    setInput('');
    
    addMessage('user', userMessage);
    
    setIsProcessing(true);
    setStatus({ ganesha: 'thinking', emergent: 'idle', overall: 'processing' });
    
    try {
      await processWithGanesha(userMessage);
      loadStats(); // Refresh stats after completion
    } catch (error) {
      addMessage('error', `Error: ${error.message}`);
      setStatus({ ganesha: 'ready', emergent: 'idle', overall: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processWithGanesha = async (userInput) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/ganesha/orchestrate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_message: userInput,
          conversation_history: messages.slice(-10)
        })
      }
    );
    
    // Check status WITHOUT reading body
    if (response.status !== 200) {
      // Don't try to read body - just throw error with status
      throw new Error(`GANESHA returned ${response.status}. Please check authentication and try again.`);
    }
    
    // Verify it's actually a streaming response
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/event-stream')) {
      throw new Error('Invalid response type - expected SSE stream');
    }
    
    // Now safe to stream - body is untouched
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let currentMessage = null;
    let currentMessageContent = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'ganesha_thinking') {
              if (!currentMessage) {
                currentMessage = addMessage('ganesha', data.content, { streaming: true });
                currentMessageContent = data.content;
              } else {
                currentMessageContent += data.content;
                setMessages(prev => prev.map(m =>
                  m.id === currentMessage.id
                    ? { ...m, content: currentMessageContent }
                    : m
                ));
              }
            }
            
            if (data.type === 'sending_to_emergent') {
              currentMessage = null;
              currentMessageContent = '';
              setStatus(prev => ({ ...prev, ganesha: 'waiting', emergent: 'building' }));
              
              addMessage('system', `**Sending to Code Agent:**\n\`\`\`\n${data.prompt.substring(0, 200)}...\n\`\`\``, {
                fullPrompt: data.prompt
              });
            }
            
            if (data.type === 'emergent_response') {
              setStatus(prev => ({ ...prev, emergent: 'complete' }));
              addMessage('emergent', `CHECK **Code Generated:**\n${data.summary}`, {
                code: data.code,
                files: data.files
              });
            }
            
            if (data.type === 'ganesha_review') {
              currentMessage = null;
              setStatus(prev => ({ ...prev, ganesha: 'thinking' }));
              
              const reviewContent = `**Code Review Complete:**\n\n${data.review}`;
              addMessage('ganesha', reviewContent, {
                issues: data.issues,
                suggestions: data.suggestions
              });
            }
            
            if (data.type === 'task_complete') {
              currentMessage = null;
              setStatus({ ganesha: 'ready', emergent: 'idle', overall: 'complete' });
              addMessage('system', `***${data.summary}**`);
            }
            
            if (data.type === 'error') {
              currentMessage = null;
              addMessage('error', data.message);
              setStatus({ ganesha: 'ready', emergent: 'idle', overall: 'error' });
            }
            
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  };
  
  const handleQuickAction = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ganesha/quick-action`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ action })
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setInput(data.message);
      }
    } catch (error) {
      console.error('Quick action failed:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#1E272E] flex">
      {/* Sidebar */}
      <div className="w-80 bg-[#222F3E] border-r border-[#2F3542] p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold mb-2 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#FFC312]" />
            System Status
          </h2>
        </div>
        
        {/* GANESHA Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#8395A7] text-sm">GANESHA (Claude)</span>
            <StatusIndicator status={status.ganesha} />
          </div>
          <p className="text-xs text-[#6B7280]">
            {status.ganesha === 'ready' && 'Awaiting instructions'}
            {status.ganesha === 'thinking' && 'Analyzing & planning...'}
            {status.ganesha === 'waiting' && 'Waiting for code agent...'}
          </p>
        </div>
        
        {/* Code Agent Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#8395A7] text-sm">Code Agent</span>
            <StatusIndicator status={status.emergent} />
          </div>
          <p className="text-xs text-[#6B7280]">
            {status.emergent === 'idle' && 'Ready to build'}
            {status.emergent === 'building' && 'Generating code...'}
            {status.emergent === 'complete' && 'Build complete'}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-2 mb-6">
          <h3 className="text-white text-sm font-bold mb-3">Quick Actions</h3>
          
          <button
            onClick={() => handleQuickAction('status')}
            className="w-full px-3 py-2 bg-[#0A3D62] text-white rounded text-sm hover:bg-[#12547A] transition-colors text-left flex items-center gap-2"
          >
            CHART Project Status
          </button>
          
          <button
            onClick={() => handleQuickAction('review')}
            className="w-full px-3 py-2 bg-[#0A3D62] text-white rounded text-sm hover:bg-[#12547A] transition-colors text-left flex items-center gap-2"
          >
            Code Review
          </button>
          
          <button
            onClick={() => handleQuickAction('next_steps')}
            className="w-full px-3 py-2 bg-[#0A3D62] text-white rounded text-sm hover:bg-[#12547A] transition-colors text-left flex items-center gap-2"
          >
            TARGET Next Steps
          </button>
        </div>
        
        {/* Statistics */}
        {stats && (
          <div className="mt-6 pt-6 border-t border-[#2F3542]">
            <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#12CBC4]" />
              Efficiency Stats
            </h3>
            
            <div className="space-y-3">
              <div className="bg-[#1E272E] rounded p-3">
                <div className="text-[#8395A7] text-xs mb-1">Total Commands</div>
                <div className="text-white text-2xl font-bold">{stats.total_commands}</div>
              </div>
              
              <div className="bg-[#1E272E] rounded p-3">
                <div className="text-[#8395A7] text-xs mb-1">Credits Saved</div>
                <div className="text-[#12CBC4] text-2xl font-bold">{stats.estimated_credits_saved}</div>
              </div>
              
              <div className="bg-[#1E272E] rounded p-3">
                <div className="text-[#8395A7] text-xs mb-2">Efficiency</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#2F3542] rounded-full h-2">
                    <div 
                      className="bg-[#12CBC4] h-2 rounded-full transition-all"
                      style={{ width: `${stats.efficiency_percentage}%` }}
                    />
                  </div>
                  <span className="text-[#12CBC4] text-xs font-bold">
                    {stats.efficiency_percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#222F3E] border-b border-[#2F3542] p-4">
          <h1 className="text-white text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-g4g-blue flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            GANESHA AI Orchestrator
          </h1>
          <p className="text-[#8395A7] text-sm mt-1">
            Your intelligent bridge between planning and execution
          </p>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isProcessing && (
            <div className="flex items-center gap-3 text-[#8395A7]">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="bg-[#222F3E] border-t border-[#2F3542] p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell GANESHA what you want to build..."
              disabled={isProcessing}
              className="flex-1 px-4 py-3 bg-[#1E272E] border border-[#2F3542] rounded-lg text-white placeholder-[#8395A7] focus:outline-none focus:border-[#0A3D62] disabled:opacity-50"
            />
            
            <button
              type="submit"
              disabled={isProcessing || !input.trim()}
              className="px-6 py-3 bg-[#0A3D62] text-white rounded-lg hover:bg-[#12547A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </form>
          
          <p className="text-[#6B7280] text-xs mt-2 text-center">
            GANESHA analyzes → Creates optimal prompts → Coordinates with agents → Reviews output
          </p>
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ status }) => {
  const colors = {
    ready: 'bg-[#12CBC4]',
    thinking: 'bg-[#FFC312]',
    waiting: 'bg-[#8395A7]',
    idle: 'bg-[#6B7280]',
    building: 'bg-[#FFC312]',
    complete: 'bg-[#12CBC4]',
    error: 'bg-[#E74C3C]'
  };
  
  return (
    <div className={`w-3 h-3 rounded-full ${colors[status] || 'bg-[#6B7280]'} ${
      status === 'thinking' || status === 'building' ? 'animate-pulse' : ''
    }`} />
  );
};

const MessageBubble = ({ message }) => {
  const { type, content, metadata, timestamp } = message;
  
  const styles = {
    user: 'bg-[#0A3D62] text-white ml-auto',
    ganesha: 'bg-[#222F3E] text-white border border-[#2F3542]',
    emergent: 'bg-[#2F3542] text-white',
    system: 'bg-[#12CBC4]/10 text-[#12CBC4] border border-[#12CBC4]/30',
    error: 'bg-[#E74C3C]/10 text-[#E74C3C] border border-[#E74C3C]/30'
  };
  
  const labels = {
    user: 'You',
    ganesha: 'GANESHA',
    emergent: 'Code Agent',
    system: 'System',
    error: 'Error'
  };

  // Icon components for message avatars
  const IconComponent = ({ messageType }) => {
    const iconClass = "w-5 h-5";
    switch(messageType) {
      case 'user': return <User className={iconClass} />;
      case 'ganesha': return <Compass className={iconClass} />;
      case 'emergent': return <Settings className={iconClass} />;
      case 'system': return <Info className={iconClass} />;
      case 'error': return <AlertTriangle className={iconClass} />;
      default: return <Compass className={iconClass} />;
    }
  };
  
  return (
    <div className={`max-w-3xl p-4 rounded-lg ${styles[type]} ${
      type === 'user' ? 'ml-auto' : ''
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-g4g-blue/20 flex items-center justify-center flex-shrink-0">
          <IconComponent messageType={type} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-sm">
              {labels[type]}
            </span>
            <span className="text-xs opacity-60">
              {timestamp.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="whitespace-pre-wrap break-words">
            {content.split('\n').map((line, i) => (
              <p key={i} className="mb-1">{line}</p>
            ))}
          </div>
          
          {metadata?.issues && metadata.issues.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-bold">Issues Found:</p>
              {metadata.issues.map((issue, i) => (
                <div key={i} className="text-sm bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded p-2">
                  {issue}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GaneshaOrchestrator;
