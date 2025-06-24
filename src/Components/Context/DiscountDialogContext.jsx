import { createContext, useContext, useState } from "react";

const DiscountDialogContext = createContext();

export const useDiscountDialog=()=>{
    return useContext(DiscountDialogContext)
}

export const DiscountDialogProvider=({children})=>{
    const [openDialogForDiscount, setOpenDialogForDiscount] =
            useState(false);
        const [discountPaginationData, setDiscountPaginationData] = useState(
            []
        );
        const [saveBtnForDiscount, setSaveBtnForDiscount] = useState("save");
        const [editIdForDiscount, setEditIdForDiscount] = useState("");
        const [discountInputs, setDiscountInputs] = useState({
            discount_percent: "",
            discount_type: "",
            applicable_date:""
        });
    
    
        const toggleDialog = () => {
            setOpenDialogForDiscount((prevState) => !prevState);
        };

        return (
            <DiscountDialogContext.Provider value={{
                openDialogForDiscount,
                toggleDialog,
                setOpenDialogForDiscount,
                discountPaginationData,
                setDiscountPaginationData,
                saveBtnForDiscount,
                setSaveBtnForDiscount,
                editIdForDiscount,
                setEditIdForDiscount,
                discountInputs,
                setDiscountInputs
            }}
            >
                {children}
            </DiscountDialogContext.Provider>
        )
}
