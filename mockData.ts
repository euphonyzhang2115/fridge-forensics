import type { AnalyzeResponse } from "./types";

export const mockAnalyzeResponse: AnalyzeResponse = {
  summary:
    "Fridge contains mostly dairy and produce. Two items are past their estimated expiry and should be checked.",
  items: [
    {
      name: "Whole milk",
      quantity: 1,
      category: "dairy",
      confidence: 0.94,
      estimatedExpiry: "2026-07-28",
    },
    {
      name: "Eggs",
      quantity: 6,
      category: "dairy",
      confidence: 0.88,
      estimatedExpiry: "2026-08-10",
    },
    {
      name: "Spinach",
      quantity: 1,
      category: "produce",
      confidence: 0.81,
      estimatedExpiry: "2026-07-24",
      notes: "Leaves appear wilted in image",
    },
    {
      name: "Cherry tomatoes",
      quantity: 1,
      category: "produce",
      confidence: 0.76,
      estimatedExpiry: "2026-07-30",
    },
    {
      name: "Leftover pasta",
      quantity: 1,
      category: "leftovers",
      confidence: 0.62,
      estimatedExpiry: "2026-07-23",
      notes: "Unlabeled container, expiry is a rough estimate",
    },
    {
      name: "Sharp cheddar cheese",
      quantity: 1,
      category: "dairy",
      confidence: 0.9,
      estimatedExpiry: "2026-08-20",
    },
  ],
  warnings: [
    "Spinach appears to be past peak freshness.",
    "Leftover pasta has no visible date label — estimate only.",
  ],
  analyzedAt: "2026-07-25T14:32:00.000Z",
};
