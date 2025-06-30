import { FlexLayout } from "./layout-flex";
import { useForm } from "react-hook-form";
import { useWidgetContext } from "../providers/WidgetProvider";
import AlertError from "./alert-error";
import InputText from "./input-text";
import Button from "./button";
import useWidgetOperation from "../hooks/useWidgetOperation";
import store from "store2";
import React, { useEffect, useMemo, useCallback } from "react";
import Loading from "./loading";
import { getParams } from "../lib/getParams";
import { nanoid } from "nanoid";
import useAttributeConfig from "../hooks/useAttributeConfig";
import useConfig from "../hooks/useConfig";
import { classNames } from "../lib/helper";

const DEFAULT_FORMS = [
  {
    label: "Full name",
    name: "name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    label: "Email address",
    name: "email",
    type: "text",
    placeholder: "Enter your email address",
    required: true,
  },
  {
    label: "Phone number",
    name: "phone",
    type: "tel",
    placeholder: "e.g. +62812XXXXXXX or 0812XXXXXXX",
    required: true,
  },
] as const;

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_PATTERN = /^(\+?[1-9]\d{0,3}|0)[0-9]{6,14}$/;
const DEFAULT_STORE_KEY = "heracx-userdata";

const params = getParams();
const mode = params?.get("mode");

interface FormData {
  name: string;
  email: string;
  phone: string;
  [key: string]: string;
}

const ScreenForm: React.FC = () => {
  const { setState } = useWidgetContext();
  const attributes = useAttributeConfig();
  const { primary_text_color, secondary_text_color } = useConfig();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "all",
    reValidateMode: "onChange",
  });

  const defaultIdentity = useMemo(
    () => (attributes.hideEmailForm ? "name" : "email"),
    [attributes.hideEmailForm],
  );

  const filteredForms = useMemo(() => {
    if (attributes.hideEmailForm) {
      return DEFAULT_FORMS.filter((item) => item.name === "name");
    }
    return DEFAULT_FORMS;
  }, [attributes.hideEmailForm]);

  const LS_DATA = store.get(DEFAULT_STORE_KEY);
  const IDENTITY = LS_DATA?.[defaultIdentity];

  const { action, status, data } = useWidgetOperation({
    events: {
      onInitSuccess: (r) => {
        if (!r.data) return;
        const { data, convo_id, id: user_id } = r.data;
        if (!data) {
          return store.remove(DEFAULT_STORE_KEY);
        }
        setState((prev) => ({ ...prev, convo_id, user_id }));
        if (mode === "anonymous") return;
        if (!attributes.user.identity) {
          store(DEFAULT_STORE_KEY, data);
        }
      },
    },
  });
  const title = data.widget?.app.name || "HERA";
  const error = status.init.error;
  const busy = status.init.busy;

  const formatPhoneNumber = useCallback((phone: string): string => {
    if (!phone) return phone;
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      return `+62${digits.substring(1)}`;
    }
    return digits.startsWith("+") ? digits : `+${digits}`;
  }, []);

  useEffect(() => {
    if (!attributes.user.identity) {
      if (mode === "anonymous") {
        const identity = "ANONYMOUS-USER--" + nanoid().toUpperCase();
        return action.init({ identity, data: { identity } });
      }
      IDENTITY && action.init({ identity: IDENTITY, data: LS_DATA });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [IDENTITY, attributes.user.identity]);

  const onSubmit = handleSubmit((data) => {
    action.init({
      identity: data[defaultIdentity],
      data: {
        ...data,
        phone: formatPhoneNumber(data.phone),
      },
    });
  });

  useEffect(() => {
    if (attributes.user.identity && !busy) {
      action.init({
        identity: attributes.user.identity,
        data: attributes.user.data,
      });
    }
  }, [attributes, busy]);

  if (
    (((LS_DATA && IDENTITY) || mode === "anonymous") && !error && busy) ||
    attributes.user.identity
  )
    return <Loading />;

  return (
    <FlexLayout
      direction="column"
      auto
      scrollable
      className="heracx-w-full heracx-font-normal"
    >
      {error && (
        <AlertError
          message={error.message || "Error initializing widget user data"}
        />
      )}
      <div className="heracx-space-y-6 heracx-p-6">
        <div className="heracx-flex heracx-flex-col heracx-gap-3">
          <h1
            className="heracx-m-0 heracx-text-lg !heracx-font-semibold"
            style={{
              color: primary_text_color || "#141522",
            }}
          >
            Hello there! 👋
          </h1>
          <p
            className="heracx-m-0 heracx-text-sm"
            style={{
              color: secondary_text_color || "#54577A",
            }}
          >
            Hi! I'm {title}, your virtual assistant!
            <br />
            Got any questions? Feel free to ask, I'm here to help! ✨
          </p>
        </div>

        {filteredForms.map((form) => (
          <div key={form.name}>
            <label
              htmlFor={form.name}
              className={classNames(
                "heracx-block heracx-text-sm heracx-leading-6",
              )}
              style={{
                color: primary_text_color || "#141522",
              }}
            >
              {form.label}
              {form.required && (
                <span className="heracx-ml-1 heracx-text-red-600">*</span>
              )}
            </label>
            <div className="heracx-mt-2 heracx-flex">
              <InputText
                id={form.name}
                disabled={busy}
                required
                type={form.type}
                placeholder={form.placeholder}
                {...register(form.name, {
                  required: {
                    message: `${form.label} is required`,
                    value: true,
                  },
                  ...(form.name === "email" && {
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Please enter a valid email address",
                    },
                  }),
                  ...(form.name === "phone" && {
                    pattern: {
                      value: PHONE_PATTERN,
                      message: "Please enter a valid phone number",
                    },
                  }),
                })}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") {
                    onSubmit();
                  }
                }}
              />
            </div>
            {errors[form.name] && (
              <p className="heracx-mt-2 heracx-text-xs heracx-text-red-600">
                {errors[form.name]?.message}
              </p>
            )}
          </div>
        ))}
        <p
          className={classNames("heracx-mt-4 heracx-text-xs heracx-italic")}
          style={{
            color: secondary_text_color || "#8E92BC",
          }}
        >
          To maintain our service quality standards, this conversation may be
          recorded and monitored for quality assurance and training purposes. By
          continuing, you accept these service conditions.
        </p>

        <Button disabled={!isValid || status.init.busy} onClick={onSubmit}>
          Start Conversation
        </Button>
      </div>

      <p
        className="heracx-m-0 heracx-mb-6 heracx-text-center heracx-text-xs heracx-font-medium"
        style={{
          color: secondary_text_color || "#8E92BC",
        }}
      >
        Powered by{" "}
        <a
          href="https://heracx.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="heracx-cursor-pointer heracx-text-[#546FFF] heracx-no-underline hover:heracx-underline"
        >
          HERA
        </a>
      </p>
    </FlexLayout>
  );
};

export default ScreenForm;
