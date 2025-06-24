import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { useToast } from "../../Context/ToastProvider";

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
    "Description",
    "Actions",
  ];

  const renderRow = (paymentTerms, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        {paymentTermsPagination.payment_terms.from + index}
      </td>
      <td className="px-6 py-4">{paymentTerms.name}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            paymentTerms.active_status == "1"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {paymentTerms.active_status === 1 ? "Active" : "Inactive"}
        </span>
      </td>
      <td className={`px-6 py-4`}>{paymentTerms.description}</td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForPaymentTerms(e, paymentTerms.id_crypt)}
          >
            View
          </button>

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
