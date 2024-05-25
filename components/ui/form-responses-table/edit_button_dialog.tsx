"use client";

import { updateResponse } from "@/components/data_loading/data_loading";
import type { Response } from "@/components/types";
import {
  contactStatusZ,
  genderZ,
  lotteryTypeZ,
  responsesSchema,
  type Gender,
  type LotteryType,
} from "@/components/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { useRouter } from "next/navigation";
import type { BaseSyntheticEvent } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import "react-phone-number-input/style.css";
import { type z } from "zod";

type FormData = z.infer<typeof responsesSchema>;

export default function ResponsesDetailsDialog({ response }: { response: Response }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  // TODO, CHANGE THIS FROM RELYING ON THE FORMDATA TYPE
  const defaultValues: Partial<FormData> = {
    name: response.name ?? "",
    dob: response.dob,
    phone: response.phone,
    email: response.email,
    gender: response.gender as Gender,
    lottery_type: response.lottery_type ?? undefined,
    contact_status: response.contact_status!,
    notes: response.notes,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(responsesSchema),
    defaultValues,
    mode: "onChange",
  });

  // Event handler for submissions
  const onSubmit = async (input: FormData) => {
    // Update response in GSheets DB
    //TODO: should they be able to change won_at date and has_won?

    // Contact status should be set to null if "clear selection" was chosen
    let contactStatusValue;
    if (!input.contact_status || input.contact_status === "clear selection") {
      contactStatusValue = null
    } else {
      contactStatusValue = input.contact_status;
    }

    response.contact_status = contactStatusValue;
    response.dob = input.dob;
    response.email = input.email;
    response.name = input.name!;
    response.gender = input.gender!;
    response.lottery_type = input.lottery_type as LotteryType ;
    response.notes = input.notes;
    // response.has_won = input.has_won as boolean;
    response.phone = input.phone;
    await updateResponse(response);

    form.reset(input);
    router.refresh();
    setOpen(false);
    return toast({
      title: "Changes saved!",
      description: "Saved your changes!",
    });
  };

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

  // TODO: This should be a nice date picker that converts to and from ISO string
  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button className="ml-1 mr-1 flex-auto">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogTitle> Application ID: {response.id} </DialogTitle>
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
                          {lotteryTypeZ.options.map((genderZ, index) => (
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
                name="contact_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(contactStatusZ.parse(value))}
                      value={field.value === "clear selection" ? "" : field.value}    // Resets Select to placeholder when "clear selection" is chosen
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {contactStatusZ.unwrap().options.map((contactStatusZ, index) => (
                            <SelectItem key={index} value={contactStatusZ}>
                              {contactStatusZ}
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
