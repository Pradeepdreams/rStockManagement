import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Bars3CenterLeftIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  CurrencyRupeeIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  HomeModernIcon,
  ListBulletIcon,
  LockClosedIcon,
  MapPinIcon,
  NumberedListIcon,
  PencilIcon,
  PercentBadgeIcon,
  PlusCircleIcon,
  RectangleGroupIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/16/solid";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "../Utils/AxiosInstance";
// import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import { errorDialog } from "../Context/ErrorContext";
import SaveButton from "../Utils/SaveButton";
import { triggerGlobalToast } from "../Utils/GlobalToast";

function CustomersDialogBox({
  openDialogForCustomer,
  setOpenDialogForCustomer,
  customerPaginationData,
  setCustomerPaginationData,
  saveBtnForCustomer,
  setSaveBtnForCustomer,
  editIdForCustomer,
  setEditIdForCustomer,
  customerInputs,
  setCustomerInputs,
  fetchCustomersData,
}) {
  const { collapsed } = useOutletContext();
  const { checkAuthError } = errorDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [requiredFields, setRequiredFields] = useState({
    name: "",
    customer_type: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    gst_number: "",
    gst_type: "",
    pan_number: "",
    credit_limit: "",
    customer_group: "",
  });

  const handleChangeForCustomers = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setCustomerInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitForCustomers = async (e) => {
    e.preventDefault();
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    console.log(customerInputs, "customerInputs");
    

    try {
      const response = await axios.post("public/api/customers", customerInputs, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      // console.log(response, "response for curtomers");
      
      setOpenDialogForCustomer(false);
      await fetchCustomersData();
      triggerGlobalToast("Success", "Customer added successfully", "success");
    } catch (error) {
      setRequiredFields(error.response.data.errors);
      checkAuthError(error);
    }
  };
  const handleUpdateForCustomers = async (e) => {
    e.preventDefault();

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const response = await axios.put(
        `public/api/customers/${editIdForCustomer}`,
        customerInputs,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setOpenDialogForCustomer(false);
      await fetchCustomersData();

      triggerGlobalToast("Success", "Customer updated successfully", "success");
    } catch (error) {
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleDialogCloseForCustomers = () => {
    setOpenDialogForCustomer(false);
    setRequiredFields({});
    setCustomerInputs({
      name: "",
      customer_type: "",
      email: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      gst_number: "",
      gst_type: "",
      pan_number: "",
      credit_limit: "",
      customer_group: "",
    });
    setEditIdForCustomer("");
  };

  return (
    <>
      {openDialogForCustomer && (
        <Dialog
          open={openDialogForCustomer}
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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100  pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
                <div className="bg-[var(--dialog-bgcolor)] text-black p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Customers
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
                      onClick={handleDialogCloseForCustomers}
                      className="bg-white text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition duration-200"
                      title="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                  {/* <h3 className="text-lg font-semibold text-gray-400 mb-4 ">
                    Employees
                  </h3> */}

                  <div className="bg-gray-50 rounded-md p-4">
                    {/* Section 1: Name & Customer Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-6">
                      {/* Name */}
                      <div className="col-span-1 sm:col-span-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <RectangleGroupIcon className="h-5 w-5 text-gray-400" />
                          <span>Name</span>{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Name"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.name}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* Customer Type */}
                      <div className="col-span-1 sm:col-span-1 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <RectangleGroupIcon className="h-5 w-5 text-gray-400" />
                          <span>Customer Type</span>
                        </label>
                        <select
                          name="customer_type"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.type}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        >
                          <option value="">Select Customer Type</option>
                          <option value="Retail">Retail</option>
                          <option value="Wholesale">Wholesale</option>
                        </select>
                      </div>
                    </div>

                    {/* Section 2: Email, Phone & GST Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-x-5 gap-y-6 mt-6">
                      {/* Email */}
                      <div className="col-span-1 sm:col-span-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          <span>Email</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.email}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* Phone */}
                      <div className="col-span-1 sm:col-span-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          <span>Phone</span>{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.phone}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* GST Type */}
                      <div className="col-span-1 sm:col-span-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <ListBulletIcon className="h-5 w-5 text-gray-400" />
                          <span>GST Type</span>
                        </label>
                        <select
                          name="gst_type"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.gst_type}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        >
                          <option value="">Select GST Type</option>
                          <option value="Normal">GST</option>
                          <option value="IGST">IGST</option>
                        </select>
                      </div>
                    </div>

                    {/* Section 3: Address Lines */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6 mt-6">
                      {/* Address Line 1 */}
                      <div className="col-span-1 sm:col-span-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          <span>Address Line 1</span>
                        </label>
                        <textarea
                          name="address_line1"
                          placeholder="Address Line 1"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.address_line1}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div className="col-span-1 sm:col-span-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <NumberedListIcon className="h-5 w-5 text-gray-400" />
                          <span>Address Line 2</span>
                        </label>
                        <textarea
                          name="address_line2"
                          placeholder="Address Line 2"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.address_line2}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>
                    </div>

                    {/* Section 4: Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-6 mt-6">
                      {/* Country */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          placeholder="Country"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.country}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.state}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.city}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          placeholder="Pincode"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.pincode}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>
                    </div>

                    {/* Section 5: GST, PAN, Credit Limit, Group */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-6 mt-6">
                      {/* GST Number */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          GST Number
                        </label>
                        <input
                          type="text"
                          name="gst_number"
                          placeholder="GST Number"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.gst_number}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* PAN Number */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          name="pan_number"
                          placeholder="PAN Number"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.pan_number}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* Credit Limit */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Credit Limit
                        </label>
                        <input
                          type="text"
                          name="credit_limit"
                          placeholder="Credit Limit"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.credit_limit}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>

                      {/* Customer Group */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Customer Group
                        </label>
                        <input
                          type="text"
                          name="customer_group"
                          placeholder="Customer Group"
                          onChange={handleChangeForCustomers}
                          value={customerInputs.customer_group}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setOpenDialogForCustomer(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}

                    {saveBtnForCustomer === "save" ? (
                      // <button
                      //   onClick={handleSubmitForCustomers}
                      //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      // >
                      //   Save
                      // </button>
                      <SaveButton saveFunction={handleSubmitForCustomers} />
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForCustomers}
                          className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          Update
                        </button>
                      )
                    )}
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

export default CustomersDialogBox;
