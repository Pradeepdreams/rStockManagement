import React, { useEffect, useState } from "react";
import { usePurchaseOrderEntriesDialogContext } from "../Context/PurchaseOrderEntriesDialogContext";
import { getBranchDataFromBalaSilksDB } from "./indexDB";
import axios from "./AxiosInstance";
import { useOutletContext } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { triggerGlobalToast } from "./GlobalToast";
import HalfSizeButton from "../Buttons/HalfSizeButton";
import { FaUserAlt } from "react-icons/fa";
import { BsCartPlusFill } from "react-icons/bs";

function HeadersAndAddButton({
  title,
  description,
  buttonName,
  buttonIcon,
  handleDialogOpen,
  approvalAddButton,
  disocuntToggleFlag,
  pdfDownload,
  pdfText,
  buttonHidden,
  pdf
}) {
  const [enabled, setEnabled] = useState(false);
  const [discountData, setDiscountData] = useState([]);

  useEffect(() => {
    if (disocuntToggleFlag) {
      const fetchDiscountStatus = async () => {
        const token = localStorage.getItem("token");
        const branchData = await getBranchDataFromBalaSilksDB();
        const branchIds = branchData.map((branch) => branch.branch.id_crypt);

        try {
          const response = await axios.get(
            "public/api/discount-on-purchases/active/type",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Branch-Id": branchIds[0],
              },
            }
          );

          setDiscountData(response.data);
          // Set enabled based on active_status
          setEnabled(response.data.active_status === 1);
        } catch (error) {
          console.error("API error:", error);
          triggerGlobalToast.error("Failed to fetch discount status");
        }
      };

      fetchDiscountStatus();
    }
  }, []);

  const handleDiscountToggle = async (checked) => {
    setEnabled(checked);
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      const response = await axios.get(
        "public/api/discount-on-purchases/change/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setDiscountData(response.data);

      triggerGlobalToast(
        "Success",
        checked ? "Discount set to Special" : "Discount set to Normal",
        "success"
      );
    } catch (error) {
      triggerGlobalToast.error("Failed to update discount status");
      console.error("API error:", error);
    }
  };

  return (
    <>
      <div className="space-y-12 mt-5 sm:mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-x-6 sm:items-start w-full">
          {/* Title & Description Section */}
          <div className="sm:col-span-4">
            <div className="flex items-center gap-2">
             <span className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--hd-bg)]">
  {buttonIcon}
</span>


              <h2 className="text-base font-[var(--font-display)] font-black text-left">
                {title}
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-600 text-left">
              {description}
            </p>
          </div>

          {/* Button & Toggle Section */}
          {!approvalAddButton && !buttonHidden && (
            <div className="sm:col-span-1 flex flex-col items-end gap-2 min-w-[120px]">
              {disocuntToggleFlag && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-gray-700 whitespace-nowrap">
                    Discount Status:
                  </label>
                  <Switch
                    checked={enabled}
                    onChange={handleDiscountToggle}
                    className={`relative inline-flex h-8 w-28 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      enabled
                        ? "bg-indigo-600 focus:ring-indigo-500"
                        : "bg-green-700 focus:ring-green-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                        enabled ? "translate-x-[78px]" : "translate-x-2"
                      }`}
                    />
                    <span
                      className={`absolute left-4 sm:left-6 text-xs sm:text-sm font-semibold tracking-wide text-white transition-opacity duration-300 ${
                        enabled ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Special
                    </span>
                    <span
                      className={`absolute right-4 sm:right-6 text-xs sm:text-sm font-semibold tracking-wide text-white transition-opacity duration-300 ${
                        enabled ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      Normal
                    </span>
                  </Switch>
                </div>
              )}

              <div className="w-full sm:w-auto flex justify-end">
                <HalfSizeButton
                  buttonIcon={buttonIcon}
                  buttonText={buttonName}
                  buttonFunction={handleDialogOpen}
                  pdfDownload={pdfDownload}
                  pdfText={pdfText}
                  pdf={pdf}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HeadersAndAddButton;
