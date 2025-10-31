import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Cargar pedidos
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total,
        order_items(
          id,
          quantity,
          size,
          price,
          product:products(name, category, image_url)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error cargando pedidos: " + error.message);
    } else {
      // ✅ Asegura que total siempre tenga valor
      const ordersWithTotal = data.map((o) => {
        const calcTotal = o.order_items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        return { ...o, total: o.total || calcTotal };
      });
      setOrders(ordersWithTotal);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  if (loading) return <p>Cargando pedidos...</p>;
  if (!orders.length) return <p>No tienes pedidos aún.</p>;

  return (
    <div>
      <h2>📦 Historial de pedidos</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 15,
            padding: 10,
          }}
        >
          <p>
            <strong>Pedido #{order.id}</strong> -{" "}
            {new Date(order.created_at).toLocaleString()} - Total: $
            {order.total.toFixed(2)}
          </p>

          <h4>Items:</h4>
          {order.order_items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 5,
                alignItems: "center",
              }}
            >
              {item.product.image_url && (
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  width={50}
                />
              )}
              <div>
                <p>{item.product.name}</p>
                <p>Cantidad: {item.quantity}</p>
                <p>Precio unitario: ${item.price}</p>
                {item.product.category.toLowerCase() === "playera" && item.size && (
                  <p>Talla: {item.size}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
