import { Bubble } from "react-chartjs-2";

export function PurchaseOrdersChart({ data, options, stripedBackground }) {
  return (
    <div className="col-span-1 w-full max-w-full p-6 bg-white rounded-lg shadow-md">
      <div className="bg-red-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Purchase Orders</h3>
        <p className="text-gray-600 text-sm mb-4">
          A graph showing the number of purchase orders and their performance over time
        </p>
      </div>
      <div className="h-[300px]">
        <Bubble
          data={data}
          options={{ ...options, maintainAspectRatio: false }}
          plugins={[stripedBackground]}
        />
      </div>
    </div>
  );
}
