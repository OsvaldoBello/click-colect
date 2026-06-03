import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, Store, Heart, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useState } from "react";
import { products } from "../mocks/data";

function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchTerm)}`);
      setIsMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (val.trim()) {
      const lowerVal = val.toLowerCase();
      const filtered = products.filter(p => 
        p.title.toLowerCase().includes(lowerVal) || 
        p.category.toLowerCase().includes(lowerVal)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
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
    <header style={{ backgroundColor: "var(--amarelo-suave)", borderBottom: "1px solid rgba(0,0,0,0.05)", position: "relative" }}>
      
      {}
      <div className="container" style={{ padding: "20px 15px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px", flexWrap: "wrap" }}>
        
        {}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button className="mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
            {isMenuOpen ? <X size={28} color="var(--azul-escuro)" /> : <Menu size={28} color="var(--azul-escuro)" />}
          </button>

          <Link to="/" style={{ fontSize: "28px", fontWeight: "bold", color: "var(--azul-escuro)", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <Store size={32} color="var(--azul-escuro)" />
            MegaLoja
          </Link>
        </div>

        {}
        <div style={{ flex: 1, minWidth: "200px", position: "relative" }} className="desktop-only">
          <form onSubmit={handleSearch} style={{ display: "flex", boxShadow: "0 1px 2px 0 rgba(0,0,0,.2)", borderRadius: "4px", overflow: "hidden" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="O que você está procurando?"
              style={{ flex: 1, padding: "14px 15px", border: "none", fontSize: "15px", outline: "none" }}
            />
            <button type="submit" style={{ padding: "0 25px", backgroundColor: "var(--azul-escuro)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9} onMouseLeave={(e) => e.currentTarget.style.opacity = 1}>
              <Search size={20} color="var(--amarelo-suave)" />
            </button>
          </form>
          
          {showSuggestions && suggestions.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "var(--branco)", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", borderRadius: "0 0 8px 8px", zIndex: 100, border: "1px solid var(--cinza-borda)", borderTop: "none", overflow: "hidden" }}>
              {suggestions.map((p) => (
                <div key={p.id} onMouseDown={() => { navigate(`/produto/${p.id}`); setSearchTerm(""); }} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 15px", cursor: "pointer", borderBottom: "1px solid var(--cinza-borda)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--cinza-fundo)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--branco)"}>
                  <img src={p.images[0]} alt={p.title} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--cinza-escuro)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "450px" }}>{p.title}</p>
                    <p style={{ fontSize: "13px", color: "var(--verde-promocao)", fontWeight: "bold" }}>R$ {p.discountPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        <div style={{ display: "flex", alignItems: "center", gap: "25px", color: "var(--cinza-escuro)" }}>
          
          {user ? (
            <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--azul-escuro)" }}>
              <User size={28} />
              <div style={{ display: "flex", flexDirection: "column", fontSize: "14px", lineHeight: "1.2" }}>
                <span>Olá,</span>
                <span style={{ fontWeight: "bold" }}>{user.name.split(" ")[0]}</span>
              </div>
              <button onClick={() => { logout(); navigate("/"); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#E02424", marginLeft: "5px" }} title="Sair">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--azul-escuro)" }}>
              <User size={28} />
              <div style={{ display: "flex", flexDirection: "column", fontSize: "14px", lineHeight: "1.2" }}>
                <span>Faça login ou</span>
                <span style={{ fontWeight: "bold" }}>crie seu cadastro</span>
              </div>
            </Link>
          )}

          {}
          <Link to="/favoritos" style={{ position: "relative", cursor: "pointer", color: "var(--azul-escuro)", display: "flex", alignItems: "center" }} title="Favoritos">
            <Heart size={28} />
            {favorites.length > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-10px", backgroundColor: "#3483FA", color: "white", fontSize: "11px", fontWeight: "bold", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                {favorites.length}
              </span>
            )}
          </Link>

          {}
          <Link to="/carrinho" style={{ position: "relative", cursor: "pointer", color: "var(--azul-escuro)", display: "flex", alignItems: "center" }} title="Carrinho">
            <ShoppingCart size={28} />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-10px", backgroundColor: "red", color: "white", fontSize: "11px", fontWeight: "bold", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                {cartCount}
              </span>
            )}
          </Link>

        </div>

        {}
        <div style={{ width: "100%", position: "relative" }} className="mobile-only">
          <form onSubmit={handleSearch} style={{ display: "flex", boxShadow: "0 1px 2px 0 rgba(0,0,0,.2)", borderRadius: "4px", overflow: "hidden" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="O que você está procurando?"
              style={{ flex: 1, padding: "12px 15px", border: "none", fontSize: "15px", outline: "none" }}
            />
            <button type="submit" style={{ padding: "0 20px", backgroundColor: "var(--azul-escuro)", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Search size={20} color="var(--amarelo-suave)" />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "var(--branco)", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", zIndex: 100, border: "1px solid var(--cinza-borda)", borderTop: "none", overflow: "hidden" }}>
              {suggestions.map((p) => (
                <div key={p.id} onMouseDown={() => { navigate(`/produto/${p.id}`); setSearchTerm(""); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 15px", cursor: "pointer", borderBottom: "1px solid var(--cinza-borda)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--cinza-fundo)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--branco)"}>
                  <img src={p.images[0]} alt={p.title} style={{ width: "35px", height: "35px", objectFit: "cover", borderRadius: "4px" }} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <p style={{ fontSize: "13px", fontWeight: "500", color: "var(--cinza-escuro)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
                    <p style={{ fontSize: "12px", color: "var(--verde-promocao)", fontWeight: "bold" }}>R$ {p.discountPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      {isMenuOpen && (
        <nav className="mobile-only" style={{ backgroundColor: "var(--branco)", padding: "15px", display: "flex", flexDirection: "column", gap: "15px", borderTop: "1px solid var(--cinza-borda)" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: "bold", color: "var(--azul-escuro)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <User size={20} /> Olá, {user.name.split(" ")[0]}
              </div>
              <button onClick={() => { logout(); navigate("/"); setIsMenuOpen(false); }} style={{ background: "none", border: "none", color: "#E02424", fontWeight: "bold", cursor: "pointer" }}>
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: "bold", color: "var(--azul-escuro)", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <User size={20} /> Entre ou Cadastre-se
            </Link>
          )}
          <hr style={{ border: "none", borderTop: "1px solid var(--cinza-borda)" }} />
          {categorias.map((categoria) => (
            <Link key={categoria.slug} to={`/categoria/${categoria.slug}`} onClick={() => setIsMenuOpen(false)} style={{ textDecoration: "none", color: "var(--cinza-texto)", fontSize: "16px" }}>
              {categoria.nome}
            </Link>
          ))}
        </nav>
      )}

      {}
      <div className="container desktop-only" style={{ padding: "0 15px 15px 15px", display: "flex", alignItems: "center", gap: "30px" }}>
        
        {}
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