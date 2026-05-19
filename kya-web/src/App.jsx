import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Home from './Home.jsx';
import Login from './login.jsx';
import Cadastro from './Cadastro.jsx';

function App() {
  const [session, setSession] = useState(undefined);
  const [tela, setTela] = useState('login');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) setTela('home');
      else setTela('login');
    });
  }, []);

  if (session === undefined) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #006400', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (session) return <Home session={session} />;

  if (tela === 'cadastro') return <Cadastro onCadastroSucesso={() => setTela('login')} onIrParaLogin={() => setTela('login')} />;
  return <Login onIrParaCadastro={() => setTela('cadastro')} />;
}

export default App;
