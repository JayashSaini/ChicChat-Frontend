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
  // State to manage form data for joining the room
  const [data, setData] = useState({
    link: "",
    roomId: "",
    password: "",
  });

  // Loader state for the join room button
  const [joinRoomLoader, setJoinRoomLoader] = useState(false);

  // Hook for navigation
  const navigate = useNavigate();

  // Function to handle room join
  const onJoinRoomHandler = () => {
    requestHandler(
      async () => await joinRoom(data), // Request to join the room
      setJoinRoomLoader, // Set loading state
      ({ data }) => {
        // On success, navigate to the room
        navigate(`/workspace/video/room/join/${data?.room?.roomId}`);
        handleClose(); // Close the modal
      },
      (e) => toast.error(e) // Show error toast on failure
    );
  };

  // Function to close the modal and reset data
  const handleClose = () => {
    setData({
      link: "",
      roomId: "",
      password: "",
    });
    onClose();
  };

  // Function to handle form data changes
  const handleDataChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        [name]: e.target.value, // Update the respective field
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

                {/* Form section to join room */}
                <div className="mt-6">
                  <div className="space-y-3">
                    {/* Input for Room Id */}
                    <Input
                      type="text"
                      placeholder="Room Id"
                      value={data.roomId}
                      onChange={handleDataChange("roomId")}
                    />
                    {/* Input for Password */}
                    <Input
                      type="password"
                      placeholder="Password (optional)"
                      value={data.password}
                      onChange={handleDataChange("password")}
                    />
                  </div>
                  <div className="text-sm my-2 text-center">OR</div>
                  {/* Input for the room link */}
                  <Input
                    type="text"
                    placeholder="Paste link here..."
                    value={data.link}
                    onChange={handleDataChange("link")}
                  />
                </div>

                {/* Buttons for closing or joining the room */}
                <div className="mt-5 flex justify-between items-center gap-4">
                  <Button
                    fullWidth={true}
                    severity="secondary"
                    onClick={handleClose} // Close button
                  >
                    Close
                  </Button>
                  <Button
                    fullWidth={true}
                    onClick={onJoinRoomHandler} // Join button
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
