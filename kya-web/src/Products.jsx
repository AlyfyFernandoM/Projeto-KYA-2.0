import React, { useState, useEffect } from 'react';
import './Products.css';
import { supabase } from './supabaseClient';
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';

export default function Products({ marketId, marketName, onBack, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .eq('mercado_id', marketId)
        .order('categoria', { ascending: true });
      setProducts(data || []);
      setLoading(false);
    }
    loadProducts();
  }, [marketId]);

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta)
    }));
  };

  const handleAddCart = (product) => {
    const qty = quantities[product.id] || 0;
    if (qty > 0) {
      onAddToCart({ ...product, quantidade: qty });
      setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    }
  };

  const groupedProducts = products.reduce((acc, prod) => {
    const cat = prod.categoria || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prod);
    return acc;
  }, {});

  return (
    <div className="products-container">
      <div className="products-header">
        <button className="back-btn" onClick={onBack}>
          <FiArrowLeft size={20} />
        </button>
        <h1>{marketName}</h1>
        <div style={{ width: 40 }} />
      </div>

      {loading ? (
        <div className="products-loading">Carregando produtos...</div>
      ) : products.length === 0 ? (
        <div className="products-empty">Nenhum produto disponível neste mercado.</div>
      ) : (
        <div className="products-list">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="product-category">
              <h2 className="category-title">{category}</h2>
              <div className="products-grid">
                {items.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-info">
                      <h3>{product.nome}</h3>
                      <p className="product-category-small">{product.categoria}</p>
                      {product.calorias > 0 && (
                        <p className="product-nutrition">
                          {Math.round(product.calorias)} kcal | P: {product.proteinas}g
                        </p>
                      )}
                    </div>
                    <div className="product-footer">
                      <span className="product-price">R$ {Number(product.preco).toFixed(2)}</span>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(product.id, -1)}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="qty-display">{quantities[product.id] || 0}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(product.id, 1)}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <button
                        className="add-cart-btn"
                        onClick={() => handleAddCart(product)}
                        disabled={!quantities[product.id] || quantities[product.id] === 0}
                      >
                        <FiShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
