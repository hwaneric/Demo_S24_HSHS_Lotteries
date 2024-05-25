import { createServerSupabaseClient } from "@/lib/server-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "./logo";

export default async function Navbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  // Create supabase server component client and obtain user session from Supabase Auth
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        <Logo />
      </Link>
      {user && (
        <>
          <Link href="/new" className="text-sm font-medium transition-colors hover:text-primary">
            New Applications
          </Link>
          <Link href="/processed" className="text-sm font-medium transition-colors hover:text-primary">
            Processed
          </Link>
          <Link href="/lotteries" className="text-sm font-medium transition-colors hover:text-primary">
            Lottery
          </Link>
          <Link href="/sync" className="text-sm font-medium transition-colors hover:text-primary">
            Sync
          </Link>
        </>
      )}
    </nav>
  );
}
