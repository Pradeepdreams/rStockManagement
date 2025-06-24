import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";

import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import VendorGroupsList from "./VendorGroupsList";
import VendorGroupsDialogBox from "./VendorGroupsDialogBox";
import { useDialogForVendorGroup } from "../../Context/VendorGroupDialogContext";
import { useSearch } from "../../Context/SearchContext";
import { RiUserStarFill } from "react-icons/ri";

function VendorGroupsCreate() {
  const { collapsed } = useOutletContext();

  const [open, setOpen] = useState(false);
  const [vendorGroupPagination, setvendorGroupPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [saveBtn, setSaveBtn] = useState("save");
  const [idCryptForGroup, setIdCryptForGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState({});

  const {
    openDialogForVendorGroup,
    setOpenDialogForVendorGroup,
    vendorGroupInputs,
    setVendorGroupInputs,
    saveBtnForVendorGroup,
    setSaveBtnForVendorGroup,
    editIdForVendorGroup,
    setEditIdForVendorGroup,
    vendorGroupPaginationData,
    setVendorGroupPaginationData,
  } = useDialogForVendorGroup();

  const { searchTerm } = useSearch();

  const fetchVendorGroup = async (page = 1, searchTerm) => {
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
        `public/api/vendor-groups?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(response, "response.data");

      setVendorGroupPaginationData(response.data.vendor_groups);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVendorGroup(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForVendorGroup = (e) => {
    e.preventDefault();
    setLoading(true);
    setOpenDialogForVendorGroup(true);
    try {
      setOpen(true);
      setSaveBtn("save");
      setVendorGroupInputs({
        name: "",
        is_active: "yes",
        description: "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
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
            title={"Vendor Groups"}
            description={"A list of all vendor groups report"}
            buttonName={"Add Vendor Groups"}
            handleDialogOpen={handleAddForVendorGroup}
             buttonIcon={<RiUserStarFill/>}
          />

          <VendorGroupsList
            vendorGroupPaginationData={vendorGroupPaginationData}
            setVendorGroupInputs={setVendorGroupInputs}
            fetchVendorGroup={fetchVendorGroup}
            setIdCryptForGroup={setIdCryptForGroup}
            setCurrentPage={setCurrentPage}
            setLoading={setLoading}
            loading={loading}
            setIsEditing={setIsEditing}
            setOpenDialogForVendorGroup={setOpenDialogForVendorGroup}
            setSaveBtnForVendorGroup={setSaveBtnForVendorGroup}
            setEditIdForVendorGroup={setEditIdForVendorGroup}
          />

          {openDialogForVendorGroup && (
            <VendorGroupsDialogBox
              openDialogForVendorGroup={openDialogForVendorGroup}
              setOpenDialogForVendorGroup={setOpenDialogForVendorGroup}
              vendorGroupInputs={vendorGroupInputs}
              setVendorGroupInputs={setVendorGroupInputs}
              fetchVendorGroup={fetchVendorGroup}
              saveBtnForVendorGroup={saveBtnForVendorGroup}
              editIdForVendorGroup={editIdForVendorGroup}
              setEditIdForVendorGroup={setEditIdForVendorGroup}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              // fetchVendorGroupAfterDialogClose={fetchVendorGroupAfterDialogClose}
            />
          )}
        </>
      )}
    </>
  );
}

export default VendorGroupsCreate;
