import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
    PencilIcon,
    XMarkIcon,
    UserCircleIcon,
    PercentBadgeIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import AreaList from "./AreaList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { RadioIcon } from "@heroicons/react/24/solid";
import SocailMediaDialogBox from "../SocialMedia/SocailMediaDialogBox";
import { useDialog } from "../../Context/DialogContext";
import AreaDialogBox from "./AreaDialogBox";
import { useDialogForArea } from "../../Context/AreaDialogContext";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";

function AreaCreate() {
    const { collapsed } = useOutletContext();

    const [areaPagination, setAreaPagination] = useState([]);
    const [branchId, setBranchId] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filterData, setFilterData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const { triggerToast } = useToast();
    const {searchTerm} = useSearch();


    const {
        openDialogForArea,
        setOpenDialogForArea,
        setSaveBtnForArea,
        setAreaInputs,
        setEditIdForArea
    } = useDialogForArea();




    const fetchArea = async (page = 1,searchTerm) => {
        setLoading(true);
        const branchData = await getBranchDataFromBalaSilksDB();
        const branchIds = branchData.map((branch) => branch.branch.id_crypt);
        setBranchId(branchIds);

        const token = localStorage.getItem("token");

         const queryParams = new URLSearchParams({
      page,
      
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }


        try {
            const response = await axios.get(
                `public/api/areas?${queryParams.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Branch-Id": branchIds,
                    },
                }
            );


            setAreaPagination(response.data.areas);
        } catch (error) {
            triggerToast("Fetch failed!", error.response?.data?.message, "error");
      
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArea(currentPage,searchTerm);
    }, [currentPage,searchTerm]);


    const handleAddForArea = () => {

        setOpenDialogForArea(true)
        setSaveBtnForArea("save");
        setEditIdForArea("");
        setIsEditing(false);
        setAreaInputs({
            name: "",
            area_code: "",
        });
    };

    return loading ? (
        <Loader />
    ) : (
        <>
            <HeadersAndAddButton
                title="Areas"
                description="A list of all Areas"
                buttonName="Add Area"
                setOpenDialogForArea={setOpenDialogForArea}
                handleDialogOpen={handleAddForArea}
            />

            <AreaList
                areaPagination={areaPagination}
                setOpenDialogForArea={setOpenDialogForArea}
                branchId={branchId}
                setSaveBtnForArea={setSaveBtnForArea}
                setAreaInputs={setAreaInputs}
                fetchArea={fetchArea}
                setEditIdForArea={setEditIdForArea}
                setCurrentPage={setCurrentPage}
                setLoading={setLoading}
                loading={loading}
                setIsEditing={setIsEditing}
            />

            {openDialogForArea &&
                <AreaDialogBox
                    openDialogForArea={openDialogForArea}
                    setOpenDialogForArea={setOpenDialogForArea}
                    fetchArea={fetchArea}
                    setIsEditing={setIsEditing}
                    isEditing={isEditing}
                />}


        </>
    );
}

export default AreaCreate;
