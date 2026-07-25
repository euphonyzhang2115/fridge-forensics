import type { AnalyzeResponse } from "@/types";

interface ResultPanelsProps {
  results: AnalyzeResponse;
}

export default function ResultPanels({ results }: ResultPanelsProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <section className="rounded-2xl border border-[color:var(--border-strong)] bg-card p-8">
        <h2 className="text-base font-bold text-accent">Recipes</h2>
        {results.recipes.length === 0 ? (
          <p className="mt-3 text-base font-normal text-muted">
            No recipe suggestions.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {results.recipes.map((recipe) => (
              <li key={recipe.title} className="flex flex-col gap-1">
                <h3 className="text-base font-bold">{recipe.title}</h3>
                <p className="text-base font-normal text-muted">
                  Uses: {recipe.usesItems.join(", ")}
                </p>
                {recipe.missingItems && recipe.missingItems.length > 0 && (
                  <p className="text-base font-normal text-muted">
                    Missing: {recipe.missingItems.join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-[color:var(--border-subtle)] bg-card p-6">
        <h2 className="text-base font-bold">Priority</h2>
        {results.priority.length === 0 ? (
          <p className="mt-3 text-base font-normal text-muted">
            Nothing needs urgent attention.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {results.priority.map((item) => (
              <li key={item.name} className="flex flex-col gap-1">
                <h3 className="text-base font-bold">{item.name}</h3>
                <p className="text-base font-normal text-muted">
                  {item.reason}
                </p>
                {item.expiresOn && (
                  <p className="text-base font-normal text-muted">
                    Expires: {item.expiresOn}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-[color:var(--border-subtle)] bg-card p-6">
        <h2 className="text-base font-bold">Shopping</h2>
        {results.shopping.length === 0 ? (
          <p className="mt-3 text-base font-normal text-muted">
            Nothing to buy.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {results.shopping.map((item) => (
              <li key={item.name} className="flex flex-col gap-1">
                <h3 className="text-base font-bold">{item.name}</h3>
                <p className="text-base font-normal text-muted">
                  {item.reason}
                </p>
              </li>
            ))}
          </ul>
        )}

        {results.unlock && (
          <div className="mt-6 rounded-xl border border-[color:var(--border-strong)] bg-card px-4 py-3">
            <p className="text-base font-bold text-accent">
              Buy {results.unlock.item} to unlock {results.unlock.unlocks.length}{" "}
              more {results.unlock.unlocks.length === 1 ? "recipe" : "recipes"}
            </p>
            <p className="text-base font-normal text-muted">
              {results.unlock.unlocks.join(", ")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
