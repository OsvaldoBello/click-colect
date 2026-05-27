import { useState } from "react";
import { MapPin, Truck } from "lucide-react";

function Checkout() {
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [cep, setCep] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = () => {
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <div
        style={{
          background: "var(--branco)",
          padding: "40px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "var(--verde-promocao)" }}>Pedido Confirmado!</h2>
        {deliveryMethod === "collect" && (
          <div style={{ marginTop: "20px" }}>
            <p>Seu código de retirada foi gerado com sucesso.</p>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Pedido12345"
              alt="QR Code Retirada"
              style={{ margin: "20px 0" }}
            />
            <p>
              <strong>Apresente este código na loja selecionada.</strong>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--branco)",
        padding: "30px",
        borderRadius: "8px",
      }}
    >
      <h2>Finalizar Compra</h2>

      <div style={{ margin: "30px 0" }}>
        <h3>Escolha a forma de entrega:</h3>
        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <div
            onClick={() => setDeliveryMethod("standard")}
            style={{
              border:
                deliveryMethod === "standard"
                  ? "2px solid var(--azul-escuro)"
                  : "1px solid var(--cinza-claro)",
              padding: "20px",
              borderRadius: "8px",
              cursor: "pointer",
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Truck size={24} />
            <span>Entrega Padrão</span>
          </div>

          <div
            onClick={() => setDeliveryMethod("collect")}
            style={{
              border:
                deliveryMethod === "collect"
                  ? "2px solid var(--azul-escuro)"
                  : "1px solid var(--cinza-claro)",
              padding: "20px",
              borderRadius: "8px",
              cursor: "pointer",
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <MapPin size={24} />
            <span>Retirar na Loja (Click & Collect)</span>
          </div>
        </div>
      </div>

      {deliveryMethod === "collect" && (
        <div
          style={{
            background: "var(--cinza-claro)",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <label>Informe seu CEP para buscar lojas próximas:</label>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="00000-000"
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button className="btn-primary">Buscar</button>
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={handleCheckout}
        style={{ width: "100%", fontSize: "18px", padding: "15px" }}
      >
        Confirmar Pagamento
      </button>
    </div>
  );
}

export default Checkout;
