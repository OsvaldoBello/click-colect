import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ margin: '40px auto', textAlign: 'center', padding: '50px', backgroundColor: 'var(--branco)', borderRadius: '8px' }}>
        <h2 style={{ color: 'var(--cinza-escuro)', marginBottom: '15px' }}>Seu carrinho está vazio</h2>
        <p style={{ color: 'var(--cinza-texto)', marginBottom: '30px' }}>Não sabe o que comprar? Milhares de produtos esperam por você!</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>
          Descobrir ofertas
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: '30px auto' }}>
      <h1 style={{ fontSize: '24px', color: 'var(--cinza-escuro)', marginBottom: '20px' }}>Carrinho de Compras</h1>
      
      <div className="cart-layout">
        
        <div style={{ flex: 2, backgroundColor: 'var(--branco)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {cart.map((item) => (
            <div key={item.cartItemId} className="cart-item">
              <img src={item.images[0]} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', color: 'var(--cinza-escuro)', marginBottom: '5px' }}>{item.title}</h3>
                {item.selectedSize && <p style={{ fontSize: '13px', color: 'var(--cinza-texto)', marginBottom: '10px' }}>Tamanho: <strong>{item.selectedSize}</strong></p>}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--cinza-borda)", borderRadius: "4px", overflow: "hidden" }}>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} style={{ padding: "5px 12px", background: "var(--cinza-fundo)", border: "none", cursor: "pointer", fontWeight: "bold" }}>-</button>
                    <span style={{ padding: "0 15px", fontSize: '14px' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} style={{ padding: "5px 12px", background: "var(--cinza-fundo)", border: "none", cursor: "pointer", fontWeight: "bold" }}>+</button>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.cartItemId)} style={{ background: 'none', border: 'none', color: 'var(--azul-link)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>
              </div>

              <div className="cart-item-price">
                <p style={{ fontSize: '20px', color: 'var(--cinza-escuro)', fontWeight: '600' }}>R$ {(item.discountPrice * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, backgroundColor: 'var(--branco)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--cinza-escuro)', marginBottom: '20px' }}>Resumo da compra</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--cinza-texto)', fontSize: '15px' }}>
            <span>Produtos ({cart.length})</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--cinza-texto)', fontSize: '15px' }}>
            <span>Frete</span>
            <span style={{ color: 'var(--verde-promocao)' }}>Grátis</span>
          </div>
          
          <div style={{ height: '1px', backgroundColor: 'var(--cinza-borda)', marginBottom: '20px' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', color: 'var(--cinza-escuro)', fontSize: '18px', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>

          <Link to="/checkout" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '15px', width: '100%' }}>Continuar a compra</button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Cart;