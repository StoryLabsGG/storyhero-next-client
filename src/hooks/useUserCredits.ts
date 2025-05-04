'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useUserCredits() {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/get-user-credits');
        if (!response.ok) {
          throw new Error('Failed to fetch credits');
        }
        const data = await response.json();
        setCredits(data.credits);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching credits:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [status]);

  return { credits, isLoading, error };
}
