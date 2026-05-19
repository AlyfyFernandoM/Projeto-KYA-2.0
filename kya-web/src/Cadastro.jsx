import React, { useState } from 'react';
import './Login.css';
import { supabase } from './supabaseClient';

export default function Cadastro({ onCadastroSucesso, onIrParaLogin }) {
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', morada: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        nome: formData.nome,
        morada: formData.morada,
      });
    }

    setSuccess('Conta criada com sucesso! Agora pode entrar.');
    setLoading(false);
    setTimeout(() => onCadastroSucesso(), 1500);
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
            <span className="auth-feature-icon">🎯</span>
            Assistente IA que aprende com você
          </li>
          <li>
            <span className="auth-feature-icon">🏪</span>
            Acesso a mercados parceiros próximos
          </li>
          <li>
            <span className="auth-feature-icon">🥗</span>
            Sugestões de receitas saudáveis
          </li>
          <li>
            <span className="auth-feature-icon">💚</span>
            Foco em alimentação e bem-estar
          </li>
        </ul>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <h1 className="auth-form-title">Criar conta KYA</h1>
          <p className="auth-form-sub">Junte-se a milhares de consumidores inteligentes.</p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Nome Completo</label>
              <input type="text" placeholder="Seu nome" value={formData.nome} onChange={set('nome')} required />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" placeholder="seu@email.com" value={formData.email} onChange={set('email')} required />
            </div>
            <div className="auth-field">
              <label>Senha</label>
              <input type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={set('password')} required minLength={6} />
            </div>
            <div className="auth-field">
              <label>Morada (opcional)</label>
              <input type="text" placeholder="Rua, número, bairro" value={formData.morada} onChange={set('morada')} />
            </div>
            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta Gratuita'}
            </button>
          </form>

          <div className="auth-divider">já tem conta?</div>

          <button className="auth-btn-secondary" onClick={onIrParaLogin}>
            Entrar na minha conta
          </button>
        </div>
      </div>
    </div>
  );
}
