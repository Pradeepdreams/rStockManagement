import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import PincodeList from "./PincodeList";
import PincodeDialogBox from "./PincodeDialogBox";
import { useDialogForPincode } from "../../Context/PincodeDialogContext";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { RiUserStarFill } from "react-icons/ri";

function PincodeCreate() {
  const { collapsed } = useOutletContext();
  const { triggerToast } = useToast();
  const {
    pincodeInputs,
    setPincodeInputs,
    openDialogForPincode,
    setOpenDialogForPincode,
    setSaveBtnForPincode,
    saveBtnForPincode,
    setEditIdForPincode,
    editIdForPincode,
    setPincodePaginationData,
    pincodePaginationData,
  } = useDialogForPincode();
  const { searchTerm } = useSearch();

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [requiredFields, setRequiredFields] = useState({
    country: false,
    state: false,
    city: false,
    pincode: false,
  });

  const fetchPincode = async (page = 1, searchTerm) => {
    setLoading(true);

    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const queryParams = new URLSearchParams({
      page,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await axios.get(
        `public/api/pincodes?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(response.data);

      setPincodePaginationData(response.data?.pincodes);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch categories"
      // );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPincode(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForPincode = async (e) => {
    e.preventDefault();
    setOpenDialogForPincode(true);
    setSaveBtnForPincode("save");
    setIsEditing(false);
    setRequiredFields("");
    setPincodeInputs({
      country: "",
      state: "",
      city: "",
      pincode: "",
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HeadersAndAddButton
            title={"Pincode"}
            description={"A list of all pincode report"}
            buttonName={"Add Pincode"}
            handleDialogOpen={handleAddForPincode}
            buttonIcon={<RiUserStarFill/>}
          />

          <PincodeList
            pincodePaginationData={pincodePaginationData}
            setOpenDialogForPincode={setOpenDialogForPincode}
            setSaveBtnForPincode={setSaveBtnForPincode}
            setPincodeInputs={setPincodeInputs}
            fetchPincode={fetchPincode}
            setEditIdForPincode={setEditIdForPincode}
            setCurrentPage={setCurrentPage}
            setLoading={setLoading}
            loading={loading}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            setRequiredFields={setRequiredFields}
          />

          {openDialogForPincode && (
            <PincodeDialogBox
              openDialogForPincode={openDialogForPincode}
              setOpenDialogForPincode={setOpenDialogForPincode}
              pincodeInputs={pincodeInputs}
              setPincodeInputs={setPincodeInputs}
              saveBtnForPincode={saveBtnForPincode}
              setSaveBtnForPincode={setSaveBtnForPincode}
              requiredFields={requiredFields}
              isEditing={isEditing}
              fetchPincode={fetchPincode}
              setRequiredFields={setRequiredFields}
              setLoading={setLoading}
              editIdForPincode={editIdForPincode}
              collapsed={collapsed}
              setIsEditing={setIsEditing}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </>
  );
}

export default PincodeCreate;
