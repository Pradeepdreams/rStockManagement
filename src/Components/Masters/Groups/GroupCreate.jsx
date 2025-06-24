import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  Bars3CenterLeftIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  InboxArrowDownIcon,
  NumberedListIcon,
  PencilIcon,
  PercentBadgeIcon,
  PhoneArrowDownLeftIcon,
  PlusCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  MapPinIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import GroupList from "./GroupList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import TopFilters from "../../Utils/TopFilters";
import { useDialogForGroup } from "../../Context/GroupDialogContext";
import GroupDialogBox from "./GroupDialogBox";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { RiUserStarFill } from "react-icons/ri";

function GroupCreate() {
  const { collapsed } = useOutletContext();

  const [open, setOpen] = useState(false);
  const [groupPagination, setGroupPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [saveBtn, setSaveBtn] = useState("save");
  const [idCryptForGroup, setIdCryptForGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState({});
  const { triggerToast } = useToast();
  const { searchTerm } = useSearch();

  const {
    openDialogForGroup,
    setOpenDialogForGroup,
    groupInputs,
    setGroupInputs,
    setSaveBtnForGroup,
    editIdForGroup,
    setEditIdForGroup,
  } = useDialogForGroup();

  const fetchGroup = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    // Convert filters to query string
    const queryParams = new URLSearchParams({
      page,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await axios.get(
        `public/api/groups?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setGroupPagination(response.data);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGroup(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForGroup = (e) => {
    e.preventDefault();
    setLoading(true);
    setOpenDialogForGroup(true);
    try {
      setOpen(true);
      setSaveBtn("save");
      setGroupInputs({
        name: "",
        is_active: "yes",
        description: "",
      });
    } catch (error) {
      triggerToast("Error!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HeadersAndAddButton
            title={"Groups"}
            description={"A list of all Groups report"}
            buttonName={"Add Groups"}
            setOpen={setOpen}
            handleDialogOpen={handleAddForGroup}
            buttonIcon={<RiUserStarFill/>}
          />

          <GroupList
            groupPagination={groupPagination}
            setOpen={setOpen}
            branchId={branchId}
            setSaveBtn={setSaveBtn}
            setGroupInputs={setGroupInputs}
            fetchGroup={fetchGroup}
            setIdCryptForGroup={setIdCryptForGroup}
            setCurrentPage={setCurrentPage}
            setLoading={setLoading}
            loading={loading}
            setIsEditing={setIsEditing}
            setOpenDialogForGroup={setOpenDialogForGroup}
            setSaveBtnForGroup={setSaveBtnForGroup}
            setEditIdForGroup={setEditIdForGroup}
          />

          {openDialogForGroup && (
            <GroupDialogBox
              openDialogForGroup={openDialogForGroup}
              setOpenDialogForGroup={setOpenDialogForGroup}
              groupInputs={groupInputs}
              setGroupInputs={setGroupInputs}
              fetchGroup={fetchGroup}
            />
          )}
        </>
      )}
    </>
  );
}

export default GroupCreate;
