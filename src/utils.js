export const friendlyError = (err) =>
  err instanceof TypeError
    ? 'Could not reach TheMealDB. Check your connection.'
    : err.message;

// The API exposes ingredients as strIngredient1..20 / strMeasure1..20.
export function getIngredients(meal) {
  return Array.from({ length: 20 }, (_, i) => ({
    name: meal[`strIngredient${i + 1}`]?.trim(),
    measure: meal[`strMeasure${i + 1}`]?.trim(),
  })).filter((item) => item.name);
}

export function getSteps(meal) {
  return (meal.strInstructions ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
