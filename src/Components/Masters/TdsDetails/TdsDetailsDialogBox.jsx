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
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import TdsDetailsList from "./TdsDetailsList";
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { RadioIcon } from "@heroicons/react/24/solid";
import SocailMediaDialogBox from "../SocialMedia/SocailMediaDialogBox";
import { useDialog } from "../../Context/DialogContext";
import { useDialogForTdsDetails } from "../../Context/TdsDetailDialogContext";

function TdsDetailsDialogBox({
  openDialogForTdsDetails,
  setOpenDialogForTdsDetails,
  fetchTdsDetails,
  setIsEditing,
  isEditing,
  sectionPagination,
}) {
  const { collapsed } = useOutletContext();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [requiredFields, setRequiredFields] = useState({
    name: false,
    tds_section_id: false,
  });

  const {
    setTdsDetailsPaginationData,
    tdsDetailsPaginationData,
    tdsDetailsInputs,
    setTdsDetailsInputs,
    saveBtnForTdsDetails,
    editIdForTdsDetails,
  } = useDialogForTdsDetails();

  const handleChangeForTdsDetails = async (e) => {
    const { name, value } = e.target;
    setTdsDetailsInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForTdsDetails = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      await axios.post("public/api/tds-details", tdsDetailsInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setOpenDialogForTdsDetails(false);

      await fetchTdsDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating value");
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForTdsDetails = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!tdsDetailsInputs.name || !tdsDetailsInputs.tds_section_id) {
      toast.error("Name and sections fields are required.");
      return;
    }

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    setLoading(true);
    try {
      await axios.put(
        `public/api/tds-details/${editIdForTdsDetails}`,
        tdsDetailsInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setOpenDialogForTdsDetails(false);
      await fetchTdsDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialogForTdsDetails && (
        <Dialog
          open={openDialogForTdsDetails}
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
                    TDS Details
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
                      onClick={() => setOpenDialogForTdsDetails(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={
                    isEditing
                      ? handleUpdateForTdsDetails
                      : handleSubmitForTdsDetails
                  }
                >
                  <div className="p-6 space-y-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            TDS Name
                          </label>
                          <span className="text-red-400">*</span>
                        </div>

                        <input
                          type="text"
                          name="name"
                          placeholder="Enter Name"
                          value={tdsDetailsInputs?.name}
                          onChange={handleChangeForTdsDetails}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />
                        {requiredFields?.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields?.name[0]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <h4>Section</h4>
                          <span className="text-red-400">*</span>
                        </label>
                        <Select
                          name="tds_section_id"
                          options={sectionPagination?.map((section) => ({
                            value: section.id,
                            label: section.name,
                            idCrypt: section.id_crypt,
                          }))}
                          value={
                            sectionPagination
                              ?.map((section) => ({
                                value: section.id,
                                label: section.name,
                                idCrypt: section.id_crypt,
                              }))
                              .find(
                                (option) =>
                                  option.value ===
                                  tdsDetailsInputs?.tds_section_id
                              ) || null
                          }
                          onChange={(selectedOption) => {
                            handleChangeForTdsDetails({
                              target: {
                                name: "tds_section_id",
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                                idCrypt: selectedOption
                                  ? selectedOption.idCrypt
                                  : null,
                              },
                            });
                          }}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                          menuPosition="fixed"
                          classNamePrefix="select"
                          isDisabled={isEditing}
                        />
                        {requiredFields?.tds_section_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields?.tds_section_id[0]}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-3">
                        <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <h4>Description</h4>
                        </label>
                        <textarea
                          rows={4}
                          type="text"
                          placeholder="Name"
                          name="description"
                          onChange={handleChangeForTdsDetails}
                          value={tdsDetailsInputs.description}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        />
                      </div>
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

                    {saveBtnForTdsDetails === "save" ? (
                      <button
                        onClick={handleSubmitForTdsDetails}
                        className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      >
                        Save
                      </button>
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForTdsDetails}
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

export default TdsDetailsDialogBox;
