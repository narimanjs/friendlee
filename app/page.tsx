"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

const Home = () => {
  const searchParams = useSearchParams();
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchKey = async () => {
      const keyFromUrl = searchParams.get("key");
      if (keyFromUrl) {
        setKey(keyFromUrl);
        Cookies.set("key", keyFromUrl);
      } else {
        const keyFromCookie = Cookies.get("key");
        if (keyFromCookie) {
          setKey(keyFromCookie);
        }
      }
    };

    fetchKey();
  }, [searchParams]);

  useEffect(() => {
    if (key) {
      const socket = new WebSocket(`ws://localhost:3000?key=${key}`);

      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.onmessage = event => {
        console.log("Received:", event.data);
      };

      socket.onerror = error => {
        console.error("WebSocket error:", error);
      };

      const interval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(key);
        }
      }, 5000);

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
      <h1>Welcome, Friend Lee!!!</h1>
    </div>
  );
};

export default Home;
