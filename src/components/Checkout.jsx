import { supabase } from '../supabaseClient'

export default function Checkout({ user, cart }) {
  const checkout = async () => {
    const total = cart.reduce((sum, i) => sum + i.quantity * i.price, 0)
    const { data, error } = await supabase
      .from('orders')
      .insert([{ user_id: user.id, total, status: 'pendiente' }])
      .select()
      .single()

    if (error) return alert(error.message)
    alert('Pedido confirmado ✅')
  }

  return (
    <button onClick={checkout}>Finalizar compra</button>
  )
}
