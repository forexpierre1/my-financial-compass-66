import { cn } from "@/lib/utils";

interface RiphusLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function RiphusLogo({ size = "md", showText = true, className }: RiphusLogoProps) {
  const sizes = {
    sm: { logo: "h-8 w-8", text: "text-lg" },
    md: { logo: "h-10 w-10", text: "text-xl" },
    lg: { logo: "h-12 w-12", text: "text-2xl" },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative", sizes[size].logo)}>
        {/* Glow effect behind */}
        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full scale-150" />
        
        {/* Logo SVG */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-full h-full drop-shadow-[0_0_10px_rgba(14,165,233,0.4)]"
        >
          <defs>
            <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(199 89% 48%)" />
              <stop offset="100%" stopColor="hsl(262 83% 58%)" />
            </linearGradient>
            <linearGradient id="logoGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(199 89% 60%)" />
              <stop offset="100%" stopColor="hsl(262 83% 68%)" />
            </linearGradient>
          </defs>
          
          {/* Top-left rounded square */}
          <rect
            x="2"
            y="2"
            width="15"
            height="15"
            rx="5"
            fill="url(#logoGradient1)"
            className="opacity-90"
          />
          
          {/* Top-right pill */}
          <rect
            x="20"
            y="2"
            width="8"
            height="18"
            rx="4"
            fill="url(#logoGradient2)"
            className="opacity-80"
          />
          
          {/* Bottom-left pill */}
          <rect
            x="2"
            y="20"
            width="8"
            height="18"
            rx="4"
            fill="url(#logoGradient2)"
            className="opacity-75"
          />
          
          {/* Bottom-right rounded square */}
          <rect
            x="14"
            y="23"
            width="14"
            height="14"
            rx="7"
            fill="url(#logoGradient1)"
            className="opacity-85"
          />
          
          {/* Small dot accent */}
          <circle
            cx="32"
            cy="8"
            r="5"
            fill="url(#logoGradient1)"
            className="opacity-70"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={cn(
          "font-display font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text",
          sizes[size].text
        )}>
          RIPHUS
        </span>
      )}
    </div>
  );
}
