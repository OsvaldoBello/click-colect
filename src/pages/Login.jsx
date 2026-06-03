import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Erro ao fazer login.");
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
      <div
        style={{
          backgroundColor: "var(--branco)",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
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
            Bem-vindo de volta!
          </h1>
          <p style={{ color: "var(--cinza-texto)", fontSize: "14px" }}>
            Entre com seus dados para continuar
          </p>
        </div>

        {error && (
          <div style={{ color: "#E02424", backgroundColor: "#FDF2F2", padding: "12px", borderRadius: "4px", fontSize: "14px", border: "1px solid #FBD5D5", marginBottom: "20px", textAlign: "center", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                color: "var(--cinza-texto)",
              }}
            >
              <input type="checkbox" /> Lembrar de mim
            </label>
            <Link to="#" style={{ color: "var(--azul-link)" }}>
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "10px" }}
          >
            Entrar
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
          Não tem conta?{" "}
          <Link
            to="/cadastro"
            style={{ color: "var(--azul-link)", fontWeight: "600" }}
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
