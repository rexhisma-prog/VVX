"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn border-line text-ink hover:border-brand">
      Printo planimetrinë
    </button>
  );
}
