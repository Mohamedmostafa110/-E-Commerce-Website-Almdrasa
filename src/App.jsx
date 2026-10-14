import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="account" element={<Account />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="shop" element={<Shop />} />
        <Route path="products" element={<Shop />} />
        <Route path="search" element={<Shop search />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
