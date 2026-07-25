export interface DetectedItem {
  name: string;
  quantity: number;
  category: string;
  confidence: number; // 0-1
  estimatedExpiry?: string; // ISO date string
  notes?: string;
}

export interface AnalyzeResponse {
  summary: string;
  items: DetectedItem[];
  warnings: string[];
  analyzedAt: string; // ISO timestamp
}
