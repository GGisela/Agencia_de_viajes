import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, FileText, ChevronRight } from 'lucide-react';

export default function ChatbotWidget({ onSelectDestination }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! Soy tu asistente virtual de viajes con Inteligencia Artificial. ¿En qué destino estás pensando o cómo puedo ayudarte hoy?',
      time: 'Ahora'
    }
  ]);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    '¿Qué paquetes hay para Bariloche?',
    '¿Cómo funciona el proceso de cotización?',
    'Ver Términos y Condiciones (PDF)',
    '¿Qué excursiones incluye Cancún?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userText) setInput('');

    // Generate intelligent AI response based on query
    setTimeout(() => {
      let botResponse = '';
      const q = textToSend.toLowerCase();

      if (q.includes('bariloche')) {
        botResponse = 'Para Bariloche contamos con el paquete "Bariloche Aventura & Chocolates (7 Días)" desde $550 USD por persona, incluyendo navegación a Isla Victoria y Circuito Chico. Puedes agregarlo al cotizador con un clic.';
      } else if (q.includes('cancún') || q.includes('cancun')) {
        botResponse = 'En Cancún tenemos el paquete "Caribe Maya: Cancún All Inclusive (8 Días)" desde $990 USD por persona, con tour completo a la maravilla de Chichén Itzá y Cenote Sagrado incluido.';
      } else if (q.includes('cotización') || q.includes('cotizacion') || q.includes('funciona')) {
        botResponse = '¡Es muy sencillo! Eliges un paquete o las excursiones que desees, seleccionas la cantidad de viajeros y presionas "Solicitar Cotización". Te llegará un correo de confirmación de inmediato y un asesor te enviará la propuesta detallada con descuentos por grupo.';
      } else if (q.includes('términos') || q.includes('terminos') || q.includes('pdf')) {
        botResponse = '📄 Puedes revisar y descargar nuestra Política de Cancelaciones y Términos y Condiciones Oficiales en formato PDF directamente con nuestro equipo de atención o solicitarlo en tu cotización.';
      } else {
        botResponse = `Gracias por tu consulta sobre "${textToSend}". Tenemos paquetes personalizados y excursiones exclusivas para este itinerario. Te sugerimos armar tu solicitud en el Cotizador Inteligente para que un agente te brinde una tarifa preferencial.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <div className="chatbot-widget-container">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          className="chatbot-fab animate-pulse-glow"
          onClick={() => setIsOpen(true)}
          title="Asistente de Viajes con IA"
        >
          <Sparkles size={16} className="fab-sparkle" />
          <Bot size={26} />
          <span className="fab-label">Chat IA</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window glass-panel animate-fade">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="chat-title">Agente IA de Viajes</h4>
                <span className="chat-status">En línea • Asistencia RAG</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages list */}
          <div className="chat-messages-container">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-message ${m.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                {m.sender === 'bot' && (
                  <div className="message-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className="message-bubble">
                  <p>{m.text}</p>
                  <span className="message-time">{m.time}</span>
                </div>
                {m.sender === 'user' && (
                  <div className="message-avatar avatar-user">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="quick-prompts-bar">
            {quickPrompts.map((p, i) => (
              <button key={i} className="prompt-chip" onClick={() => handleSend(p)}>
                <span>{p}</span>
                <ChevronRight size={12} />
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form 
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input 
              type="text" 
              placeholder="Pregunta sobre itinerarios, precios..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
