import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center relative">
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      {children}
    </div>
  );
}
