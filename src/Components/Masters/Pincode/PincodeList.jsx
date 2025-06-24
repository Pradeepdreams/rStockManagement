import axios from "../../Utils/AxiosInstance";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import {
  FaHashtag,
  FaGlobeAsia,
  FaMapMarkedAlt,
  FaCity,
  FaMapPin,
} from "react-icons/fa";

function PincodeList({
  pincodePaginationData,
  setOpenDialogForPincode,
  setSaveBtnForPincode,
  setPincodeInputs,
  fetchPincode,
  setEditIdForPincode,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
  isEditing,
  setRequiredFields,
}) {
  const { triggerToast } = useToast();
  const handleViewForPincode = async (e, id_crypt) => {
    setOpenDialogForPincode(true);
    setEditIdForPincode(id_crypt);
    setLoading(true);
    setIsEditing(true);
    setSaveBtnForPincode("update");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");
    try {
      const responseForPincodeEditData = await axios.get(
        `public/api/pincodes/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      console.log(responseForPincodeEditData, "edit");

      setPincodeInputs({
        country: responseForPincodeEditData.data.country,
        state: responseForPincodeEditData.data.state,
        city: responseForPincodeEditData.data.city,
        pincode: responseForPincodeEditData.data.pincode,
      });
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const headers = ["S.No", "Country", "State", "City", "Pincode", "Actions"];

  const renderRow = (pincode, index) => (
    // <>
    //   <td className="px-6 py-4 whitespace-nowrap">{pincodePaginationData.from + index}</td>
    //   <td className="px-6 py-4">{pincode.country}</td>
    //   <td className="px-6 py-4">{pincode.state}</td>
    //   <td className="px-6 py-4">{pincode.city}</td>
    //   <td className="px-6 py-4">{pincode.pincode}</td>

    //   <td className="px-6 py-4 text-center">
    //     <div className="flex justify-center gap-2">
    //       {/* <button
    //         className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-sm shadow"
    //         onClick={(e) => handleViewForPincode(e, pincode.id_crypt)}
    //       >
    //         View
    //       </button> */}
    //       <ViewButton onView={handleViewForPincode} item={pincode} />

    //       <DeleteConfirmation
    //         apiType="pincode"
    //         id_crypt={pincode.id_crypt}
    //         fetchDatas={fetchPincode}
    //         setLoading={setLoading}
    //         loading={loading}
    //       />
    //     </div>
    //   </td>
    // </>

    <>
      {/* Index */}
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
          <FaHashtag className="text-gray-500" />
          {pincodePaginationData.from + index}
        </span>
      </td>

      {/* Country */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1  text-green-800 px-2 py-1 rounded text-sm font-medium capitalize">
          {/* <FaGlobeAsia className="text-green-600" /> */}
          {pincode.country || "N/A"}
        </span>
      </td>

      {/* State */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1  text-blue-800 px-2 py-1 rounded text-sm font-medium capitalize">
          {/* <FaMapMarkedAlt className="text-blue-600" /> */}
          {pincode.state || "N/A"}
        </span>
      </td>

      {/* City */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium capitalize">
          <FaCity className="text-yellow-600" />
          {pincode.city || "N/A"}
        </span>
      </td>

      {/* Pincode */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
          <FaMapPin className="text-purple-600" />
          {pincode.pincode || "N/A"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-center">
        <div className="flex  gap-2">
          <ViewButton onView={handleViewForPincode} item={pincode} />
          <DeleteConfirmation
            apiType="pincode"
            id_crypt={pincode.id_crypt}
            fetchDatas={fetchPincode}
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
        data={pincodePaginationData?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={pincodePaginationData}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default PincodeList;
