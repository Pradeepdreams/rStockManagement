import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { useDialogForBranch } from "../../Context/BranchesDialogContext";
import BranchesDialogBox from "./BranchesDialogBox";
import BranchesList from "./BranchesList";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { FaRegBuilding } from "react-icons/fa";

function BranchesCreate() {
  const [branchPagination, setBranchPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { triggerToast } = useToast();
  const {searchTerm} = useSearch();

  const {
    openDialogForBranch,
    setOpenDialogForBranch,
    setSaveBtnForBranch,
    saveBtnForBranch,
    setBranchInputs,
    branchInputs,
    setEditIdForBranch,
    editIdForBranch,
  } = useDialogForBranch();

  const fetchBranch = async (page = 1,searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
      search:searchTerm
    });

    try {
      const response = await axios.get(
        `public/api/branches?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setBranchPagination(response.data.branches);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranch(currentPage,searchTerm);
  }, [currentPage,searchTerm]);

  const handleAddForBranch = () => {
    setOpenDialogForBranch(true);
    setSaveBtnForBranch("save");
    setEditIdForBranch("");
    setIsEditing(false);
    setBranchInputs({
      name: "",
      area_code: "",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Branches"
        description="A list of all branches"
        buttonName="Add Branches"
        setOpenDialogForBranch={setOpenDialogForBranch}
        handleDialogOpen={handleAddForBranch}
         buttonIcon={<FaRegBuilding  />}
      />

      <BranchesList
        branchPagination={branchPagination}
        setOpenDialogForBranch={setOpenDialogForBranch}
        setSaveBtnForBranch={setSaveBtnForBranch}
        setBranchInputs={setBranchInputs}
        fetchBranch={fetchBranch}
        setEditIdForBranch={setEditIdForBranch}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      {openDialogForBranch && (
        <BranchesDialogBox
          openDialogForBranch={openDialogForBranch}
          setOpenDialogForBranch={setOpenDialogForBranch}
          fetchBranch={fetchBranch}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          saveBtnForBranch={saveBtnForBranch}
          branchInputs={branchInputs}
          setBranchInputs={setBranchInputs}
          setEditIdForBranch={setEditIdForBranch}
          editIdForBranch={editIdForBranch}
        />
      )}
    </>
  );
}

export default BranchesCreate;
