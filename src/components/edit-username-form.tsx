"use client";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { toast } from "sonner"
import LogInOut from '@/components/ui/loginout'


const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

interface EditUsernameFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditUsernameForm({ setOpen }: EditUsernameFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("ollama_user") || "Anonymous");
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("ollama_user", values.username);
    window.dispatchEvent(new Event("storage"));
    toast.success("Name updated successfully");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    form.setValue("username", e.currentTarget.value);
    setName(e.currentTarget.value);
  };

  return (
    <Form {...form}>
       <div className="flex flex-col gap-4 pt-8">
       <FormLabel>Theme</FormLabel>
        <ModeToggle />
       </div>
       <div className="w-full">
        <LogInOut/>
        </div>
    </Form>
  );
}
