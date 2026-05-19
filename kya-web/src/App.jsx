import React, { useState } from 'react';
import Home from './Home.jsx';
import Login from './login.jsx';
import Cadastro from './Cadastro.jsx';

function App() {
  const [tela, setTela] = useState('login'); // 'login', 'cadastro' ou 'home'
  const [utilizador, setUtilizador] = useState(null);

  if (tela === 'cadastro') return <Cadastro onCadastroSucesso={() => setTela('login')} />;
  if (tela === 'login') return <Login onLogin={(u) => { setUtilizador(u); setTela('home'); }} onIrParaCadastro={() => setTela('cadastro')} />;
  
  return <Home utilizador={utilizador} />;
}

export default App;