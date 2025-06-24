import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import AgentList from "./AgentList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import AgentDialogBox from "./AgentDialogBox";
import { useDialogForAgent } from "../../Context/AgentDialogContext";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";

function AgentCreate() {
  const { collapsed } = useOutletContext();

  const [agentPagination, setAgentPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { triggerToast } = useToast();
  const {searchTerm} = useSearch();

  const {
    openDialogForAgent,
    setOpenDialogForAgent,
    setSaveBtnForAgent,
    setAgentInputs,
    setEditIdForAgent,
  } = useDialogForAgent();

  const fetchAgent = async (page = 1, searchTerm) => {
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
        `public/api/agents?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds,
          },
        }
      );

      setAgentPagination(response.data.original.agents);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
    //   toast.error(
    //     error.response?.data?.message || "Failed to fetch attribute values"
    //   );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgent(currentPage,searchTerm);
  }, [currentPage,searchTerm]);

  const handleAddForAgent = () => {
    setOpenDialogForAgent(true);
    setSaveBtnForAgent("save");
    setEditIdForAgent("");
    setIsEditing(false);
    setAgentInputs({
      name: "",
      phone: "",
      email: "",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Agents"
        description="A list of all Agents"
        buttonName="Add Agent"
        setOpenDialogForAgent={setOpenDialogForAgent}
        handleDialogOpen={handleAddForAgent}
      />

      <AgentList
        agentPagination={agentPagination}
        setOpenDialogForAgent={setOpenDialogForAgent}
        branchId={branchId}
        setSaveBtnForAgent={setSaveBtnForAgent}
        setAgentInputs={setAgentInputs}
        fetchAgent={fetchAgent}
        setEditIdForAgent={setEditIdForAgent}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      {openDialogForAgent && (
        <AgentDialogBox
          openDialogForAgent={openDialogForAgent}
          setOpenDialogForAgent={setOpenDialogForAgent}
          fetchAgent={fetchAgent}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
      )}
    </>
  );
}

export default AgentCreate;
