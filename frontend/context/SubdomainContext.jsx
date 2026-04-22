import { createContext, useContext, useState } from 'react';

const SubdomainContext = createContext();

export const useSubdomain = () => {
  const context = useContext(SubdomainContext);
  if (!context) {
    return {
      subdomain: null,
      isLoading: false,
      customDomain: null,
    };
  }
  return context;
};

export const useSafeSubdomain = () => {
  const context = useContext(SubdomainContext);
  if (!context) {
    return {
      subdomain: null,
      isLoading: false,
      customDomain: null,
    };
  }
  return context;
};

export const SubdomainProvider = ({ children }) => {
  const [subdomain] = useState(null);
  const [customDomain] = useState(null);

  const value = {
    subdomain,
    isLoading: false,
    customDomain,
  };

  return (
    <SubdomainContext.Provider value={value}>
      {children}
    </SubdomainContext.Provider>
  );
};

export default SubdomainContext;
