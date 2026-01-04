import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RiphusLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

export function RiphusLogo({ size = "md", showText = true, className, animated = false }: RiphusLogoProps) {
  const sizes = {
    sm: { logo: "h-9 w-9", text: "text-lg" },
    md: { logo: "h-11 w-11", text: "text-xl" },
    lg: { logo: "h-14 w-14", text: "text-2xl" },
  };

  const LogoSVG = () => (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="riphusGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="riphusGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="riphusGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Top-left: Rounded square */}
      <rect
        x="2"
        y="2"
        width="17"
        height="17"
        rx="5"
        fill="url(#riphusGrad1)"
        filter="url(#logoGlow)"
      />
      
      {/* Top-right: Vertical pill */}
      <rect
        x="23"
        y="2"
        width="9"
        height="20"
        rx="4.5"
        fill="url(#riphusGrad2)"
        opacity="0.9"
      />
      
      {/* Bottom-left: Vertical pill */}
      <rect
        x="2"
        y="23"
        width="9"
        height="19"
        rx="4.5"
        fill="url(#riphusGrad2)"
        opacity="0.85"
      />
      
      {/* Bottom-right: Circle */}
      <circle
        cx="27"
        cy="32"
        r="10"
        fill="url(#riphusGrad3)"
        filter="url(#logoGlow)"
      />
      
      {/* Accent dot */}
      <circle
        cx="37"
        cy="7"
        r="5"
        fill="url(#riphusGrad1)"
        opacity="0.8"
      />
    </svg>
  );

  const content = (
    <>
      <div className={cn("relative", sizes[size].logo)}>
        {/* Glow behind logo */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 via-violet-500/30 to-purple-500/40 blur-xl rounded-full scale-150 opacity-60" />
        <div className="relative z-10 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          <LogoSVG />
        </div>
      </div>
      
      {showText && (
        <span className={cn(
          "font-display font-bold tracking-tight",
          sizes[size].text
        )}>
          <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            RIPHUS
          </span>
        </span>
      )}
    </>
  );

  if (animated) {
    return (
      <motion.div 
        className={cn("flex items-center gap-3", className)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {content}
    </div>
  );
}
