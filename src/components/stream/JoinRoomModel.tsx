import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import Input from "@components/Input";
import Button from "@components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { requestHandler } from "@utils/index";
import { joinRoom } from "@api/index";

const JoinRoomModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [data, setData] = useState({
    link: "",
    roomId: "",
    password: "",
  });
  const [joinRoomLoader, setJoinRoomLoader] = useState(false);

  const navigate = useNavigate();

  // Join room handler
  const onJoinRoomHandler = () => {
    requestHandler(
      async () => await joinRoom(data),
      setJoinRoomLoader,
      ({ data }) => {
        navigate(`/workspace/stream/room/join/${data?.room?.roomId}`); // Redirect to the chat page with the joined room ID
        handleClose();
      },
      (e) => toast.error(e)
    );
  };

  const handleClose = () => {
    setData({
      link: "",
      roomId: "",
      password: "",
    });
    onClose();
  };

  const handleDataChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        [name]: e.target.value,
      });
    };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-visible">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform overflow-x-hidden rounded-lg bg-backgroundSecondary px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl w-full sm:p-6"
                style={{
                  overflow: "inherit",
                }}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-textPrimary"
                    >
                      Join room
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-transparent text-textPrimary"
                      onClick={handleClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Room Id"
                      value={data.roomId}
                      onChange={handleDataChange("roomId")}
                    />
                    <Input
                      type="password"
                      placeholder="Password (optional)"
                      value={data.password}
                      onChange={handleDataChange("password")}
                    />
                  </div>
                  <div className="text-sm my-2 text-center">OR</div>
                  <Input
                    type="text"
                    placeholder="Paste link here..."
                    value={data.link}
                    onChange={handleDataChange("link")}
                  />
                </div>
                <div className="mt-5 flex justify-between items-center gap-4">
                  <Button
                    fullWidth={true}
                    severity="secondary"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                    fullWidth={true}
                    onClick={onJoinRoomHandler}
                    isLoading={joinRoomLoader}
                  >
                    Join
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default JoinRoomModal;
