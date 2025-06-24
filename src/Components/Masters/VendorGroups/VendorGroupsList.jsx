import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";

function VendorGroupsList({
    vendorGroupPaginationData,
            setVendorGroupInputs,
            fetchVendorGroup,
            setCurrentPage,
            setLoading,
            loading,
            setIsEditing,
            setOpenDialogForVendorGroup,
            setSaveBtnForVendorGroup,
            setEditIdForVendorGroup
}) {
    const handleViewForGroup = async (e, id_crypt) => {
        e.preventDefault();
        setLoading(true);
        setIsEditing(true);
        setOpenDialogForVendorGroup(true);
        setEditIdForVendorGroup(id_crypt);
        setSaveBtnForVendorGroup("update");

        const token = localStorage.getItem("token");
         const branchData = await getBranchDataFromBalaSilksDB();
            const branchIds = branchData.map((branch) => branch.branch.id_crypt);
        try {
            const response = await axios.get(
                `public/api/vendor-groups/${id_crypt}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Branch-Id": branchIds[0],
                    },
                }
            );

            const group = response.data.data;
            setVendorGroupInputs({
                name: group.name,
                description: group.description,
            });
           
            
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error fetching group.");
        } finally {
            setLoading(false);
        }
    };

    const headers = ["S.No", "Vendor Group Name","description", "Actions"];

    const renderRow = (group, index) => (
        <>
            <td className="px-6 py-4 whitespace-nowrap">
                {vendorGroupPaginationData.from + index}
            </td>
            <td className="px-6 py-4">{group.name}</td>
          
            <td className={`px-6 py-4`}>
                {group.description}
            </td>
            <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                    <button
                        className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
                        onClick={(e) => handleViewForGroup(e, group.id_crypt)}
                    >
                        View
                    </button>

                    <DeleteConfirmation
                        apiType="vendor-group"
                        id_crypt={group.id_crypt}
                        fetchDatas={fetchVendorGroup}
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
                data={vendorGroupPaginationData?.data || []}
                renderRow={renderRow}
            />
            <Pagination
                meta={vendorGroupPaginationData}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </>
    );
}

export default VendorGroupsList;
