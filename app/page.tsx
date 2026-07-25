"use client";

import { useState } from "react";
import ItemChips from "@/components/ItemChips";
import ResultPanels from "@/components/ResultPanels";
import { MOCK_RESULTS } from "@/mockData";
import type { AnalyzeResponse } from "@/types";

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.8;
const EXAMPLE_IMAGE_PATH = "/demo-fridge.jpg";

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

  async function analyzeFile(file: File) {
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

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    await analyzeFile(file);
  }

  async function handleTryExample() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(EXAMPLE_IMAGE_PATH);
      if (!response.ok) {
        throw new Error("Failed to load the example photo.");
      }
      const blob = await response.blob();
      const file = new File([blob], "demo-fridge.jpg", {
        type: blob.type || "image/jpeg",
      });
      await analyzeFile(file);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load the example photo.",
      );
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1000px] flex-col items-center gap-12 px-6 py-16 md:py-24">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Fridge Forensics
        </h1>
        <p className="max-w-md text-base font-normal text-muted">
          See what’s in your fridge and what to cook with it.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[color:var(--border-subtle)] bg-card/40 p-10 sm:flex-row">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          suppressHydrationWarning
          className="text-base font-normal text-muted file:mr-4 file:rounded-full file:border file:border-[color:var(--border-subtle)] file:bg-transparent file:px-4 file:py-2 file:text-base file:font-bold file:text-foreground disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleTryExample}
          disabled={loading}
          className="rounded-full border border-accent bg-accent px-5 py-2 text-base font-bold text-background disabled:opacity-50"
        >
          Try example
        </button>
      </div>

      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Selected fridge photo"
          className="max-w-xs rounded-xl border border-[color:var(--border-subtle)]"
        />
      )}

      {loading && (
        <div
          role="status"
          aria-label="Analyzing photo"
          className="flex w-full flex-col gap-3"
        >
          <div className="h-4 w-1/3 animate-pulse rounded-full bg-card" />
          <div className="h-4 w-full animate-pulse rounded-full bg-card" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-card" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-card" />
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-card px-4 py-3 text-base font-bold"
        >
          {error}
        </p>
      )}

      <div className="flex w-full flex-col gap-4">
        <h2 className="text-base font-bold">Detected in your fridge</h2>
        <ItemChips items={results.items} />
      </div>

      <ResultPanels results={results} />
    </main>
  );
}
