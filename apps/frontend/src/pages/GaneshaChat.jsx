import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, MicOff, Paperclip, Brain, Zap, Globe,
  FileText, X, ChevronDown, Loader, ArrowLeft,
  CheckCircle, AlertCircle, Database, Cpu, LogOut, User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './GaneshaChat.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AVAILABLE_MODELS = [
  { id: 'auto', name: 'Auto (Recommended)', icon: <Brain size={18} />, description: 'Automatically selects best model' },
  { id: 'claude', name: 'Claude', icon: <Brain size={18} />, description: 'Best for reasoning & analysis' },
  { id: 'gemini', name: 'Gemini', icon: <Zap size={18} />, description: 'Structured data & multimodal' },
  { id: 'gpt4', name: 'GPT-4', icon: <Cpu size={18} />, description: 'Code & creative tasks' },
];

const QUICK_PROMPTS = [
  "What's our financial status?",
  "URGAA charger health report",
  "Team workload balance",
  "Revenue across all products"
];

const GaneshaChat = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use webm format for better browser compatibility
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4') 
          ? 'audio/mp4' 
          : 'audio/ogg';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please allow microphone access and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Determine file extension from mime type
      const mimeType = audioBlob.type;
      const extension = mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'mp4' : 'ogg';
      formData.append('file', audioBlob, `voice_recording.${extension}`);

      const response = await fetch(`${API_URL}/api/ganesha/voice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseText = await response.text();
      if (!response.ok) {
        let errorData = {};
        try { errorData = JSON.parse(responseText); } catch {}
        throw new Error(errorData.detail || 'Transcription failed');
      }

      const data = JSON.parse(responseText);
      
      if (data.status === 'success' && data.transcription) {
        // Set transcription to input field
        setInput(prevInput => {
          const newInput = prevInput ? `${prevInput} ${data.transcription}` : data.transcription;
          return newInput;
        });
      } else {
        // Show message if transcription failed
        console.warn('Transcription not available:', data.message || data.note);
        alert(data.message || 'Voice transcription is not available. Please type your message.');
      }
      
    } catch (error) {
      console.error('Transcription error:', error);
      alert(`Voice transcription failed: ${error.message}`);
    } finally {
      setIsTranscribing(false);
      setRecordingTime(0);
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage = {
      role: 'user',
      content: input,
      attachments: attachments.map(f => f.name),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Handle file uploads first if any (OCR)
      let fullQuery = currentInput;
      for (const file of attachments) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const ocrRes = await fetch(`${API_URL}/api/ganesha/ocr`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });
          if (ocrRes.ok) {
            const ocrData = await ocrRes.json();
            fullQuery += `\n\n[Document: ${file.name}]\n${ocrData.extracted_text}`;
          }
        } catch (e) {
          console.error('OCR error:', e);
        }
      }

      // Main GANESHA query
      const response = await fetch(`${API_URL}/api/ganesha/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: fullQuery,
          model: selectedModel,
          include_level2: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        routed_to: data.routed_to,
        scope: data.scope,
        source_product: data.source_product,
        models_used: data.models_used,
        data_sources: data.data_sources,
        problems_addressed: data.problems_addressed,
        automation_percentage: data.automation_percentage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    }

    setIsLoading(false);
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ganesha-chat">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <Link to="/dashboard/executive" className="back-btn">
            <ArrowLeft size={18} />
          </Link>
          <div className="header-icon">
            <Brain size={28} />
          </div>
          <div className="header-info">
            <h1>GANESHA</h1>
            <p>AI Orchestrator — Ask anything about Go4Garage</p>
          </div>
        </div>

        {/* Model Selector */}
        <div className="model-selector-wrapper">
          <button 
            className="model-selector-btn"
            onClick={() => setShowModelSelector(!showModelSelector)}
          >
            <span>Model: {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}</span>
            <ChevronDown size={16} />
          </button>
          
          {showModelSelector && (
            <div className="model-dropdown">
              {AVAILABLE_MODELS.map(model => (
                <button
                  key={model.id}
                  className={`model-option ${selectedModel === model.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setShowModelSelector(false);
                  }}
                >
                  <span className="model-icon">{model.icon}</span>
                  <div className="model-info">
                    <span className="model-name">{model.name}</span>
                    <span className="model-desc">{model.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-menu-wrapper">
          <button 
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <ChevronDown size={14} />
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info-section">
                <p className="user-name">{user?.full_name || 'User'}</p>
                <p className="user-code">{user?.aegis_code || 'AEGIS'}</p>
              </div>
              <div className="user-menu-actions">
                <button onClick={() => { navigate('/dashboard/executive'); setShowUserMenu(false); }} className="menu-item">
                  <Globe size={16} />
                  <span>Dashboard</span>
                </button>
                <button onClick={handleLogout} className="menu-item logout">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Brain size={48} />
            </div>
            <h2>Welcome to GANESHA</h2>
            <p>I can answer questions about any Go4Garage operations</p>
            
            {/* Quick Actions */}
            <div className="quick-actions">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  className="quick-action-btn"
                  onClick={() => setInput(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
              {/* Message Content */}
              <div className="message-content">
                {msg.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              
              {/* Attachments for user messages */}
              {msg.role === 'user' && msg.attachments?.length > 0 && (
                <div className="message-attachments">
                  {msg.attachments.map((name, i) => (
                    <span key={i} className="attachment-tag">
                      <FileText size={12} /> {name}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Metadata for assistant messages */}
              {msg.role === 'assistant' && !msg.isError && (
                <div className="message-meta">
                  {/* Routing Info */}
                  <div className="meta-tags">
                    <span className={`meta-tag scope-${msg.scope}`}>
                      {msg.scope?.toUpperCase()}
                    </span>
                    <span className="meta-tag neutral">
                      Routed to: {msg.routed_to}
                    </span>
                    {msg.source_product && (
                      <span className="meta-tag product">
                        Product: {msg.source_product}
                      </span>
                    )}
                  </div>
                  
                  {/* Models Used */}
                  <div className="meta-row">
                    <span className="meta-label">Models:</span>
                    {msg.models_used?.map((m, i) => (
                      <span key={i} className="model-tag">{m}</span>
                    ))}
                  </div>
                  
                  {/* Data Sources */}
                  {msg.data_sources?.length > 0 && (
                    <div className="meta-row">
                      <Database size={12} />
                      <span className="meta-label">Sources:</span>
                      <span className="meta-value">{msg.data_sources.join(', ')}</span>
                    </div>
                  )}
                  
                  {/* Automation Rate */}
                  {msg.automation_percentage && (
                    <div className="meta-row automation">
                      <Zap size={12} />
                      <span>{msg.automation_percentage}% of related issues resolved automatically</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-bubble loading">
              <Loader className="spin" size={20} />
              <span>GANESHA is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map((file, idx) => (
            <div key={idx} className="attachment-item">
              <FileText size={16} />
              <span>{file.name}</span>
              <button onClick={() => removeAttachment(idx)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="input-container">
          {/* Attach Button */}
          <button 
            className="input-action-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach PDF or Image (OCR enabled)"
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileAttach}
            className="hidden-input"
          />

          {/* Voice Button with Recording State */}
          <button 
            className={`input-action-btn ${isRecording ? 'recording' : ''} ${isTranscribing ? 'transcribing' : ''}`}
            onClick={handleVoiceButtonClick}
            disabled={isTranscribing}
            title={isRecording ? `Recording... ${formatRecordingTime(recordingTime)} - Click to stop` : isTranscribing ? 'Transcribing...' : 'Voice input (Whisper)'}
          >
            {isTranscribing ? (
              <Loader size={20} className="spin" />
            ) : isRecording ? (
              <MicOff size={20} />
            ) : (
              <Mic size={20} />
            )}
          </button>
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="recording-indicator">
              <span className="recording-dot"></span>
              <span className="recording-time">{formatRecordingTime(recordingTime)}</span>
            </div>
          )}

          {/* Text Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask GANESHA anything about Go4Garage..."
            className="chat-input"
            rows={1}
          />

          {/* Send Button */}
          <button 
            className={`send-btn ${(input.trim() || attachments.length > 0) ? 'active' : ''}`}
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GaneshaChat;
