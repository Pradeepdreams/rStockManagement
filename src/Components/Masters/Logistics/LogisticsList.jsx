import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import { FaHashtag, FaTruck } from "react-icons/fa";

function LogisticsList({
  logisticsPagination,
  setOpenDialogForLogistics,
  setSaveBtnForLogistics,
  setLogisticsInputs,
  fetchLogistics,
  setEditIdForLogistics,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
}) {
  const { triggerToast } = useToast();
  const handleViewForLogistics = async (e, id_crypt) => {
    setOpenDialogForLogistics(true);
    setEditIdForLogistics(id_crypt);
    setLoading(true);
    setIsEditing(true);
    setSaveBtnForLogistics("update");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");
    try {
      const responseForLogisticsEditData = await axios.get(
        `public/api/logistics/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setLogisticsInputs({
        name: responseForLogisticsEditData.data.name,
      });
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const headers = ["S.No", "Name", "Actions"];

  const renderRow = (logistics, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 roundedtext-sm font-medium">
          <FaHashtag className="text-gray-500" />
          {logisticsPagination.from + index}
        </span>
      </td>

      {/* Logistics Name with icon */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
          <FaTruck className="text-blue-600" />
          {logistics.name ?? "N/A"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-center">
        <div className="flex  gap-2">
          <ViewButton onView={handleViewForLogistics} item={logistics} />

          <DeleteConfirmation
            apiType="logistics"
            id_crypt={logistics.id_crypt}
            fetchDatas={fetchLogistics}
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
        data={logisticsPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={logisticsPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default LogisticsList;
