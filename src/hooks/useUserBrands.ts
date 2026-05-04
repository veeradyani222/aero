import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { getUserBrands, UserBrand } from '@/firebase/firestore/getUserBrands';

interface UseUserBrandsReturn {
  brands: UserBrand[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserBrands(): UseUserBrandsReturn {
  const { user } = useAuthContext();
  const [brands, setBrands] = useState<UserBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      setBrands([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { result, error: fetchError } = await getUserBrands(user.uid);

      if (fetchError) {
        setError('Failed to load brands. Please try again.');
      } else {
        const sortedBrands = (result || []).slice().sort((a, b) => {
          const aTime = a.timestamp || new Date(a.createdAt || 0).getTime() || 0;
          const bTime = b.timestamp || new Date(b.createdAt || 0).getTime() || 0;
          return bTime - aTime;
        });
        setBrands(sortedBrands);
      }
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      setError('Failed to load brands. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands
  };
}

