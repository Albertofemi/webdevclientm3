export default function CategoryChips({ categories, active, onSelect }) {
  return (
    <nav id="categories" aria-label="Categories">
      {categories.map(({ strCategory }) => (
        <button
          key={strCategory}
          type="button"
          className="chip"
          aria-pressed={strCategory === active}
          onClick={() => onSelect(strCategory)}
        >
          {strCategory}
        </button>
      ))}
    </nav>
  );
}
