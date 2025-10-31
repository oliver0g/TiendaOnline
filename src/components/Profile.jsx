import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Profile({ profile }) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: profile.id,
      full_name: fullName,
      phone,
      address,
      role: profile.role, // nunca cambiar
    });
    setLoading(false);
    if (error) alert("Error al guardar perfil: " + error.message);
    else alert("Perfil actualizado ✅");
  };

  return (
    <div>
      <h2>👤 Perfil</h2>
      <div>
        <label>Nombre completo:</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div>
        <label>Teléfono:</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <label>Dirección:</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <button onClick={handleSave} disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}
