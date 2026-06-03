import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Erro ao realizar cadastro.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 150px)",
        padding: "20px",
      }}
    >
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{
              color: "var(--azul-escuro)",
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            MegaLoja
          </h2>
          <h1
            style={{
              fontSize: "22px",
              color: "var(--cinza-escuro)",
              marginBottom: "5px",
            }}
          >
            Crie sua conta
          </h1>
          <p style={{ color: "var(--cinza-texto)", fontSize: "14px" }}>
            Cadastre-se para começar suas compras
          </p>
        </div>

        {error && (
          <div style={{ color: "#E02424", backgroundColor: "#FDF2F2", padding: "12px", borderRadius: "4px", fontSize: "14px", border: "1px solid #FBD5D5", marginBottom: "20px", textAlign: "center", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "5px",
                color: "var(--cinza-escuro)",
              }}
            >
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--cinza-borda)",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "5px",
                color: "var(--cinza-escuro)",
              }}
            >
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--cinza-borda)",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "5px",
                color: "var(--cinza-escuro)",
              }}
            >
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--cinza-borda)",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "5px",
                color: "var(--cinza-escuro)",
              }}
            >
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--cinza-borda)",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "10px" }}
          >
            Criar conta
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "14px",
            color: "var(--cinza-texto)",
          }}
        >
          Já tem uma conta?{" "}
          <Link
            to="/login"
            style={{ color: "var(--azul-link)", fontWeight: "600" }}
          >
            Entre
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
