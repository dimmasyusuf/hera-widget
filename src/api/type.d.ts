export type ChatReference = {
  index: string;
  name: string;
  url: string;
};

interface Message {
  type: string; // e.g., "steps", "text", etc.
  payload: {
    content: string | Record<string, any>[] | string[]; // The actual message content
  };
}

export type Chat = {
  id: string;
  role: "user" | "assistant";
  type?: string;
  message: Message[] | string;
  created_at: Date;
  reference?: ChatReference[];
  context?: {
    feedback?: string;
    feedback_message?: string;
  };
  file?: File;
};

export type Answer = {
  conversation_id: string;
  response: {
    text: string;
    ref: string | null;
  }[];
  references: Record<string, any>;
  replySuggestions: string[];
  action: {
    name: string | null;
    input: string | null;
    isConditionFulfilled: boolean;
  };
  context: Record<string, any>;
};

export type CreateChatResponse = {
  status: "success" | "error";
  answer?: Answer;
  message?: string;
};

export type ChatInput = {
  role: "user" | "assistant";
  message: string;
  user_id: string;
  file?: File;
};

export type FeedbackInput = {
  chat_id: string;
  feedback: string;
  feedback_message: string;
};

export type AppConfigImage = {
  name: string;
  image_url: string;
};

export type SkillResourceItem = {
  id: string;
  name: string;
  metadata: { filetype: string }[];
};

export type WidgetConfig = {
  // greeting settings
  greeting_text?: string;
  greeting_message?: string;

  // citation settings
  citation?: boolean;

  // feedback settings
  conversation_feedback?: boolean;
  feedback_timer?: number;
  feedback_reaction?: boolean;

  // agreement settings
  agreement?: boolean;
  agreement_text?: string;
  agree_text?: string;
  disagree_text?: string;
  user_agree_text?: string;
  user_disagree_text?: string;
  agree_button_text?: string;
  agree_button_background_color?: string;
  agree_button_text_color?: string;
  disagree_button_text?: string;
  disagree_button_background_color?: string;
  disagree_button_text_color?: string;

  // assistant chat bubble settings
  assistant_mascot_name?: string;
  assistant_show_mascot_name?: string;
  assistant_show_mascot_image?: string;
  assistant_chat_background_color?: string;
  assistant_chat_text_color?: string;

  // user chat bubble settings
  user_chat_background_color?: string;
  user_chat_text_color?: string;
  user_show_profile_pic?: boolean;
  user_show_profile_name?: boolean;

  // attachment media settings
  audio_upload?: boolean;
  image_upload?: boolean;
  document_upload?: boolean;
  image_upload_size?: number;
  document_upload_size?: number;
  disable_resource_citation?: SkillResourceItem[];

  // company settings
  company_logo_url?: string;
  company_logo?: AppConfigImage;

  // agent settings
  agent_name?: string;
  avatar_image_url?: string;
  avatar_image?: AppConfigImage;

  app_logo_url?: string;
  app_logo?: AppConfigImage;

  // laucher settings
  launcher_image_url?: string;
  launcher_image?: AppConfigImage;

  // widget settings
  bg_color?: string;
  accent_color?: string;
  radius?: number;
  border_color?: string;
  toolbar_color?: string;

  // typography settings
  primary_text_color?: string;
  secondary_text_color?: string;
  highlight_text_color?: string;

  // button settings
  button_bg_color?: string;
  button_text_color?: string;
};

export type WidgetInput = {
  identity: string;
  data?: Record<string, any>;
};

export type InitWidgetResponseData = {
  convo_id: string;
  id: string;
  data: JSON;
};

export type Widget = {
  app: {
    id: string;
    name: string;
    description: string;
    config: WidgetConfig;
  };
  agent: {
    id: string;
    name: string;
    config: {
      srap?: boolean;
      enable_latency?: boolean;
    };
  };
};

export type ListQueryResponse<T = Record<string, any>> = {
  status?: string;
  message?: string;
  items: T[];
  total?: number;
};

export type DetailQueryResponse<T = Record<string, any>> = {
  status?: string;
  message?: string;
  data: T;
};

export type MutationResponse<T = Record<string, any>> = {
  status?: "success" | "error";
  data?: T;
  message?: string;
};
