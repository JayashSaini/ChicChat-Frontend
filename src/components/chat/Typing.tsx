import { classNames } from "../../utils";

const Typing = () => {
  return (
    <div
      className={classNames(
        "p-5 rounded-3xl bg-backgroundTertiary w-fit inline-flex gap-1.5"
      )}
    >
      <span className="animation1 mx-[0.5px] h-2 w-2 dark:bg-zinc-300 bg-zinc-700 rounded-full"></span>
      <span className="animation2 mx-[0.5px] h-2 w-2 dark:bg-zinc-300 bg-zinc-700 rounded-full"></span>
      <span className="animation3 mx-[0.5px] h-2 w-2 dark:bg-zinc-300 bg-zinc-700 rounded-full"></span>
    </div>
  );
};

export default Typing;
