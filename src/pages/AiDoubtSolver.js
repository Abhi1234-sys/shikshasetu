import React, { useState, useEffect, useContext, useRef } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

function AiDoubtSolver() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { isDarkMode, colors } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const currentQuestion = question; 
    const userMessage = { type: 'user', text: currentQuestion };
    
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8080/api/ai/doubt',
        { question: currentQuestion },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      const aiMessage = { type: 'ai', text: res.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Fetch Error:", err);
      const errorMessage = { 
        type: 'ai', 
        text: 'System connection anomaly detected. Please ensure the backend engine is running.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const dynamicStyles = {
    page: { ...styles.page, backgroundColor: colors.background },
    title: { ...styles.title, color: colors.text },
    subtitle: { ...styles.subtitle, color: colors.subText },
    chatContainer: { 
        ...styles.chatContainer, 
        backgroundColor: colors.card, 
        borderColor: colors.border,
        boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(16, 185, 129, 0.04)'
    },
    aiBubble: { 
        ...styles.aiBubble, 
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', 
        color: colors.text,
        borderColor: colors.border
    },
    suggestionBtn: { 
        ...styles.suggestionBtn, 
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#ffffff', 
        borderColor: colors.border, 
        color: colors.text 
    },
    inputContainer: { 
        ...styles.inputContainer, 
        backgroundColor: colors.card, 
        borderTopColor: colors.border 
    },
    input: { 
        ...styles.input, 
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : '#f8fafc', 
        color: colors.text, 
        borderColor: colors.border 
    }
  };

  return (
    <div style={dynamicStyles.page}>
      <Navbar />
      <div style={styles.container}>

        {/*   */}
        <div style={styles.header}>
          <h1 style={dynamicStyles.title}>🤖 AI Doubt Solver</h1>
          <p style={dynamicStyles.subtitle}>Get instant explanations for your coding queries natively.</p>
        </div>

        <div style={dynamicStyles.chatContainer}>
          <div style={styles.messagesBox}>
            {messages.length === 0 && (
              <div style={styles.emptyChat}>
                <div style={styles.botIconWrapper}>
                    <span style={{fontSize: '40px'}}>⚡</span>
                </div>
                <h3 style={{...styles.emptyChatTitle, color: colors.text}}>Let's debug your code</h3>
                <p style={{...styles.subtitle, color: colors.subText, fontSize: '14px'}}>Select a common architectural theme or type a dynamic runtime inquiry below.</p>
                
                {/*  */}
                <div style={styles.suggestionsGrid}>
                  {[
                    { title: 'What is OOP in Java?', tag: 'Core Concepts' },
                    { title: 'Explain Spring Boot Annotations', tag: 'Architecture' },
                    { title: 'React UseContext vs Props', tag: 'State Management' },
                    { title: 'PostgreSQL Join types', tag: 'Database Optimization' }
                  ].map((suggest) => (
                    <button
                      key={suggest.title}
                      style={dynamicStyles.suggestionBtn}
                      onClick={() => setQuestion(suggest.title)}>
                      <div style={{fontWeight: '700', fontSize: '14px', marginBottom: '4px'}}>{suggest.title}</div>
                      <div style={{fontSize: '11px', color: colors.accent, fontWeight: '800', textTransform: 'uppercase'}}>{suggest.tag}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                style={msg.type === 'user' ? styles.userMessage : styles.aiMessage}>
                <div style={msg.type === 'user' ? { ...styles.userBubble, backgroundColor: colors.accent } : dynamicStyles.aiBubble}>
                  {msg.type === 'ai' && (
                    <span style={styles.aiIcon}>🤖</span>
                  )}
                  <p style={styles.messageText}>{msg.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={styles.aiMessage}>
                <div style={dynamicStyles.aiBubble}>
                  <div style={styles.pulseDot}>🤖</div>
                  <p style={{...styles.typingText, color: colors.subText}}>Compiling core solution context...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/*  */}
          <div style={dynamicStyles.inputContainer}>
            <textarea
              placeholder="Ask your query here... (Press Enter to dispatch)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              style={dynamicStyles.input}
              rows={1}
            />
            <button
              style={{
                ...styles.sendBtn,
                backgroundColor: colors.accent,
                opacity: loading || !question.trim() ? 0.6 : 1
              }}
              onClick={handleAsk}
              disabled={loading || !question.trim()}>
              {loading ? '...' : '🍬'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px', transition: 'background-color 0.3s ease' },
  container: { maxWidth: '850px', margin: '0 auto', padding: '0 20px' },
  header: { marginBottom: '35px', textAlign: 'center' },
  title: { fontSize: '36px', fontWeight: '900', letterSpacing: '-1.5px', margin: '0 0 6px 0' },
  subtitle: { fontSize: '15px', margin: 0, fontWeight: '500' },
  
  chatContainer: {
    borderRadius: '28px',
    overflow: 'hidden',
    border: '1px solid',
    transition: '0.3s ease-in-out'
  },
  messagesBox: {
    minHeight: '440px', maxHeight: '540px',
    overflowY: 'auto', padding: '30px',
    display: 'flex', flexDirection: 'column'
  },
  
  // Empty State Modifications
  emptyChat: { textAlign: 'center', padding: '40px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  botIconWrapper: { width: '70px', height: '70px', borderRadius: '22px', backgroundColor: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  emptyChatTitle: { fontSize: '24px', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-0.5px' },
  
  suggestionsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px', marginTop: '30px', width: '100%', maxWidth: '600px'
  },
  suggestionBtn: {
    padding: '16px', border: '1px solid', borderRadius: '16px',
    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
  },
  
  userMessage: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
  aiMessage: { display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' },
  userBubble: {
    color: 'white', padding: '14px 20px', borderRadius: '22px 22px 4px 22px',
    maxWidth: '75%', fontWeight: '500', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
  },
  aiBubble: {
    padding: '14px 20px', borderRadius: '22px 22px 22px 4px', border: '1px solid',
    maxWidth: '80%', display: 'flex', gap: '14px', alignItems: 'flex-start'
  },
  aiIcon: { fontSize: '22px', flexShrink: 0 },
  messageText: { fontSize: '15px', lineHeight: '1.6', margin: 0 },
  typingText: { fontSize: '15px', margin: 0, fontStyle: 'italic' },
  pulseDot: { fontSize: '22px', animation: 'pulse 1.5s infinite' },

  inputContainer: {
    display: 'flex', gap: '12px', padding: '20px 25px',
    borderTop: '1px solid', alignItems: 'center'
  },
  input: {
    flex: 1, padding: '14px 20px', borderRadius: '100px',
    border: '1px solid', fontSize: '15px', outline: 'none',
    resize: 'none', lineHeight: '24px', fontFamily: 'inherit'
  },
  sendBtn: {
    width: '48px', height: '48px', border: 'none', borderRadius: '50%',
    color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: '0.2s'
  }
};

export default AiDoubtSolver;