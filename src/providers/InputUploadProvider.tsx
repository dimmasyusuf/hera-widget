import React, { createContext, useState, useContext, ReactNode } from "react";

interface InputUploadContextType {
  uploadedFiles: File[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (fileName: string) => void;
  clearFiles: () => void;
}

const InputUploadContext = createContext<InputUploadContextType | undefined>(
  undefined
);

interface InputUploadProviderProps {
  children: ReactNode;
}

export const InputUploadProvider: React.FC<InputUploadProviderProps> = ({
  children
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const addFiles = (newFiles: File[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prevFiles =>
      prevFiles.filter(file => file.name !== fileName)
    );
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <InputUploadContext.Provider
      value={{ uploadedFiles, addFiles, removeFile, clearFiles }}
    >
      {children}
    </InputUploadContext.Provider>
  );
};

export const useInputUpload = (): InputUploadContextType => {
  const context = useContext(InputUploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an InputUploadProvider");
  }
  return context;
};
