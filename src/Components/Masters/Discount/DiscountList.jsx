import axios from "../../Utils/AxiosInstance";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import { useToast } from "../../Context/ToastProvider";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";

function DiscountList({
        discountPaginationData,
        setOpenDialogForDiscount,
        setSaveBtnForDiscount,
        setDiscountInputs,
        fetchDiscount,
        setEditIdForDiscount,
        setCurrentPage,
        setLoading,
        loading,
        setIsEditing,
        saveBtnForDiscount,
}) {


  const { triggerToast } = useToast();


  const handleViewForAgent = async (e, id_crypt) => {
    console.log(id_crypt,"hello");
    
    // e.preventDefault();
    setOpenDialogForDiscount(true);
    setEditIdForDiscount(id_crypt);
    setLoading(true);
    setIsEditing(true);
    setSaveBtnForDiscount("update");

    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForDiscountEditData = await axios.get(
        `public/api/discount-on-purchases/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForDiscountEditData, "responseForDiscountEditData");
      

      const discountViewData = responseForDiscountEditData.data;
      console.log(discountViewData, "discountViewData");
      

      setDiscountInputs({
        discount_type:discountViewData.discount_type,
        discount_percent:discountViewData.discount_percent,
        applicable_date:discountViewData.applicable_date,
      });
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  const headers = ["S.No", "Discount Type", "Discount Percent", "Applicable Date", "Actions"];


  const renderRow = (discount, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">{discountPaginationData.from + index}</td>
      <td className="px-6 py-4">{discount.discount_type}</td>
      <td className="px-6 py-4">{discount.discount_percent}</td>
      <td className="px-6 py-4">{discount.applicable_date}</td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForAgent(e, discount.id_crypt)}
          >
            View
          </button>

          <DeleteConfirmation
            apiType="discount"
            id_crypt={discount.id_crypt}
            fetchDatas={fetchDiscount}
            setLoading={setLoading}
            loading={loading}
            
          />
        </div>
      </td>
    </>
  );

  return (
    <>

      <Table
        headers={headers}
        data={discountPaginationData?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={discountPaginationData}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default DiscountList;
