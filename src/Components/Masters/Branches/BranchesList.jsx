import axios from "../../Utils/AxiosInstance";
import { toast } from "react-toastify";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import { FaBuilding, FaHashtag } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";

function BranchesList({
  branchPagination,
  setLoading,
  setIsEditing,
  setSaveBtnForBranch,
  fetchBranch,
  setEditIdForBranch,
  loading,
  setCurrentPage,
  setOpenDialogForBranch,
  setBranchInputs
}) {
const { triggerToast } = useToast();

  const handleViewForArea = async (e, id_crypt) => {
    console.log(id_crypt);
    
    setOpenDialogForBranch(true);
    setEditIdForBranch(id_crypt);
    setLoading(true);
    setIsEditing(true);
    setSaveBtnForBranch("update");
    const branchData = await getBranchDataFromBalaSilksDB();
        const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");
    try {
      const responseForBranchEditData = await axios.get(
        `public/api/branches/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      console.log(responseForBranchEditData, "edit");
      

      setBranchInputs({
        name: responseForBranchEditData.data.name,
        location: responseForBranchEditData.data.location,
      });

    } catch (error) {
      triggerToast("Error", error.response.data.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  const headers = ["S.No", "Branch Name", "Location", "Actions"];


  const renderRow = (branch, index) => (
    // <>
    //   <td className="px-6 py-4 whitespace-nowrap">{branchPagination.from + index}</td>
    //   <td className="px-6 py-4">{branch.name}</td>
    //   <td className="px-6 py-4">{branch.location}</td>

    //   <td className="px-6 py-4 text-center">
    //     <div className="flex justify-center gap-2">
    //       {/* <button
    //         className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-sm shadow"
    //         onClick={(e) => handleViewForArea(e, branch.id_crypt)}
    //       >
    //         View
    //       </button> */}
    //       <ViewButton onView={handleViewForArea} item={branch} />

    //       <DeleteConfirmation
    //         apiType="branches"
    //         id_crypt={branch.id_crypt}
    //         fetchDatas={fetchBranch}
    //         setLoading={setLoading}
    //         loading={loading}
    //       />
    //     </div>
    //   </td>
    // </>

    <>
  <td className="px-6 py-4 whitespace-nowrap text-left">
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
      <FaHashtag className="text-gray-500" />
      {branchPagination.from + index}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
      <FaBuilding className="text-blue-600" />
      {branch.name || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1  text-green-800 px-2 py-1 rounded text-sm font-medium">
      <FaMapMarkerAlt className="text-green-600" />
      {branch.location || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    <div className="flex  gap-2">
      <ViewButton onView={handleViewForArea} item={branch} />

      <DeleteConfirmation
        apiType="branches"
        id_crypt={branch.id_crypt}
        fetchDatas={fetchBranch}
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
        data={branchPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={branchPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default BranchesList;
