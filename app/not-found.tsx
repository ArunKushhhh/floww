import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-screen">
      <h1 className="text-6xl md:text-9xl font-bold text-primary tracking-wider">
        404
      </h1>
      <h2 className="text-lg font-semibold text-primary">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground max-w-sm text-center">
        Don't worry, even the best data sometimes gets lost in the internet.
      </p>
      <Link href={"/"} className={`flex items-center gap-2 ${buttonVariants({variant: "secondary"})}`}>
        <ArrowLeft  className="size-4"/>
        <p>Go back to Dashboard</p>
      </Link>
      <p className="text-muted-foreground text-center">If you believe this is an error, please contact support.</p>
    </div>
  );
}
