import { useMemo } from "react";

export const useAccount = () => {
  return useMemo(() => ({
    account: null,
    isActive: true,
    needsPaymentWall: () => false,
  }), []);
};

export default useAccount;
