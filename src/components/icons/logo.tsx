
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 160 32" 
      width="120" 
      height="24"
      {...props}
    >
      <text 
        x="0" 
        y="24" 
        fontFamily="Space Grotesk, sans-serif" 
        fontSize="24" 
        fontWeight="bold" 
        fill="hsl(var(--primary))"
      >
        ProPantheon
      </text>
    </svg>
  );
}
