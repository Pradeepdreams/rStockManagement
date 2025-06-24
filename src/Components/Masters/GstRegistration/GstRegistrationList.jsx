import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import GstRegistrationDialogBox from "./GstRegistrationDialogBox";
import { useDialogForGstRegistration } from "../../Context/GstRegistrationDialogContext";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import { FaHashtag, FaIdCard, FaBarcode } from "react-icons/fa";

function GstRegistrationList({
  gstRegistrationPagination,
  setLoading,
  setIsEditing,


  fetchGstRegistration,
  branchId,
  loading,
  setCurrentPage,
}) {

  const [open, setOpen] = useState(false);
  const [gstRegistrationEditData, setGstRegistrationEditData] = useState();
  const {
    openDialogForGstRegistration,
    setOpenDialogForGstRegistration,
    setSaveBtnForGstRegistration,
    setEditIdForGstRegistration,
    gstRegistrationInputs,
    setGstRegistrationInputs,


  } = useDialogForGstRegistration();
  const [editId, setEditId] = useState("");
  const { triggerToast } = useToast();

  const handleViewForGstRegistration = async (e, id_crypt) => {
    // e.preventDefault();
    setOpenDialogForGstRegistration(true);
    setEditIdForGstRegistration(id_crypt);
    setLoading(true);
    setIsEditing(true);
    // setEditId(id_crypt);
    setSaveBtnForGstRegistration("update");

    const token = localStorage.getItem("token");
    try {
      const responseForGstRegistrationEditData = await axios.get(
        `public/api/gst-registration-types/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      setGstRegistrationEditData(responseForGstRegistrationEditData.data.data);
      setGstRegistrationInputs({
        name: responseForGstRegistrationEditData.data.data.name,
        code: responseForGstRegistrationEditData.data.data.code,
        description: responseForGstRegistrationEditData.data.data.description,
      });
 
      setEditId(responseForGstRegistrationEditData.data.data?.id_crypt);
    } catch (error) {
      triggerToast("Error", error.response.data.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  const headers = ["S.No", "Name", "Code", "Actions"];


  const renderRow = (gstRegistration, index) => (
   <>
  {/* Index with Icon */}
  <td className="px-6 py-4 whitespace-nowrap text-left">
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 roundedtext-sm font-medium">
      <FaHashtag className="text-gray-500" />
      {gstRegistrationPagination.from + index}
    </span>
  </td>

  {/* GST Name with Icon */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1  px-2 py-1 roundedtext-sm font-medium capitalize">
      <FaIdCard className="text-blue-600" />
      {gstRegistration.name || "N/A"}
    </span>
  </td>

  {/* GST Code with Icon */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 roundedtext-sm font-medium">
      <FaBarcode className="text-indigo-600" />
      {gstRegistration.code || "N/A"}
    </span>
  </td>

  {/* Action Buttons */}
  <td className="px-6 py-4 text-center">
    <div className="flex gap-2">
      <ViewButton onView={handleViewForGstRegistration} item={gstRegistration} />
      <DeleteConfirmation
        apiType="gst"
        id_crypt={gstRegistration.id_crypt}
        fetchDatas={fetchGstRegistration}
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
        data={gstRegistrationPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={gstRegistrationPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default GstRegistrationList;
