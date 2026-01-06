"use client";

import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Coins, Loader2 } from "lucide-react";
import Link from "next/link";
import { ReactCountUpWrapper } from "./ReactCountUpWrapper";
import { buttonVariants } from "./ui/button";

export function UserAvailableCreditsBadge() {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => getAvailableCredits(),
    refetchInterval: 30 * 1000,
  });
  return (
    <Link
      href="/billing"
      className={cn(
        "w-full flex items-center space-x-2",
        buttonVariants({ variant: "outline" })
      )}
    >
      <Coins className="text-primary size-4" />
      <span className="font-medium capitalize">
        {query.isLoading && (
          <Loader2 className="animate-spin size-4 text-muted-foreground" />
        )}
        {!query.isLoading && query.data && (
          <ReactCountUpWrapper value={query.data} />
        )}
        {!query.isLoading && !query.data === undefined && "-"}
      </span>
    </Link>
  );
}
