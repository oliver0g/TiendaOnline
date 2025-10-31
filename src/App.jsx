import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import ProductList from "./components/ProductList";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState("products");
  const [fullName, setFullName] = useState(""); // Para registro

  // 🔐 Detectar sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // 👤 Cargar perfil
  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (!error) setProfile(data);
      };
      fetchProfile();
    } else setProfile(null);
  }, [session]);

  // 🔑 Registro normal
  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!fullName) return alert("Ingresa tu nombre completo");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: "customer" } },
    });
    if (error) alert("Error: " + error.message);
    else alert("Usuario registrado, revisa tu correo para verificarlo");
  };

  // 🔑 Login normal
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
  };

  // 🔑 Login con Google OAuth
  const handleLoginWithGoogle = async () => {
    await supabase.auth.signOut(); // cerrar sesión previa
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) alert("Error al iniciar con Google: " + error.message);
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  // 🧭 Navegación
  const NavBar = () => (
    <nav style={{ marginBottom: 20 }}>
      <button onClick={() => setView("products")}>🛍️ Productos</button>
      {session && (
        <>
          <button onClick={() => setView("profile")}>👤 Perfil</button>
          <button onClick={() => setView("cart")}>🛒 Carrito</button>
          <button onClick={() => setView("orders")}>📦 Pedidos</button>
        </>
      )}
      {profile?.role === "admin" && <button onClick={() => setView("admin")}>⚙️ Admin Panel</button>}
      {session && <button onClick={handleLogout}>🚪 Cerrar sesión</button>}
    </nav>
  );

  // 🏠 Visitante (registro + login)
  if (!session)
    return (
      <div style={{ padding: 20 }}>
        <h1>🛒 Mercado del Hype</h1>

        <h2>Registro</h2>
        <form onSubmit={handleRegister}>
          <input
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input name="email" type="email" placeholder="Correo" required />
          <input name="password" type="password" placeholder="Contraseña" required />
          <button type="submit">Registrarse</button>
        </form>

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Correo" required />
          <input name="password" type="password" placeholder="Contraseña" required />
          <button type="submit">Iniciar sesión</button>
        </form>

        <button onClick={handleLoginWithGoogle}>🔐 Iniciar con Google</button>

        <hr />
        <ProductList />
      </div>
    );

  // 👑 Usuario autenticado
  return (
    <div style={{ padding: 20 }}>
      <h1>🛍️ Bienvenido, {profile?.full_name || "Usuario"}!</h1>
      <NavBar />
{view === "products" && <ProductList user={session.user} />}
      {view === "profile" && <Profile profile={profile} setProfile={setProfile} />}
      {view === "cart" && <Cart user={session.user} />}
      {view === "orders" && <Orders user={session.user} />}
      {view === "admin" && profile?.role === "admin" && <AdminPanel />}
    </div>
  );
}
