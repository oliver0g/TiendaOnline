export default function CategoryFilter({ categories, onSelect }) {
  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">Todas las categorías</option>
      {categories.map(c => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  )
}
