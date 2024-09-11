import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function useRedirect() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    } else if (!pathname.includes("creator")) {
      router.push("/");
    }
  }, [session]);
}
