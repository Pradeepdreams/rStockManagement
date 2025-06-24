import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useOutletContext } from "react-router-dom";
import axios from "../../Utils/AxiosInstance";
import { useToast } from "../../Context/ToastProvider";
import SaveButton from "../../Utils/SaveButton";

function LogisticsDialogBox({
  openDialogForLogistics,
  setOpenDialogForLogistics,
  fetchLogistics,
  setLoading,
  setIsEditing,
  isEditing,
  logisticsInputs,
  setLogisticsInputs,
  saveBtnForLogistics,
  setSaveBtnForLogistics,
  editIdForLogistics,
  setEditIdForLogistics,
}) {
  const { collapsed } = useOutletContext();
  const { triggerToast } = useToast();
  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });

  const handleChangeForLogistics = async (e) => {
    const { name, value } = e.target;
    setLogisticsInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForLogistics = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      await axios.post("public/api/logistics", logisticsInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setOpenDialogForLogistics(false);
      triggerToast("Success", "Logistics created successfully!", "success");
      await fetchLogistics();
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error creating value");
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForArea = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    setLoading(true);
    try {
      await axios.put(
        `public/api/logistics/${editIdForLogistics}`,
        logisticsInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setOpenDialogForLogistics(false);
      triggerToast(
        "Update Success",
        "Logistics updated successfully!",
        "success"
      );
      await fetchLogistics();
    } catch (error) {
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialogForLogistics && (
        <Dialog
          open={openDialogForLogistics}
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
                <div className="bg-[var(--dialog-bg)] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Logistics
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
                      onClick={() => setOpenDialogForLogistics(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={
                    isEditing ? handleUpdateForArea : handleSubmitForLogistics
                  }
                >
                  <div className="p-6 space-y-6 bg-gray-50">
                    <div className="grid grid-cols-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Logistics Name{" "}
                          </label>
                          <span className="text-red-400">*</span>
                        </div>

                        <input
                          type="text"
                          name="name"
                          placeholder="Enter Area Name"
                          value={logisticsInputs.name}
                          onChange={handleChangeForLogistics}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />

                        {requiredFields.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.name[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setOpenDialogForLogistics(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}

                    {saveBtnForLogistics === "save" ? (
                      // <button
                      //   onClick={handleSubmitForLogistics}
                      //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      // >
                      //   Save
                      // </button>
                      <SaveButton saveFunction={handleSubmitForLogistics} />
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForArea}
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

export default LogisticsDialogBox;
