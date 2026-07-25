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

// Captured verbatim from a real /api/analyze call against public/demo-fridge.jpg.
// Used by DEMO_MODE (see config.ts) to serve a canned response without calling the model.
export const DEMO_RESULTS: AnalyzeResponse = {
  items: [
    { name: "Cauliflower", quantity: "1 head", confidence: "high" },
    { name: "Green cabbage", quantity: "1 head", confidence: "high" },
    { name: "Cucumbers", quantity: "6-7", confidence: "high" },
    { name: "Red cabbage", quantity: "1 head", confidence: "high" },
    { name: "Radishes", quantity: "1 bowl (~8)", confidence: "high" },
    { name: "Bottled water", quantity: "3 bottles", confidence: "high" },
    { name: "Yogurt drinks", quantity: "2 small bottles", confidence: "low" },
    { name: "Milk", quantity: "1 bottle", confidence: "high" },
    { name: "Hard yellow cheese", quantity: "1 large block", confidence: "high" },
    { name: "Eggs", quantity: "1 dozen carton", confidence: "high" },
    {
      name: "Leftovers in plastic containers",
      quantity: "2 containers",
      confidence: "low",
    },
    {
      name: "Bell peppers (red, yellow, orange)",
      quantity: "4",
      confidence: "high",
    },
    { name: "Green onions / scallions", quantity: "1 bunch", confidence: "high" },
    { name: "Leaf lettuce", quantity: "1 head", confidence: "high" },
  ],
  recipes: [
    {
      title: "Cheese and Pepper Omelette with Scallions",
      usesItems: [
        "Eggs",
        "Hard yellow cheese",
        "Bell peppers (red, yellow, orange)",
        "Green onions / scallions",
        "Milk",
      ],
      missingItems: ["Butter"],
    },
    {
      title: "Crunchy Cabbage, Radish and Cucumber Slaw",
      usesItems: [
        "Red cabbage",
        "Green cabbage",
        "Cucumbers",
        "Radishes",
        "Green onions / scallions",
      ],
      missingItems: ["Mayonnaise", "Apple cider vinegar"],
    },
    {
      title: "Roasted Cauliflower Cheese Bake",
      usesItems: ["Cauliflower", "Hard yellow cheese", "Milk"],
      missingItems: ["Butter", "Flour", "Dijon mustard"],
    },
  ],
  priority: [
    {
      name: "Leaf lettuce",
      reason: "Leafy greens typically stay crisp only about 3-5 days in the fridge",
    },
    {
      name: "Milk",
      reason: "Opened milk is typically good for about a week",
    },
    {
      name: "Cucumbers",
      reason: "Whole cucumbers usually keep about a week before turning soft",
    },
  ],
  shopping: [
    {
      name: "Butter",
      reason: "Needed for the omelette and cauliflower cheese bake",
    },
    {
      name: "Mayonnaise",
      reason: "Dressing base for the cabbage slaw",
    },
    {
      name: "Apple cider vinegar",
      reason: "Adds tang to the slaw dressing",
    },
    {
      name: "Dijon mustard",
      reason: "Flavors the cheese sauce in the cauliflower bake",
    },
  ],
};
