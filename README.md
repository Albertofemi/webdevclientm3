# Reactor Core

The Async Odyssey recipe finder rebuilt in React 19 + Vite, using the public [TheMealDB](https://www.themealdb.com/api.php) API.

```bash
npm install
npm run dev
npm run build
```

## Structure

```
src/
  App.jsx                 state + derived values, composes the components
  api.js                  endpoint paths
  cache.js                localStorage cache with 24 h TTL
  utils.js                friendlyError, getIngredients, getSteps
  hooks/
    useFetch.js           BONUS: fetch + loading/error/success + cache + abort
    useLocalStorage.js    BONUS: useState that persists (category, sort)
    useDebounce.js        delays the search term
  components/
    SearchBar, CategoryChips, Status, MealGrid, MealCard, MealDetail, Footer
```

## Mission checklist

- Components and props: one component per piece of UI, data flows down as props, events flow up as callbacks
- State: `query`, `category`, `sort`, `selectedId`; everything else (search term, active category, request path, sorted list, page title) is derived during render
- Effects: `useFetch` (request + abort on cleanup), `useDebounce` (timer cleanup), `useLocalStorage` (persist), `MealDetail` (open the dialog)
- React 19: `<title>` rendered from the component, `ref` used directly, `StrictMode` safe
- BONUS: three reusable custom hooks

---

## AI usage

**Author:** Alberto Fernández · **Mission:** M3 · Reactor Core

| | |
|---|---|
| Tool | Claude (Anthropic), via the claude.ai chat interface |
| Input I gave it | The mission brief, pasted verbatim (rebuild the M2 app in React 19: components, props, state, effects; UI driven by state; bonus custom hook) |
| Choices made by the AI | Keeping the same TheMealDB app as M2, the component split, which values are state and which are derived, the three custom hooks, reusing `cache.js` and `style.css` from M2 |
| What the AI generated | The whole project: `vite.config.js`, `package.json`, `src/App.jsx`, all components, all hooks, `utils.js`, `api.js`, this README |
| What the AI did *not* do | It did not run `npm install`, start Vite, render the components or call the real API (its sandbox had no network access) |

**TODO (Alberto): complete this part honestly before submitting.**
- What I changed or rewrote myself:
- What I tested by hand:
- Parts I can explain without the AI's help:

## AI autopsy

### What worked well
- A clear separation between **state** (`query`, `category`, `sort`, `selectedId`) and **derived values** (search term, active category, request path, sorted list, title). Handlers only call setters, so the UI follows the state.
- `useFetch` aborts in-flight requests in its effect cleanup, which removes the manual race-condition guard from M2.
- Preferences (`category`, `sort`) use a separate localStorage prefix from the cache, so "Clear cache" does not delete them.

### What went wrong during the work
- **A tooling mistake in the AI's own process:** the first project-creation script used shell brace expansion (`mkdir -p src/{hooks,components}`) in a shell that does not support it. It created a folder literally named `{hooks,components}` and the next command failed. This was caught because the command returned an error, the folder was removed, and the files were rewritten. It is a reminder that AI-run commands need their output read, not just their intent trusted.

### What was NOT verified
- **No runtime test.** Only a bracket-balance check on the source files was done. No component has been rendered; there is no build, no unit test and no ESLint run.
- **React 19 `<title>`.** The page title is rendered from `App` and relies on React 19 hoisting it into `<head>`. The static title was removed from `index.html` for that reason. This was reasoned from the React 19 documentation as the model remembers it, not tested.
- **API details** (endpoints, field names, test key `1`, `/medium` thumbnails) come from model memory and were not checked against the live API.
- **Package versions** in `package.json` (`react ^19`, `vite ^5.4`, `@vitejs/plugin-react ^4.3.4`) were not verified against npm.

### Known weaknesses and limitations
- `useFetch` calls `setState` synchronously inside an effect for the cache-hit and idle cases. It works, but newer React lint rules (`react-hooks`) may flag it; a `useSyncExternalStore` or a derived-state approach would be cleaner.
- `cacheStats()` reads localStorage during render (wrapped in `useMemo` with a manual dependency list and an `eslint-disable` comment). That is an impure read and the dependency list is a workaround, not a principled design.
- Two components calling `useFetch` with the same path do not share one request (no request deduplication). A library such as TanStack Query solves this properly.
- In development, `StrictMode` mounts effects twice, so the first request is aborted and repeated. This is expected, but it can look like a bug in the Network tab.
- Same limitations as M2: TTL-only cache invalidation, no pagination, Google Fonts dependency, shared free API key, no automated tests.

### Risks of relying on AI here
- Be able to explain *why* each value is state or derived, what each effect's cleanup does, and why `key` props are used in the lists.
- The "custom hook" bonus is only worth credit if I can explain the hook's contract (inputs, returned object, when it refetches).

### Verification checklist (to run myself)
- [ ] `npm install && npm run dev` starts without errors or console warnings
- [ ] Changing category or search updates the grid; the page title changes
- [ ] Reload: the last category and sort order are restored
- [ ] Network tab: repeated requests are served from cache; "Clear cache" resets the counter
- [ ] Offline mode shows the error state; "Try again" recovers
- [ ] Detail dialog opens and closes (button, Escape, backdrop) and shows its own loading/error states
- [ ] `npm run build` succeeds
