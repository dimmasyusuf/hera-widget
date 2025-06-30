import React, { useMemo, useState } from "react";
import { Chat } from "../api/type";
import useConfig from "../hooks/useConfig";
import useAttributeConfig from "../hooks/useAttributeConfig";
import store from "store2";

const DEFAULT_STORE_KEY = "heracx-userdata";
const DEFAULT_USER_NAME_KEY = "name";

type ChatRowHeaderProps = {
  chat?: Partial<Chat>;
};

const SkeletonLoader: React.FC = () => {
  return (
    <div className="heracx-w-full heracx-h-full heracx-bg-gray-300 heracx-animate-pulse heracx-rounded-full "></div>
  );
};

const SmoothImageWithSkeleton: React.FC<{ src: string; alt: string }> = ({
  src,
  alt
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="relative heracx-w-5 heracx-h-5">
      {!isLoaded && <SkeletonLoader />}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className={`heracx-w-5 heracx-h-5 heracx-rounded-full heracx-object-cover transition-opacity duration-1000 ease-in-out ${
          isLoaded ? "heracx-opacity-100" : "heracx-opacity-0"
        }`}
      />
    </div>
  );
};

const ChatRowHeader: React.FC<ChatRowHeaderProps> = ({ chat }) => {
  const {
    user_show_profile_name,
    user_show_profile_pic,
    agent_name,
    avatar_image_url,
    assistant_show_mascot_name,
    assistant_show_mascot_image,
    avatar_image
  } = useConfig();

  const {
    user: { data: userData }
  } = useAttributeConfig();
  const LS_DATA = store.get(DEFAULT_STORE_KEY);
  const userProfileName =
    userData?.[DEFAULT_USER_NAME_KEY] || LS_DATA?.[DEFAULT_USER_NAME_KEY] || "";

  const userProfilePictureUrl = useMemo(() => {
    return (
      userData?.["imageUrl"] ||
      `https://avatar.iran.liara.run/public?username=${userProfileName}`
    );
  }, [userData, userProfileName]);

  const assistantProfilePictureUrl = useMemo(() => {
    const url = avatar_image?.image_url || avatar_image_url;
    return url ? (url?.includes("blob:") ? "" : url) : "";
  }, [avatar_image_url, avatar_image?.image_url]);

  if (!chat) return null;

  const isAssistant = chat.role === "assistant";

  if (
    isAssistant &&
    (assistant_show_mascot_name || assistant_show_mascot_image)
  ) {
    return (
      <div className="heracx-flex heracx-items-center heracx-gap-2">
        {assistantProfilePictureUrl && assistant_show_mascot_image ? (
          <SmoothImageWithSkeleton
            src={assistantProfilePictureUrl}
            alt="assistant profile"
          />
        ) : null}
        {agent_name && assistant_show_mascot_name ? (
          <p className="heracx-my-0 heracx-font-semibold">{agent_name}</p>
        ) : null}
      </div>
    );
  }

  if (!isAssistant && (user_show_profile_name || user_show_profile_pic)) {
    return (
      <div className="heracx-flex heracx-items-center heracx-gap-2">
        {user_show_profile_pic && (
          <SmoothImageWithSkeleton
            src={userProfilePictureUrl}
            alt="user profile"
          />
        )}
        {user_show_profile_name && (
          <p className="heracx-my-0 heracx-font-semibold">
            {userProfileName || "John Doe"}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default ChatRowHeader;
