import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full">
      {children}

      <Separator />
      <footer className="p-2 flex items-center justify-between">
        <Logo iconSize={16} fontSize="text-base" />
        <ThemeToggle />
      </footer>
    </div>
  );
}
