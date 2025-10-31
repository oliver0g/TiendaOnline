import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  // 🔄 Cargar productos
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🛒 Agregar al carrito
  const addToCart = async (product) => {
    if (!user) return alert("Debes iniciar sesión para agregar productos al carrito");

    let size = null;
    if (product.category?.toLowerCase() === "playera") {
      size = prompt("Selecciona talla (S, M, L, XL):");
      if (!size) return alert("Debes seleccionar una talla");
    }

    const { error } = await supabase.from("cart_items").upsert({
      user_id: user.id,
      product_id: product.id,
      quantity: 1,
      size,
    });

    if (error) alert("Error agregando al carrito: " + error.message);
    else alert("Producto agregado ✅");
  };

  // 🧩 Filtro por categoría
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div>
      <h2>🛍️ Productos</h2>

      {/* 🔽 Filtro de categorías */}
      {categories.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <strong>Categorías:</strong>{" "}
          <button onClick={() => setSelectedCategory("all")}>Todas</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 🧱 Listado de productos */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                margin: 10,
                padding: 10,
                width: 200,
                textAlign: "center",
              }}
            >
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                />
              )}
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>
                <em>📂 {p.category}</em>
              </p>
              <strong>${p.price}</strong>
              <br />
              <button onClick={() => addToCart(p)} style={{ marginTop: 5 }}>
                🛒 Agregar al carrito
              </button>
            </div>
          ))
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
}
