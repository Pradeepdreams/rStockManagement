import React, { useEffect, useState } from "react";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import axios from "../Utils/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Utils/Loader";
import HeadersAndAddButton from "../Utils/HeadersAndAddButton";
import { errorDialog } from "../Context/ErrorContext";
import { useToast } from "../Context/ToastProvider";
import { useSearch } from "../Context/SearchContext";
import { FaDownload, FaUserAlt, FaUsersCog } from "react-icons/fa";
import { useDialogForSales } from "../Context/SalesDialogContext";
import SalesList from "./SalesList";
import SalesDialogBox from "./SalesDialogBox";

function SalesCreate() {
  const {
    openDialogForSales,
    setOpenDialogForSales,
    salesPaginationData,
    setSalesPaginationData,
    saveBtnForSales,
    setSaveBtnForSales,
    editIdForSales,
    setEditIdForSales,
    salesInputs,
    setSalesInputs,
  } = useDialogForSales();

  const { searchTerm } = useSearch();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const { checkAuthError } = errorDialog();

  const { triggerToast } = useToast();

  const fetchSales = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
      //   ...filters,
    });

    try {
      const response = await axios.get(`public/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setSalesPaginationData(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
      checkAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(currentPage);
  }, [currentPage]);

  const searchSalesFetch = async (searchTerm) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page: 1,
      search: searchTerm,
    });
    try {
      const responseForEmployees = await axios.get(
        `public/api/sales?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForEmployees.data.data, "employee");

      setSalesPaginationData(responseForEmployees.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

  useEffect(() => {
    searchSalesFetch(searchTerm);
  }, [searchTerm]);

  const handleAddForSales = () => {
    console.log("Add Employee");

    setOpenDialogForSales(true);
    setSaveBtnForSales("save");
    setEditIdForSales("");
    setIsEditing(false);
    setSalesInputs({
      sales_order_number: "",
      order_date: "",
      customer_id: "",
      igst_amount: "",
      cgst_amount: "",
      sgst_amount: "",
      gst_amount: "",
      order_amount: "",
      total_amount: "",
      discount: "",
      discount_percent: "",
      discount_amount: "",
      discounted_total: "",
      payment_terms_id: "",
      mode_of_delivery: "",
      expected_delivery_date: "",
      logistic_id: "",
      sales_status: "",
      remarks: "",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Sales"
        description="A list of all sales"
        buttonName="Add Sales"
        setOpenDialogForSales={setOpenDialogForSales}
        handleDialogOpen={handleAddForSales}
        buttonIcon={<FaUsersCog />}
        pdfDownload={<FaDownload />}
        // pdf={true}
        // pdfText={"Download Employees Report"}
      />

      {openDialogForSales && (
        <SalesDialogBox
          openDialogForSales={openDialogForSales}
          setOpenDialogForSales={setOpenDialogForSales}
          salesInputs={salesInputs}
          setSalesInputs={setSalesInputs}
          saveBtnForSales={saveBtnForSales}
          setSaveBtnForSales={setSaveBtnForSales}
          fetchSales={fetchSales}
          setEditIdForSales={setEditIdForSales}
          editIdForSales={editIdForSales}
          setIsEditing={setIsEditing}
          isEditing={isEditing}

        />
      )}

      <SalesList
        salesPaginationData={salesPaginationData}
        setOpenDialogForSales={setOpenDialogForSales}
        setSaveBtnForSales={setSaveBtnForSales}
        setSalesInputs={setSalesInputs}
        fetchSales={fetchSales}
        setEditIdForSales={setEditIdForSales}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      


    </>
  );
}

export default SalesCreate;
