import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { RadioIcon } from "@heroicons/react/24/solid";
import SectionList from "./SectionList";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { TbReceiptTax } from "react-icons/tb";
import SaveButton from "../../Utils/SaveButton";

function SectionCreate() {
  const { collapsed } = useOutletContext();

  const [open, setOpen] = useState(false);
  const [sectionPagination, setSectionPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [saveBtn, setSaveBtn] = useState("save");
  const [idCryptForSection, setIdCryptForSection] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterData, setFilterData] = useState({});

  const { triggerToast } = useToast();
  const { searchTerm } = useSearch();

  const [sectionInputs, setSectionInputs] = useState({
    name: "",
    percent_with_pan: "",
    percent_without_pan: "",
    applicable_date: "",
    amount_limit: "",
  });

  const [requiredFields, setRequiredFields] = useState({
    name: false,
    percent_with_pan: false,
    percent_without_pan: false,
    applicable_date: false,
    amount_limit: false,
  });

  const fetchSection = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    setBranchId(branchIds);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await axios.get(
        `public/api/tds-sections?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds,
          },
        }
      );

      setSectionPagination(response.data.tds_sections);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleChangeForSection = (e) => {
    const { name, value } = e.target;
    setSectionInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddForSection = () => {
    setLoading(true);
    try {
      setOpen(true);
      setSaveBtn("save");
      setIsEditing(false);
      setSectionInputs({
        name: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForSection = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("public/api/tds-sections", sectionInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchId,
        },
      });

      setOpen(false);
      await fetchSection();
      triggerToast("Success", "Section Created Successfully!", "success");
    } catch (error) {
      // toast.error(error.response?.data?.message || "Error creating value");
      triggerToast("Error", "Unable to Create Section", "error");

      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForSection = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.put(
        `public/api/tds-sections/${idCryptForSection}`,
        sectionInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );
      setOpen(false);
      await fetchSection();
      triggerToast("Success", "Section Updated Successfully!", "success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setLoading(true);
    try {
      setOpen(false);
      setSaveBtn("save");
      setIsEditing(false);
      setSectionInputs({
        name: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Section"
        description="A list of all Section"
        buttonName="Add Section"
        setOpen={setOpen}
        handleDialogOpen={handleAddForSection}
        buttonIcon={<TbReceiptTax/>}
      />

      <SectionList
        sectionPagination={sectionPagination}
        setOpen={setOpen}
        branchId={branchId}
        setSaveBtn={setSaveBtn}
        setSectionInputs={setSectionInputs}
        fetchSection={fetchSection}
        setIdCryptForSection={setIdCryptForSection}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      {open && (
        <Dialog open={open} onClose={() => {}} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div
            className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
              collapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
                <div className="bg-[var(--dialog-bgcolor)] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Section
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
                      onClick={handleDialogClose}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={
                    isEditing ? handleUpdateForSection : handleSubmitForSection
                  }
                >
                  <div className="p-6 space-y-6 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-4  gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter Section Name"
                          value={sectionInputs.name}
                          onChange={handleChangeForSection}
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Percent With Pan{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="percent_with_pan"
                          placeholder="Enter Section Name"
                          value={sectionInputs.percent_with_pan}
                          onChange={handleChangeForSection}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />
                        {requiredFields.percent_with_pan && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.percent_with_pan[0]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Percent Without Pan{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="percent_without_pan"
                          placeholder="Enter Section Name"
                          value={sectionInputs.percent_without_pan}
                          onChange={handleChangeForSection}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />
                        {requiredFields.percent_without_pan && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.percent_without_pan[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Applicable Date{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          name="applicable_date"
                          value={sectionInputs?.applicable_date || ""}
                          placeholder="Applicable Date"
                          onChange={handleChangeForSection}
                          min={new Date().toISOString().split("T")[0]}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />
                        {requiredFields.applicable_date && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.applicable_date[0]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount Limits <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="amount_limit"
                          placeholder="Enter Section Name"
                          value={sectionInputs.amount_limit}
                          onChange={handleChangeForSection}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />
                        {requiredFields.amount_limit && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.amount_limit[0]}
                          </p>
                        )}
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

                    {saveBtn === "save" ? (
                      // <button
                      //   onClick={handleSubmitForSection}
                      //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      // >
                      //   Save
                      // </button>
                      <SaveButton saveFunction={handleSubmitForSection} />
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForSection}
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

export default SectionCreate;
