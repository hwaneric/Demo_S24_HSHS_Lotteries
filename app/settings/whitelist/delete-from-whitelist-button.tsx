import { deleteEmail } from "@/app/settings/whitelist/whitelist-server-actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface ErrorMsg {
  message: string;
}

export default function DeleteFromWhitelistButton({ email }: { email: string }) {
  const router = useRouter();

  const handleDeleteEmail = async (email: string) => {
    await deleteEmail(email).catch((error: ErrorMsg) => {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    });

    // Force server components to be refreshed to re-sync data with Supabase
    router.refresh();

    return toast({
      title: "Email deleted successfully.",
    });
  };

  return (
    <Button variant="destructive" onClick={() => void handleDeleteEmail(email)}>
      Delete
    </Button>
  );
}
