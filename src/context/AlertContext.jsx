import { createContext, useState, useContext } from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null); 

  const showAlert = (message, type = "info") => {
    return new Promise((resolve) => {
      setAlert({
        message,
        type,
        resolve
      });
    });
  };

  const closeAlert = () => {
    if (alert && alert.resolve) {
      alert.resolve();
    }
    setAlert(null);
  };

  const renderIcon = () => {
    switch (alert?.type) {
      case "success":
        return <CheckCircle size={40} color="var(--verde-promocao)" />;
      case "error":
        return <AlertTriangle size={40} color="#E02424" />;
      case "warning":
        return <AlertTriangle size={40} color="#D03801" />;
      default:
        return <Info size={40} color="var(--azul-link)" />;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          animation: "fadeIn 0.2s ease-out"
        }}>
          <div style={{
            backgroundColor: "var(--branco)",
            borderRadius: "12px",
            padding: "30px 25px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            position: "relative",
            animation: "scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            <button 
              onClick={closeAlert} 
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--cinza-texto)",
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={20} />
            </button>
            <div style={{ marginTop: "10px" }}>
              {renderIcon()}
            </div>
            <p style={{
              fontSize: "16px",
              color: "var(--cinza-escuro)",
              lineHeight: "1.5",
              margin: 0,
              fontWeight: "500"
            }}>
              {alert.message}
            </p>
            <button
              onClick={closeAlert}
              className="btn-primary"
              style={{
                width: "120px",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "10px"
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
