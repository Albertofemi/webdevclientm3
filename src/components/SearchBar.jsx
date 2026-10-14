export default function SearchBar({ query, onQueryChange, sort, onSortChange }) {
  return (
    <form id="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="search" className="sr-only">Search meals by name</label>
      <input
        id="search"
        type="search"
        placeholder="Search meals, e.g. arrabiata"
        autoComplete="off"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <label htmlFor="sort" className="sr-only">Sort order</label>
      <select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value)}>
        <option value="asc">A to Z</option>
        <option value="desc">Z to A</option>
      </select>
    </form>
  );
}
