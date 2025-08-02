import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from '../../services/geminiApi';
import { useAuth } from '../auth/AuthProvider';


const ChatInterface = ({ projectParams }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentEditParam, setCurrentEditParam] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [params, setParams] = useState(projectParams);
  const [isParamsCollapsed, setIsParamsCollapsed] = useState(true);
  const { user } = useAuth();
  
  const chatMessagesRef = useRef(null);
  const paramsPanelRef = useRef(null);

  const dropdownOptions = {
    constructionType: ['Steel Frame', 'Concrete Frame', 'Wood Frame', 'Hybrid'],
    stories: ['1', '2', '3', '4', '5+'],
    houseType: ['Residential', 'Commercial', 'Industrial', 'Warehouse'],
    foundationType: ['Slab-on-Grade', 'T-Shaped', 'Basement', 'Crawl Space', 'Pile Foundation'],
    roofType: ['Gable', 'Hip', 'Shed', 'Gambrel', 'Flat', 'Truss System']
  };

  const geminiService = new GeminiService(import.meta.env.VITE_REACT_APP_GEMINI_API_KEY);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  // Send firstQuery automatically on mount if chatHistory is empty
  useEffect(() => {
    if (projectParams.firstQuery && chatHistory.length === 0) {
      // Prevent duplicate sending by checking a flag
      if (!window.hasSentFirstQuery) {
        addMessage('user', projectParams.firstQuery);
        generateResponse(projectParams.firstQuery);
        window.hasSentFirstQuery = true;
      }
    }
  }, [projectParams, chatHistory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paramsPanelRef.current && !paramsPanelRef.current.contains(event.target)) {
        setIsParamsCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addMessage = (sender, content) => {
    setChatHistory((prev) => [...prev, { sender, content, timestamp: new Date() }]);
  };

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (isTyping) return;
    const input = e.target.elements['chat-input'];
    const message = input.value.trim();
    if (!message) return;
    addMessage('user', message);
    input.value = '';
    await generateResponse(message);
  };

  const generateResponse = async (userMessage) => {
    setIsTyping(true);

    try {
      const response = await geminiService.generateResponse(userMessage, '', params);
      addMessage('assistant', response);
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage('assistant', 'Sorry, there was an error generating the response.');
    } finally {
      setIsTyping(false);
    }
  };

  const openEditModal = (paramName) => {
    setCurrentEditParam(paramName);
    setEditValue(params[paramName] || '');
  };

  const closeEditModal = () => {
    setCurrentEditParam(null);
    setEditValue('');
  };

  const saveParameterEdit = () => {
    if (!editValue) return;
    setParams((prev) => ({
      ...prev,
      [currentEditParam]: editValue
    }));
    addMessage('assistant', `I've updated your ${getParamDisplayName(currentEditParam)} to: ${editValue}. This change will be considered in all future responses.`);
    closeEditModal();
  };

  const getParamDisplayName = (paramName) => {
    const displayNames = {
      plotSize: 'Plot Size',
      constructionType: 'Construction Type',
      stories: 'Number of Stories',
      houseType: 'Building Type',
      foundationType: 'Foundation Type',
      roofType: 'Roof Type',
      specialRequirements: 'Special Requirements'
    };
    return displayNames[paramName] || paramName;
  };

  const toggleParamsCollapse = () => {
    setIsParamsCollapsed(!isParamsCollapsed);
  };

  return (
    <div className="chat-interface">
      <div className="parameters-panel" ref={paramsPanelRef}>
        <div className="parameters-header" onClick={toggleParamsCollapse}>
          <h3>Project Parameters</h3>
          <div className="header-controls">
            <button className="btn btn--sm edit-param-btn" onClick={(e) => { e.stopPropagation(); toggleParamsCollapse(); }}>Edit</button>
            <svg
              className={`collapse-icon ${isParamsCollapsed ? 'collapsed' : 'expanded'}`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={(e) => { e.stopPropagation(); toggleParamsCollapse(); }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        {!isParamsCollapsed && (
          <div className="parameters-grid">
            {['plotSize', 'constructionType', 'stories', 'houseType', 'foundationType', 'roofType'].map((param) => (
              <div key={param} className="parameter-item">
                <div className='param-row'>
                  <span className="parameter-label">{getParamDisplayName(param)}:</span>
                  <button className="btn btn--sm edit-param-btn" title='Edit' onClick={() => openEditModal(param)} >✎</button>
                </div>
                <span className="parameter-value">{param === 'plotSize' ? `${params[param]} sq ft` : params[param]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-container">
        <div id="chat-messages" className="chat-messages" ref={chatMessagesRef}>
          {chatHistory.map(({ sender, content, timestamp }, index) => (
            <div key={index} className={`message ${sender}`}>
              {/* <div className="message-avatar">{sender === 'user' ? (user && user.photoURL ? <img src={user.photoURL} alt="U" /> : 'U') : 'AI'}</div> */}
              <div>
              {sender === 'assistant' ? (
                <div className="message-content assistant-card" dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <div className="message-content">{content}</div>
              )}
              {/* <div className="message-time">
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div> */}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message assistant" id="typing-indicator">
              <div className="message-avatar">AI</div>
              <div className="typing-indicator">
                <span>AI is thinking</span>
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <form id="chat-form" className="chat-form" onSubmit={handleChatSubmit}>
            <div className="input-wrapper">
              <textarea
                id="chat-input"
                className="chat-input"
                name="chat-input"
                placeholder="Ask about your steel construction project..."
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
                }}
              />
              <button type="submit" className="send-button" id="send-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Parameter Edit Modal */}
      {currentEditParam && (
        <div className="modal" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="modal-title">Edit {getParamDisplayName(currentEditParam)}</h3>
              <button className="modal-close" id="modal-close" onClick={closeEditModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="modal-input" className="form-label">{getParamDisplayName(currentEditParam)}</label>
                {(currentEditParam === 'plotSize') && (
                  <input
                    type="number"
                    id="modal-input"
                    className="form-control"
                    min="100"
                    step="100"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                )}
                {(currentEditParam === 'specialRequirements') && (
                  <textarea
                    id="modal-textarea"
                    className="form-control"
                    rows={3}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                )}
                {dropdownOptions[currentEditParam] && (
                  <select
                    id="modal-select"
                    className="form-control"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  >
                    <option value="">Select...</option>
                    {dropdownOptions[currentEditParam].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" id="modal-cancel" onClick={closeEditModal}>Cancel</button>
              <button className="btn btn--primary" id="modal-save" onClick={saveParameterEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
