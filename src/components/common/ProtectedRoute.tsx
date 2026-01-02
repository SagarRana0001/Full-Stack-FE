import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import type { RootState } from "@/app/store";
import { ROUTES } from "@/utils/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      toast.error("Token invalid");
    }
  }, [token]);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}

