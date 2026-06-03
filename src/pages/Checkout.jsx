import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Truck, CreditCard, QrCode, ClipboardCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

function Checkout() {
  const { cart: contextCart, setCart } = useCart();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  
  const cart = contextCart && contextCart.length > 0 
    ? contextCart 
    : (() => {
        const saved = localStorage.getItem("click_colect_cart");
        return saved ? JSON.parse(saved) : [];
      })();

  const cartTotal = cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);

  
  const [step, setStep] = useState(1); 
  const [deliveryMethod, setDeliveryMethod] = useState(""); 
  const [cep, setCep] = useState("");
  const [cepError, setCepError] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  
  
  const [paymentMethod, setPaymentMethod] = useState("credit_card"); 
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardCpf, setCardCpf] = useState("");
  const [installments, setInstallments] = useState("1");
  const [paymentErrors, setPaymentErrors] = useState({});
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardBrand, setCardBrand] = useState("generic"); 

  
  const [pixCopied, setPixCopied] = useState(false);
  const [boletoCopied, setBoletoCopied] = useState(false);

  
  if (!user) {
    return (
      <div className="container" style={{ margin: "50px auto", textAlign: "center", padding: "50px", backgroundColor: "var(--branco)", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", maxWidth: "500px" }}>
        <h2 style={{ color: "var(--cinza-escuro)", marginBottom: "15px", fontWeight: "600" }}>Acesse sua conta</h2>
        <p style={{ color: "var(--cinza-texto)", marginBottom: "30px", fontSize: "15px" }}>Para finalizar a compra, você precisa entrar na sua conta.</p>
        <Link to="/login" className="btn-primary" style={{ display: "inline-block", width: "auto", textDecoration: "none", padding: "12px 30px" }}>
          Entrar ou Cadastrar-se
        </Link>
      </div>
    );
  }

  
  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container" style={{ margin: "50px auto", textAlign: "center", padding: "50px", backgroundColor: "var(--branco)", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", maxWidth: "500px" }}>
        <h2 style={{ color: "var(--cinza-escuro)", marginBottom: "15px", fontWeight: "600" }}>Seu carrinho está vazio</h2>
        <p style={{ color: "var(--cinza-texto)", marginBottom: "30px", fontSize: "15px" }}>Adicione alguns produtos antes de finalizar sua compra!</p>
        <Link to="/" className="btn-primary" style={{ display: "inline-block", width: "auto", textDecoration: "none", padding: "12px 30px" }}>
          Explorar Produtos
        </Link>
      </div>
    );
  }

  
  const detectCardBrand = (number) => {
    const cleanNumber = number.replace(/\s?/g, "");
    if (cleanNumber.startsWith("4")) return "visa";
    if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) return "master";
    if (/^(34|37)/.test(cleanNumber)) return "amex";
    if (/^(4011|4389|4514|5041|5066|5090|6278|6363|6362|6504|6509|6516)/.test(cleanNumber)) return "elo";
    return "generic";
  };

  
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.replace(/(\d{4})(\d)/, "$1 $2");
    val = val.replace(/(\d{4})(\d)/, "$1 $2");
    val = val.replace(/(\d{4})(\d)/, "$1 $2");
    const masked = val.substring(0, 19);
    setCardNumber(masked);
    setCardBrand(detectCardBrand(masked));
  };

  const handleCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setCardExpiry(val.substring(0, 5));
  };

  const handleCardCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    const limit = cardBrand === "amex" ? 4 : 3;
    setCardCvv(val.substring(0, limit));
  };

  const handleCardCpfChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d{1,2})/, "$1-$2");
    setCardCpf(val.substring(0, 14));
  };

  const handleCepChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 5) {
      val = val.substring(0, 5) + "-" + val.substring(5, 8);
    }
    setCep(val.substring(0, 9));
  };

  
  const handleSearchStores = () => {
    setCepError("");
    setSelectedStore(null);
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setCepError("Digite um CEP válido com 8 números.");
      return;
    }

    const firstDigit = cleanCep[0];
    if (firstDigit === "0" || firstDigit === "1") {
      setStores([
        { id: 1, name: "MegaLoja Paulista", address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP", hours: "Retirada em até 2h - Segunda a Sábado das 08h às 22h" },
        { id: 2, name: "MegaLoja Pinheiros", address: "Rua dos Pinheiros, 500 - Pinheiros, São Paulo - SP", hours: "Retirada em até 1h - Segunda a Sábado das 09h às 21h" },
        { id: 3, name: "MegaLoja Centro", address: "Av. Ipiranga, 200 - República, São Paulo - SP", hours: "Retirada em até 3h - Segunda a Sexta das 08h às 19h" }
      ]);
    } else {
      setStores([
        { id: 4, name: "MegaLoja Regional Centro", address: "Av. Central, 120 - Centro, Cidade de Destino", hours: "Retirada em 2 dias úteis - Segunda a Sábado das 09h às 18h" },
        { id: 5, name: "MegaLoja Regional Shopping", address: "Av. das Américas, 4500 - Lourdes, Cidade de Destino", hours: "Retirada em 1 dia útil - Todos os dias das 10h às 22h" },
        { id: 6, name: "MegaLoja Regional Express", address: "Rua da Bahia, 980 - Lourdes, Cidade de Destino", hours: "Retirada em 2 dias úteis - Segunda a Sexta das 08h às 20h" }
      ]);
    }
  };

  
  const handleProceedToPayment = () => {
    if (!deliveryMethod) {
      showAlert("Por favor, selecione uma forma de entrega.", "warning");
      return;
    }
    if (deliveryMethod === "collect" && !selectedStore) {
      showAlert("Por favor, selecione uma loja física para retirada.", "warning");
      return;
    }
    setStep(2);
  };

  
  const handleConfirmPayment = () => {
    if (paymentMethod === "credit_card") {
      const errors = {};
      if (cardNumber.replace(/\s?/g, "").length < 15) errors.number = "Número de cartão incompleto.";
      if (cardName.trim().length < 3) errors.name = "Nome do titular inválido.";
      if (cardExpiry.length !== 5) errors.expiry = "Data de vencimento inválida (MM/AA).";
      
      const parts = cardExpiry.split("/");
      if (parts.length === 2) {
        const month = parseInt(parts[0]);
        if (month < 1 || month > 12) errors.expiry = "Mês inválido.";
      }

      const requiredCvvLength = cardBrand === "amex" ? 4 : 3;
      if (cardCvv.length !== requiredCvvLength) errors.cvv = `CVV deve ter ${requiredCvvLength} dígitos.`;
      if (cardCpf.length !== 14) errors.cpf = "CPF inválido.";

      if (Object.keys(errors).length > 0) {
        setPaymentErrors(errors);
        return;
      }
    }

    
    setStep(3);
    
    setTimeout(() => {
      setCart([]);
    }, 100);
  };

  
  const handleCopyPix = () => {
    navigator.clipboard.writeText("00020101021226300014br.gov.bcb.pix2530mercado-pago-qr-code-ficticio");
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  
  const handleCopyBoleto = () => {
    navigator.clipboard.writeText("34191.79001 01043.513184 91020.150008 7 902400000" + Math.round(cartTotal * 100));
    setBoletoCopied(true);
    setTimeout(() => setBoletoCopied(false), 2000);
  };

  
  const renderCardBrandIcon = () => {
    switch (cardBrand) {
      case "visa": return <span style={{ color: "#0066b2", fontWeight: "bold", fontSize: "14px", fontStyle: "italic" }}>VISA</span>;
      case "master": return <span style={{ color: "#f79e1b", fontWeight: "bold", fontSize: "14px", fontStyle: "italic" }}>Mastercard</span>;
      case "amex": return <span style={{ color: "#007bc4", fontWeight: "bold", fontSize: "14px" }}>AMEX</span>;
      case "elo": return <span style={{ color: "#00a4e4", fontWeight: "bold", fontSize: "14px" }}>ELO</span>;
      default: return <CreditCard size={20} color="#999" />;
    }
  };

  return (
    <div className="container" style={{ margin: "40px auto", paddingBottom: "60px", maxWidth: "1000px" }}>
      
      {}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "40px" }}>
        <div className="checkout-step-container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: step >= 1 ? "var(--azul-link)" : "#ccc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold" }}>1</span>
          <span className="checkout-progress-text" style={{ fontSize: "14px", fontWeight: step === 1 ? "bold" : "500", color: step === 1 ? "var(--cinza-escuro)" : "var(--cinza-texto)" }}>Envio</span>
        </div>
        <div style={{ width: "60px", height: "2px", backgroundColor: step >= 2 ? "var(--azul-link)" : "#ccc" }}></div>
        <div className="checkout-step-container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: step >= 2 ? "var(--azul-link)" : "#ccc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold" }}>2</span>
          <span className="checkout-progress-text" style={{ fontSize: "14px", fontWeight: step === 2 ? "bold" : "500", color: step === 2 ? "var(--cinza-escuro)" : "var(--cinza-texto)" }}>Pagamento</span>
        </div>
        <div style={{ width: "60px", height: "2px", backgroundColor: step >= 3 ? "var(--azul-link)" : "#ccc" }}></div>
        <div className="checkout-step-container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: step >= 3 ? "var(--verde-promocao)" : "#ccc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold" }}>3</span>
          <span className="checkout-progress-text" style={{ fontSize: "14px", fontWeight: step === 3 ? "bold" : "500", color: step === 3 ? "var(--cinza-escuro)" : "var(--cinza-texto)" }}>Confirmação</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {}
        <div style={{ flex: 1.8, minWidth: "320px", display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {}
          {step === 1 && (
            <div className="checkout-card">
              <h2 style={{ fontSize: "20px", color: "var(--cinza-escuro)", marginBottom: "20px", fontWeight: "600" }}>Opções de Entrega</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                
                {}
                <div
                  onClick={() => { setDeliveryMethod("standard"); setSelectedStore(null); }}
                  style={{
                    border: deliveryMethod === "standard" ? "2px solid var(--azul-link)" : "1px solid var(--cinza-borda)",
                    borderRadius: "8px",
                    padding: "20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    backgroundColor: deliveryMethod === "standard" ? "rgba(52, 131, 250, 0.03)" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <input type="radio" checked={deliveryMethod === "standard"} readOnly style={{ accentColor: "var(--azul-link)" }} />
                  <Truck size={32} color="var(--azul-link)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "600", color: "var(--cinza-escuro)" }}>Enviar para meu endereço</span>
                      <span style={{ color: "var(--verde-promocao)", fontWeight: "bold" }}>Grátis</span>
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--cinza-texto)" }}>Chega em até 3 dias úteis</span>
                  </div>
                </div>

                {}
                <div
                  onClick={() => setDeliveryMethod("collect")}
                  style={{
                    border: deliveryMethod === "collect" ? "2px solid var(--azul-link)" : "1px solid var(--cinza-borda)",
                    borderRadius: "8px",
                    padding: "20px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    backgroundColor: deliveryMethod === "collect" ? "rgba(52, 131, 250, 0.03)" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <input type="radio" checked={deliveryMethod === "collect"} readOnly style={{ accentColor: "var(--azul-link)" }} />
                    <MapPin size={32} color="var(--azul-link)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "600", color: "var(--cinza-escuro)" }}>Retirar na Loja (Click & Collect)</span>
                        <span style={{ color: "var(--verde-promocao)", fontWeight: "bold" }}>Grátis</span>
                      </div>
                      <span style={{ fontSize: "13px", color: "var(--cinza-texto)" }}>Retire no mesmo dia ou agende</span>
                    </div>
                  </div>

                  {}
                  {deliveryMethod === "collect" && (
                    <div style={{ borderTop: "1px solid var(--cinza-borda)", paddingTop: "15px", marginTop: "5px" }} onClick={(e) => e.stopPropagation()}>
                      <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--cinza-escuro)", marginBottom: "8px" }}>Digite seu CEP para buscar lojas próximas:</p>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          type="text"
                          placeholder="00000-000"
                          value={cep}
                          onChange={handleCepChange}
                          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid var(--cinza-borda)", fontSize: "14px", outline: "none" }}
                        />
                        <button onClick={handleSearchStores} className="btn-primary" style={{ width: "auto", padding: "10px 25px" }}>Buscar Lojas</button>
                      </div>

                      {cepError && <p style={{ color: "#E02424", fontSize: "13px", marginTop: "8px" }}>{cepError}</p>}

                      {stores.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
                          <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--cinza-texto)" }}>Lojas Encontradas:</p>
                          {stores.map((store) => (
                            <div
                              key={store.id}
                              onClick={() => setSelectedStore(store)}
                              style={{
                                border: selectedStore?.id === store.id ? "2px solid var(--verde-promocao)" : "1px solid var(--cinza-borda)",
                                borderRadius: "6px",
                                padding: "12px",
                                cursor: "pointer",
                                backgroundColor: selectedStore?.id === store.id ? "#F3FAF5" : "var(--branco)",
                                transition: "all 0.2s"
                              }}
                            >
                              <div style={{ display: "flex", justifyItems: "center", gap: "8px" }}>
                                <input type="radio" checked={selectedStore?.id === store.id} readOnly style={{ accentColor: "var(--verde-promocao)", marginTop: "2px" }} />
                                <div>
                                  <span style={{ fontWeight: "bold", fontSize: "14px", color: "var(--cinza-escuro)" }}>{store.name}</span>
                                  <p style={{ fontSize: "12px", color: "var(--cinza-texto)", margin: "4px 0" }}>{store.address}</p>
                                  <p style={{ fontSize: "11px", color: "var(--verde-promocao)", fontWeight: "500", margin: 0 }}>{store.hours}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

              <button
                className="btn-primary"
                onClick={handleProceedToPayment}
                style={{ marginTop: "30px", padding: "14px", fontSize: "16px" }}
              >
                Continuar para o Pagamento
              </button>
            </div>
          )}

          {}
          {step === 2 && (
            <div className="checkout-card">
              
              {}
              <button 
                onClick={() => setStep(1)} 
                style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "5px", color: "var(--azul-link)", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginBottom: "20px" }}
              >
                <ArrowLeft size={16} /> Voltar para opções de entrega
              </button>

              <h2 style={{ fontSize: "20px", color: "var(--cinza-escuro)", marginBottom: "8px", fontWeight: "600" }}>Como você prefere pagar?</h2>
              <p style={{ fontSize: "14px", color: "var(--cinza-texto)", marginBottom: "25px" }}>Finalize seu pagamento com segurança no ambiente certificado.</p>

              {}
              <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                {[
                  { id: "credit_card", label: "Cartão de Crédito" },
                  { id: "pix", label: "Pix" },
                  { id: "boleto", label: "Boleto Bancário" }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => { setPaymentMethod(method.id); setPaymentErrors({}); }}
                    style={{
                      flex: 1,
                      padding: "12px 5px",
                      borderRadius: "6px",
                      border: paymentMethod === method.id ? "2px solid #009EE3" : "1px solid var(--cinza-borda)",
                      backgroundColor: paymentMethod === method.id ? "#E6F6FD" : "var(--branco)",
                      color: paymentMethod === method.id ? "#009EE3" : "var(--cinza-escuro)",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s"
                    }}
                  >
                    {method.label}
                  </button>
                ))}
              </div>

              {}
              
              {}
              {paymentMethod === "pix" && (
                <div style={{ textAlign: "center", padding: "20px", border: "1px dashed var(--cinza-borda)", borderRadius: "8px", backgroundColor: "#FAF9F9" }}>
                  <QrCode size={48} style={{ color: "#009EE3", marginBottom: "15px" }} />
                  <h3 style={{ fontSize: "16px", color: "var(--cinza-escuro)", marginBottom: "10px", fontWeight: "600" }}>Pagamento Instantâneo via Pix</h3>
                  <p style={{ fontSize: "14px", color: "var(--cinza-texto)", maxWidth: "380px", margin: "0 auto 15px auto", lineHeight: "1.4" }}>
                    Ao clicar em "Confirmar Pagamento", geraremos um QR Code Pix do Mercado Pago. O pagamento é aprovado na hora.
                  </p>
                </div>
              )}

              {}
              {paymentMethod === "boleto" && (
                <div style={{ textAlign: "center", padding: "20px", border: "1px dashed var(--cinza-borda)", borderRadius: "8px", backgroundColor: "#FAF9F9" }}>
                  <div style={{ fontSize: "36px", color: "#666", marginBottom: "10px" }}>║▌║█║▌│║▌║▌█</div>
                  <h3 style={{ fontSize: "16px", color: "var(--cinza-escuro)", marginBottom: "10px", fontWeight: "600" }}>Boleto Bancário</h3>
                  <p style={{ fontSize: "14px", color: "var(--cinza-texto)", maxWidth: "380px", margin: "0 auto 15px auto", lineHeight: "1.4" }}>
                    A aprovação do boleto leva de 1 a 2 dias úteis. Você poderá copiar a linha digitável ou baixar o PDF após a confirmação.
                  </p>
                </div>
              )}

              {}
              {paymentMethod === "credit_card" && (
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "20px",
                  border: "1px solid var(--cinza-borda)",
                  borderRadius: "12px",
                  padding: "25px",
                  backgroundColor: "#FAF9F9",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                }}>
                  
                  {}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px", color: "var(--cinza-escuro)" }}>Número do Cartão *</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        style={{ 
                          width: "100%", 
                          padding: "12px", 
                          paddingRight: "50px", 
                          border: paymentErrors.number ? "1.5px solid #E02424" : "1px solid var(--cinza-borda)", 
                          borderRadius: "8px", 
                          fontSize: "15px", 
                          outline: "none" 
                        }}
                      />
                      <div style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
                        {renderCardBrandIcon()}
                      </div>
                    </div>
                    {paymentErrors.number && <p style={{ color: "#E02424", fontSize: "12px", marginTop: "4px" }}>{paymentErrors.number}</p>}
                  </div>

                  {}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px", color: "var(--cinza-escuro)" }}>Nome do Titular (como está escrito no cartão) *</label>
                    <input
                      type="text"
                      placeholder="EX: M A SILVA"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{ 
                        width: "100%", 
                        padding: "12px", 
                        border: paymentErrors.name ? "1.5px solid #E02424" : "1px solid var(--cinza-borda)", 
                        borderRadius: "8px", 
                        fontSize: "15px", 
                        outline: "none", 
                        textTransform: "uppercase" 
                      }}
                    />
                    {paymentErrors.name && <p style={{ color: "#E02424", fontSize: "12px", marginTop: "4px" }}>{paymentErrors.name}</p>}
                  </div>

                  {}
                  <div style={{ display: "flex", gap: "15px" }}>
                    
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px", color: "var(--cinza-escuro)" }}>Validade *</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        style={{ 
                          width: "100%", 
                          padding: "12px", 
                          border: paymentErrors.expiry ? "1.5px solid #E02424" : "1px solid var(--cinza-borda)", 
                          borderRadius: "8px", 
                          fontSize: "15px", 
                          outline: "none" 
                        }}
                      />
                      {paymentErrors.expiry && <p style={{ color: "#E02424", fontSize: "12px", marginTop: "4px" }}>{paymentErrors.expiry}</p>}
                    </div>

                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px", color: "var(--cinza-escuro)" }}>Cód. Segurança (CVV) *</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={handleCardCvvChange}
                        style={{ 
                          width: "100%", 
                          padding: "12px", 
                          border: paymentErrors.cvv ? "1.5px solid #E02424" : "1px solid var(--cinza-borda)", 
                          borderRadius: "8px", 
                          fontSize: "15px", 
                          outline: "none" 
                        }}
                      />
                      {paymentErrors.cvv && <p style={{ color: "#E02424", fontSize: "12px", marginTop: "4px" }}>{paymentErrors.cvv}</p>}
                    </div>

                  </div>

                  {}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px", color: "var(--cinza-escuro)" }}>CPF do Titular do Cartão *</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cardCpf}
                      onChange={handleCardCpfChange}
                      style={{ 
                        width: "100%", 
                        padding: "12px", 
                        border: paymentErrors.cpf ? "1.5px solid #E02424" : "1px solid var(--cinza-borda)", 
                        borderRadius: "8px", 
                        fontSize: "15px", 
                        outline: "none" 
                      }}
                    />
                    {paymentErrors.cpf && <p style={{ color: "#E02424", fontSize: "12px", marginTop: "4px" }}>{paymentErrors.cpf}</p>}
                  </div>

                  {}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px", color: "var(--cinza-escuro)" }}>Escolha o parcelamento *</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      style={{ 
                        width: "100%", 
                        padding: "12px", 
                        border: "1px solid var(--cinza-borda)", 
                        borderRadius: "8px", 
                        fontSize: "15px", 
                        backgroundColor: "#fff", 
                        outline: "none" 
                      }}
                    >
                      <option value="1">1x de R$ {cartTotal.toFixed(2)} sem juros</option>
                      <option value="2">2x de R$ {(cartTotal / 2).toFixed(2)} sem juros</option>
                      <option value="3">3x de R$ {(cartTotal / 3).toFixed(2)} sem juros</option>
                      <option value="6">6x de R$ {(cartTotal / 6).toFixed(2)} sem juros</option>
                      <option value="12">12x de R$ {(cartTotal / 12).toFixed(2)} sem juros</option>
                    </select>
                  </div>

                </div>
              )}

              {}
              <button
                className="btn-primary"
                onClick={handleConfirmPayment}
                style={{ 
                  marginTop: "30px", 
                  padding: "15px", 
                  fontSize: "16px", 
                  backgroundColor: "#009EE3",
                  color: "#fff",
                  border: "none",
                  fontWeight: "bold",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#008ad2"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#009EE3"}
              >
                Confirmar Pagamento
              </button>

            </div>
          )}

          {}
          {step === 3 && (
            <div className="checkout-card" style={{ textAlign: "center" }}>
              <CheckCircle2 size={64} color="var(--verde-promocao)" style={{ marginBottom: "20px" }} />
              
              <h2 style={{ color: "var(--cinza-escuro)", fontSize: "24px", fontWeight: "600", marginBottom: "10px" }}>Compra Confirmada com Sucesso!</h2>
              <p style={{ color: "var(--cinza-texto)", fontSize: "15px", marginBottom: "30px" }}>
                Pronto! O seu pagamento foi processado e aprovado pelo Mercado Pago.
              </p>

              {}
              {deliveryMethod === "collect" && (
                <div style={{ border: "1px solid var(--cinza-borda)", borderRadius: "8px", padding: "20px", backgroundColor: "#F9FAF9", maxWidth: "450px", margin: "0 auto 30px auto" }}>
                  <h3 style={{ fontSize: "16px", color: "var(--cinza-escuro)", marginBottom: "12px", fontWeight: "600" }}>Código de Retirada (Click & Collect)</h3>
                  
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MegaLojaPedido12345"
                    alt="QR Code Retirada"
                    style={{ margin: "15px 0", border: "1px solid #ccc", padding: "8px", backgroundColor: "#fff", borderRadius: "4px" }}
                  />
                  
                  <p style={{ fontSize: "14px", color: "var(--cinza-escuro)", margin: "5px 0", fontWeight: "bold" }}>
                    Loja selecionada: {selectedStore?.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--cinza-texto)", margin: "4px 0" }}>
                    {selectedStore?.address}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--verde-promocao)", fontWeight: "500", marginTop: "10px", lineHeight: "1.4" }}>
                    Apresente este QR Code e um documento com foto no balcão de Click & Collect da loja para retirar seus produtos.
                  </p>
                </div>
              )}

              {}
              {paymentMethod === "pix" && (
                <div style={{ border: "1px solid var(--cinza-borda)", borderRadius: "8px", padding: "20px", backgroundColor: "#F9FAF9", maxWidth: "450px", margin: "0 auto 30px auto" }}>
                  <h3 style={{ fontSize: "15px", color: "var(--cinza-escuro)", marginBottom: "10px", fontWeight: "600" }}>Pague pelo QR Code ou Copie o Código Pix:</h3>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020101021226300014br.gov.bcb.pix2530mercado-pago-qr-code-ficticio"
                    alt="QR Code Pix"
                    style={{ margin: "15px 0", border: "1px solid #ccc", padding: "5px", backgroundColor: "#fff" }}
                  />
                  
                  <button
                    onClick={handleCopyPix}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#009EE3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <ClipboardCheck size={18} /> {pixCopied ? "Copiado!" : "Copiar Chave Pix"}
                  </button>
                </div>
              )}

              {}
              {paymentMethod === "boleto" && (
                <div style={{ border: "1px solid var(--cinza-borda)", borderRadius: "8px", padding: "20px", backgroundColor: "#F9FAF9", maxWidth: "450px", margin: "0 auto 30px auto" }}>
                  <h3 style={{ fontSize: "15px", color: "var(--cinza-escuro)", marginBottom: "12px", fontWeight: "600" }}>Boleto Fictício Gerado</h3>
                  <p style={{ fontSize: "13px", color: "var(--cinza-texto)", marginBottom: "15px" }}>
                    Você pode pagar este código em qualquer aplicativo bancário ou lotérica.
                  </p>
                  
                  <button
                    onClick={handleCopyBoleto}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#009EE3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <ClipboardCheck size={18} /> {boletoCopied ? "Copiado!" : "Copiar Código de Barras"}
                  </button>
                </div>
              )}

              <button
                className="btn-primary"
                onClick={() => navigate("/")}
                style={{ width: "auto", padding: "12px 35px", marginTop: "10px" }}
              >
                Voltar para a Página Inicial
              </button>
            </div>
          )}

        </div>

        {}
        {step !== 3 && (
          <div style={{ flex: 1, minWidth: "280px", backgroundColor: "var(--branco)", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "sticky", top: "20px" }}>
            <h3 style={{ fontSize: "17px", color: "var(--cinza-escuro)", marginBottom: "18px", fontWeight: "600", borderBottom: "1px solid var(--cinza-borda)", paddingBottom: "10px" }}>Resumo da compra</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "250px", overflowY: "auto", marginBottom: "20px", paddingRight: "5px" }}>
              {cart.map((item) => (
                <div key={item.cartItemId} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <img src={item.images[0]} alt={item.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--cinza-borda)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", color: "var(--cinza-escuro)", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>{item.title}</p>
                    <p style={{ fontSize: "12px", color: "var(--cinza-texto)", margin: "2px 0 0 0" }}>Qtd: {item.quantity} {item.selectedSize && `| Tam: ${item.selectedSize}`}</p>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "var(--cinza-escuro)" }}>R$ {(item.discountPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "var(--cinza-texto)", fontSize: "14px" }}>
              <span>Produtos ({cart.length})</span>
              <span>R$ {cartTotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "var(--cinza-texto)", fontSize: "14px" }}>
              <span>Envio</span>
              <span style={{ color: "var(--verde-promocao)", fontWeight: "bold" }}>Grátis</span>
            </div>

            {selectedStore && (
              <div style={{ backgroundColor: "#F3FAF5", padding: "10px", borderRadius: "4px", fontSize: "11px", color: "#2E7D32", marginBottom: "15px", border: "1.5px solid #C8E6C9" }}>
                <strong>Retirada em:</strong> {selectedStore.name}
              </div>
            )}
            
            <div style={{ height: "1px", backgroundColor: "var(--cinza-borda)", marginBottom: "15px" }}></div>
            
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cinza-escuro)", fontSize: "16px", fontWeight: "bold" }}>
              <span>Total</span>
              <span>R$ {cartTotal.toFixed(2)}</span>
            </div>

            {paymentMethod === "credit_card" && step === 2 && installments !== "1" && (
              <p style={{ fontSize: "11px", color: "var(--cinza-texto)", textAlign: "right", marginTop: "5px" }}>
                em {installments}x de R$ {(cartTotal / parseInt(installments)).toFixed(2)} sem juros
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Checkout;
