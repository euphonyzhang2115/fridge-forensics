export interface Item {
  name: string;
  quantity: string;
  confidence: "high" | "low";
}

export interface Recipe {
  title: string;
  usesItems: string[];
  missingItems?: string[];
}

export interface PriorityItem {
  name: string;
  reason: string;
  expiresOn?: string; // ISO date string
}

export interface ShoppingItem {
  name: string;
  reason: string;
}

export interface AnalyzeResponse {
  items: Item[];
  recipes: Recipe[];
  priority: PriorityItem[];
  shopping: ShoppingItem[];
}
