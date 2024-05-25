"use client";

// TODO: This page should not have "Submitted On" and "Won On" fields

import { insertResponse } from "@/components/data_loading/data_loading";
import type { Response } from "@/components/types";
import { genderZ, lotteryTypeZ, responsesSchema } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import _ from "lodash";

type FormData = z.infer<typeof responsesSchema>;

export default function AddResponseDialog() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const defaultValues: Partial<FormData> = {
    name: "",
    dob: null,
    phone: null,
    email: null,
    gender: undefined,
    lottery_type: undefined,
    notes: null,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(responsesSchema),
    defaultValues,
    mode: "onChange",
  });

  // Event handler for submissions
  const onSubmit = async (input: FormData) => {
    // Add response to GSheets DB
    const response = input as Response;
    response.id = -1;
    response.submitted_at = new Date().toISOString();
    response.uploaded_at = new Date().toISOString();
    response.is_processed = true;
    response.is_waitlisted = false;
    response.is_duplicate = false;
    response.duplicate_ids = [];
    response.unwaitlisted_at = null;
    response.won_at = null;
    response.has_won = false;
    response.is_banned = false;
    response.banned_ids = [];

    await insertResponse(response);

    form.reset(defaultValues);
    setOpen(false);
    router.refresh();

    return toast({
      title: "Changes saved!",
      description: "Saved your changes!",
    });
  }


  const toggleOpen = () => {
    const isClosing = open;
    const formValues = form.getValues();
    const changesWereMade = !_.isEqual(defaultValues, formValues) as boolean;
    if (isClosing && changesWereMade) {
      if (!window.confirm("Are you sure you want to cancel?")) {
        return;
      }

      form.reset(defaultValues);
    }
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Response</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogTitle> New Response </DialogTitle>
        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input value={value ?? ""} {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => {
                  // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                  // TODO: This should be a nice date picker that converts to and from ISO string
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" value={value ?? ""} {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(genderZ.parse(value))}
                      value={field.value as string}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {genderZ.options.map((genderZ, index) => (
                            <SelectItem key={index} value={genderZ}>
                              {genderZ}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lottery_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lottery Type</FormLabel>
                    <Select onValueChange={(value) => field.onChange(lotteryTypeZ.parse(value))} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {lotteryTypeZ.options.map((gender, index) => (
                            <SelectItem key={index} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input value={value ?? ""} {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input value={value ?? ""} {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => {
                  // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input value={value ?? ""} {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" className="ml-1 mr-1 flex-auto">
                Confirm
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
