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
import PaymentTermsList from "./PaymentTermsList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import TopFilters from "../../Utils/TopFilters";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import SaveButton from "../../Utils/SaveButton";
import { TbReceiptTax } from "react-icons/tb";

function PaymentTermsCreate() {
  const { collapsed } = useOutletContext();

  const [open, setOpen] = useState(false);
  const [paymentTermsPagination, setPaymentTermsPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [saveBtn, setSaveBtn] = useState("save");
  const [idCryptForPaymentTerms, setIdCryptForPaymentTerms] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState({});
  const { triggerToast } = useToast();
  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });
  const { searchTerm } = useSearch();

  const [paymentTermsInputs, setPaymentTermsInputs] = useState([
    {
      name: "",
      active_status: "yes",
      description: "",
    },
  ]);

  const [filterData, setFilterData] = useState({
    name: "",
  });

  const fetchPaymentTerms = async (page = 1, searchTerm) => {
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
        `public/api/payment-terms?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchData.map((branch) => branch.branch.id_crypt),
          },
        }
      );

      setPaymentTermsPagination(response.data.original);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch Payment Terms"
      // );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPaymentTerms(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForPaymentTerms = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setOpen(true);
      setSaveBtn("save");
      setPaymentTermsInputs({
        name: "",
        active_status: "yes",
        description: "",
      });
    } catch (error) {
      triggerToast("Error!", error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeForPaymentTerms = (e) => {
    const { name, value } = e.target;
    setPaymentTermsInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const payload = {
    name: paymentTermsInputs.name,
    active_status: paymentTermsInputs.active_status == "yes" ? 1 : 0,
    description: paymentTermsInputs.description,
  };
  const handleSubmitForPaymentTerms = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const responseForPaymentTermsCreateData = await axios.post(
        "public/api/payment-terms",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      setOpen(false);
      triggerToast(
        "Create Success",
        "Payment Terms created successfully!",
        "success"
      );
      await fetchPaymentTerms();
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForPaymentTerms = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const responseForPaymentTermsUpdateData = await axios.put(
        `public/api/payment-terms/${idCryptForPaymentTerms}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      setOpen(false);
      triggerToast(
        "Update Success",
        "Payment Terms updated successfully!",
        "success"
      );
      await fetchPaymentTerms();
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
            title={"Payment Terms"}
            description={"A list of all Payment Terms report"}
            buttonName={"Add Payment Terms"}
            setOpen={setOpen}
            handleDialogOpen={handleAddForPaymentTerms}
            buttonIcon={<TbReceiptTax/>}
          />

          <PaymentTermsList
            paymentTermsPagination={paymentTermsPagination}
            setOpen={setOpen}
            branchId={branchId}
            setSaveBtn={setSaveBtn}
            setPaymentTermsInputs={setPaymentTermsInputs}
            fetchPaymentTerms={fetchPaymentTerms}
            setIdCryptForPaymentTerms={setIdCryptForPaymentTerms}
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
                        Payment Terms
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="mb-5">
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
                              onChange={handleChangeForPaymentTerms}
                              value={paymentTermsInputs.name}
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
                          <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">
                              Active Status
                            </label>

                            <div className="mt-2 flex items-center space-x-4 w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="yes"
                                  name="active_status"
                                  value="yes"
                                  checked={
                                    paymentTermsInputs?.active_status === "yes"
                                  }
                                  disabled={isEditing}
                                  onChange={(e) =>
                                    handleChangeForPaymentTerms({
                                      target: {
                                        name: "active_status",
                                        value: e.target.value,
                                      },
                                    })
                                  }
                                  className={`h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300 
                                  `}
                                />
                                <label
                                  htmlFor="active"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  Active
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="no"
                                  name="active_status"
                                  value="no"
                                  checked={
                                    paymentTermsInputs?.active_status === "no"
                                  }
                                  onChange={(e) =>
                                    handleChangeForPaymentTerms({
                                      target: {
                                        name: "active_status",
                                        value: e.target.value,
                                      },
                                    })
                                  }
                                  disabled={isEditing}
                                  className={`h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300 ${
                                    isEditing && "cursor-not-allowed"
                                  }`}
                                />
                                <label
                                  htmlFor="inactive"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  Inactive
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:col-span-2">
                            <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                              <UserCircleIcon className="h-5 w-5 text-gray-400" />
                              <h4>Description</h4>
                            </label>
                            <textarea
                              type="text"
                              rows={3}
                              placeholder="Description"
                              name="description"
                              onChange={handleChangeForPaymentTerms}
                              value={paymentTermsInputs.description}
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

                          {saveBtn === "save" ? (
                            // <button
                            //   onClick={handleSubmitForPaymentTerms}
                            //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                            // >
                            //   Save
                            // </button>
                            <SaveButton saveFunction={handleSubmitForPaymentTerms} />
                          ) : (
                            !isEditing && (
                              <button
                                onClick={handleUpdateForPaymentTerms}
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

export default PaymentTermsCreate;
