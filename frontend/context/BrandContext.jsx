import { createContext, useContext, useState } from 'react';

const BrandContext = createContext();

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    return {
      brand: null,
      brands: [],
    };
  }
  return context;
};

export const useCurrentBrand = () => {
  const { brand } = useBrand();
  return brand;
};

export const useBrandList = () => {
  const { brands } = useBrand();
  return brands;
};

export const BrandProvider = ({ children }) => {
  const [brand, setBrand] = useState(null);
  const [brands, setBrands] = useState([]);

  const value = {
    brand,
    brands,
    setBrand,
    setBrands,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};

export default BrandContext;
