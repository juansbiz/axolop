import { useState, useMemo, useCallback } from 'react';

const MOCK_BRANDS = [
  { id: 1, name: "My Store", slug: "my-store", logo_url: null },
];

export const useBrand = () => {
  const [brand, setBrand] = useState(MOCK_BRANDS[0]);
  const [brands, setBrands] = useState(MOCK_BRANDS);

  const switchBrand = useCallback((newBrand) => {
    setBrand(newBrand);
  }, []);

  const addBrand = useCallback((newBrand) => {
    setBrands(prev => [...prev, newBrand]);
  }, []);

  return useMemo(() => ({
    brand,
    brands,
    setBrand: switchBrand,
    setBrands,
    addBrand,
  }), [brand, brands, switchBrand, addBrand]);
};

export const useCurrentBrandId = () => {
  const { brand } = useBrand();
  return useMemo(() => brand?.id || null, [brand]);
};

export const useCurrentBrandName = () => {
  const { brand } = useBrand();
  return useMemo(() => brand?.name || '', [brand]);
};

export const useBrandList = () => {
  const { brands } = useBrand();
  return useMemo(() => ({ brands }), [brands]);
};

export const useBrandActions = () => {
  const { setBrand, addBrand } = useBrand();
  
  const switchBrand = useCallback(async (brandId) => {
    // Placeholder - would call API
  }, []);

  return useMemo(() => ({ 
    switchBrand,
    addBrand,
  }), [switchBrand, addBrand]);
};

export const useBrandLoading = () => {
  return useMemo(() => ({
    isLoading: false,
    hasFailed: false,
    error: null,
  }), []);
};

export const useSubscription = () => {
  return useMemo(() => ({
    subscription: null,
    subscriptionLoading: false,
    hasActiveSubscription: false,
  }), []);
};

export const usePro = () => {
  return useMemo(() => ({
    hasPro: false,
    isLoading: false,
  }), []);
};

export const useAccount = () => {
  const needsPaymentWall = () => false;
  return useMemo(() => ({
    account: null,
    needsPaymentWall,
  }), []);
};

export default useBrand;
