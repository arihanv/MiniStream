"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const streamRef = useRef(true);
  const [streaming, setStreaming] = useState(false);

  const generateResponse = async (prompt: string) => {
    console.log("prompt:", prompt);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });
    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();
    setPrompt("");
    setResponse("");
    setStreaming(true)// Update the ref, not the state directly

    while (streamRef.current) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Process and update the streaming data in your state
      setResponse((prevResponse) => prevResponse + textDecoder.decode(value));
    }
    setStreaming(false)
  };

  const stopResponse = () => {
    streamRef.current = false; // Update the ref, not the state directly
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-5">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Button disabled={!streaming} onClick={() => stopResponse()}>Stop Stream</Button>
      </div>
      {response.length > 0 && (
        <div className="w-full max-w-5xl">{response}</div>
      )}
      <Input
        disabled={streaming}
        className="w-full max-w-5xl"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Prompt..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            generateResponse(prompt);
          }
        }}
      />
    </main>
  );
}
