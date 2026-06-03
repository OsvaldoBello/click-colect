import { useState, useEffect } from "react";
import { products } from "../mocks/data";
import ProductCard from "../components/ProductCard";
import { Truck, ShieldCheck, Undo2, CreditCard } from "lucide-react";

function Home() {
  const [timeLeft, setTimeLeft] = useState(45932); 
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 45932));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const categories = ["Todos", "Eletrônicos", "Moda", "Casa e Decoração", "Esportes", "Beleza"];

  const filteredProducts = selectedCategory === "Todos"
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  return (
    <div style={{ paddingBottom: "50px" }}>
      
      {}
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <div style={{ 
          backgroundColor: 'var(--roxo-banner)', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          display: 'flex', 
          flexWrap: 'wrap',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          
          {}
          <div className="home-banner-text-col" style={{ flex: 1, minWidth: '300px', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <span style={{ 
              backgroundColor: 'var(--amarelo-suave)', 
              color: 'var(--azul-escuro)', 
              fontWeight: 'bold', 
              fontSize: '12px', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              marginBottom: '15px' 
            }}>
              MEGA OFERTA
            </span>
            
            <h1 style={{ fontSize: '42px', color: 'var(--branco)', marginBottom: '15px', lineHeight: '1.1' }}>
              Mês do<br/>Consumidor
            </h1>
            
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '30px', maxWidth: '400px' }}>
              Milhares de produtos com até <strong style={{color: 'var(--amarelo-suave)'}}>70% de desconto</strong> e frete grátis.
            </p>
            
            <button 
              onClick={() => {
                const section = document.getElementById("ofertas-do-dia");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ 
                backgroundColor: 'var(--amarelo-suave)', 
                color: 'var(--azul-escuro)', 
                border: 'none', 
                padding: '15px 30px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                borderRadius: '6px', 
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
            >
              Aproveitar Ofertas
            </button>
          </div>

          {}
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            {}
            <img 
              src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80" 
              alt="Promoção Mês do Consumidor" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '300px' }} 
            />
            {}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--roxo-banner)', opacity: 0.2 }}></div>
          </div>

        </div>
      </div>

      <div className="container">
        {}
        <div className="grid-mobile-2 grid-mobile-2-benefits"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "50px",
          }}
        >
          {[
            {
              icon: <Truck size={32} color="var(--azul-escuro)" />,
              title: "Frete grátis",
              sub: "A partir de R$ 79",
            },
            {
              icon: <ShieldCheck size={32} color="var(--azul-escuro)" />,
              title: "Compra garantida",
              sub: "Ou devolvemos seu dinheiro",
            },
            {
              icon: <Undo2 size={32} color="var(--azul-escuro)" />,
              title: "Devolução grátis",
              sub: "Em até 30 dias",
            },
            {
              icon: <CreditCard size={32} color="var(--azul-escuro)" />,
              title: "Parcele em 12x",
              sub: "Sem juros no cartão",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className="benefit-card"
              style={{
                backgroundColor: "var(--branco)",
                padding: "25px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                className="icon-container"
                style={{
                  backgroundColor: "var(--amarelo-suave)",
                  padding: "15px",
                  borderRadius: "50%",
                }}
              >
                {benefit.icon}
              </div>
              <h3 style={{ fontSize: "16px", color: "var(--cinza-escuro)" }}>
                {benefit.title}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--cinza-texto)" }}>
                {benefit.sub}
              </p>
            </div>
          ))}
        </div>

        {}
        <div id="ofertas-do-dia" className="ofertas-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '24px', color: 'var(--cinza-escuro)', fontWeight: '600' }}>Ofertas do dia</h2>
          </div>
          <div style={{ backgroundColor: 'var(--azul-escuro)', color: 'var(--branco)', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', minWidth: "160px", textAlign: "center" }}>
            Termina em: {formatTime(timeLeft)}
          </div>
        </div>

        {}
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "15px", marginBottom: "25px", scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-tab ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid-mobile-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;