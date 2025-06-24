import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { FaHashtag, FaLayerGroup, FaInfoCircle, FaEye } from "react-icons/fa";
import ViewButton from "../../Utils/ViewButton";

function VendorGroupsList({
  vendorGroupPaginationData,
  setVendorGroupInputs,
  fetchVendorGroup,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
  setOpenDialogForVendorGroup,
  setSaveBtnForVendorGroup,
  setEditIdForVendorGroup,
}) {
  const handleViewForGroup = async (e, id_crypt) => {
    e.preventDefault();
    setLoading(true);
    setIsEditing(true);
    setOpenDialogForVendorGroup(true);
    setEditIdForVendorGroup(id_crypt);
    setSaveBtnForVendorGroup("update");

    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const response = await axios.get(`public/api/vendor-groups/${id_crypt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      const group = response.data.data;
      setVendorGroupInputs({
        name: group.name,
        description: group.description,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching group.");
    } finally {
      setLoading(false);
    }
  };

  const headers = ["S.No", "Vendor Group Name", "Actions"];

  const renderRow = (group, index) => (
    <>
      {/* Index */}
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
          <FaHashtag className="text-gray-500" />
          {vendorGroupPaginationData.from + index}
        </span>
      </td>

      {/* Group Name */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium capitalize">
          <FaLayerGroup className="text-blue-600" />
          {group.name || "N/A"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-left">
        <div className="flex gap-2">
          {/* <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-md text-sm shadow flex items-center gap-1"
        onClick={(e) => handleViewForGroup(e, group.id_crypt)}
      >
        <FaEye className="w-4 h-4" />
        View
      </button> */}
          <ViewButton onView={handleViewForGroup} item={group} />

          <DeleteConfirmation
            apiType="vendor-group"
            id_crypt={group.id_crypt}
            fetchDatas={fetchVendorGroup}
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
        data={vendorGroupPaginationData?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={vendorGroupPaginationData}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default VendorGroupsList;
