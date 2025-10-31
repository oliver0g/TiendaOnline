import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Cart({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, product:products(*)")
      .eq("user_id", user.id);
    if (error) alert("Error cargando carrito: " + error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleQuantityChange = async (id, quantity) => {
    await supabase.from("cart_items").update({ quantity }).eq("id", id);
    fetchCart();
  };

  const handleRemove = async (id) => {
    await supabase.from("cart_items").delete().eq("id", id);
    fetchCart();
  };

  const handleCheckout = async () => {
    if (!items.length) return alert("El carrito está vacío");

    // Crear orden
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ user_id: user.id }])
      .select()
      .single();
    if (orderError) return alert("Error al crear orden: " + orderError.message);

    // Crear items de la orden
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      size: item.product.category.toLowerCase() === "playera" ? item.size : null,
      price: item.product.price
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) return alert("Error al crear items: " + itemsError.message);

    // Vaciar carrito
    const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", user.id);
    if (cartError) return alert("Error al vaciar carrito: " + cartError.message);

    alert("✅ Pedido realizado correctamente!");
    fetchCart();
  };

  if (loading) return <p>Cargando carrito...</p>;
  if (!items.length) return <p>El carrito está vacío</p>;

  return (
    <div>
      <h2>🛒 Carrito</h2>
      {items.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10, display: "flex", gap: 10 }}>
          {item.product.image_url && <img src={item.product.image_url} alt={item.product.name} width={100} />}
          <div>
            <p><strong>{item.product.name}</strong></p>
            <p>${item.product.price}</p>
            {item.product.category.toLowerCase() === "playera" && (
              <select
                value={item.size || ""}
                onChange={async (e) => {
                  await supabase.from("cart_items").update({ size: e.target.value }).eq("id", item.id);
                  fetchCart();
                }}
              >
                <option value="">Selecciona talla</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            )}
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
            />
            <button onClick={() => handleRemove(item.id)}>Eliminar</button>
          </div>
        </div>
      ))}
      <button onClick={handleCheckout} style={{ marginTop: 20 }}>
        🛒 Finalizar compra
      </button>
    </div>
  );
}
