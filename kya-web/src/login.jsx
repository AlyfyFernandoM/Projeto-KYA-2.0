import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, onIrParaCadastro }) {
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const dados = await res.json();
    if (dados.autenticado) {
      onLogin(dados.utilizador); // Passa os dados do utilizador para a Home
    } else {
      alert('Email não encontrado!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>KYA</h1>
        <p>Olá! Digite o seu email para entrar:</p>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleLogin}>Entrar</button>
        <button type="button" className="secondary-btn" onClick={onIrParaCadastro}>
          Criar conta
        </button>
      </div>
    </div>
  );
}