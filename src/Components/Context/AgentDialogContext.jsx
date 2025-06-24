import React, { createContext, useContext, useState } from "react";

const AgentDialogContext = createContext();

export const useDialogForAgent = () => {
    return useContext(AgentDialogContext);
};

export const AgentDialogProvider = ({ children }) => {
    const [openDialogForAgent, setOpenDialogForAgent] =
        useState(false);
    const [agentPaginationData, setAgentPaginationData] = useState(
        []
    );
    const [saveBtnForAgent, setSaveBtnForAgent] = useState("save");
    const [editIdForAgent, setEditIdForAgent] = useState("");
    const [agentInputs, setAgentInputs] = useState({
        name: "",
        phone: "",
        email: "",
    });


    const toggleDialog = () => {
        setOpenDialogForAgent((prevState) => !prevState);
    };

    return (
        <AgentDialogContext.Provider
            value={{
                openDialogForAgent,
                toggleDialog,
                setOpenDialogForAgent,
                agentPaginationData,
                setAgentPaginationData,
                saveBtnForAgent,
                setSaveBtnForAgent,
                editIdForAgent,
                setEditIdForAgent,
                agentInputs,
                setAgentInputs,
            }}
        >
            {children}
        </AgentDialogContext.Provider>
    );
};
