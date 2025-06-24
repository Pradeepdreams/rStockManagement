import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import GstRegistrationList from "./GstRegistrationList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import GstRegistrationDialogBox from "./GstRegistrationDialogBox";
import { useDialogForGstRegistration } from "../../Context/GstRegistrationDialogContext";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { TbReceiptTax } from "react-icons/tb";

function GstRegistrationCreate() {
  const { collapsed } = useOutletContext();

  const [gstRegistrationPagination, setGstRegistrationPagination] = useState(
    []
  );
  const [branchId, setBranchId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { triggerToast } = useToast();
  const { searchTerm } = useSearch();

  const {
    openDialogForGstRegistration,
    setOpenDialogForGstRegistration,
    setSaveBtnForGstRegistration,
    setGstRegistrationInputs,
    setEditIdForGstRegistration,
  } = useDialogForGstRegistration();

  const fetchGstRegistration = async (page = 1, searchTerm) => {
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
        `public/api/gst-registration-types?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds,
          },
        }
      );

      setGstRegistrationPagination(response.data.gst_registration_types);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGstRegistration(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForGstRegistration = () => {
    setOpenDialogForGstRegistration(true);
    setSaveBtnForGstRegistration("save");
    setEditIdForGstRegistration("");
    setIsEditing(false);
    setGstRegistrationInputs({
      name: "",
      code: "",
      description: "",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Gst Registration Types"
        description="A list of all Gst Registration Types"
        buttonName="Add Gst Registration Type"
        setOpenDialogForGstRegistration={setOpenDialogForGstRegistration}
        handleDialogOpen={handleAddForGstRegistration}
        buttonIcon={<TbReceiptTax/>}
      />

      <GstRegistrationList
        gstRegistrationPagination={gstRegistrationPagination}
        setOpenDialogForGstRegistration={setOpenDialogForGstRegistration}
        branchId={branchId}
        setSaveBtnForGstRegistration={setSaveBtnForGstRegistration}
        setGstRegistrationInputs={setGstRegistrationInputs}
        fetchGstRegistration={fetchGstRegistration}
        setEditIdForGstRegistration={setEditIdForGstRegistration}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      {openDialogForGstRegistration && (
        <GstRegistrationDialogBox
          openDialogForGstRegistration={openDialogForGstRegistration}
          setOpenDialogForGstRegistration={setOpenDialogForGstRegistration}
          fetchGstRegistration={fetchGstRegistration}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
      )}
    </>
  );
}

export default GstRegistrationCreate;
