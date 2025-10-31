import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", image_url: "", is_active: true });

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async () => {
    const { error } = await supabase.from("products").insert([{ ...newProduct }]);
    if (!error) {
      alert("Producto agregado!");
      setNewProduct({ name: "", description: "", price: "", image_url: "", is_active: true });
      fetchProducts();
    } else alert(error.message);
  };

  const toggleActive = async (id, current) => {
    const { error } = await supabase.from("products").update({ is_active: !current }).eq("id", id);
    if (!error) fetchProducts();
  };

  return (
    <div>
      <h2>Admin Panel - Productos</h2>
      <input placeholder="Nombre" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
      <input placeholder="Descripción" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
      <input placeholder="Precio" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
      <input placeholder="URL Imagen" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} />
      <button onClick={addProduct}>Agregar producto</button>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - ${p.price} - {p.is_active ? "Activo" : "Inactivo"}
            <button onClick={() => toggleActive(p.id, p.is_active)}>Toggle Active</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
