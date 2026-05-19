import React, { useState } from 'react';
import './KyaAssistant.css';
import { FiMic, FiX, FiSend } from 'react-icons/fi';

export default function KyaAssistant({ isOpen, onClose }) {
  const [inputText, setInputText] = useState('');

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="kya-overlay">
      <div className="kya-modal">
        <button className="close-btn" onClick={onClose}>
          <FiX size={24} />
        </button>
        
        <div className="kya-header">
          <div className="kya-avatar">
            <FiMic size={32} color="#FFF" />
          </div>
          <h2>Assistente KYA</h2>
          <p>Como posso ajudar com as suas compras hoje?</p>
        </div>

        <div className="kya-chat-area">
          <div className="message kya-message">
            Olá! Sou a KYA. Pode pedir-me para procurar produtos, sugerir refeições com base no seu perfil nutricional ou verificar o seu carrinho. Estou a ouvir!
          </div>
          {/* As mensagens do utilizador e as respostas da IA entrarão aqui no futuro */}
        </div>

        <div className="kya-input-area">
          <button className="voice-btn pulse-animation">
            <FiMic size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Diga 'KYA' ou escreva aqui..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="send-btn">
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}