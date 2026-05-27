import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, Store } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function Header() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchTerm)}`);
      setIsMenuOpen(false);
    }
  };

  const categorias = [
    { nome: "Eletrônicos", slug: "eletronicos" },
    { nome: "Moda", slug: "moda" },
    { nome: "Casa e Decoração", slug: "casa-e-decoracao" },
    { nome: "Esportes", slug: "esportes" },
    { nome: "Livros", slug: "livros" },
    { nome: "Brinquedos", slug: "brinquedos" },
    { nome: "Automotivo", slug: "automotivo" },
    { nome: "Beleza", slug: "beleza" },
  ];

  return (
    <header style={{ backgroundColor: "var(--amarelo-suave)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      
      {/* Main Header */}
      <div className="container" style={{ padding: "20px 15px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px", flexWrap: "wrap" }}>
        
        {/* Lado Esquerdo: Logo e Hamburguer (Mobile) */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button className="mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
            {isMenuOpen ? <X size={28} color="var(--azul-escuro)" /> : <Menu size={28} color="var(--azul-escuro)" />}
          </button>

          <Link to="/" style={{ fontSize: "28px", fontWeight: "bold", color: "var(--azul-escuro)", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <Store size={32} color="var(--azul-escuro)" />
            MegaLoja
          </Link>
        </div>

        {/* Centro: Barra de Busca (Nova Estrutura) */}
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: "200px", display: "flex", boxShadow: "0 1px 2px 0 rgba(0,0,0,.2)", borderRadius: "4px", overflow: "hidden" }} className="desktop-only">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="O que você está procurando?"
            style={{ flex: 1, padding: "14px 15px", border: "none", fontSize: "15px", outline: "none" }}
          />
          <button type="submit" style={{ padding: "0 25px", backgroundColor: "var(--azul-escuro)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9} onMouseLeave={(e) => e.currentTarget.style.opacity = 1}>
            <Search size={20} color="var(--amarelo-suave)" />
          </button>
        </form>

        {/* Lado Direito: Login e Carrinho */}
        <div style={{ display: "flex", alignItems: "center", gap: "30px", color: "var(--cinza-escuro)" }}>
          
          <Link to="/login" className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--azul-escuro)" }}>
            <User size={28} />
            <div style={{ display: "flex", flexDirection: "column", fontSize: "14px", lineHeight: "1.2" }}>
              <span>Faça login ou</span>
              <span style={{ fontWeight: "bold" }}>crie seu cadastro</span>
            </div>
          </Link>

          <Link to="/carrinho" style={{ position: "relative", cursor: "pointer", color: "var(--azul-escuro)", display: "flex", alignItems: "center" }}>
            <ShoppingCart size={28} />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-10px", backgroundColor: "red", color: "white", fontSize: "11px", fontWeight: "bold", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Barra de Busca (Mobile) */}
        <form onSubmit={handleSearch} style={{ width: "100%", display: "flex", boxShadow: "0 1px 2px 0 rgba(0,0,0,.2)", borderRadius: "4px", overflow: "hidden" }} className="mobile-only">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="O que você está procurando?"
            style={{ flex: 1, padding: "12px 15px", border: "none", fontSize: "15px", outline: "none" }}
          />
          <button type="submit" style={{ padding: "0 20px", backgroundColor: "var(--azul-escuro)", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Search size={20} color="var(--amarelo-suave)" />
          </button>
        </form>
      </div>

      {/* Menu Mobile Expandido */}
      {isMenuOpen && (
        <nav className="mobile-only" style={{ backgroundColor: "var(--branco)", padding: "15px", display: "flex", flexDirection: "column", gap: "15px", borderTop: "1px solid var(--cinza-borda)" }}>
          <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: "bold", color: "var(--azul-escuro)", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <User size={20} /> Entre ou Cadastre-se
          </Link>
          <hr style={{ border: "none", borderTop: "1px solid var(--cinza-borda)" }} />
          {categorias.map((categoria) => (
            <Link key={categoria.slug} to={`/categoria/${categoria.slug}`} onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none", color: "var(--cinza-texto)", fontSize: "16px" }}>
              {categoria.nome}
            </Link>
          ))}
        </nav>
      )}

      {/* Categories Nav (Desktop) */}
      <div className="container desktop-only" style={{ padding: "0 15px 15px 15px", display: "flex", alignItems: "center", gap: "30px" }}>
        
        {/* Botão Todos os Departamentos */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--azul-escuro)", fontWeight: "bold", cursor: "pointer", paddingRight: "20px", borderRight: "1px solid rgba(0,0,0,0.1)" }}>
          <Menu size={20} />
          <span>Todos os Departamentos</span>
        </div>

        <nav style={{ display: "flex", gap: "25px", fontSize: "14px", color: "var(--cinza-escuro)", fontWeight: "500" }}>
          {categorias.map((categoria) => (
            <Link
              key={categoria.slug}
              to={`/categoria/${categoria.slug}`}
              style={{ transition: "color 0.2s", cursor: "pointer", textDecoration: "none", color: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--azul-link)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
            >
              {categoria.nome}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;