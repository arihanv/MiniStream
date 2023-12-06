"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";

export default function Home() {
  const [botResponse, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [streaming, setStreaming] = useState(false);
  const [readStream, setReadStream] = useState<any>();

  const generateResponse = async (prompt: string) => {
    setPrompt("");
    let textRes = "";
    await fetch("/api/slay", {
      method: "POST",
      body: prompt,
      headers: { "Content-Type": "text/plain" },
    }).then( (res) => {
      // @ts-ignore ReadableStream on different environments can be strange
      const runner = ChatCompletionStream.fromReadableStream(res.body);
      setReadStream(runner);
      runner.on("content", (message) => {
        console.log(message);
        textRes += message;
        setResponse(textRes);
      });
      runner.on("end", () => {
        setMessages((prevMessages: []) => [
          ...prevMessages,
          { role: "bot", content: textRes },
        ]);
        setResponse("");
      });
      runner.on("chatCompletion", (usage) => {
        console.log(usage);
      });
    });
    setStreaming(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-5">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Button onClick={() => readStream?.abort()}>Stop Stream</Button>
      </div>
      <div className="w-full justify-start max-w-5xl">
        {messages.map((message: any, i: number) => {
          return (
            <div className="flex flex-col" key={i}>
              <div className="text-gray-500 flex gap-2 items-center">
                {message.role}:{" "}
                <div className="text-gray-600">{message.content}</div>
              </div>
            </div>
          );
        })}
        {botResponse.length > 0 && (
          <div className="text-gray-500 flex gap-2 items-center">
            bot: <div className="text-gray-600">{botResponse}</div>
          </div>
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
            setStreaming(true);
            generateResponse(prompt);
            setMessages((prevMessages: []) => [
              ...prevMessages,
              { role: "user", content: prompt },
            ]);
          }
        }}
      />
    </main>
  );
}
