import React, { useState } from 'react';
import './Login.css';
import { supabase } from './supabaseClient';

export default function Login({ onIrParaCadastro }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-logo-block">
          <span className="auth-logo-bee">🐝</span>
          <div className="auth-logo-text">KYA</div>
          <div className="auth-tagline">Knowledge for You, Always</div>
        </div>
        <ul className="auth-features">
          <li>
            <span className="auth-feature-icon">🛒</span>
            Compras inteligentes com IA assistente
          </li>
          <li>
            <span className="auth-feature-icon">🥦</span>
            Perfil nutricional personalizado
          </li>
          <li>
            <span className="auth-feature-icon">🚀</span>
            Entrega rápida em mercados próximos
          </li>
          <li>
            <span className="auth-feature-icon">📊</span>
            Histórico e sugestões de refeições
          </li>
        </ul>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <h1 className="auth-form-title">Bem-vindo de volta</h1>
          <p className="auth-form-sub">Entre na sua conta para continuar suas compras inteligentes.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="auth-divider">ou</div>

          <button className="auth-btn-secondary" onClick={onIrParaCadastro}>
            Criar conta gratuita
          </button>
        </div>
      </div>
    </div>
  );
}
