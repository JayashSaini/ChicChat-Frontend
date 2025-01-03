import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";

import Button from "../Button";
import Input from "../Input";
import { toast } from "sonner";
import { requestHandler } from "@utils/index";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setPasswordHandler } from "@api/index";

const ChangePasswordModel: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { room } = useSelector((state: RootState) => state.room);

  const changePasswordHandler = () => {
    // Check if the passwords match
    if (password !== confirmPassword) {
      toast.error("The passwords do not match");
      return;
    }

    requestHandler(
      async () =>
        await setPasswordHandler({
          password,
          confirmPassword,
          roomId: room?.roomId || "",
        }),
      setIsLoading,
      () => {
        toast.success("Password updated successfully");
        handleClose();
      },
      (e) => {
        toast.error(e);
      }
    );
  };

  // Function to reset local state values and close the modal/dialog
  const handleClose = () => {
    // Execute the onClose callback/function
    setPassword("");
    setConfirmPassword("");

    onClose();
  };

  // useEffect hook to perform side effects based on changes in the component lifecycle or state/props
  useEffect(() => {
    // Check if the modal/dialog is not open
    if (!open) return;

    // The effect depends on the 'open' value. Whenever 'open' changes, the effect will re-run.
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 bg-opacity-10 transition-opacity" />
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
                      Edit Password
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-transparent text-textPrimary"
                      onClick={() => handleClose()}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="my-4 space-y-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-textPrimary"
                    >
                      New Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-textPrimary"
                    >
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-between items-center gap-4">
                  <Button
                    severity={"secondary"}
                    onClick={handleClose}
                    className="w-1/2"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={changePasswordHandler}
                    className="w-1/2"
                    isLoading={isLoading}
                  >
                    Change Password
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

export default ChangePasswordModel;
