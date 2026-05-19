import React, { useState, useEffect } from 'react';
import './Home.css';
import { FiSearch, FiUser, FiSettings, FiShoppingBag, FiMic, FiHeart, FiX } from 'react-icons/fi';
import KyaAssistant from './KyaAssistant';

export default function Home() {
  const [isKyaOpen, setIsKyaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio'); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [mercadosDaApi, setMercadosDaApi] = useState([]);
  const [historicoCompras, setHistoricoCompras] = useState([]);

  // Busca Mercados
  useEffect(() => {
    fetch('http://localhost:3000/api/mercados')
      .then(resposta => resposta.json())
      .then(dados => setMercadosDaApi(dados))
      .catch(erro => console.error("Erro ao buscar mercados:", erro));
  }, []);

  // Busca Compras
  useEffect(() => {
    fetch('http://localhost:3000/api/compras/1')
      .then(res => res.json())
      .then(dados => setHistoricoCompras(dados))
      .catch(err => console.error("Erro ao buscar compras:", err));
  }, []);

  const filteredMarkets = mercadosDaApi.filter(market => 
    market.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (market.tags && market.tags.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="app-container">
      {/* BARRA LATERAL */}
      <aside className="sidebar">
        <div className="logo-container">
          <h1 className="logo-text">KYA</h1>
        </div>
        <nav className="nav-menu">
          <button className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => setActiveTab('inicio')}>
            <FiSearch size={20} /> <span>Início</span>
          </button>
          <button className={`nav-item ${activeTab === 'compras' ? 'active' : ''}`} onClick={() => setActiveTab('compras')}>
            <FiShoppingBag size={20} /> <span>Últimas Compras</span>
          </button>
          <button className={`nav-item ${activeTab === 'nutricional' ? 'active' : ''}`} onClick={() => setActiveTab('nutricional')}>
            <FiHeart size={20} /> <span>Nutricional</span>
          </button>
        </nav>
        <div className="kya-ai-container">
          <button className="kya-button" onClick={() => setIsKyaOpen(true)}><FiMic size={28} /></button>
          <span className="kya-label">Falar com KYA</span>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">
        <header className="top-header">
          <div className="profile-section">
            <button className="icon-btn profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}><FiUser size={24} /></button>
            <span className="welcome-text">Olá, Cliente!</span>
          </div>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Pesquisar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className="icon-btn" onClick={() => setIsSettingsOpen(true)}><FiSettings size={24} /></button>
        </header>

        <div className="scrollable-content">
          {isProfileOpen && (
            <div className="profile-panel">
              <h3>O Meu Perfil</h3>
              <p>Nome: Cliente KYA | Morada: Rua Cândida Matos nº 52</p>
            </div>
          )}

          {activeTab === 'inicio' && (
            <section className="markets-section">
              <h2 className="section-title">Mercados Próximos de Si</h2>
              <div className="markets-grid">
                {filteredMarkets.length > 0 ? filteredMarkets.map(market => (
                  <div className="market-card" key={market.id}>
                    <h4>{market.nome}</h4>
                    <p>{market.distancia}</p>
                  </div>
                )) : <p>Nenhum mercado encontrado.</p>}
              </div>
            </section>
          )}

          {activeTab === 'compras' && (
            <section className="compras-section">
              <h2 className="section-title">As Suas Últimas Compras</h2>
              {historicoCompras.length > 0 ? historicoCompras.map((compra, index) => (
                <div key={index} className="compra-card">
                  <h4>Pedido {compra.id} - Entregue</h4>
                  <p><strong>Local:</strong> {compra.nome_mercado}</p>
                  <p><strong>Produtos:</strong> {compra.produtos}</p>
                  <p><strong>Tempo:</strong> {compra.tempo_entrega}</p>
                </div>
              )) : <p>Nenhuma compra encontrada.</p>}
            </section>
          )}

          {activeTab === 'nutricional' && (
            <section className="nutricional-section">
              <h2 className="section-title">Perfil Nutricional</h2>
              <p>Dados de macronutrientes do seu histórico.</p>
            </section>
          )}
        </div>
      </main>

      {isSettingsOpen && (
        <div className="modal-overlay">
           <div className="settings-modal">
             <h2>Configurações</h2>
             <button onClick={() => setIsSettingsOpen(false)}>Fechar</button>
           </div>
        </div>
      )}
      <KyaAssistant isOpen={isKyaOpen} onClose={() => setIsKyaOpen(false)} />
    </div>
  );
}