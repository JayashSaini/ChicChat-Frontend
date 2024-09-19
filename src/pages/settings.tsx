import Button from "@components/Button";
import Select from "@components/Select";
import { useSidebar } from "@context/SliderContext";
import { useState } from "react";

const SettingsPage = () => {
  // State variables for various settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isAccountActive, setIsAccountActive] = useState(true);
  const { theme, toggleTheme } = useSidebar();

  // Functions to handle changes
  const toggleNotifications = () =>
    setNotificationsEnabled(!notificationsEnabled);

  return (
    <div className="w-full h-screen bg-background px-3 py-10">
      <div className="max-w-screen-lg w-full mx-auto">
        <h1 className="md:text-2xl  text-xl font-bold text-textPrimary mb-6">
          Settings
        </h1>

        {/* Unified Settings Container */}
        <div className="p-6 bg-backgroundSecondary rounded-lg shadow-sm ">
          {/* Appearance Section (Dark Mode) */}
          <div className="mb-6">
            <h2 className="md:text-lg text-base font-medium text-textPrimary mb-3">
              Appearance
            </h2>
            <Select
              options={[
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
                { value: "system", label: "System" },
              ]}
              placeholder="Select Theme"
              value={theme}
              onChange={({ value }) => {
                if (value !== "system" && value !== theme) {
                  toggleTheme();
                }
              }}
            />
          </div>

          {/* Notifications Settings */}
          <div className="mb-6">
            <h2 className="md:text-lg text-base font-medium text-textPrimary mb-3">
              Notifications
            </h2>
            <div className="flex items-center justify-between">
              <label className="material-checkbox">
                <input
                  type="checkbox"
                  checked={notificationsEnabled} // Use 'checked' instead of 'value' for boolean inputs
                  onChange={toggleNotifications}
                />
                <span className="checkmark"></span>
                <span className="text-sm">
                  {" "}
                  {notificationsEnabled ? "ON" : "OFF"}
                </span>
              </label>
            </div>
          </div>

          {/* Account Settings */}
          <div className="mb-6">
            <h2 className="md:text-lg text-base font-medium text-textPrimary mb-3">
              Account
            </h2>
            <Button
              fullWidth={true}
              severity={isAccountActive ? "danger" : "primary"}
              onClick={() => setIsAccountActive((prev) => !prev)}
            >
              {isAccountActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
