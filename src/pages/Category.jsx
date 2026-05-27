import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../mocks/data";
import ProductCard from "../components/ProductCard";

const slugToName = {
  eletronicos: "Eletrônicos",
  moda: "Moda",
  "casa-e-decoracao": "Casa e Decoração",
  esportes: "Esportes",
  livros: "Livros",
  brinquedos: "Brinquedos",
  automotivo: "Automotivo",
  beleza: "Beleza",
};

function Category() {
  const { nomeCategoria } = useParams();
  const categoryNameDisplay =
    slugToName[nomeCategoria] ||
    nomeCategoria.charAt(0).toUpperCase() + nomeCategoria.slice(1);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filters, setFilters] = useState({
    freeShipping: false,
    sameDayDelivery: false,
    isNew: false,
    isUsed: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const filteredProducts = products.filter((product) => {
    if (product.category !== categoryNameDisplay) return false;
    if (minPrice && product.discountPrice < parseFloat(minPrice)) return false;
    if (maxPrice && product.discountPrice > parseFloat(maxPrice)) return false;
    if (filters.freeShipping && !product.freeShipping) return false;
    if (filters.sameDayDelivery && !product.sameDayDelivery) return false;

    const conditionFilterActive = filters.isNew || filters.isUsed;
    if (conditionFilterActive) {
      if (filters.isNew && !filters.isUsed && product.condition !== "Novo")
        return false;
      if (filters.isUsed && !filters.isNew && product.condition !== "Usado")
        return false;
    }

    return true;
  });

  return (
    <div className="container" style={{ margin: "20px auto" }}>
      <div
        style={{
          fontSize: "14px",
          marginBottom: "20px",
          display: "flex",
          gap: "8px",
        }}
      >
        <Link to="/" style={{ color: "var(--azul-link)" }}>
          Início
        </Link>
        <span style={{ color: "var(--cinza-texto)" }}>&gt;</span>
        <span style={{ color: "var(--cinza-texto)" }}>
          {categoryNameDisplay}
        </span>
      </div>

      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        <aside
          style={{
            width: "250px",
            flexShrink: 0,
            position: "sticky",
            top: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              color: "var(--cinza-escuro)",
              marginBottom: "5px",
            }}
          >
            {categoryNameDisplay}
          </h1>
          <p
            style={{
              color: "var(--cinza-texto)",
              fontSize: "14px",
              marginBottom: "30px",
            }}
          >
            {filteredProducts.length} resultados
          </p>

          <div
            style={{
              backgroundColor: "var(--branco)",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "16px", marginBottom: "15px" }}>Filtros</h3>

            <div style={{ marginBottom: "25px" }}>
              <h4
                style={{
                  fontSize: "14px",
                  color: "var(--cinza-escuro)",
                  marginBottom: "10px",
                }}
              >
                Faixa de preço
              </h4>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="number"
                  placeholder="Mín."
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid var(--cinza-borda)",
                    borderRadius: "4px",
                    outline: "none",
                  }}
                />
                <span style={{ color: "var(--cinza-texto)" }}>-</span>
                <input
                  type="number"
                  placeholder="Máx."
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid var(--cinza-borda)",
                    borderRadius: "4px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <h4
                style={{
                  fontSize: "14px",
                  color: "var(--cinza-escuro)",
                  marginBottom: "10px",
                }}
              >
                Envio
              </h4>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "var(--cinza-texto)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="freeShipping"
                  checked={filters.freeShipping}
                  onChange={handleCheckboxChange}
                />
                Frete grátis
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "var(--cinza-texto)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="sameDayDelivery"
                  checked={filters.sameDayDelivery}
                  onChange={handleCheckboxChange}
                />
                Entrega no mesmo dia
              </label>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "14px",
                  color: "var(--cinza-escuro)",
                  marginBottom: "10px",
                }}
              >
                Condição
              </h4>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "var(--cinza-texto)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="isNew"
                  checked={filters.isNew}
                  onChange={handleCheckboxChange}
                />
                Novo
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "var(--cinza-texto)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="isUsed"
                  checked={filters.isUsed}
                  onChange={handleCheckboxChange}
                />
                Usado
              </label>
            </div>
          </div>
        </aside>

        <div style={{ flex: 1 }}>
          {filteredProducts.length > 0 ? (
            <div
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
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                backgroundColor: "var(--branco)",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{ color: "var(--cinza-escuro)", marginBottom: "10px" }}
              >
                Nenhum produto encontrado
              </h3>
              <p style={{ color: "var(--cinza-texto)" }}>
                Tente ajustar os filtros na barra lateral para ver mais
                resultados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
