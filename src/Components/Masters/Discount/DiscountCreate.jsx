import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import DiscountList from "./DiscountList";
import DiscountDialogBox from "./DiscountDialogBox";
import { useDiscountDialog } from "../../Context/DiscountDialogContext";


function DiscountCreate() {
  const { collapsed } = useOutletContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { triggerToast } = useToast();
  const { searchTerm } = useSearch();

  const {
    openDialogForDiscount,
    toggleDialog,
    setOpenDialogForDiscount,
    discountPaginationData,
    setDiscountPaginationData,
    saveBtnForDiscount,
    setSaveBtnForDiscount,
    editIdForDiscount,
    setEditIdForDiscount,
    discountInputs,
    setDiscountInputs,
  } = useDiscountDialog();

  const fetchDiscount = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page,
      // search: searchTerm,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await axios.get(
        `public/api/discount-on-purchases?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds,
          },
        }
      );
      console.log(response.data.discounts, "discount");
      

      setDiscountPaginationData(response.data.discounts);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscount(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForDiscount = () => {
    setOpenDialogForDiscount(true);
    setSaveBtnForDiscount("save");
    setEditIdForDiscount("");
    setIsEditing(false);
    setDiscountInputs({
      name: "",
      discount_type: "",
      applicable_date: "",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Discounts"
        description="A list of all discounts"
        buttonName="Add Discount"
        setOpenDialogForDiscount={setOpenDialogForDiscount}
        handleDialogOpen={handleAddForDiscount}
        disocuntToggleFlag="discount"
      />

      <DiscountList
        discountPaginationData={discountPaginationData}
        setOpenDialogForDiscount={setOpenDialogForDiscount}
        setSaveBtnForDiscount={setSaveBtnForDiscount}
        setDiscountInputs={setDiscountInputs}
        fetchDiscount={fetchDiscount}
        setEditIdForDiscount={setEditIdForDiscount}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
        saveBtnForDiscount={saveBtnForDiscount}



      />

      {openDialogForDiscount && (
        <DiscountDialogBox
        discountPaginationData={discountPaginationData}
        setOpenDialogForDiscount={setOpenDialogForDiscount}
        openDialogForDiscount={openDialogForDiscount}
        setSaveBtnForDiscount={setSaveBtnForDiscount}
        setDiscountInputs={setDiscountInputs}
        fetchDiscount={fetchDiscount}
        setEditIdForDiscount={setEditIdForDiscount}
        editIdForDiscount={editIdForDiscount}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        saveBtnForDiscount={saveBtnForDiscount}
        loading={loading}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        discountInputs={discountInputs}
        />
      )}
    </>
  );
}

export default DiscountCreate;
