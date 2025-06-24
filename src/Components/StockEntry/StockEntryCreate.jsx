import React, { useState, useEffect } from "react";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "../../Components/Utils/AxiosInstance";
import { toast } from "react-toastify";
import Select from "react-select";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import { useDialog } from "../Context/DialogContext";
import { useToast } from "../Context/ToastProvider";
import Loader from "../Utils/Loader";
import HeadersAndAddButton from "../Utils/HeadersAndAddButton";
import { useOutletContext } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/16/solid";
import { triggerGlobalToast } from "../Utils/GlobalToast";
import { BsBodyText } from "react-icons/bs";
import { FaDownload } from "react-icons/fa6";
import SaveButton from "../Utils/SaveButton";

function StockEntryCreate({
  //   collapsed,
  isEditing,
  setIsEditing,
  //   setLoading,
  //   fetchSocialMedia,
}) {
  const {
    openDialogForSocialMedia,
    setOpenDialogForSocialMedia,
    saveBtnForSocialMedia,
    editIdForSocialMedia,
    socialMediaInputs,
    setSocialMediaInputs,
  } = useDialog();

  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });

  const { triggerToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [openDialogForStockEntry, setOpenDialogForStockEntry] = useState(false);
  const { collapsed } = useOutletContext();
  const [poEntryDatas, setPoEntryDatas] = useState([]);
  const [stockEntryItems, setStockEntryItems] = useState([]);
  // const [stockCategory, setStockCategory] = useState([]);
  const [stockCategoryMap, setStockCategoryMap] = useState({});
  const [categoryDataForGetCategoryName,setCategoryDataForGetCategoryName] = useState({});

  const [showRemaingFields, setShowRemaingFields] = useState(false);
  const [itemsShow, setItemsShow] = useState(false);

  const [stockEntryInputs, setStockEntryInputs] = useState({
    po_number: "",
    quantity: "",
    items: [
      {
        item_id: "",
        quantity: "",
        selling_price: "",
        category:"",
        attributes: [],
      },
    ],
  });

  const fetchStockEntry = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await axios.get(`public/api/purchase-entries/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      console.log(response, "stock");
      setPoEntryDatas(response?.data);
    } catch (error) {
      console.log("API error:", error);
      toast.error(
        error.response?.data?.message || "Error fetching stock entry"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockEntry();
  }, []);

  useEffect(() => {
  if (!openDialogForStockEntry) {
    setStockEntryInputs({
      po_number: "",
      quantity: "",
      items: [
        {
          item_id: "",
          quantity: "",
          selling_price: "",
          category: "",
          attributes: [],
        },
      ],
    });
    setStockCategoryMap({});
    setShowRemaingFields(false);
    setItemsShow(false);
  }
}, [openDialogForStockEntry]);

  const handleAddStockEntry = () => {
    setOpenDialogForStockEntry(true);

  setStockEntryInputs({
     po_number: "",
    quantity: "",
    items: [
      {
        item_id: "",
        quantity: "",
        selling_price: "",
        category:"",
        attributes: [],
      },
    ],
  });

  };

  
  // const handleChangeforStockEntry = async (e, index = null) => {
  //   const { name, value, id_crypt } = e.target;
  //   console.log(name, value);

  //   const branchData = await getBranchDataFromBalaSilksDB();
  //   const branchIds = branchData.map((branch) => branch.branch.id_crypt);
  //   const token = localStorage.getItem("token");

  //   if (name === "po_number") {
  //     // Fetch purchase entry details based on po_number id_crypt
  //     try {
  //       const response = await axios.get(
  //         `public/api/purchase-entries/${id_crypt}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "X-Branch-Id": branchIds[0],
  //           },
  //         }
  //       );

  //       console.log(response.data, "poitems");

  //       // Set the items related to this purchase entry
  //       setStockEntryItems(response.data.items);
  //       setItemsShow(true)

  //       // Update po_number in main stockEntryInputs state
  //       setStockEntryInputs((prev) => ({
  //         ...prev,
  //         po_number: value,
  //       }));
  //     } catch (error) {
  //       console.error("Error fetching purchase entry:", error);
  //     }
  //     return;
  //   }

  //   // If we are updating an item-level field (item_id, quantity, selling_price, etc.)
  //   if (index !== null) {
  //     setStockEntryInputs((prev) => {
  //       const updatedItems = [...prev.items];
  //       updatedItems[index] = {
  //         ...updatedItems[index],
  //         [name]: value,
  //         id_crypt: id_crypt || updatedItems[index].id_crypt,
  //       };
  //       return {
  //         ...prev,
  //         items: updatedItems,
  //       };
  //     });

  //     if (name === "item_id") {
  //       // Fetch item category details on item_id change
  //       setShowRemaingFields(true);
  //       try {
  //         const responseForItems = await axios.get(
  //           `public/api/items/${id_crypt}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //               "X-Branch-Id": branchIds[0],
  //             },
  //           }
  //         );

  //         console.log(
  //           responseForItems.data.original.category,
  //           "responseForItems"
  //         );
  //         setStockCategory(responseForItems.data.original.category);
  //       } catch (error) {
  //         console.error("Error fetching item category:", error);
  //       }
  //     }
  //   }

  //   if (index === null) {
  //     setStockEntryInputs((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleChangeforStockEntry = async (e, index = null) => {
  const { name, value, id_crypt } = e.target;
  console.log(name, value);

  const branchData = await getBranchDataFromBalaSilksDB();
  const branchIds = branchData.map((branch) => branch.branch.id_crypt);
  const token = localStorage.getItem("token");

  if (name === "po_number") {
    try {
      const response = await axios.get(
        `public/api/purchase-entries/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      console.log(response.data, "poitems");
     const checkQuantityForItems = response.data?.items.filter(
  (item) => Number(item.pending_quantity) > 0
);

      console.log(checkQuantityForItems, "checkQuantityForItems");
      

      // setStockEntryItems(response.data.items);
      setStockEntryItems(checkQuantityForItems);
      setItemsShow(true);

      setStockEntryInputs((prev) => ({
        ...prev,
        po_number: value,
        // Do not clear existing items here
      }));
    } catch (error) {
      console.error("Error fetching purchase entry:", error);
    }
    return;
  }

//   let enteredQty = 0

//    if(name==="quantity"){
//     console.log(value, "value");
//     enteredQty = value

//      setStockEntryInputs((prev) => ({
//       ...prev,
//       items: prev.items.map((item, i) => {
//         if (i === index) {
         
//           return {
//             ...item,
//             // pending_quantity: stockEntryItems.map((item) => item.pending_quantity),
// pending_quantity: stockEntryItems.map((item) => item.pending_quantity) - enteredQty, 
//           };
//         }
//         return item;
//       }),
//     }));
//    }


//   if (index !== null) {
//     setStockEntryInputs((prev) => {
//       const updatedItems = [...prev.items];
//       updatedItems[index] = {
//         ...updatedItems[index],
//         [name]: value,
//         id_crypt: id_crypt || updatedItems[index].id_crypt,
//       };
//       return {
//         ...prev,
//         items: updatedItems,
//       };
//     });

  

//     if (name === "item_id") {
//   setShowRemaingFields(true);
//   try {
//     const responseForItems = await axios.get(
//       `public/api/items/${id_crypt}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Branch-Id": branchIds[0],
//         },
//       }
//     );
//     console.log(responseForItems.data.original, "responseForItems");
    

// setStockEntryInputs((prev) => {
//   const enteredQty = Number(prev.items[index]?.quantity || 0);

//   const previousPendingQty = index > 0
//     ? Number(prev.items[index - 1]?.pending_quantity || 0)
//     : Number(stockEntryItems.map((item) => item.pending_quantity) || 0); // fallback for first item

//   const newPendingQty = previousPendingQty - enteredQty;

//   return {
//     ...prev,
//     items: prev.items.map((item, i) => {
//       if (i === index) {
//         return {
//           ...item,
//           category: responseForItems.data.original.category?.name,
//           original_pending_quantity: previousPendingQty,
//           pending_quantity: newPendingQty,
//         };
//       }
//       return item;
//     }),
//   };
// });

    
    
// //     setStockEntryInputs((prev) => ({
// //       ...prev,
// //       items: prev.items.map((item, i) => {
// //         if (i === index) {
// //           if(item.quantity){
// //             enteredQty = Number(item.quantity || 0);
// //           }
          
// //           const calculatedPendingQty = stockEntryItems.map((item) => item.pending_quantity) - enteredQty;
// //           console.log(calculatedPendingQty, "calculatedPendingQty");
          

// //           return {
// //             ...item,
// //             category: responseForItems.data.original.category?.name,
// //             // pending_quantity: stockEntryItems.map((item) => item.pending_quantity),
// // pending_quantity: item.pending_quantity ? item.pending_quantity - enteredQty : stockEntryItems.map((item) => item.pending_quantity) - enteredQty, 
// //           };
// //         }
// //         return item;
// //       }),
// //     }));

//     const categoryData = responseForItems.data.original.category;
//     setCategoryDataForGetCategoryName(categoryData);

//     // Save category specific to this item index
//     setStockCategoryMap((prev) => ({
//       ...prev,
//       [index]: categoryData,
//     }));
//   } catch (error) {
//     console.error("Error fetching item category:", error);
//   }
// }


//   } else {
//     setStockEntryInputs((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }

let enteredQty = 0;

if (name === "quantity") {
  enteredQty = Number(value || 0);

  // Step 1: Update quantity and recalculate pending_quantity
  setStockEntryInputs((prev) => {
    const previousPending = index > 0
      ? Number(prev.items[index - 1]?.pending_quantity || 0)
      : Number(prev.items[index]?.pending_quantity || 0); // fallback

    const newPending = previousPending - enteredQty;

    const updatedItems = [...prev.items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: enteredQty,
      pending_quantity: newPending,
    };

    return {
      ...prev,
      items: updatedItems,
    };
  });
}

// Always update the item field (name/value)
if (index !== null) {
  setStockEntryInputs((prev) => {
    const updatedItems = [...prev.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
      id_crypt: id_crypt || updatedItems[index].id_crypt,
    };
    return {
      ...prev,
      items: updatedItems,
    };
  });

  // If item_id changed, fetch details and update category & pending
  if (name === "item_id") {
    setShowRemaingFields(true);

    try {
      const responseForItems = await axios.get(
        `public/api/items/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      const categoryData = responseForItems.data.original.category;
      const apiPendingQty = stockEntryItems.map((item) => item.pending_quantity);

      setCategoryDataForGetCategoryName(categoryData);

      // Save category map
      setStockCategoryMap((prev) => ({
        ...prev,
        [index]: categoryData,
      }));

      setStockEntryInputs((prev) => {
        const enteredQty = Number(prev.items[index]?.quantity || 0);

        const previousPending = index > 0
          ? Number(prev.items[index - 1]?.pending_quantity || 0)
          : Number(apiPendingQty || 0);

        const newPending = previousPending - enteredQty;

        const updatedItems = [...prev.items];
        updatedItems[index] = {
          ...updatedItems[index],
          category: categoryData?.name,
          original_pending_quantity: previousPending,
          pending_quantity: newPending,
        };

        const filteredItems = updatedItems.filter(item => Number(item.pending_quantity) > 0);
        console.log(filteredItems, "filteredItems");
        

        return {
          ...prev,
          items: updatedItems,
         
        };
      });

    } catch (error) {
      console.error("Error fetching item category:", error);
    }
  }
} else {
  // For main level fields (like po_number)
  setStockEntryInputs((prev) => ({
    ...prev,
    [name]: value,
  }));
}



};

  const handleAttributeChange = (selectedOption, itemIndex, attributeId) => {
  setStockEntryInputs((prev) => {
    const updatedItems = [...prev.items];
    let attributes = updatedItems[itemIndex].attributes || [];

    const attrIndex = attributes.findIndex(
      (attr) => attr.attribute_id === attributeId
    );

    if (attrIndex !== -1) {
      attributes[attrIndex] = {
        attribute_id: attributeId,
        value_id: selectedOption.value,
        value_label: selectedOption.label,
        id_crypt: selectedOption.id_crypt,
      };
    } else {
      attributes.push({
        attribute_id: attributeId,
        value_id: selectedOption.value,
        value_label: selectedOption.label,
        id_crypt: selectedOption.id_crypt,
      });
    }

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      attributes,
    };

    return {
      ...prev,
      items: updatedItems,
    };
  });
};


  
//   const handleSubmitForStockEntry = async(e) => {
//     e.preventDefault();

//     const groupedItems = {};

//     stockEntryInputs.items?.forEach((item) => {
//       const itemId = item.item_id;

//       // Get item-related info from stockEntryItems
//       const itemMeta = stockEntryItems.find(
//         (entry) => entry.item.id === itemId
//       );

//       console.log(itemMeta, "itemMeta");

//       if (!itemMeta) return; // Skip if metadata not found

//       // Build one entry (item_list block)
//       const newItemEntry = {
//         selling_price: item.selling_price,
//         quantity: item.quantity,
//         attributes: (item.attributes || []).map((attr) => {
//           // const attrCategory = stockCategory?.attributes?.find(
//           //   (cat) => cat.id === attr.attribute_id
//           // );
//          const attrCategory = stockCategoryMap[itemIndex]?.attributes?.find(
//   (cat) => cat.id === attr.attribute_id
// );

//           console.log(attrCategory, "attrCategory");
          

//           return {
//             attribute_id: attrCategory?.id || null,
//             attribute_name: attrCategory?.name || "",
//             attribute_value_id: attr.attribute_id,
//             attribute_value_name: attr.value_label,
//           };
//         }),
//       };

//       // Group entries by item_id
//       if (!groupedItems[itemId]) {
//         groupedItems[itemId] = {
//           item_id: itemMeta.item.id,
//           item_name: itemMeta.item.item_name,
//           category_id: itemMeta.item.category_id,
//           category_name: categoryDataForGetCategoryName?.name || "", // ✅ correct category name
//           purchase_entry_item_id: itemMeta.id,
//           item_lists: [newItemEntry],
//         };
//       } else {
//         groupedItems[itemId].item_lists.push(newItemEntry);
//       }
//     });

//     const finalPayload = {
//       purchase_entry_id: stockEntryInputs.po_number,
//       items: Object.values(groupedItems),
//     };

//     try {
//       const response = await axios.post(`public/api/stock-items`, finalPayload, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     triggerGlobalToast("Success", "Stock Entry Created Successfully", "success");
//     } catch (error) {
//       console.log("API error:", error);
      
//     }


//     console.log("✅ Final Submission Payload:", finalPayload);
//   };

  // const handleAddItems = () => {
  //   setStockEntryInputs((prev) => {
  //     const newItem = {
  //       item_id: "", // or 0/null as default
  //       item_name: "",
  //       category_id: null,
  //       category_name: "",
  //       purchase_entry_item_id: null,
  //       item_lists: [
  //         {
  //           selling_price: "",
  //           quantity: "",
  //           attributes: [],
  //         },
  //       ],
  //     };

  //     return {
  //       ...prev,
  //       items: [...(prev.items || []), newItem],
  //     };
  //   });
  // };

  const handleSubmitForStockEntry = async (e) => {
  e.preventDefault();

  const groupedItems = {};

  stockEntryInputs.items?.forEach((item, itemIndex) => {
    const itemId = item.item_id;

    // Get item-related info from stockEntryItems
    const itemMeta = stockEntryItems.find(
      (entry) => entry.item.id === itemId
    );

    console.log(itemMeta, "itemMeta");

    if (!itemMeta) return; // Skip if metadata not found

    // Build one entry (item_list block)
    const newItemEntry = {
      selling_price: item.selling_price,
      quantity: item.quantity,
      attributes: (item.attributes || []).map((attr) => {
        // Get attribute category from stockCategoryMap for the current item index
        const attrCategory = stockCategoryMap[itemIndex]?.attributes?.find(
          (cat) => cat.id === attr.attribute_id
        );

        console.log(attrCategory, "attrCategory");

        return {
          attribute_id: attrCategory?.id || null,
          attribute_name: attrCategory?.name || "",
          attribute_value_id: attr.value_id,          // corrected to attr.value_id
          attribute_value_name: attr.value_label,
        };
      }),
    };

    // Group entries by item_id
    if (!groupedItems[itemId]) {
      groupedItems[itemId] = {
        item_id: itemMeta.item.id,
        item_name: itemMeta.item.item_name,
        category_id: itemMeta.item.category_id,
        category_name: categoryDataForGetCategoryName?.name || "",  // safer fallback here
        purchase_entry_item_id: itemMeta.id,
        item_lists: [newItemEntry],
      };
    } else {
      groupedItems[itemId].item_lists.push(newItemEntry);
    }
  });

  const finalPayload = {
    purchase_entry_id: stockEntryInputs.po_number,
    items: Object.values(groupedItems),
  };

  try {
    const response = await axios.post(`public/api/stock-items`, finalPayload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    triggerGlobalToast("Success", "Stock Entry Created Successfully", "success");
  } catch (error) {
    console.log("API error:", error);
  }

  console.log("✅ Final Submission Payload:", finalPayload);
};


  const handleAddItems = () => {
  const newItem = {
    item_id: "",
    selling_price: "",
    quantity: "",
    attributes: [],
  };
 

  setStockEntryInputs((prev) => ({
    ...prev,
    items: [...(prev.items || []), newItem],
  }));
};

const handleRemoveItems = (index) => {
  setStockEntryInputs((prev) => ({
    ...prev,
    items: prev.items.filter((_, i) => i !== index),
  }));
};    

const handleCloseForStockentryDialogBox = () => {
  setOpenDialogForStockEntry(false);
 
};


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HeadersAndAddButton
            title={"Stock Entry"}
            description={"A list of all stock entries"}
            buttonName={"Add Stock Entry"}
            handleDialogOpen={handleAddStockEntry}
            buttonIcon={<BsBodyText />}
                    pdf={true}
                    pdfDownload={<FaDownload />}
                    pdfText={"Download Stock Entry Reports"}
          />
        </>
      )}

      <Dialog
        open={openDialogForStockEntry}
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
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100   text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
              <div className="bg-[var(--dialog-bgcolor)] text-white p-4 flex items-center justify-between">
                <h2 style={{ fontFamily: "poppins" }} className="font-semibold">
                  Stock Entry
                </h2>
                <div className="flex gap-2">
                  {isEditing && (
                    <div
                      onClick={() => setIsEditing(false)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    onClick={handleCloseForStockentryDialogBox}
                    className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 bg-gray-50">
                <div className="grid grid-cols-1  gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Entry <span className="text-red-400">*</span>
                    </label>

                    <Select
                      name="po_number"
                      options={poEntryDatas.map((item) => ({
                        value: item.id,
                        label: item.purchase_entry_number,
                        id_crypt: item.id_crypt,
                      }))}
                      value={
                        poEntryDatas
                          .map((item) => ({
                            value: item.id,
                            label: item.purchase_entry_number,
                            id_crypt: item.id_crypt,
                          }))
                          .find(
                            (option) =>
                              option.value === stockEntryInputs.po_number
                          ) || null
                      }
                      onChange={(selectedOption) => {
                        handleChangeforStockEntry({
                          target: {
                            name: "po_number",
                            value: selectedOption?.value || null,
                            id_crypt: selectedOption?.id_crypt || null,
                          },
                        });
                      }}
                      classNamePrefix="select"
                      isDisabled={isEditing}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                    />

                    {requiredFields.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {requiredFields.name[0]}
                      </p>
                    )}
                  </div>

{itemsShow && (
    <div className="mt-2 sm:mt-4 flow-root">
                    <div className="overflow-x-auto border border-gray-300 rounded-md">
                      <div className="min-w-[1200px] sm:min-w-full">
                        {/* Header */}
                        <div
                          className={`grid grid-cols-12
                                 gap-1 border-b border-gray-300 bg-gray-100`}
                        >
                          <div className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 col-span-3">
                            Items
                          </div>
                        </div>

                        {/* Body */}
                        <div className="divide-y divide-gray-200 p-2 ">
                          {(stockEntryInputs?.items || [])?.map(
                            (item, index) => (
                              <React.Fragment key={index}>
                               
                                <div
                                  key={index}
                                  className={`grid grid-cols-12
                                       gap-1 items-center py-3`}
                                >
                                  <div
                                    className={`col-span-2`}
                                  >
                                      <span className="inline-flex items-center rounded-md mb-2 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                                              Choose Item
                                            </span>
                                    <Select
                                      name="item_id"
                                      options={stockEntryItems.map((item) => ({
                                        value: item.item.id,
                                        label: item.item.item_name,
                                        id_crypt: item.item.id_crypt,
                                      }))}
                                      value={
                                        stockEntryItems
                                          .map((item) => ({
                                            value: item.item.id,
                                            label: item.item.item_name,
                                            id_crypt: item.item.id_crypt,
                                          }))
                                          .find(
                                            (option) =>
                                              option.value == item.item_id
                                          ) || null
                                      }
                                      onChange={(selectedOption) => {
                                        handleChangeforStockEntry(
                                          {
                                            target: {
                                              name: "item_id",
                                              value:
                                                selectedOption?.value || null,
                                              id_crypt:
                                                selectedOption?.id_crypt ||
                                                null,
                                            },
                                          },
                                          index // Make sure to pass this!
                                        );
                                      }}
                                      classNamePrefix="select"
                                      isDisabled={isEditing}
                                      menuPortalTarget={document.body}
                                      menuPosition="fixed"
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                    />
                                  </div>

                                 


   {showRemaingFields && (
 <div
                                      className={`col-span-2 `}
                                    >
                                        <span className="inline-flex items-center rounded-md mb-2 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                                              Category
                                            </span>

                                      <input
                                        type="text"
                                        name="category"
                                        value={item.category}
                                        placeholder="Category"
                                        onChange={(e) =>
                                          handleChangeforStockEntry(e, index)
                                        }
                                        className={`w-full  rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                      />
                                    </div>
                                  )}

                                 

                                  {stockCategoryMap[index]?.attributes?.map(
                                    (category) => {
                                      // Find saved attribute value inside this stock item
                                      const selectedAttributeValue =
                                        item.attributes?.find(
                                          (attr) =>
                                            attr.attribute_id === category.id
                                        );

                                      return (
                                        <>
                                          <div
                                            key={category.id}
                                            className="col-span-2"
                                          >
                                            <span className="inline-flex items-center rounded-md mb-2 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                                              Attribute : {category.name}
                                            </span>
                                            {/* <label>{category.name}</label> */}
                                            <Select
                                              name={`attributes-${category.id}`}
                                              options={category.attribute_values?.map(
                                                (item) => ({
                                                  value: item.id,
                                                  label: item.values,
                                                  id_crypt: item.id_crypt,
                                                })
                                              )}
                                              value={
                                                selectedAttributeValue
                                                  ? {
                                                      value:
                                                        selectedAttributeValue.value_id,
                                                      label:
                                                        selectedAttributeValue.value_label,
                                                      id_crypt:
                                                        selectedAttributeValue.id_crypt,
                                                    }
                                                  : null
                                              }
                                              onChange={(selectedOption) => {
                                                handleAttributeChange(
                                                  selectedOption,
                                                  index,
                                                  category.id
                                                );
                                              }}
                                              classNamePrefix="select"
                                              isDisabled={isEditing}
                                              menuPortalTarget={document.body}
                                              menuPosition="fixed"
                                              styles={{
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
                                                }),
                                              }}
                                            />
                                          </div>
                                        </>
                                      );
                                    }
                                  )}

                                   {showRemaingFields && (
                                    <>
                                     <div
                                      className={`col-span-1`}
                                    >
                                       <span className="inline-flex items-center rounded-md mb-2 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                                              Pending Q
                                            </span>
                                      <input
                                        type="text"
                                        name="pending_quantity"
                                        value={item.pending_quantity}
                                        placeholder="Pending Quantity"
                                        onChange={(e) =>
                                          handleChangeforStockEntry(e, index)
                                        }
                                        className={`w-full  rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                      />
                                    </div>

                                      <div
                                      className={`col-span-2 `}
                                    >
                                       <span className="inline-flex items-center rounded-md mb-2 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                                              Quantity
                                            </span>
                                      <input
                                        type="text"
                                        name="quantity"
                                        value={item.quantity}
                                        placeholder="Quantity"
                                        onChange={(e) =>
                                          handleChangeforStockEntry(e, index)
                                        }
                                        className={`w-full  rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                      />
                                    </div>

                                    </>
                                  
                                  )}

                                  {showRemaingFields && (
                                    <div
                                      className={`col-span-2`}
                                    >
                                       <span className="inline-flex items-center rounded-md mb-2 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
                                              Selling Price
                                            </span>
                                      <input
                                        type="text"
                                        name="selling_price"
                                        value={item.selling_price || ""}
                                        placeholder="Selling Price"
                                        onChange={(e) =>
                                          handleChangeforStockEntry(e, index)
                                        } // ✅ Pass index here
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                      />
                                    </div>
                                  )}

                                  {/* Delete Icon */}
                                  <div
                                    className={`col-span-1 flex ${
                                      showRemaingFields ? "mt-8" : "mt-8"
                                    }`}
                                  >
                                    <span className="inline-flex items-center rounded-md mb-2 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-700/10 ring-inset">
                                      <XMarkIcon
                                        className="h-5 w-5  cursor-pointer"
                                        onClick={() =>
                                          handleRemoveItems(index)
                                        }
                                      />
                                    </span>
                                  </div>
                                </div>
                                
                              </React.Fragment>
                            )
                          )}
                        </div>

                        {/* Add New Item */}
                        <div
                          className={`${
                            isEditing && "hidden"
                          } mt-2 sm:mt-4 flex items-center px-4 mb-4`}
                        >
                          <UserPlusIcon
                            className="h-5 w-5 text-blue-600 mr-2 cursor-pointer"
                            onClick={handleAddItems}
                          />
                          <span
                            className="text-sm text-gray-700 cursor-pointer"
                            onClick={handleAddItems}
                          >
                            Add New Item
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
)}
                
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setOpenDialogForSocialMedia(false)}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                )}

                {saveBtnForSocialMedia === "save" ? (
                  // <button
                  //   onClick={handleSubmitForStockEntry}
                  //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  // >
                  //   Save
                  // </button>
                  <SaveButton saveFunction={handleSubmitForStockEntry} />
                ) : (
                  !isEditing && (
                    <button
                      // onClick={(e) => handleUpdateForSocialMedia(e)}
                      className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                      Update
                    </button>
                  )
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default StockEntryCreate;
