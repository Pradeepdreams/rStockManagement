import React, { useState } from "react";
import axios from "./AxiosInstance";

import { getBranchDataFromBalaSilksDB } from "./indexDB";
import { useToast } from "../Context/ToastProvider";
import { FaTrashCanArrowUp } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

function DeleteConfirmation({
  apiType,
  id_crypt,
  fetchDatas,
  setLoading,
  loading,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { triggerToast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      if (apiType === "category") {
        endpoint = `public/api/categories/${id_crypt}`;
      } else if (apiType === "item") {
        endpoint = `public/api/items/${id_crypt}`;
      } else if (apiType === "attribute") {
        endpoint = `public/api/attributes/${id_crypt}`;
      } else if (apiType == "attribute_values") {
        endpoint = `public/api/attribute-values/${id_crypt}`;
      } else if (apiType == "areas") {
        endpoint = `public/api/areas/${id_crypt}`;
      } else if (apiType == "paymentTerms") {
        endpoint = `public/api/payment-terms/${id_crypt}`;
      } else if (apiType == "group") {
        endpoint = `public/api/groups/${id_crypt}`;
      } else if (apiType == "socialmedia") {
        endpoint = `public/api/socialmedia/${id_crypt}`;
      } else if (apiType == "gst") {
        endpoint = `public/api/gst-registration-types/${id_crypt}`;
      } else if (apiType == "sections") {
        endpoint = `public/api/tds-sections/${id_crypt}`;
      } else if (apiType == "tds-details") {
        endpoint = `public/api/tds-details/${id_crypt}`;
      } else if (apiType == "agents") {
        endpoint = `public/api/agents/${id_crypt}`;
      } else if (apiType == "vendor") {
        endpoint = `public/api/vendors/${id_crypt}`;
      } else if (apiType == "roles") {
        endpoint = `public/api/roles/${id_crypt}`;
      } else if (apiType == "employee") {
        endpoint = `public/api/employees/${id_crypt}`;
      } else if (apiType == "branches") {
        endpoint = `public/api/branches/${id_crypt}`;
      } else if (apiType == "vendor-group") {
        endpoint = `public/api/vendor-groups/${id_crypt}`;
      } else if (apiType == "qualifications") {
        endpoint = `public/api/qualifications/${id_crypt}`;
      } else if (apiType == "pincode") {
        endpoint = `public/api/pincodes/${id_crypt}`;
      } else if (apiType == "po") {
        endpoint = `public/api/purchase-orders/${id_crypt}`;
      } else if (apiType == "logistics") {
        endpoint = `public/api/logistics/${id_crypt}`;
      } else if (apiType == "discount") {
        endpoint = `public/api/discount-on-purchases/${id_crypt}`;
      } else if (apiType == "customers") {
        endpoint = `public/api/customers/${id_crypt}`;
      }

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-BRANCH-ID": branchIds[0],
        },
      });

      triggerToast(
        "Success",
        apiType.charAt(0).toUpperCase() +
          apiType.slice(1).toLowerCase() +
          " Deleted successfully!",
        "error"
      );
      await fetchDatas();
    } catch (error) {
      console.error("Delete error:", error);
      triggerToast("Error", error?.response?.data?.message, "error");
    } finally {
      setShowConfirm(false);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        id="delete"
        onClick={() => setShowConfirm(true)}
        data-tooltip-id="global-tooltip"
        // data-tooltip-content="Delete"
        className="bg-red-600 cursor-pointer px-[10px] py-[8px] hover:bg-red-700 text-white rounded-md text-xs shadow flex items-center justify-center"
      >
        <FaTrashCanArrowUp className="w-3 h-3" />
      </button>

      <Tooltip anchorSelect="#delete" place="top" content="Delete" />

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-[600px] grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                <span className="flex items-center justify-center p-2 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 11-0 20 10 10 0 010-20z"
                    />
                  </svg>
                </span>

                <div className="text-center grid grid-cols-1 sm:text-left mt-3 sm:mt-0 w-full">
                  <h2 className="text-lg font-bold text-gray-800">
                    Confirm Deletion
                  </h2>
                  <p className="text-gray-600 mt-4 sm:mt-2">
                    Are you sure you want to delete this item?
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:flex sm:justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteConfirmation;
