import type { Response } from "@/components/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypographyH3 } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  women: z.number().int().nonnegative().nullable(),
  men: z.number().int().nonnegative().nullable(),
  neutral: z.number().int().nonnegative().nullable(),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: Partial<FormData> = {
  women: null,
  men: null,
  neutral: null,
};

export function BedFormDialog(formProps: {
  setWinnerArr: React.Dispatch<React.SetStateAction<Response[]>>;
  setWonOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Response[];
}) {
  //Define dialog open/closed
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  // 2. Define a submit handler.
  function onSubmit(values: FormData) {
    // Do the random selection lottery math with the form value param.
    const winnerArr = [];
    const womenArr = [];
    const menArr = [];
    for (const response of formProps.data) {
      if (response.lottery_type && response.lottery_type.indexOf("woman") != -1 && response.is_waitlisted) {
        womenArr.push(response);
      } else if (response.lottery_type && response.lottery_type.indexOf("man") != -1 && response.is_waitlisted) {
        menArr.push(response);
      }
    }
    if (values.women) {
      if (womenArr.length < values.women) {
        //options are less than we need
        values.women = womenArr.length;
        toast({
          title: "More women requested than on waitlist.",
          description: "Changed number to " + womenArr.length + ".",
        });
      }
      for (let i = 0; i < values.women; i++) {
        const rand = Math.floor(Math.random() * womenArr.length);
        const winner = womenArr[rand];
        if (winner) {
          winnerArr.push(winner);
          womenArr.splice(rand, 1);
        }
      }
    }
    if (values.men) {
      if (menArr.length < values.men) {
        values.men = menArr.length;
        toast({ title: "More men requested than on waitlist", description: "Changed number to" + menArr.length + "." });
      }
      for (let i = 0; i < values.men; i++) {
        const rand = Math.floor(Math.random() * menArr.length);
        const winner = menArr[rand];
        if (winner) {
          winnerArr.push(winner);
          menArr.splice(rand, 1);
        }
      }
    }
    if (values.neutral) {
      const totalLength = menArr.length + womenArr.length;
      if (totalLength < values.neutral) {
        toast({
          title: "More beds requested than left on waitlist",
          description: "Changed number to " + totalLength + ".",
        });
      }
      for (let i = 0; i < values.neutral; i++) {
        const rand = Math.floor(Math.random() * (totalLength - i));
        if (rand < menArr.length) {
          const winner = menArr[rand];
          if (winner) {
            winnerArr.push(winner);
            menArr.splice(rand, 1);
          }
        } else {
          const winner = womenArr[rand - menArr.length];
          if (winner) {
            winnerArr.push(winner);
            womenArr.splice(rand, 1);
          }
        }
      }
    }

    router.refresh();
    formProps.setWinnerArr(winnerArr); //TODO: need to update winner array's won_at values and remove them from waitlist
    formProps.setWonOpen(true);
    form.reset(defaultValues);
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="container flex items-center">
          <Button variant="hshs" className="mt-3 h-12 min-h-fit w-1/4 min-w-fit max-w-full">
            <TypographyH3>Run the Lottery</TypographyH3>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Run the Lottery</DialogTitle>
            <DialogDescription>
              <p>Select how many winners you want.</p>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)} className="space-y-8">
              <FormField
                control={form.control}
                name="women"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Women</FormLabel>
                      <FormControl>
                        {/* Using shadcn/ui form with number: https://github.com/shadcn-ui/ui/issues/421 */}
                        <Input
                          type="number"
                          value={value ?? ""}
                          placeholder="0"
                          {...rest}
                          onChange={(event) => field.onChange(+event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="men"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Men</FormLabel>
                      <FormControl>
                        {/* Using shadcn/ui form with number: https://github.com/shadcn-ui/ui/issues/421 */}
                        <Input
                          type="number"
                          value={value ?? ""}
                          placeholder="0"
                          {...rest}
                          onChange={(event) => field.onChange(+event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="neutral"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Gender Neutral</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={value ?? ""}
                          placeholder="0"
                          {...rest}
                          onChange={(event) => field.onChange(+event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit">Submit</Button>
              <DialogClose asChild>
                <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
