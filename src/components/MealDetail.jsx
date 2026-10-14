import { useEffect, useRef } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import { paths } from '../api.js';
import { friendlyError, getIngredients, getSteps } from '../utils.js';

export default function MealDetail({ id, onClose }) {
  const dialogRef = useRef(null);
  const { status, data, error, refetch } = useFetch(paths.meal(id));
  const meal = data?.meals?.[0];

  // Open the native <dialog> as a modal once it is mounted.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="detail-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {(status === 'loading' || status === 'idle') && (
        <p className="dialog-status">Loading recipe…</p>
      )}

      {status === 'error' && (
        <>
          <p className="dialog-status is-error">{friendlyError(error)}</p>
          <div className="dialog-actions">
            <button type="button" onClick={refetch}>Try again</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </>
      )}

      {status === 'success' && !meal && (
        <>
          <p className="dialog-status is-error">This recipe no longer exists.</p>
          <div className="dialog-actions">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </>
      )}

      {status === 'success' && meal && (
        <>
          <img className="detail-img" src={`${meal.strMealThumb}/medium`} alt={meal.strMeal} />
          <div className="detail-body">
            <h2 id="detail-title">{meal.strMeal}</h2>
            <p className="meta">{[meal.strCategory, meal.strArea].filter(Boolean).join(', ')}</p>

            <h3>Ingredients</h3>
            <ul className="ingredients">
              {getIngredients(meal).map(({ name, measure }, i) => (
                <li key={`${name}-${i}`}>
                  <span>{measure}</span>
                  {name}
                </li>
              ))}
            </ul>

            <h3>Method</h3>
            <div className="method">
              {getSteps(meal).map((step, i) => (
                <p key={i}>{step}</p>
              ))}
            </div>

            <div className="dialog-actions">
              <button type="button" onClick={onClose}>Close</button>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
