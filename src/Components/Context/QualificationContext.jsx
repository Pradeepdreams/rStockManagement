import React, { createContext, useContext, useState } from "react";

const QualificationDialogContext = createContext();

export const useDialogForQualification = () => {
    return useContext(QualificationDialogContext);
};

export const QualificationDialogProvider = ({ children }) => {
    const [openDialogForQualification, setOpenDialogForQualification] =
        useState(false);
    const [qualificationPaginationData, setQualificationPaginationData] = useState(
        []
    );
    const [saveBtnForQualification, setSaveBtnForQualification] = useState("save");
    const [editIdForQualification, setEditIdForQualification] = useState("");
     const [qualificationInputs, setQualificationInputs] = useState(
        {
        name:"",
        description:""
        },
      );

    const toggleDialog = () => {
        setOpenDialogForQualification((prevState) => !prevState);
    };

    return (
        <QualificationDialogContext.Provider
            value={{
                openDialogForQualification,
                toggleDialog,
                setOpenDialogForQualification,
                qualificationPaginationData,
                setQualificationPaginationData,
                saveBtnForQualification,
                setSaveBtnForQualification,
                editIdForQualification,
                setEditIdForQualification,
                qualificationInputs,
                setQualificationInputs,
            }}
        >
            {children}
        </QualificationDialogContext.Provider>
    );
};
