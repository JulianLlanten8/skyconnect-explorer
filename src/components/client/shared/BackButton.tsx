"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../ui/Button";

interface BackButtonProps {
  fallbackUrl?: string;
  label?: string;
}

export function BackButton({
  fallbackUrl = "/",
  label = "Volver",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleBack}>
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <title>Back</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </Button>
  );
}
