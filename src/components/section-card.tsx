import { cn } from "@/lib/utils";

export function SectionCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={cn("paper rounded-[28px] border border-line p-5 md:p-6", className)}>{children}</section>;
}
