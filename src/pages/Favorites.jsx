import { useFavorites } from "../context/FavoritesContext";
import { products } from "../mocks/data";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

function Favorites() {
  const { favorites } = useFavorites();
  
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="container" style={{ margin: "40px auto", textAlign: "center", padding: "50px", backgroundColor: "var(--branco)", borderRadius: "8px" }}>
        <h2 style={{ color: "var(--cinza-escuro)", marginBottom: "15px" }}>Sua lista de favoritos está vazia</h2>
        <p style={{ color: "var(--cinza-texto)", marginBottom: "30px" }}>Dê um coraçãozinho nos produtos que você mais gostou para salvá-los aqui!</p>
        <Link to="/" className="btn-primary" style={{ display: "inline-block", width: "auto", textDecoration: "none" }}>
          Explorar Ofertas
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: "30px auto", minHeight: "60vh" }}>
      <h1 style={{ fontSize: "24px", color: "var(--cinza-escuro)", marginBottom: "20px" }}>Meus Favoritos</h1>
      
      <div className="grid-mobile-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
