import { useEffect, useState } from "react";
import { requestHandler } from "@utils/index";
import { getProfile, updateAvatar, updateProfile } from "@api/index";
import { toast } from "sonner";
import { ProfileInterface } from "@interfaces/user";
import Loader from "@components/Loader";
import Button from "@components/Button";
import Input from "@components/Input";
import { useAuth } from "@context/AuthContext";
import AvatarEditor from "react-avatar-editor";
import { IconCamera } from "@tabler/icons-react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { user, updateAvatar: updateAvatarState } = useAuth();

  const [profile, setProfile] = useState<ProfileInterface>({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phoneNumber: "9000000000",
  });

  const [image, setImage] = useState<File | null>(null);
  const [editor, setEditor] = useState<AvatarEditor | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const onSubmit = async (data: ProfileInterface) => {
    requestHandler(
      async () => updateProfile(data),
      setSubmitLoading,
      ({ data }) => {
        const { firstName, lastName, email, phoneNumber } = data;
        setProfile({ firstName, lastName, email, phoneNumber });
        toast.success("Profile updated successfully!");
      },
      (err: any) => {
        toast.error(err);
      }
    );
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setShowEditor(true);
    }
  };

  const handleSaveAvatar = async () => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
          const formData = new FormData();
          formData.append("avatar", blob, "avatar.png");

          requestHandler(
            async () => updateAvatar(formData),
            setAvatarLoading,
            ({ data }) => {
              updateAvatarState(data);
              toast.success("Avatar updated successfully!");
              setShowEditor(false);
            },
            (err: any) => {
              toast.error(err);
            }
          );
        }
      });
    }
  };
  useEffect(() => {
    requestHandler(
      async () => getProfile(),
      setLoading,
      ({ data }) => {
        const { firstName, lastName, email, phoneNumber } = data;
        setProfile({ firstName, lastName, email, phoneNumber });
      },
      (err: any) => toast.error(err.message)
    );
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full h-screen flex justify-center items-center bg-background">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(profile);
        }}
        className="w-full max-w-screen-sm space-y-3 px-3"
      >
        <h1 className="text-3xl text-center text-textPrimary custom-font">
          Profile
        </h1>
        <div className="w-full flex md:flex-row flex-col-reverse h-auto items-center justify-center gap-2">
          <div className="md:w-[70%] w-full space-y-3">
            {/* Input for entering the firstName */}
            <div className="w-full">
              <Input
                placeholder="Enter your first name..."
                name="firstName"
                value={profile.firstName}
                onChange={onChangeHandler}
              />
            </div>
            {/* Input for entering the lastName */}
            <div className="w-full">
              <Input
                placeholder="Enter your last name..."
                name="lastName"
                value={profile.lastName}
                onChange={onChangeHandler}
              />
            </div>
            <div className="w-full">
              <Input
                type="number"
                name="phoneNumber"
                placeholder="Enter your phone number..."
                value={profile.phoneNumber}
                onChange={onChangeHandler}
              />
            </div>
          </div>
          <div className="md:w-[30%] w-[60%] relative group cursor-pointer rounded-md overflow-hidden">
            <img src={user?.avatar.url} alt="User Avatar" className="w-full" />
            <div className="w-full h-full absolute top-0 left-0 -z-10 bg-[#00000073] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:z-10 duration-150 ease-in-out">
              {/* Hidden file input */}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={onAvatarChange}
              />
              <IconCamera size={60} className="text-[#ffffffcb]" />
            </div>
          </div>
        </div>
        <div className="w-full">
          <Input
            type="email"
            placeholder="Enter your email..."
            name="email"
            value={profile.email}
            onChange={onChangeHandler}
          />
        </div>
        <div className="w-full pt-3">
          <Button
            fullWidth={true}
            disabled={submitLoading}
            isLoading={submitLoading}
          >
            Save Profile{" "}
          </Button>
        </div>
      </form>
      {showEditor && image && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-neutral-800 border-neutral-500 border-2 px-4 py-6 rounded-md">
            <AvatarEditor
              ref={(ref) => setEditor(ref)}
              image={image}
              width={200}
              height={200}
              border={50}
              color={[0, 0, 0, 0.6]} // RGBA
              scale={1.2}
            />
            <div className="flex justify-between mt-4 gap-2 md:flex-row flex-col">
              <Button
                onClick={() => setShowEditor(false)}
                severity="secondary"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAvatar}
                isLoading={avatarLoading}
                disabled={avatarLoading}
                fullWidth
              >
                Save Avatar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
