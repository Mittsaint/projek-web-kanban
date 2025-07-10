import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// Custom Hook to make it easier to use context
export const useAuth = () => {
  return useContext(AuthContext);
};