export default function SearchBar({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Buscar producto..."
      onChange={e => onSearch(e.target.value)}
    />
  )
}
