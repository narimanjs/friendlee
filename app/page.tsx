"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

const Home = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || Cookies.get("key");

  useEffect(() => {
    if (key) {
      Cookies.set("key", key);
      const socket = new WebSocket("ws://localhost:3000");

      socket.onopen = () => {
        console.log("WebSocket connection established");
        socket.send(key);
      };

      const interval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(key);
        }
      }, 5000);

      socket.onmessage = event => {
        console.log("Received:", event.data);
      };

      socket.onerror = error => {
        console.error("WebSocket error:", error);
      };

      return () => {
        clearInterval(interval);
        socket.close();
      };
    }
  }, [key]);

  if (!key) {
    return <div>Key is required</div>;
  }

  return (
    <div>
      <h1>Welcome to the protected page!</h1>
    </div>
  );
};

export default Home;
