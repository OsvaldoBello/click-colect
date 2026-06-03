import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../mocks/data";
import { Star, Truck, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { useAlert } from "../context/AlertContext";

function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id)) || products[0];

  const [selectedImage, setSelectedImage] = useState(() => product.images[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingResult, setShippingResult] = useState(null);
  const [shippingError, setShippingError] = useState("");

  const { addToCart } = useCart();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );

  const handleAddToCart = () => {
    if (product.category === "Moda" && !selectedSize) {
      showAlert("Por favor, selecione um tamanho antes de adicionar ao carrinho.", "warning");
      return;
    }
    addToCart(product, quantity, selectedSize);
    showAlert("Produto adicionado ao carrinho com sucesso!", "success");
  };

  const handleBuyNow = () => {
    if (product.category === "Moda" && !selectedSize) {
      showAlert("Por favor, selecione um tamanho antes de comprar.", "warning");
      return;
    }
    addToCart(product, quantity, selectedSize);
    navigate("/checkout");
  };

  const handleCalculateShipping = () => {
    setShippingError("");
    setShippingResult(null);
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setShippingError("CEP inválido. Digite 8 números.");
      return;
    }

    const firstDigit = cleanCep[0];
    if (firstDigit === "0" || firstDigit === "1") {
      setShippingResult({
        price: "Grátis",
        time: "2 dias úteis",
        store: "Disponível para Click & Collect nas Lojas Centro, Paulista e Pinheiros"
      });
    } else {
      setShippingResult({
        price: "R$ 15,90",
        time: "5 a 7 dias úteis",
        store: "Disponível para Click & Collect nas Lojas Regionais em até 4 dias"
      });
    }
  };

  const handleCepChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 5) {
      val = val.substring(0, 5) + "-" + val.substring(5, 8);
    }
    setCep(val.substring(0, 9));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setSelectedImage(product.images[0]);
      setQuantity(1);
      setSelectedSize("");
      setShippingResult(null);
      setShippingError("");
      setCep("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
    return () => clearTimeout(t);
  }, [product.id, product.images]);

  return (
    <div
      className="container"
      style={{ margin: "30px auto", paddingBottom: "50px" }}
    >
      <div
        style={{
          fontSize: "14px",
          marginBottom: "20px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{ color: "var(--azul-link)", textDecoration: "none" }}
        >
          Início
        </Link>
        <span style={{ color: "var(--cinza-texto)" }}>&gt;</span>
        <Link
          to={`/categoria/${product.category.toLowerCase().replace(/ /g, "-")}`}
          style={{ color: "var(--azul-link)", textDecoration: "none" }}
        >
          {product.category}
        </Link>
        <span style={{ color: "var(--cinza-texto)" }}>&gt;</span>
        <span style={{ color: "var(--cinza-texto)" }}>{product.title}</span>
      </div>

      <div className="product-detail-layout">
        <div className="product-images-layout">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {product.images.map((imgUrl, index) => (
              <div
                key={index}
                onMouseEnter={() => setSelectedImage(imgUrl)}
                onClick={() => setSelectedImage(imgUrl)}
                style={{
                  width: "60px",
                  height: "60px",
                  border:
                    selectedImage === imgUrl
                      ? "2px solid var(--azul-link)"
                      : "1px solid var(--cinza-borda)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Miniatura ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <img
              src={selectedImage}
              alt={product.title}
              style={{
                width: "100%",
                borderRadius: "8px",
                objectFit: "cover",
                maxHeight: "500px",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "14px", color: "var(--cinza-texto)" }}>
            {product.condition} | {product.reviews} vendidos
          </span>
          <h1
            style={{
              fontSize: "22px",
              color: "var(--cinza-escuro)",
              margin: "10px 0",
              fontWeight: "600",
            }}
          >
            {product.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "20px",
            }}
          >
            <Star size={16} fill="#3483FA" color="#3483FA" />
            <Star size={16} fill="#3483FA" color="#3483FA" />
            <Star size={16} fill="#3483FA" color="#3483FA" />
            <Star size={16} fill="#3483FA" color="#3483FA" />
            <Star size={16} color="#3483FA" />
            <span
              style={{
                fontSize: "14px",
                color: "var(--cinza-texto)",
                marginLeft: "5px",
              }}
            >
              ({product.reviews} avaliações)
            </span>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <span
              style={{
                textDecoration: "line-through",
                color: "var(--cinza-texto)",
                fontSize: "16px",
              }}
            >
              R$ {(product.price * quantity).toFixed(2)}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "36px",
                  color: "var(--cinza-escuro)",
                  fontWeight: "300",
                }}
              >
                R$ {(product.discountPrice * quantity).toFixed(2)}
              </span>
              <span
                style={{ color: "var(--verde-promocao)", fontWeight: "bold" }}
              >
                {product.discountPercent}% OFF
              </span>
            </div>
            <p
              style={{
                color: "var(--verde-promocao)",
                fontSize: "14px",
                marginTop: "5px",
              }}
            >
              em até {product.installments} sem juros
            </p>
          </div>

          {product.category === "Moda" && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontWeight: "600", marginBottom: "10px" }}>
                Tamanho:
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {["P", "M", "G", "GG"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "4px",
                      backgroundColor:
                        selectedSize === size
                          ? "var(--azul-link)"
                          : "var(--cinza-fundo)",
                      color:
                        selectedSize === size ? "#fff" : "var(--cinza-escuro)",
                      border:
                        selectedSize === size
                          ? "none"
                          : "1px solid var(--cinza-borda)",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "30px" }}>
            <p style={{ fontWeight: "600", marginBottom: "10px" }}>
              Quantidade:
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid var(--cinza-borda)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: "8px 15px",
                    background: "var(--cinza-fundo)",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  -
                </button>
                <span style={{ padding: "0 15px" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: "8px 15px",
                    background: "var(--cinza-fundo)",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  +
                </button>
              </div>
              <span style={{ fontSize: "14px", color: "var(--cinza-texto)" }}>
                (estoque disponível)
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "30px",
              marginTop: "20px",
            }}
          >
            <button className="btn-primary" onClick={handleBuyNow}>Comprar agora</button>
            <button className="btn-secondary" onClick={handleAddToCart}>
              Adicionar ao carrinho
            </button>
          </div>

          <div
            style={{
              border: "1px solid var(--cinza-borda)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <Truck size={24} color="var(--verde-promocao)" />
              <span
                style={{ color: "var(--verde-promocao)", fontWeight: "600" }}
              >
                Opções de entrega
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--cinza-texto)",
                marginBottom: "15px",
              }}
            >
              Calcular frete ou disponibilidade de Retirada na Loja:
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={handleCepChange}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid var(--cinza-borda)",
                  outline: "none",
                }}
              />
              <button
                onClick={handleCalculateShipping}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "none",
                  color: "var(--azul-link)",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Calcular
              </button>
            </div>

            {shippingError && (
              <p style={{ color: "#E02424", fontSize: "13px", marginTop: "12px", fontWeight: "500" }}>{shippingError}</p>
            )}

            {shippingResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid var(--cinza-borda)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--cinza-escuro)" }}>Envio Normal</span>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--verde-promocao)" }}>{shippingResult.price}</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--cinza-texto)", margin: 0 }}>Prazo de entrega: {shippingResult.time}</p>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "5px", padding: "12px", backgroundColor: "var(--cinza-fundo)", borderRadius: "4px" }}>
                  <MapPin size={16} style={{ color: "var(--azul-link)", flexShrink: 0, marginTop: "2px" }} />
                  <p style={{ fontSize: "12px", color: "var(--cinza-escuro)", margin: 0, lineHeight: "1.4" }}>{shippingResult.store}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div style={{ marginTop: "60px" }}>
          <h2
            style={{
              fontSize: "24px",
              color: "var(--cinza-escuro)",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            Produtos relacionados
          </h2>
          <div
            className="grid-mobile-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
