import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";

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
      <td className="px-6 py-4 whitespace-nowrap">{logisticsPagination.from + index}</td>
      <td className="px-6 py-4">{logistics.name ?? "N/A"}</td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForLogistics(e, logistics.id_crypt)}
          >
            View
          </button>

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
