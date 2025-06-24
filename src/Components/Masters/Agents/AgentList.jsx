import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import AgentDialogBox from "./AgentDialogBox";
import { useDialogForAgent } from "../../Context/AgentDialogContext";
import { useToast } from "../../Context/ToastProvider";

function AgentList({
  agentPagination,
  setLoading,
  setIsEditing,


  fetchAgent,
  branchId,
  loading,
  setCurrentPage,
}) {

  const [open, setOpen] = useState(false);
  const [agentEditData, setAgentEditData] = useState();
  const { triggerToast } = useToast();
  const {
    openDialogForAgent,
    setOpenDialogForAgent,
    setSaveBtnForAgent,
    setEditIdForAgent,
    agentInputs,
    setAgentInputs,


  } = useDialogForAgent();
  const [editId, setEditId] = useState("");

  const handleViewForAgent = async (e, id_crypt) => {
    // e.preventDefault();
    setOpenDialogForAgent(true);
    setEditIdForAgent(id_crypt);
    setLoading(true);
    setIsEditing(true);
    // setEditId(id_crypt);
    setSaveBtnForAgent("update");

    const token = localStorage.getItem("token");
    try {
      const responseForAgentEditData = await axios.get(
        `public/api/agents/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );
   
      setAgentEditData(responseForAgentEditData.data);
      setAgentInputs({
        name: responseForAgentEditData.data.name,
        phone: responseForAgentEditData.data.phone,
        email: responseForAgentEditData.data.email,
      });
   
      setEditId(responseForAgentEditData.data?.id_crypt);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  const headers = ["S.No", "Agent Name", "Email", "Phone", "Actions"];


  const renderRow = (agent, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">{agentPagination.from + index}</td>
      <td className="px-6 py-4">{agent.name}</td>
      <td className="px-6 py-4">{agent.email}</td>
      <td className="px-6 py-4">{agent.phone}</td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForAgent(e, agent.id_crypt)}
          >
            View
          </button>

          <DeleteConfirmation
            apiType="agents"
            id_crypt={agent.id_crypt}
            fetchDatas={fetchAgent}
            branchId={branchId}
            setLoading={setLoading}
            loading={loading}
            
          />
        </div>
      </td>
    </>
  );

  return (
    <>

      <Table
        headers={headers}
        data={agentPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={agentPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default AgentList;
