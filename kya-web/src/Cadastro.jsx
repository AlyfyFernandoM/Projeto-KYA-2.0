import React, { useState } from 'react';
import './Login.css'; // Podemos reutilizar o mesmo estilo do Login

export default function Cadastro({ onCadastroSucesso }) {
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', cpf: '' });

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:3000/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Cadastro realizado com sucesso!');
      onCadastroSucesso(); // Volta para a tela de Login
    } else {
      alert(data?.message || 'Erro no cadastro. Tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Criar Conta KYA</h2>
        <input placeholder="Nome Completo" onChange={(e) => setFormData({...formData, nome: e.target.value})} />
        <input placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input placeholder="Telefone" onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
        <input placeholder="CPF" onChange={(e) => setFormData({...formData, cpf: e.target.value})} />
        <button onClick={handleSubmit}>Finalizar Cadastro</button>
      </div>
    </div>
  );
}