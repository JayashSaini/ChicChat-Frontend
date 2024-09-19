import { useEffect } from "react";
import { useParams } from "react-router-dom";

const room = () => {
  const roomId = useParams();

  useEffect(() => {}, [roomId]);

  return (
    <div className="w-full md:h-screen h-[calc(100vh-56px)] bg-background">
      room
    </div>
  );
};

export default room;
