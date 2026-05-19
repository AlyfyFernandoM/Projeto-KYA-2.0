import React, { useState } from 'react';
import './ShoppingCart.css';
import { FiX, FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { supabase } from './supabaseClient';

export default function ShoppingCart({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, marketId, marketName, session }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const total = cartItems.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantidade, 0);

  const handleCheckout = async () => {
    if (!marketId || cartItems.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError('');

    try {
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert([{
          utilizador_id: session.user.id,
          mercado_id: marketId,
          mercado_nome: marketName,
          total: total,
          status: 'pendente',
          tempo_entrega: '30-45 min',
        }])
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      const itensData = cartItems.map(item => ({
        pedido_id: pedido.id,
        produto_nome: item.nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco,
      }));

      const { error: itensError } = await supabase
        .from('itens_pedido')
        .insert(itensData);

      if (itensError) throw itensError;

      alert('Pedido realizado com sucesso! Seu pedido será entregue em 30-45 minutos.');
      onClose();
    } catch (err) {
      setCheckoutError(err.message || 'Erro ao processar pedido');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <button className="cart-close-btn" onClick={onClose}>
            <FiArrowLeft size={20} />
          </button>
          <h2>Carrinho</h2>
          <span className="cart-badge">{itemCount}</span>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>O seu carrinho está vazio</p>
              <span>Adicione produtos para continuar</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.nome}</h4>
                      <p className="cart-item-price">R$ {Number(item.preco).toFixed(2)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantidade - 1)}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="qty-value">{item.quantidade}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <span className="cart-item-subtotal">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                      title="Remover"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Entrega</span>
                  <span>Grátis</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {checkoutError && (
                <div className="cart-error">{checkoutError}</div>
              )}

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.length === 0}
              >
                {isCheckingOut ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
