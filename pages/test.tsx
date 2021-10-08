import { useEffect, useState } from "react";
import useRooms from "@/hooks/useRooms";

const TestSocket = () => {
  const [imprintEvents, setImprintEvents] = useState<Array<any>>([]);
  const { joinRoom } = useRooms();

  useEffect(() => {
    joinRoom("imprint-4", (data) => {
      setImprintEvents((events) => [data, ...events]);
    });
  }, []);

  return (
    <>
      <p>Events</p>
      {JSON.stringify(imprintEvents)}
    </>
  );
};

export default TestSocket;
