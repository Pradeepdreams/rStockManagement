import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import {
  FaHashtag,
  FaRegFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";


function GroupList({
  paymentTermsPagination,
  setOpen,
  branchId,
  setSaveBtn,
  setPaymentTermsInputs,
  fetchPaymentTerms,
  setIdCryptForPaymentTerms,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
}) {
  const { triggerToast } = useToast();
  const handleViewForPaymentTerms = async (e, id_crypt) => {
    e.preventDefault();
    setLoading(true);
    setIsEditing(true);
    setOpen(true);
    setIdCryptForPaymentTerms(id_crypt);
    setSaveBtn("update");

    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`public/api/payment-terms/${id_crypt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchId,
        },
      });

      const paymentTerms = response.data;

      setPaymentTermsInputs({
        name: paymentTerms.name,
        active_status: paymentTerms.active_status ? "yes" : "no",
        description: paymentTerms.description,
      });
    } catch (error) {
      triggerToast("Error!", error?.response?.data?.message, "error");
      // toast.error(error?.response?.data?.message || "Error fetching PaymentTerms.");
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    "S.No",
    "Payment Terms Name",
    "Active Status",
    "Actions",
  ];

  const renderRow = (paymentTerms, index) => (
    <>
      {/* Index with Icon */}
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded  text-sm font-medium">
          <FaHashtag className="text-gray-500" />
          {paymentTermsPagination.payment_terms.from + index}
        </span>
      </td>

      {/* Payment Term Name */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded  text-sm font-medium capitalize">
          <FaRegFileAlt className="text-blue-600" />
          {paymentTerms.name || "N/A"}
        </span>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4 text-left">
        {paymentTerms.active_status == "1" ? (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded  text-sm font-medium">
            <FaCheckCircle className="text-green-600" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded  text-sm font-medium">
            <FaTimesCircle className="text-red-600" />
            Inactive
          </span>
        )}
      </td>

     

      {/* Action Buttons */}
      <td className="px-6 py-4 text-center">
        <div className="flex gap-2">
          <ViewButton onView={handleViewForPaymentTerms} item={paymentTerms} />
          <DeleteConfirmation
            apiType="paymentTerms"
            id_crypt={paymentTerms.id_crypt}
            fetchDatas={fetchPaymentTerms}
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
        data={paymentTermsPagination?.payment_terms?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={paymentTermsPagination?.payment_terms}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default GroupList;
