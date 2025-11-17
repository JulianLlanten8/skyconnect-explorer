import Image from "next/image";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface Props {
  elements: ReactNode;
}

export default function SubCard({ elements }: Props) {
  return (
    <Card className="w-full hover:shadow-xl transition-shadow relative overflow-hidden rounded-lg border-2 border-white bg-linear-to-br from-airport-card-bg to-airport-card-bg-end p-8">
      <CardHeader className="">{elements}</CardHeader>

      <CardContent className="absolute right-0 top-0 h-full w-1/2 opacity-10">
        <Image
          src="/images/airplane.webp"
          alt="img-blur-shadow"
          width={100}
          height={100}
          className="object-fit h-full w-full"
          priority
        />
      </CardContent>
    </Card>
  );
}
