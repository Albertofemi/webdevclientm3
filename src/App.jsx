import { useMemo, useState } from 'react';
import { paths } from './api.js';
import { clearCache, cacheStats } from './cache.js';
import { useFetch } from './hooks/useFetch.js';
import { useDebounce } from './hooks/useDebounce.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import SearchBar from './components/SearchBar.jsx';
import CategoryChips from './components/CategoryChips.jsx';
import Status from './components/Status.jsx';
import MealGrid from './components/MealGrid.jsx';
import MealDetail from './components/MealDetail.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  // ---- State: the only things the user can change ----
  const [query, setQuery] = useState('');
  const [category, setCategory] = useLocalStorage('category', null);
  const [sort, setSort] = useLocalStorage('sort', 'asc');
  const [selectedId, setSelectedId] = useState(null);
  const [cacheVersion, setCacheVersion] = useState(0);

  // ---- Derived values: computed from state, never stored ----
  const searchTerm = useDebounce(query.trim(), 350);

  const categoriesReq = useFetch(paths.categories);
  const categories = categoriesReq.data?.categories ?? [];
  const activeCategory = searchTerm ? null : (category ?? categories[0]?.strCategory ?? null);

  const listPath = searchTerm
    ? paths.search(searchTerm)
    : activeCategory
      ? paths.byCategory(activeCategory)
      : null;
  const mealsReq = useFetch(listPath);

  // While the category list itself is loading (or failed), it drives the status area.
  const listReq = listPath ? mealsReq : categoriesReq;

  const meals = useMemo(() => {
    const list = mealsReq.data?.meals ?? []; // the API returns null when nothing matches
    return [...list].sort((a, b) =>
      sort === 'asc' ? a.strMeal.localeCompare(b.strMeal) : b.strMeal.localeCompare(a.strMeal)
    );
  }, [mealsReq.data, sort]);

  const stats = useMemo(
    () => cacheStats(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mealsReq.status, categoriesReq.status, selectedId, cacheVersion]
  );

  const title = searchTerm
    ? `“${searchTerm}” · Async Odyssey`
    : activeCategory
      ? `${activeCategory} · Async Odyssey`
      : 'Async Odyssey';

  const emptyMessage = searchTerm
    ? `No meals match “${searchTerm}”. Try another name.`
    : `No meals found in ${activeCategory}.`;

  // ---- Event handlers just update state; the UI follows ----
  const handleSelectCategory = (name) => {
    setQuery('');
    setCategory(name);
  };

  const handleClearCache = () => {
    clearCache();
    setCacheVersion((v) => v + 1);
  };

  return (
    <>
      <title>{title}</title>

      <header className="top">
        <h1>Reactor Core</h1>
        <p className="lede">Find a recipe. Every request is fetched once, then remembered.</p>
        <SearchBar query={query} onQueryChange={setQuery} sort={sort} onSortChange={setSort} />
        <CategoryChips categories={categories} active={activeCategory} onSelect={handleSelectCategory} />
      </header>

      <main>
        <Status
          status={listReq.status}
          error={listReq.error}
          isEmpty={listReq.status === 'success' && meals.length === 0}
          emptyMessage={emptyMessage}
          onRetry={listReq.refetch}
        />
        <MealGrid meals={meals} onSelect={setSelectedId} />
      </main>

      <Footer
        fromCache={mealsReq.status === 'success' ? mealsReq.fromCache : null}
        stats={stats}
        onClear={handleClearCache}
      />

      {selectedId && (
        <MealDetail key={selectedId} id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}
