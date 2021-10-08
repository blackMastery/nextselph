import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

function useRooms() {
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      extraHeaders: {
        Authorization: localStorage ? localStorage.getItem("token") : undefined,
      },
    });

    setSocket(socket);
  }, []);

  const joinRoom = useCallback(
    (roomName: string, cb?: (message) => any) => {
      if (!socket) return null;
      socket.emit("joinRoom", roomName);
      socket.on(roomName, (message: any) => {
        cb(message);
      });
    },
    [socket]
  );

  return { joinRoom, socket };
}

export default useRooms;
