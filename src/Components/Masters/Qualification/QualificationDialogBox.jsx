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
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import { useToast } from "../../Context/ToastProvider";

function QualificationDialogBox({
  openDialogForQualification,
  setOpenDialogForQualification,
  fetchQualifications,
  setIsEditing,
  isEditing,
  setQualificationInputs,
  qualificationInputs,
  editIdForQualification,
  saveBtnForQualification,
  AfterFetchQualifications,
  employeeFlag
}) {
  const { collapsed } = useOutletContext();
  const { triggerToast } = useToast();

  console.log(employeeFlag, "employeeFlag");
  

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });



  const handleChangeForGstRegistration = async (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    
    setQualificationInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForQualification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    console.log(qualificationInputs, "qualificationInputs");
    
    try {
      await axios.post(
        "public/api/qualifications",
        qualificationInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      triggerToast("Success", "Qualification created successfully!", "success");

      setOpenDialogForQualification(false);

      if(employeeFlag){
        await AfterFetchQualifications();
      }
      await fetchQualifications();

    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating value");
      setRequiredFields(error.response?.data?.errors);
    }
  };

  const handleUpdateForQualification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");


    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    setLoading(true);
    try {
      await axios.put(
        `public/api/qualifications/${editIdForQualification}`,
        qualificationInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setOpenDialogForQualification(false);
      triggerToast("Success", "Qualification updated successfully!", "success");
      await fetchQualifications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialogForQualification && (
        <Dialog
          open={openDialogForQualification}
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
                <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Qualifications
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
                      onClick={() => setOpenDialogForQualification(false)}
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
                          value={qualificationInputs?.name}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        />

                        {requiredFields?.name && (
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
                          value={qualificationInputs.code}
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
                          value={qualificationInputs?.description}
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

                      {saveBtnForQualification === "save" ? (
                        <button
                          onClick={handleSubmitForQualification}
                          className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          Save
                        </button>
                      ) : (
                        !isEditing && (
                          <button
                            onClick={handleUpdateForQualification}
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

export default QualificationDialogBox;
