import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import ChangePasswordModel from "./ChangePasswordModel";
import { requestHandler } from "@utils/index";
import { toggleChatEnable } from "@api/index";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { toast } from "sonner";
import { useAuth } from "@context/index";
import { Room } from "@interfaces/stream";

export default function MenuDropdown() {
  const [isChangePasswordModelOpen, setIsChangePasswordModelOpen] =
    useState(false);
  const { room } = useSelector((state: RootState) => state.room);
  const { user } = useAuth();
  console.log("room : ", room?.isChatEnable);

  const onChatEnabledHandler = () => {
    if (user?._id.toString() == room?.admin.toString()) {
      requestHandler(
        async () => await toggleChatEnable(room?.roomId || ""),
        null,
        ({ data }) => {
          const room: Room = data.room;
          console.log("room is", room);
          toast.success(
            `Chat ${room.isChatEnable ? "enabled" : "disabled"} successfully`
          );
        },
        (e) => toast.error(e)
      );
    } else {
      toast.error("Only room admins can enable/disable chat");
    }
  };

  return (
    <>
      <div className="relative">
        <Menu as="div" className="relative">
          <div>
            <Menu.Button>
              <BsThreeDotsVertical />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute bottom-10 mb-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-background shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active
                          ? "bg-backgroundTertiary text-textPrimary"
                          : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm bg-backgroundSecondary text-textSecondary`}
                      onClick={() => {
                        if (user?._id.toString() == room?.admin.toString()) {
                          setIsChangePasswordModelOpen(true);
                          return;
                        } else {
                          toast.info(
                            "Only admin is allowed to change password."
                          );
                        }
                      }}
                    >
                      <FiEdit className="mr-3" />
                      Edit Password
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active
                          ? "bg-backgroundTertiary text-textPrimary"
                          : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm bg-backgroundSecondary text-textSecondary`}
                      onClick={onChatEnabledHandler}
                    >
                      <IoChatboxEllipsesOutline className="mr-3 text-base" />
                      {room?.isChatEnable ? "Chat Disabled" : "Chat Enabled"}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {isChangePasswordModelOpen && (
        <ChangePasswordModel
          onClose={() => setIsChangePasswordModelOpen(false)}
          open={isChangePasswordModelOpen}
        />
      )}
    </>
  );
}
