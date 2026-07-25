import type { AnalyzeResponse } from "./types";

export const MOCK_RESULTS: AnalyzeResponse = {
  items: [
    { name: "Whole milk", quantity: "1 carton", confidence: "high" },
    { name: "Eggs", quantity: "6", confidence: "high" },
    { name: "Spinach", quantity: "1 bag", confidence: "low" },
    { name: "Cherry tomatoes", quantity: "1 pint", confidence: "high" },
    { name: "Leftover pasta", quantity: "1 container", confidence: "low" },
    { name: "Sharp cheddar cheese", quantity: "1 block", confidence: "high" },
    { name: "Butter", quantity: "1 stick", confidence: "high" },
    { name: "Greek yogurt", quantity: "2 cups", confidence: "high" },
    { name: "Orange juice", quantity: "1 bottle", confidence: "high" },
    { name: "Carrots", quantity: "1 bunch", confidence: "high" },
  ],
  recipes: [
    {
      title: "Spinach and cheddar omelette",
      usesItems: ["Eggs", "Spinach", "Sharp cheddar cheese"],
    },
    {
      title: "Tomato pasta bake",
      usesItems: ["Cherry tomatoes", "Leftover pasta", "Sharp cheddar cheese"],
      missingItems: ["Garlic", "Olive oil"],
    },
  ],
  priority: [
    {
      name: "Leftover pasta",
      reason: "Unlabeled container, estimated to be closest to spoiling",
      expiresOn: "2026-07-23",
    },
    {
      name: "Spinach",
      reason: "Leaves appear wilted in the photo",
      expiresOn: "2026-07-24",
    },
  ],
  shopping: [
    {
      name: "Garlic",
      reason: "Needed for the tomato pasta bake recipe",
    },
    {
      name: "Whole milk",
      reason: "Only one carton left",
    },
  ],
};
