"use client";

export default function Home() {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    console.log(file);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold">Fridge Forensics</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </main>
  );
}
