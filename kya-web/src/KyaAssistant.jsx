import React, { useState, useRef, useEffect } from 'react';
import './KyaAssistant.css';
import { FiMic, FiX, FiSend } from 'react-icons/fi';

const INITIAL_MESSAGE = {
  role: 'kya',
  text: 'Olá! Sou a KYA. Posso ajudá-lo a procurar produtos, sugerir refeições com base no seu perfil nutricional ou responder a perguntas sobre os mercados. Como posso ajudar?',
};

function generateReply(text) {
  const t = text.toLowerCase();
  if (t.includes('mercado') || t.includes('loja') || t.includes('supermercado')) {
    return 'Temos vários mercados parceiros próximos de si! Pode vê-los no separador "Início". Posso ajudá-lo a filtrar por categoria ou distância.';
  }
  if (t.includes('produto') || t.includes('comprar') || t.includes('preço') || t.includes('preco')) {
    return 'Para pesquisar produtos específicos, utilize a barra de pesquisa no topo da página. Posso também sugerir produtos com base no seu perfil nutricional!';
  }
  if (t.includes('receita') || t.includes('refeição') || t.includes('comer') || t.includes('nutrição') || t.includes('nutricao')) {
    return 'Com base no seu perfil nutricional, posso sugerir refeições equilibradas. Visite o separador "Nutricional" para configurar as suas preferências alimentares.';
  }
  if (t.includes('compra') || t.includes('pedido') || t.includes('histor')) {
    return 'Pode consultar todas as suas compras anteriores no separador "Últimas Compras". Aí encontra os detalhes de cada pedido.';
  }
  if (t.includes('obrigado') || t.includes('obrigada') || t.includes('valeu')) {
    return 'De nada! Estou sempre aqui para ajudar com as suas compras e nutrição. Há mais alguma coisa em que possa ajudar?';
  }
  if (t.includes('olá') || t.includes('ola') || t.includes('oi') || t.includes('bom dia') || t.includes('boa tarde')) {
    return 'Olá! Fico contente em falar consigo. Como posso ajudá-lo hoje?';
  }
  return 'Entendido! Ainda estou a aprender, mas posso ajudá-lo a encontrar mercados, produtos ou sugestões de refeições. O que precisa?';
}

export default function KyaAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputText('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 700 + Math.random() * 400));

    setMessages(prev => [...prev, { role: 'kya', text: generateReply(text) }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="kya-overlay" onClick={onClose}>
      <div className="kya-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FiX size={22} />
        </button>

        <div className="kya-header">
          <div className="kya-avatar">
            <span className="kya-avatar-bee">🐝</span>
          </div>
          <h2>Assistente KYA</h2>
          <p>Inteligência para as suas compras</p>
        </div>

        <div className="kya-chat-area">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role === 'kya' ? 'kya-message' : 'user-message'}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="message kya-message typing-indicator">
              <span /><span /><span />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="kya-input-area">
          <button className="voice-btn pulse-animation" title="Voz (em breve)">
            <FiMic size={18} />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Escreva a sua mensagem..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button className="send-btn" onClick={sendMessage} disabled={!inputText.trim() || isLoading}>
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
