"use client";

import { ArrowLeft } from "lucide-react";
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
      <ArrowLeft />
      {label}
    </Button>
  );
}
