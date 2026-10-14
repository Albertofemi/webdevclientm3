export default function MealCard({ meal, onSelect }) {
  return (
    <button className="card" type="button" onClick={() => onSelect(meal.idMeal)}>
      <img src={`${meal.strMealThumb}/medium`} alt="" loading="lazy" width="500" height="500" />
      <span className="card-name">{meal.strMeal}</span>
    </button>
  );
}
