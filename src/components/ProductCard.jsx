import { Link } from "react-router-dom";
import { Heart, Truck, Star } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  return (
    <Link
      to={`/produto/${product.id}`}
      style={{
        background: "var(--branco)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        display: "block",
        position: "relative",
        transition: "box-shadow 0.2s",
      }}
      className="product-card"
    >
      {}
      <div
        style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}
      >
        <span className="badge-discount">{product.discountPercent}% OFF</span>
      </div>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "50%",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          cursor: "pointer",
        }}
      >
        <Heart size={18} fill={favorited ? "#E02424" : "none"} color={favorited ? "#E02424" : "var(--cinza-texto)"} />
      </div>

      {}
      <div
        style={{
          height: "220px",
          overflow: "hidden",
          borderBottom: "1px solid var(--cinza-fundo)",
        }}
      >
        <div className="product-image-container">
          <img
            src={product.images[0]}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {}
      <div style={{ padding: "15px" }}>
        <h3
          style={{
            fontSize: "14px",
            color: "var(--cinza-texto)",
            fontWeight: "400",
            height: "40px",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          {product.title}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "24px",
              color: "var(--cinza-escuro)",
              fontWeight: "400",
            }}
          >
            R$ {product.discountPrice}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "var(--cinza-texto)",
              textDecoration: "line-through",
            }}
          >
            R$ {product.price}
          </span>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "var(--verde-promocao)",
            margin: "4px 0",
          }}
        >
          em até {product.installments} sem juros
        </p>

        {product.freeShipping && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "var(--verde-promocao)",
              fontSize: "13px",
              fontWeight: "bold",
              marginTop: "8px",
            }}
          >
            <Truck size={16} /> Frete grátis
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "10px",
            fontSize: "12px",
            color: "var(--cinza-texto)",
          }}
        >
          <Star size={14} fill="#FFF159" color="#FFF159" />
          <Star size={14} fill="#FFF159" color="#FFF159" />
          <Star size={14} fill="#FFF159" color="#FFF159" />
          <Star size={14} fill="#FFF159" color="#FFF159" />
          <Star size={14} color="#FFF159" />
          <span>({product.reviews})</span>
        </div>

        {product.officialStore && (
          <span className="loja-oficial">Loja Oficial</span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
