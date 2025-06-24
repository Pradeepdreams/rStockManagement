import React, { useState } from "react";

import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "../../Utils/AxiosInstance";
import { useToast } from "../../Context/ToastProvider";

function PincodeDialogBox({
  openDialogForPincode,
  setOpenDialogForPincode,
  pincodeInputs,
  setPincodeInputs,
  saveBtnForPincode,
  requiredFields,
  isEditing,
  fetchPincode,
  setRequiredFields,
  setLoading,
  editIdForPincode,
  collapsed,
  setIsEditing,
}) {

const { triggerToast } = useToast();

  const handleChangeForPincode = async (e) => {
    const { name, value } = e.target;
    setPincodeInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForPincode = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      await axios.post("public/api/pincodes", pincodeInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setOpenDialogForPincode(false);
      triggerToast("Create Success", "Pincode created successfully!", "success");
      await fetchPincode();
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error creating value");
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForPincode = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    setLoading(true);
    try {
      await axios.put(`public/api/pincodes/${editIdForPincode}`, pincodeInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      setOpenDialogForPincode(false);
      triggerToast(
        "Update Success",
        "Pincode updated successfully!",
        "success"
      );
      await fetchPincode();
    } catch (error) {
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error updating value");
      setRequiredFields(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialogForPincode && (
        <Dialog
          open={openDialogForPincode}
          onClose={() => {}}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div
            className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
              collapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
                <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Pincode
                  </h2>
                  <div className="flex gap-2">
                    {isEditing && (
                      <div
                        onClick={() => setIsEditing(false)}
                        className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      onClick={() => setOpenDialogForPincode(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={
                    isEditing ? handleUpdateForPincode : handleSubmitForPincode
                  }
                >
                  <div className="p-6 space-y-6 bg-gray-50">
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-4 gap-6`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country 
                          </label>
                          <span className="text-red-400">*</span>
                        </div>

                        <input
                          type="text"
                          name="country"
                          placeholder="Enter Country"
                          value={pincodeInputs?.country}
                          onChange={handleChangeForPincode}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />

                        {requiredFields.country && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.country[0]}
                          </p>
                        )}
                      </div>

                     <div>
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State 
                          </label>
                          <span className="text-red-400">*</span>
                        </div>

                        <input
                          type="text"
                          name="state"
                          placeholder="Enter State"
                          value={pincodeInputs?.state}
                          onChange={handleChangeForPincode}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />

                        {requiredFields.state && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.state[0]}
                          </p>
                        )}
                      </div>

                       <div>
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City 
                          </label>
                          <span className="text-red-400">*</span>
                        </div>

                        <input
                          type="text"
                          name="city"
                          placeholder="Enter City"
                          value={pincodeInputs?.city}
                          onChange={handleChangeForPincode}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />

                        {requiredFields.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.city[0]}
                          </p>
                        )}
                      </div>

                       <div>
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode
                          </label>
                          <span className="text-red-400">*</span>
                        </div>

                        <input
                          type="text"
                          name="pincode"
                          placeholder="Enter Pincode"
                          value={pincodeInputs?.pincode}
                          onChange={handleChangeForPincode}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />

                        {requiredFields.pincode && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.pincode[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setOpenDialogForPincode(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}

                    {saveBtnForPincode === "save" ? (
                      <button
                        onClick={handleSubmitForPincode}
                        className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      >
                        Save
                      </button>
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForPincode}
                          className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          Update
                        </button>
                      )
                    )}
                  </div>
                </form>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default PincodeDialogBox;
