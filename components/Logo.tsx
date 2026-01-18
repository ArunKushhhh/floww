import { cn } from "@/lib/utils";
import { SquareDashedMousePointer } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo({
  fontSize = "lg",
  iconSize = 16,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href={"/"}
      className={cn("text-lg font-extrabold flex items-center gap-2", fontSize)}
    >
      <div className="rounded-md bg-primary p-2">
        <SquareDashedMousePointer size={iconSize} color="white" />
      </div>
      <div>
        <span className="text-secondary-foreground">Floww</span>
      </div>
    </Link>
  );
}

export default Logo;
