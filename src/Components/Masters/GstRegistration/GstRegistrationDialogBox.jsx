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
import GstRegistrationList from "./GstRegistrationList";
import axios from "../../Utils/AxiosInstance";
import { useDialogForGstRegistration } from "../../Context/GstRegistrationDialogContext";
import { useToast } from "../../Context/ToastProvider";
import SaveButton from "../../Utils/SaveButton";

function GstRegistrationDialogBox({
  openDialogForGstRegistration,
  setOpenDialogForGstRegistration,
  fetchGstRegistration,
  setIsEditing,
  isEditing,
}) {
  const { collapsed } = useOutletContext();
const { triggerToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });

  const {
    setGstRegistrationPaginationData,
    gstRegistrationPaginationData,
    gstRegistrationInputs,
    setGstRegistrationInputs,
    saveBtnForGstRegistration,
    editIdForGstRegistration,
  } = useDialogForGstRegistration();

  const handleChangeForGstRegistration = async (e) => {
    const { name, value } = e.target;
    setGstRegistrationInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForGstRegistration = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      await axios.post(
        "public/api/gst-registration-types",
        gstRegistrationInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setOpenDialogForGstRegistration(false);
triggerToast("Success", "Gst Registration created successfully!", "success");
      await fetchGstRegistration();
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error creating value");
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForGstRegistration = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // if (!gstRegistrationInputs.name || !gstRegistrationInputs.code) {
    //   toast.error("Name and Code fields are required.");
    //   return;
    // }

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    setLoading(true);
    try {
      await axios.put(
        `public/api/gst-registration-types/${editIdForGstRegistration}`,
        gstRegistrationInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setOpenDialogForGstRegistration(false);
      triggerToast("Success", "Gst Registration updated successfully!", "success");
      await fetchGstRegistration();
    } catch (error) {
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialogForGstRegistration && (
        <Dialog
          open={openDialogForGstRegistration}
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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-0">
                <div className="bg-[var(--dialog-bgcolor)] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    GST Registration Type
                  </h2>
                  <div className="flex gap-2">
                    {isEditing && (
                      <div
                        onClick={() => setIsEditing(false)}
                        className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      onClick={() => setOpenDialogForGstRegistration(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200 transition duration-200"
                      title="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                  <div className=" sm:p-6 bg-gray-50 rounded-md ">
                    <div className="grid grid-cols-1  gap-4">
                      <div>
                        <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <h4>Name</h4>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Name"
                          name="name"
                          onChange={handleChangeForGstRegistration}
                          value={gstRegistrationInputs.name}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        />

                        {requiredFields.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.name[0]}
                          </p>
                        )}
                      </div>
                      {/* <div>
                        <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <h4>Code</h4>
                        </label>
                        <input
                          type="text"
                          placeholder="Code"
                          name="code"
                          onChange={handleChangeForGstRegistration}
                          value={gstRegistrationInputs.code}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        />
                      </div> */}
                      <div className="">
                        <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <h4>Description</h4>
                        </label>
                        <textarea
                          rows={4}
                          type="text"
                          placeholder="Description"
                          name="description"
                          onChange={handleChangeForGstRegistration}
                          value={gstRegistrationInputs.description}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      )}

                      {saveBtnForGstRegistration === "save" ? (
                        // <button
                        //   onClick={handleSubmitForGstRegistration}
                        //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        // >
                        //   Save
                        // </button>
                        <SaveButton saveFunction={handleSubmitForGstRegistration} />
                      ) : (
                        !isEditing && (
                          <button
                            onClick={handleUpdateForGstRegistration}
                            className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                          >
                            Update
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default GstRegistrationDialogBox;
