"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [botResponse, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const streamRef = useRef(true);
  const [streaming, setStreaming] = useState(false);
  const [readStream, setReadStream] = useState<ReadableStreamDefaultReader>();

  const generateResponse = async (prompt: string) => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });
    if(response.body == null) {
      console.error("response is null")
      return
    }
    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();
    setReadStream(reader)
    setStreaming(true)
    setPrompt("");
    setResponse("");
    let textRes = ""
    while (streamRef.current) {
      const { done, value } = await reader.read();

      if (done) {
        setMessages((prevMessages: []) => [...prevMessages, {role:"bot", content:textRes}])
        break;
      }

      textRes += textDecoder.decode(value)
      setResponse((prevResponse) => textRes);
    }
;
    setStreaming(false)
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-5">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Button disabled={!streaming} onClick={() => readStream?.cancel()}>Stop Stream</Button>
      </div>
      <div className="w-full justify-start max-w-5xl">
        {messages.map((message: any, i: number) => {
          return (
            <div className="flex flex-col" key={i}>
              <div className="text-gray-500 flex gap-2 items-center">{message.role}: <div className="text-gray-600">{message.content}</div></div>
            </div>
          );
        }
        )}
         {botResponse.length > 0 && streaming && (
        <div className="text-gray-500 flex gap-2 items-center">bot: <div className="text-gray-600">{botResponse}</div></div>
      )}
      </div>
      <Input
        disabled={streaming}
        className="w-full max-w-5xl"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Prompt..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            generateResponse(prompt);
            setMessages((prevMessages: []) => [...prevMessages, {role:"user", content:prompt}]);
          }
        }}
      />
    </main>
  );
}
