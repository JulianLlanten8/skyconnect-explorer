import { cn } from "@/lib/utils";

interface props {
  value: string;
  className?: string;
}
export const Subtitle = ({ value, className }: props) => {
  return (
    <h3
      className={cn(
        "font-extrabold  bg-linear-to-r from-[#006AFF] to-[#00F9FF] inline-block text-transparent bg-clip-text",
        className,
      )}
    >
      {value}
    </h3>
  );
};
