import React, { createContext, useContext, useState } from "react";

// Tipe untuk konteks
interface ButtonContextType {
  isDisabled: boolean;
  disableButton: () => void;
  enableButton: () => void;
}

// Buat konteks
const ButtonContext = createContext<ButtonContextType | undefined>(undefined);

// Provider untuk mengelola status tombol
export const ButtonProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const disableButton = () => setIsDisabled(true);
  const enableButton = () => setIsDisabled(false);

  return (
    <ButtonContext.Provider value={{ isDisabled, disableButton, enableButton }}>
      {children}
    </ButtonContext.Provider>
  );
};

// Custom hook untuk menggunakan konteks
export const useButtonContext = () => {
  const context = useContext(ButtonContext);
  if (context === undefined) {
    throw new Error("useButtonContext must be used within a ButtonProvider");
  }
  return context;
};
