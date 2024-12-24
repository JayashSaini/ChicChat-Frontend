import Button from "@components/Button";
import Select from "@components/Select";
import { useSidebar } from "@context/SliderContext";
import { useState } from "react";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isAccountActive, setIsAccountActive] = useState(true);
  const { theme, toggleTheme } = useSidebar();

  const toggleNotifications = () =>
    setNotificationsEnabled(!notificationsEnabled);

  return (
    <div className="w-full h-screen bg-background px-3 py-10">
      <div className="max-w-screen-lg w-full mx-auto">
        <h1 className="md:text-2xl text-xl font-bold text-textPrimary mb-8">
          Settings
        </h1>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="bg-backgroundSecondary rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-textPrimary">
                  Appearance
                </h2>
                <p className="text-sm text-textSecondary mt-1">
                  Customize how the app looks and feels
                </p>
              </div>
            </div>
            <div className="w-72">
              <Select
                options={[
                  { value: "dark", label: "Dark Theme" },
                  { value: "light", label: "Light Theme" },
                  { value: "system", label: "System Default" },
                ]}
                placeholder="Choose theme"
                value={theme}
                onChange={({ value }) => {
                  if (value !== "system" && value !== theme) {
                    toggleTheme();
                  }
                }}
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-backgroundSecondary rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-textPrimary">
                  Notifications
                </h2>
                <p className="text-sm text-textSecondary mt-1">
                  Manage your notification preferences
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-textPrimary">
                    Push Notifications
                  </h3>
                  <p className="text-xs text-textSecondary mt-1">
                    Receive notifications even when you're not using the app
                  </p>
                </div>
                <label className="material-checkbox">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={toggleNotifications}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-backgroundSecondary rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-textPrimary">
                  Account Settings
                </h2>
                <p className="text-sm text-textSecondary mt-1">
                  Manage your account status and preferences
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-textPrimary mb-2">
                  Account Status
                </h3>
                <Button
                  fullWidth={true}
                  severity={isAccountActive ? "danger" : "primary"}
                  onClick={() => setIsAccountActive((prev) => !prev)}
                >
                  {isAccountActive ? "Deactivate Account" : "Activate Account"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
