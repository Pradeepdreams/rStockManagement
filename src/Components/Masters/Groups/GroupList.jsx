import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import {
  FaHashtag,
  FaUsersCog,
  FaInfoCircle,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

function GroupList({
  groupPagination,
  setOpen,
  branchId,
  setSaveBtn,
  setGroupInputs,
  fetchGroup,
  setIdCryptForGroup,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
  setOpenDialogForGroup,
  setSaveBtnForGroup,
  setEditIdForGroup,
}) {
  const { triggerToast } = useToast();
  const handleViewForGroup = async (e, id_crypt) => {
    e.preventDefault();
    setLoading(true);
    setIsEditing(true);
    setOpenDialogForGroup(true);
    setEditIdForGroup(id_crypt);
    setSaveBtnForGroup("update");

    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const response = await axios.get(`public/api/groups/${id_crypt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      const group = response.data.data;
      setGroupInputs({
        name: group.name,
        is_active: group.is_active ? "yes" : "no",
        description: group.description,
      });
    } catch (error) {
      triggerToast("Error!", error.response?.data?.message, "error");
      // toast.error(error?.response?.data?.message || "Error fetching group.");
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    "S.No",
    "Group Name",
    "Active Status",
    "Actions",
  ];

  const renderRow = (group, index) => (
    <>
      {/* Index */}
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 text-left rounded text-sm font-medium">
          <FaHashtag className="text-gray-500 " />
          {groupPagination.groups.from + index}
        </span>
      </td>

      {/* Group Name */}
      <td className="px-6 py-4  text-left">
        <span className="inline-flex items-center gap-1  px-2 py-1  text-left rounded text-sm font-medium capitalize">
          <FaUsersCog className="text-blue-600 w-5 h-5" />
          {group.name || "N/A"}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4 text-left">
        <span
          className={`inline-flex items-center  text-left gap-1 px-2 py-1 text-sm font-semibold rounded
        ${
          group.is_active == "1" || group.is_active === 1
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
        >
          {group.is_active == "1" || group.is_active === 1 ? (
            <>
              <FaToggleOn className="text-green-600" />
              Active
            </>
          ) : (
            <>
              <FaToggleOff className="text-red-600" />
              Inactive
            </>
          )}
        </span>
      </td>

     

      {/* Actions */}
      <td className="px-6 py-4 text-center">
        <div className="flex  gap-2">
          <ViewButton onView={handleViewForGroup} item={group} />

          {/* Uncomment if delete is needed */}
          {/* 
      <DeleteConfirmation
        apiType="group"
        id_crypt={group.id_crypt}
        fetchDatas={fetchGroup}
        branchId={branchId}
        setLoading={setLoading}
        loading={loading}
      /> 
      */}
        </div>
      </td>
    </>
  );

  return (
    <>
      <Table
        headers={headers}
        data={groupPagination?.groups?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={groupPagination?.groups}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default GroupList;
