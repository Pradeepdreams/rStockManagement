import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { useDialogForLogistics } from "../../Context/LogisticsDialogContext";
import LogisticsList from "./LogisticsList";
import LogisticsDialogBox from "./LogisticsDialogBox";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { BsMinecartLoaded } from "react-icons/bs";

function LogisticsCreate() {
  const { collapsed } = useOutletContext();
  const [logisticsPagination, setLogisticsPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { triggerToast } = useToast();
  const { searchTerm } = useSearch();

  const {
    openDialogForLogistics,
    setOpenDialogForLogistics,
    setSaveBtnForLogistics,
    setLogisticsInputs,
    setEditIdForLogistics,
    logisticsInputs,
    saveBtnForLogistics,
    editIdForLogistics,
  } = useDialogForLogistics();

  const fetchLogistics = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await axios.get(
        `public/api/logistics?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setLogisticsPagination(response.data.logistics);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch attribute values"
      // );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogistics(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForLogistics = () => {
    setOpenDialogForLogistics(true);
    setSaveBtnForLogistics("save");
    setEditIdForLogistics("");
    setIsEditing(false);
    setLogisticsInputs({
      name: "",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Logistics"
        description="A list of all logistics"
        buttonName="Add Logistics"
        setOpenDialogForLogistics={setOpenDialogForLogistics}
        handleDialogOpen={handleAddForLogistics}
        buttonIcon={<BsMinecartLoaded />}
      />

      <LogisticsList
        logisticsPagination={logisticsPagination}
        setOpenDialogForLogistics={setOpenDialogForLogistics}
        setSaveBtnForLogistics={setSaveBtnForLogistics}
        setLogisticsInputs={setLogisticsInputs}
        fetchLogistics={fetchLogistics}
        setEditIdForLogistics={setEditIdForLogistics}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      {openDialogForLogistics && (
        <LogisticsDialogBox
          openDialogForLogistics={openDialogForLogistics}
          setOpenDialogForLogistics={setOpenDialogForLogistics}
          fetchLogistics={fetchLogistics}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          setLoading={setLoading}
          logisticsInputs={logisticsInputs}
          setLogisticsInputs={setLogisticsInputs}
          saveBtnForLogistics={saveBtnForLogistics}
          setSaveBtnForLogistics={setSaveBtnForLogistics}
          editIdForLogistics={editIdForLogistics}
          setEditIdForLogistics={setEditIdForLogistics}
        />
      )}
    </>
  );
}

export default LogisticsCreate;
