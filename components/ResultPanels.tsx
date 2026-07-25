import type { AnalyzeResponse } from "@/types";

interface ResultPanelsProps {
  results: AnalyzeResponse;
}

export default function ResultPanels({ results }: ResultPanelsProps) {
  return (
    <div>
      <section>
        <h2>Recipes</h2>
        {results.recipes.length === 0 ? (
          <p>No recipe suggestions.</p>
        ) : (
          <ul>
            {results.recipes.map((recipe) => (
              <li key={recipe.title}>
                <h3>{recipe.title}</h3>
                <p>Uses: {recipe.usesItems.join(", ")}</p>
                {recipe.missingItems && recipe.missingItems.length > 0 && (
                  <p>Missing: {recipe.missingItems.join(", ")}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Priority</h2>
        {results.priority.length === 0 ? (
          <p>Nothing needs urgent attention.</p>
        ) : (
          <ul>
            {results.priority.map((item) => (
              <li key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.reason}</p>
                {item.expiresOn && <p>Expires: {item.expiresOn}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Shopping</h2>
        {results.shopping.length === 0 ? (
          <p>Nothing to buy.</p>
        ) : (
          <ul>
            {results.shopping.map((item) => (
              <li key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
