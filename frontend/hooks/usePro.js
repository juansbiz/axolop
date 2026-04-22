import { useMemo } from "react";

export const usePro = () => {
  return useMemo(() => ({
    hasPro: false,
    isLoading: false,
    checkPro: () => false,
  }), []);
};

export default usePro;
