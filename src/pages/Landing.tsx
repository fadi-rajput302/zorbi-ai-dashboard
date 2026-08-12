import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router";

/**
 * The Zorbi marketing website lives separately. This route simply routes
 * signed-in users into the student app and everyone else to sign-in.
 */
export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />;
}
