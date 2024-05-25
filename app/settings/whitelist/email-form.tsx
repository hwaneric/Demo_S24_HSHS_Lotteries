"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addEmail } from "./whitelist-server-actions";

interface ErrorMsg {
  message: string;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export function EmailForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await addEmail(values.email).catch((error: ErrorMsg) => {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    });

    // Clear form values if successfully uploaded to Supabase
    form.reset();

    // Force data to be re-fetched from Supabase to show the new email in the table
    router.refresh();

    return toast({
      title: "Email added successfully!",
    });
  };

  const onInvalid = () => {
    return toast({
      title: "Invalid email address",
      variant: "destructive",
    });
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit, onInvalid)(e)} className="space-y-8">
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <FormItem style={{ marginRight: "8px" }}>
              <FormLabel>Add Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@example.com"
                  {...form.register("email")}
                  style={{ width: "300px", height: "40px" }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <div style={{ paddingLeft: "10px" }}>
              <Button type="submit">Add</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
