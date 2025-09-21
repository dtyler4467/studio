
import Image from 'next/image';

export function ProPantheonLogo() {
  return (
    <Image 
        src="/propantheon-logo.png" 
        alt="ProPantheon Logo" 
        width={160} 
        height={32}
    />
  );
}
