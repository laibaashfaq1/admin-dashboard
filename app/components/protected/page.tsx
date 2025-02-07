'use client'
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouterProps {
  children: ReactNode;
}

const ProtectedRouter: React.FC<ProtectedRouterProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRouter;
