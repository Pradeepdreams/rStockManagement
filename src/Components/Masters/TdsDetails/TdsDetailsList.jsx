import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import TdsDetailsDialogBox from "./TdsDetailsDialogBox";
import { useDialogForTdsDetails } from "../../Context/TdsDetailDialogContext";
import ViewButton from "../../Utils/ViewButton";
import { FaHashtag, FaUserTie, FaListOl, FaRupeeSign } from "react-icons/fa";

function TdsDetailsList({
  tdsDetailsPagination,
  setLoading,
  setIsEditing,
  // setOpen,
  setSaveBtn,

  fetchTdsDetails,
  branchId,
  setIdCryptForTdsDetails,
  idCryptForTdsDetails,
  loading,
  setCurrentPage,
}) {
  const [open, setOpen] = useState(false);
  const [tdsDetailsEditData, setTdsDetailsEditData] = useState();
  const {
    openDialogForTdsDetails,
    setOpenDialogForTdsDetails,
    setSaveBtnForTdsDetails,
    setEditIdForTdsDetails,
    tdsDetailsInputs,
    setTdsDetailsInputs,
  } = useDialogForTdsDetails();
  const [editId, setEditId] = useState("");

  const handleViewForTdsDetails = async (e, id_crypt) => {
    // e.preventDefault();
    setOpenDialogForTdsDetails(true);
    setEditIdForTdsDetails(id_crypt);
    setLoading(true);
    setIsEditing(true);
    // setEditId(id_crypt);
    setSaveBtnForTdsDetails("update");

    const token = localStorage.getItem("token");
    try {
      const responseForTdsDetailsEditData = await axios.get(
        `public/api/tds-details/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      setTdsDetailsEditData(responseForTdsDetailsEditData.data);
      setTdsDetailsInputs({
        name: responseForTdsDetailsEditData.data.name,
        tds_section_id: responseForTdsDetailsEditData.data.tds_section_id,
        description: responseForTdsDetailsEditData.data.description,
      });
      setEditId(responseForTdsDetailsEditData.data?.id_crypt);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const headers = ["S.No", "Name", "Section", "Amount Limit", "Actions"];

  const renderRow = (item, index) => (
    <>
      {/* Index with Icon */}
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
          <FaHashtag className="text-gray-500" />
          {tdsDetailsPagination.from + index}
        </span>
      </td>

      {/* TDS Name */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1  px-2 py-1 rounded text-sm font-medium capitalize">
          <FaUserTie className="text-blue-600" />
          {item.name || "N/A"}
        </span>
      </td>

      {/* TDS Section Name */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
          <FaListOl className="text-green-600" />
          {item?.tds_section?.name || "N/A"}
        </span>
      </td>

      {/* Amount Limit */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 border border-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
          <FaRupeeSign className="text-yellow-600" />
          {item?.tds_section?.amount_limit != null
            ? Number(item.tds_section.amount_limit).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "N/A"}
        </span>
      </td>

      {/* Action Buttons */}
      <td className="px-6 py-4 text-center">
        <div className="flex gap-2">
          <ViewButton onView={handleViewForTdsDetails} item={item} />
          <DeleteConfirmation
            apiType="tds-details"
            id_crypt={item.id_crypt}
            fetchDatas={fetchTdsDetails}
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
        data={tdsDetailsPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={tdsDetailsPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default TdsDetailsList;
