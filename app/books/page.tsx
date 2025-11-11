// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('https://www.amazon.com/dp/B0F98T9WSV?ref_=pe_93986420_775043100');
  }, [router]);

  return (
    <div>
      Redirecting to Amazon...
    </div>
  );
}