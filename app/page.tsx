"use client";

import { useState } from "react";
import ResultPanels from "@/components/ResultPanels";
import { MOCK_RESULTS } from "@/mockData";
import type { AnalyzeResponse } from "@/types";

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.8;

function downscaleToBase64Jpeg(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(
        1,
        MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
      );
      const width = Math.round(image.naturalWidth * scale);
      const height = Math.round(image.naturalHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      URL.revokeObjectURL(objectUrl);

      if (!ctx) {
        reject(new Error("Canvas is not supported in this browser."));
        return;
      }

      ctx.drawImage(image, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      resolve(dataUrl.split(",")[1] ?? "");
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load the selected image."));
    };

    image.src = objectUrl;
  });
}

export default function Home() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<AnalyzeResponse>(MOCK_RESULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    setError(null);
    setLoading(true);

    try {
      const imageBase64 = await downscaleToBase64Jpeg(file);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to analyze the image.",
        );
        return;
      }

      setResults(data as AnalyzeResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze the image.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold">Fridge Forensics</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Selected fridge photo"
          className="max-w-xs"
        />
      )}

      {loading && <p>Analyzing photo...</p>}
      {error && <p role="alert">{error}</p>}

      <ResultPanels results={results} />
    </main>
  );
}
