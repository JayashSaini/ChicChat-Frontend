import { LuLoader2 } from "react-icons/lu";

const Loader = () => {
  return (
    <div className="flex space-x-2 w-full h-screen fixed inset-0 bg-background z-50 justify-center items-center">
      <LuLoader2 className="text-textPrimary animate-spin" size={40} />
    </div>
  );
};

export default Loader;
