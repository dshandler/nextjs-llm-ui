"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UsernameForm from "@/components/username-form";
import SignInForm from "@/components/signin-form";
import { getSelectedModel } from "@/lib/model-helper";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { ChatRequestOptions } from "ai";
import { Message, useChat } from "ai/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import LogInOut from '@/components/ui/loginout';
import Register from '@/components/ui/register';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
    setInput,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);
      toast.error("An error occurred. Please try again.");
    },
  });
  const [chatId, setChatId] = React.useState<string>("");
  const [selectedModel, setSelectedModel] = React.useState<string>(
    getSelectedModel()
  );
  const [open, setOpen] = React.useState(false);
  const [ollama, setOllama] = useState<ChatOllama>();
  const env = process.env.NODE_ENV;
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (messages.length < 1) {
      // Generate a random id for the chat
      console.log("Generating chat id");
      const id = uuidv4();
      setChatId(id);
    }
  }, [messages]);

  React.useEffect(() => {
    if (!isLoading && !error && chatId && messages.length > 0) {
      // Save messages to local storage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [chatId, isLoading, error]);

  useEffect(() => {
    if (env === "production") {
      const newOllama = new ChatOllama({
        baseUrl: process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434",
        model: selectedModel,
      });
      setOllama(newOllama);
    }

    if (!localStorage.getItem("ollama_user")) {
      setOpen(true);
    }
  }, [selectedModel]);

  const addMessage = (Message: any) => {
    messages.push(Message);
    window.dispatchEvent(new Event("storage"));
    setMessages([...messages]);
  };

  // Function to handle chatting with Ollama in production (client side)
  const handleSubmitProduction = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    addMessage({ role: "user", content: input, id: chatId });
    setInput("");

    if (ollama) {
      try {
        const parser = new BytesOutputParser();

        const stream = await ollama
          .pipe(parser)
          .stream(
            (messages as Message[]).map((m) =>
              m.role == "user"
                ? new HumanMessage(m.content)
                : new AIMessage(m.content)
            )
          );

        const decoder = new TextDecoder();

        let responseMessage = "";
        for await (const chunk of stream) {
          const decodedChunk = decoder.decode(chunk);
          responseMessage += decodedChunk;
          setLoadingSubmit(false);
          setMessages([
            ...messages,
            { role: "assistant", content: responseMessage, id: chatId },
          ]);
        }
        addMessage({ role: "assistant", content: responseMessage, id: chatId });
        setMessages([...messages]);

        localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
        // Trigger the storage event to update the sidebar component
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        setLoadingSubmit(false);
      }
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);

    setMessages([...messages]);

    // Prepare the options object with additional body data, to pass the model.
    const requestOptions: ChatRequestOptions = {
      options: {
        body: {
          selectedModel: selectedModel,
        },
      },
    };

    if (env === "production") {
      handleSubmitProduction(e);
    } else {
      // Call the handleSubmit function with the options
      handleSubmit(e, requestOptions);
    }
  };

  const onOpenChange = (isOpen: boolean) => { 
    const username = localStorage.getItem("ollama_user")
    if (username) return setOpen(isOpen)

    localStorage.setItem("ollama_user", "Anonymous")
    window.dispatchEvent(new Event("storage"))
    setOpen(isOpen)
  }

  const { user, errorNext, isLoadingNext } = useUser();
  
  if (user) {
    return (
    
      <main className="flex h-[calc(100dvh)] flex-col items-center ">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <ChatLayout
            chatId=""
            setSelectedModel={setSelectedModel}
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={onSubmit}
            isLoading={isLoading}
            loadingSubmit={loadingSubmit}
            error={error}
            stop={stop}
            navCollapsedSize={10}
            defaultLayout={[30, 160]}
            formRef={formRef}
            setMessages={setMessages}
            setInput={setInput}
          />
          <DialogContent className="flex flex-col space-y-4">
            <DialogHeader className="space-y-2">
              <DialogTitle>Welcome to Your Private LLM!</DialogTitle>
              <DialogDescription>
                You're ready to start getting answers!
              </DialogDescription>
              <SignInForm setOpen={false} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </main>
      );
    }
    return (
      <main className="flex h-[calc(100dvh)] flex-col justify-center ">
        <div className="w-full flex flex-col gap-4 pt-8 items-center">
        <Card>
        <CardContent className="pb-0 flex flex-col space-y-4">
            <CardHeader className="pb-0 space-y-2">
              <CardTitle>Welcome to Your Private LLM!</CardTitle>
              <CardDescription>
               Please log in to gain unparalleled private access!
              </CardDescription>
              <CardDescription>
                Or register your interest for our next cohort.
              </CardDescription>
            </CardHeader>
          </CardContent>
          <div className="grid grid-cols-2 gap-8 px-4 justify-items-center place-content-center h-20">
                <div className="w-full">
                <LogInOut/>
                </div>
                <div className="w-full">
                <Register/>
                </div>
            </div>
          </Card>
          </div>

      </main>
    )
}
