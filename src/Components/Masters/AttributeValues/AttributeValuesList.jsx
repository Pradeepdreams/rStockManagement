import axios from "../../Utils/AxiosInstance";
import React, { useState, useEffect } from "react";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import Select from "react-select";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";

function AttributeValuesList({
  attributeValuesPagination,
  setOpen,
  branchId,
  setSaveBtn,
  setAttributeValuesInputs,
  fetchAttributeValues,
  setIdCryptForAttributeValues,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
  filterData,
  setFilterData,
}) {
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const { triggerToast } = useToast();
  useEffect(() => {
    const fetchAttributes = async () => {
      const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds = branchData.map((branch) => branch.branch.id_crypt);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("public/api/attributes/list", {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        });
        setAttributes(res.data);
      } catch (error) {
        triggerToast("Fetch failed!", error.response?.data?.message, "error");
        // toast.error("Failed to load attributes");
      }
    };

    fetchAttributes();
  }, [branchId]);

  const handleViewForAttributeValues = async (e, id_crypt) => {
    e.preventDefault();
    setLoading(true);
    setIsEditing(true);
    setOpen(true);
    setIdCryptForAttributeValues(id_crypt);
    setSaveBtn("update");

    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForAttributeValuesEditData = await axios.get(
        `public/api/attribute-values/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      const attribute = responseForAttributeValuesEditData.data;
      setAttributeValuesInputs({
        values: attribute.values,
        attribute_id: attribute.attribute_id,
      });
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }

    setOpen(true);
  };

  const handleEditForAttributeValues = async (e, id_crypt) => {
    e.preventDefault();
    setLoading(true);
    setOpen(true);
    setIdCryptForAttributeValues(id_crypt);
    setSaveBtn("update");

    const token = localStorage.getItem("token");
    try {
      const responseForAttributeValuesEditData = await axios.get(
        `public/api/attribute-values/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      const attribute = responseForAttributeValuesEditData.data;
      setAttributeValuesInputs({
        values: attribute.values,
        attribute_id: attribute.attribute.name,
      });
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }

    setOpen(true);
  };

  const headers = ["S.No", "Attribute", "Sub Attribute", "Actions"];

  const renderRow = (attribute, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        {attributeValuesPagination?.attribute_values?.from + index}
      </td>
      <td className="px-6 py-4">{attribute.attribute.name}</td>
      <td className="px-6 py-4">{attribute.values}</td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-purple-600 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForAttributeValues(e, attribute.id_crypt)}
          >
            View
          </button>

          <DeleteConfirmation
            apiType="attribute_values"
            id_crypt={attribute.id_crypt}
            fetchDatas={fetchAttributeValues}
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
      <div className="flex gap-4 mb-4 items-end">
        <div className="flex flex-col">
          <Select
            options={[
              { value: "", label: "Select Attribute", isDisabled: true },
              ...attributes.map((attr) => ({
                value: attr.id,
                label: attr.name,
              })),
            ]}
            value={
              [
                { value: "", label: "Select Attribute" },
                ...attributes.map((attr) => ({
                  value: attr.id,
                  label: attr.name,
                })),
              ].find((option) => option.value === filterData.attribute_id) || {
                value: "",
                label: "Select Attribute",
              }
            }
            onChange={(selectedOption) => {
              setFilterData((prev) => ({
                ...prev,
                attribute_id: selectedOption ? selectedOption.value : "",
              }));
            }}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
            menuPosition="fixed"
            classNamePrefix="select"
          />
        </div>

        <button
          className="bg-[#134b90] text-white px-3 py-2 rounded"
          onClick={() => {
            fetchAttributeValues(1, filterData);
          }}
        >
          Apply Filters
        </button>
      </div>

      <Table
        headers={headers}
        data={attributeValuesPagination?.attribute_values?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={attributeValuesPagination?.attribute_values}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default AttributeValuesList;
