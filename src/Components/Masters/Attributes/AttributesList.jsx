import axios from "../../Utils/AxiosInstance";
import React from "react";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { useToast } from "../../Context/ToastProvider";

function AttributesList({
    attributesPagination,
    setOpen,
    branchId,
    setSaveBtn,
    setAttributesInputs,
    fetchAttributes,
    setIdCryptForAttributes,
    setCurrentPage,
    setLoading,
    loading,
    setIsEditing
}) {

    const { triggerToast } = useToast();
    const handleViewForAttributes = async (e, id_crypt) => {
        e.preventDefault();
        setLoading(true);
        setIsEditing(true);
        setOpen(true);
        setIdCryptForAttributes(id_crypt);
        setSaveBtn("update");

        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                `public/api/attributes/${id_crypt}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Branch-Id": branchId,
                    },
                }
            );

            const attribute = response.data;
            setAttributesInputs({
                name: attribute.name,
            });
        } catch (error) {
            triggerToast("Error", error?.response?.data?.message, "error");
            // toast.error(error?.response?.data?.message || "Error fetching attribute.");
        } finally {
            setLoading(false);
        }
    };

    const headers = ["S.No", "Categories",  "Attribute name","Actions"];

    const renderRow = (attribute, index) => (
        <>
            <td className="px-6 py-4 whitespace-nowrap">
                {attributesPagination.attributes.from + index}
            </td>
            <td className={`px-6 py-4 `}>
                {attribute.categories?.length > 0
                    ? attribute.categories.map(cat => cat.name).join(', ')
                    : '-'}
            </td>
            <td className="px-6 py-4">{attribute.name}</td>
            
            <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                    <button
                        className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
                        onClick={(e) => handleViewForAttributes(e, attribute.id_crypt)}
                    >
                        View
                    </button>

                    <DeleteConfirmation
                        apiType="attribute"
                        id_crypt={attribute.id_crypt}
                        fetchDatas={fetchAttributes}
                        branchId={branchId}
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
                data={attributesPagination?.attributes?.data || []}
                renderRow={renderRow}
            />
            <Pagination
                meta={attributesPagination?.attributes}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </>
    );
}

export default AttributesList;
