import MealCard from './MealCard.jsx';

export default function MealGrid({ meals, onSelect }) {
  return (
    <section className="grid" aria-label="Meals">
      {meals.map((meal) => (
        <MealCard key={meal.idMeal} meal={meal} onSelect={onSelect} />
      ))}
    </section>
  );
}
