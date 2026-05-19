import React, { useState, useEffect } from 'react';
import './Home.css';
import { supabase } from './supabaseClient';
import {
  FiSearch, FiSettings, FiShoppingBag, FiMic, FiHeart,
  FiHome, FiLogOut, FiMapPin, FiPackage
} from 'react-icons/fi';
import KyaAssistant from './KyaAssistant';
import Products from './Products';
import ShoppingCart from './ShoppingCart';

export default function Home({ session }) {
  const [isKyaOpen, setIsKyaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [mercados, setMercados] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedMarket, setSelectedMarket] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [settingsData, setSettingsData] = useState({ nome: '', morada: '', preferencias_alimentares: '' });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [{ data: mData }, { data: pData }, { data: prData }] = await Promise.all([
        supabase.from('mercados').select('*').order('nome'),
        supabase.from('pedidos').select('*, mercados(nome)').eq('utilizador_id', session.user.id).order('criado_em', { ascending: false }),
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
      ]);
      setMercados(mData || []);
      setPedidos(pData || []);
      setProfile(prData);
      setSettingsData({
        nome: prData?.nome || '',
        morada: prData?.morada || '',
        preferencias_alimentares: prData?.preferencias_alimentares || '',
      });
      setLoading(false);
    }
    loadData();
  }, [session.user.id]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: settingsData.nome,
          morada: settingsData.morada,
          preferencias_alimentares: settingsData.preferencias_alimentares,
        })
        .eq('id', session.user.id);

      if (error) throw error;
      setProfile(settingsData);
      setIsSettingsOpen(false);
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      alert('Erro ao guardar: ' + err.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredMarkets = mercados.filter(m => {
    const q = searchQuery.toLowerCase();
    return (
      m.nome?.toLowerCase().includes(q) ||
      (Array.isArray(m.tags) ? m.tags.some(t => t.toLowerCase().includes(q)) : false)
    );
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const displayName = profile?.nome || session.user.email?.split('@')[0] || 'Cliente';

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantidade: p.quantidade + product.quantidade }
            : p
        );
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prev =>
        prev.map(p => p.id === productId ? { ...p, quantidade: newQty } : p)
      );
    }
  };

  if (selectedMarket) {
    return (
      <Products
        marketId={selectedMarket.id}
        marketName={selectedMarket.nome}
        onBack={() => setSelectedMarket(null)}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-bee">🐝</span>
          <span className="sidebar-logo-text">KYA</span>
        </div>

        <nav className="nav-menu">
          <button className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => setActiveTab('inicio')}>
            <FiHome size={18} /> <span>Início</span>
          </button>
          <button className={`nav-item ${activeTab === 'compras' ? 'active' : ''}`} onClick={() => setActiveTab('compras')}>
            <FiShoppingBag size={18} /> <span>Últimas Compras</span>
          </button>
          <button className={`nav-item ${activeTab === 'nutricional' ? 'active' : ''}`} onClick={() => setActiveTab('nutricional')}>
            <FiHeart size={18} /> <span>Nutricional</span>
          </button>
        </nav>

        <div className="kya-ai-container">
          <button className="kya-button" onClick={() => setIsKyaOpen(true)}>
            <FiMic size={24} />
          </button>
          <span className="kya-label">Falar com KYA</span>
        </div>

        <button className="signout-btn" onClick={handleSignOut}>
          <FiLogOut size={16} /> <span>Sair</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-greeting">
            <span>Bem-vindo,</span>
            <strong>{displayName}</strong>
          </div>

          <div className="search-bar">
            <FiSearch className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Pesquisar mercados..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="icon-btn" onClick={() => setIsCartOpen(true)} title="Carrinho">
              <FiShoppingBag size={18} />
              {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
            </button>
            <button className="icon-btn" onClick={() => setIsSettingsOpen(true)} title="Configurações">
              <FiSettings size={18} />
            </button>
          </div>
        </header>

        <div className="page-body">
          {activeTab === 'inicio' && (
            <>
              <div className="stats-banner">
                <div className="stat-card">
                  <div className="stat-icon green"><FiMapPin size={20} /></div>
                  <div>
                    <div className="stat-value">{mercados.length}</div>
                    <div className="stat-label">Mercados disponíveis</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon amber"><FiShoppingBag size={20} /></div>
                  <div>
                    <div className="stat-value">{pedidos.length}</div>
                    <div className="stat-label">Pedidos realizados</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon teal"><FiHeart size={20} /></div>
                  <div>
                    <div className="stat-value">IA</div>
                    <div className="stat-label">Assistente ativo</div>
                  </div>
                </div>
              </div>

              <section>
                <div className="section-header">
                  <h2 className="section-title">Mercados Próximos</h2>
                  <span className="section-count">{filteredMarkets.length} encontrados</span>
                </div>
                {loading ? (
                  <div className="markets-grid">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="market-card">
                        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 12 }} />
                        <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: 8 }} />
                        <div className="skeleton" style={{ width: '50%', height: 13 }} />
                      </div>
                    ))}
                  </div>
                ) : filteredMarkets.length > 0 ? (
                  <div className="markets-grid">
                    {filteredMarkets.map(market => (
                      <button
                        className="market-card"
                        key={market.id}
                        onClick={() => setSelectedMarket(market)}
                        style={{ cursor: 'pointer', textAlign: 'left', border: 'none', padding: 0, background: 'none' }}
                      >
                        <div className="market-card-icon"><FiMapPin size={18} /></div>
                        <h4>{market.nome}</h4>
                        <p>{market.distancia || 'Distância não informada'}</p>
                        {Array.isArray(market.tags) && market.tags.length > 0 && (
                          <div className="market-tags">
                            {market.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="market-tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    {searchQuery ? `Nenhum mercado encontrado para "${searchQuery}".` : 'Nenhum mercado disponível.'}
                  </div>
                )}
              </section>
            </>
          )}

          {activeTab === 'compras' && (
            <section>
              <div className="section-header">
                <h2 className="section-title">Últimas Compras</h2>
                <span className="section-count">{pedidos.length} pedidos</span>
              </div>
              {loading ? (
                <div className="empty-state">Carregando...</div>
              ) : pedidos.length > 0 ? (
                pedidos.map((pedido) => (
                  <div className="compra-card" key={pedido.id}>
                    <div className="compra-icon"><FiPackage size={20} /></div>
                    <div className="compra-details">
                      <div className="compra-title">
                        {pedido.mercados?.nome || 'Mercado'}
                      </div>
                      <div className="compra-meta">
                        <span>Pedido #{String(pedido.id).slice(0, 8)}</span>
                        {pedido.criado_em && (
                          <span>{new Date(pedido.criado_em).toLocaleDateString('pt-BR')}</span>
                        )}
                        {pedido.total && <span>R$ {Number(pedido.total).toFixed(2)}</span>}
                      </div>
                    </div>
                    <span className="compra-badge">
                      {pedido.status || 'Entregue'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-state">Nenhuma compra realizada ainda.</div>
              )}
            </section>
          )}

          {activeTab === 'nutricional' && (
            <section>
              <div className="section-header">
                <h2 className="section-title">Perfil Nutricional</h2>
              </div>
              <div className="profile-panel" style={{ marginBottom: 24 }}>
                <h3>As suas preferências</h3>
                <div className="profile-info-row">
                  <strong>Nome</strong>
                  <span>{profile?.nome || '—'}</span>
                </div>
                <div className="profile-info-row">
                  <strong>Email</strong>
                  <span>{session.user.email}</span>
                </div>
                <div className="profile-info-row">
                  <strong>Morada</strong>
                  <span>{profile?.morada || 'Não informada'}</span>
                </div>
                <div className="profile-info-row">
                  <strong>Dieta</strong>
                  <span>{profile?.preferencias_alimentares || 'Sem restrições'}</span>
                </div>
              </div>
              <div className="section-header">
                <h2 className="section-title">Resumo Nutricional</h2>
              </div>
              <div className="nutricional-grid">
                <div className="nutri-card">
                  <div className="nutri-value">—<span className="nutri-unit">kcal</span></div>
                  <div className="nutri-label">Calorias diárias</div>
                </div>
                <div className="nutri-card">
                  <div className="nutri-value">—<span className="nutri-unit">g</span></div>
                  <div className="nutri-label">Proteínas</div>
                </div>
                <div className="nutri-card">
                  <div className="nutri-value">—<span className="nutri-unit">g</span></div>
                  <div className="nutri-label">Carboidratos</div>
                </div>
                <div className="nutri-card">
                  <div className="nutri-value">—<span className="nutri-unit">g</span></div>
                  <div className="nutri-label">Gorduras</div>
                </div>
              </div>
              <p style={{ marginTop: 16, fontSize: 13, color: 'var(--gray-400)', textAlign: 'center' }}>
                Os dados nutricionais serão calculados com base nas suas compras.
              </p>
            </section>
          )}
        </div>
      </main>

      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Configurações</h2>
            <div className="settings-section">
              <label>Nome</label>
              <input
                type="text"
                value={settingsData.nome}
                onChange={(e) => setSettingsData({ ...settingsData, nome: e.target.value })}
              />
            </div>
            <div className="settings-section">
              <label>Email</label>
              <input type="email" value={session.user.email} readOnly />
            </div>
            <div className="settings-section">
              <label>Morada</label>
              <input
                type="text"
                value={settingsData.morada}
                onChange={(e) => setSettingsData({ ...settingsData, morada: e.target.value })}
              />
            </div>
            <div className="settings-section">
              <label>Preferências Alimentares</label>
              <input
                type="text"
                placeholder="ex: vegetariano, sem glúten..."
                value={settingsData.preferencias_alimentares}
                onChange={(e) => setSettingsData({ ...settingsData, preferencias_alimentares: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button className="modal-btn-ghost" onClick={() => setIsSettingsOpen(false)} disabled={isSavingSettings}>Fechar</button>
              <button className="modal-btn-primary" onClick={handleSaveSettings} disabled={isSavingSettings}>
                {isSavingSettings ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <KyaAssistant isOpen={isKyaOpen} onClose={() => setIsKyaOpen(false)} session={session} />

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        marketId={selectedMarket?.id}
        marketName={selectedMarket?.nome || 'Mercado'}
        session={session}
      />
    </div>
  );
}
