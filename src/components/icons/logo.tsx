import type { SVGProps } from "react";
import Image from 'next/image';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Image 
        src="https://picsum.photos/seed/propantheon/160/32" 
        alt="ProPantheon Logo" 
        width={120} 
        height={24}
        className="h-auto"
        {...props}
    />
  );
}
