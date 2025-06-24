import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  Bars3CenterLeftIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  InboxArrowDownIcon,
  NumberedListIcon,
  PencilIcon,
  PercentBadgeIcon,
  PhoneArrowDownLeftIcon,
  PlusCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  MapPinIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import AttributesList from "./AttributesList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import TopFilters from "../../Utils/TopFilters";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";



function AttributesCreate() {
  const { collapsed } = useOutletContext();
const { triggerToast } = useToast();
  const [open, setOpen] = useState(false);
  const [attributesPagination, setAttributesPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [saveBtn, setSaveBtn] = useState("save");
  const [idCryptForAttributes, setIdCryptForAttributes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState({});
  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });
  const {searchTerm} = useSearch();

  const [attributesInputs, setAttributesInputs] = useState([
    {
      name: "",
    },
  ]);

  const [filterData, setFilterData] = useState({
    name: "",
  });

  const fetchAttributes = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    setBranchId(branchData.map((branch) => branch.branch.id_crypt));

    const token = localStorage.getItem("token");

    // Convert filters to query string
     const queryParams = new URLSearchParams({
      page,
      
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }


    try {
      const response = await axios.get(
        `public/api/attributes?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchData.map((branch) => branch.branch.id_crypt),
          },
        }
      );

      setAttributesPagination(response.data);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch attributes"
      // );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAttributes(currentPage, searchTerm);
  }, [currentPage,searchTerm]);



  const handleAddForAttributes = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setOpen(true);
      setIsEditing(false);
      setSaveBtn("save");
      setIdCryptForAttributes(null);
      setAttributesInputs({ name: "" });
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeForAttributes = (e) => {
    const { name, value } = e.target;
    setAttributesInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmitForAttributes = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const responseForAttributesCreateData = await axios.post(
        "public/api/attributes",
        attributesInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      setOpen(false);
      await fetchAttributes();
      triggerToast("Success", "Attribute created successfully!", "success");
      
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForAttributes = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const responseForAttributesUpdateData = await axios.put(
        `public/api/attributes/${idCryptForAttributes}`,
        attributesInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      setOpen(false);
      triggerToast("Success", "Attribute updated successfully!", "success");
      await fetchAttributes();
    } catch (error) {
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <TopFilters
                        fields={fields}
                        filterData={filterData}
                        handleChange={handleChange}
                        handleFilter={handleFilter}
                        handleReset={handleReset}
                        noResultsMessage="No results found"
                    /> */}

          <HeadersAndAddButton
            title={"Attributes"}
            description={"A list of all attributes report"}
            buttonName={"Add Attributes"}
            setOpen={setOpen}
            handleDialogOpen={handleAddForAttributes}
          />

          <AttributesList
            attributesPagination={attributesPagination}
            setOpen={setOpen}
            branchId={branchId}
            setSaveBtn={setSaveBtn}
            setAttributesInputs={setAttributesInputs}
            fetchAttributes={fetchAttributes}
            setIdCryptForAttributes={setIdCryptForAttributes}
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
                    <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                      <h2
                        style={{ fontFamily: "poppins" }}
                        className="font-semibold"
                      >
                        Attributes
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
                          onClick={() => setOpen(false)}
                          className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200 transition duration-200"
                          title="Close"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                      {/* <h3 className="text-lg font-semibold text-gray-400 mb-4 ">
                                                Attributes
                                            </h3> */}

                      <div className=" sm:p-6 bg-gray-50 rounded-md ">
                        <div>
                          <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                            <h4>
                              Name <span className="text-red-400">*</span>
                            </h4>
                          </label>
                          <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange={handleChangeForAttributes}
                            value={attributesInputs.name}
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
                            <button
                              onClick={handleSubmitForAttributes}
                              className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                            >
                              Save
                            </button>
                          ) : (
                            !isEditing && (
                              <button
                                onClick={handleUpdateForAttributes}
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
      )}
    </>
  );
}

export default AttributesCreate;
