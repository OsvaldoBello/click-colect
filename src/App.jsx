import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AlertProvider } from "./context/AlertContext";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Register />} />
                <Route path="/categoria/:nomeCategoria" element={<Category />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/busca" element={<Search />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
