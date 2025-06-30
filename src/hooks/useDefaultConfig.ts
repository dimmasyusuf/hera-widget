import { WidgetConfig } from "../api/type";

const useDefaultConfig = (): WidgetConfig => {
  const config: WidgetConfig = {
    // BASE
    agent_name: "Application Name",
    accent_color: "#ffffff",
    launcher_image: undefined,

    // ASISTANT
    avatar_image_url: undefined,
    launcher_image_url: undefined,
    avatar_image: undefined,

    // GREETING
    greeting_text: undefined,
    greeting_message: undefined,

    // FEEDBACK
    conversation_feedback: false,
    feedback_timer: undefined,
    feedback_reaction: false,

    // ASISTANT CHAT BUBLE
    assistant_chat_background_color: "#ffffff",
    assistant_chat_text_color: "#141522",
    assistant_mascot_name: "Assistant",
    assistant_show_mascot_name: undefined,
    assistant_show_mascot_image: undefined,

    // USER CHAT BUBLE
    user_chat_background_color:
      "linear-gradient(92deg, rgba(51, 105, 255, 0.25) 0%, rgba(112, 80, 227, 0.25) 100%);",
    user_chat_text_color: "#141522",
    user_show_profile_pic: false,
    user_show_profile_name: false,

    // AGREEMENT
    // agreement?: boolean;
    // agreement_text?: string;
    // agree_text?: string;
    // disagree_text?: string;
    // user_agree_text?: string;
    // user_disagree_text?: string;
    // agree_button_text?: string;
    // agree_button_background_color?: string;
    // agree_button_text_color?: string;
    // disagree_button_text?: string;
    // disagree_button_background_color?: string;
    // disagree_button_text_color?: string;

    // UPLOADING MEDIA
    image_upload: false,
    document_upload: false,
    image_upload_size: 50,
    document_upload_size: 50,

    // CITATION
    citation: false,
    disable_resource_citation: undefined
  };
  return config;
};

export default useDefaultConfig;
