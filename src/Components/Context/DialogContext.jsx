import React, { createContext, useContext, useState } from "react";

const DialogContext = createContext();

export const useDialog = () => {
  return useContext(DialogContext);
};

export const DialogProvider = ({ children }) => {
  const [openDialogForSocialMedia, setOpenDialogForSocialMedia] =
    useState(false);
  const [socailMediaPaginationData, setSocailMediaPaginationData] = useState(
    []
  );
  const [saveBtnForSocialMedia, setSaveBtnForSocialMedia] = useState("save");
  const [editIdForSocialMedia, setEditIdForSocialMedia] = useState("");
  const [socialMediaInputs, setSocialMediaInputs] = useState({
    name: "",
    links: "",
  });

  return (
    <DialogContext.Provider
      value={{
        openDialogForSocialMedia,
        setOpenDialogForSocialMedia,
        socailMediaPaginationData,
        setSocailMediaPaginationData,
        saveBtnForSocialMedia,
        setSaveBtnForSocialMedia,
        editIdForSocialMedia,
        setEditIdForSocialMedia,
        socialMediaInputs,
        setSocialMediaInputs,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
