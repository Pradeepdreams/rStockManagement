import { Bar, Bubble, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import {
  MdWbSunny,
  MdNightsStay,
  MdBrightness4,
  MdLightMode,
} from "react-icons/md";
import axios from "../Utils/AxiosInstance";
import {
  getBranchDataFromBalaSilksDB,
  getUserDataFromBalaSilksDB,
} from "../Utils/indexDB";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCartArrowDown, FaCartPlus, FaCartShopping } from "react-icons/fa6";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import { href } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const transparentize = (color, opacity) => {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return color + alpha;
};

// Bar colors
const barColors = [
  "#ef4444",
  "#3b82f6",
  "#16a34a",
  "#f59e0b",
  "#9333ea",
  "#0ea5e9",
  "#db2777",
];

const stripedBackground = {
  id: "stripedBackground",
  beforeDraw(chart) {
    const {
      ctx,
      chartArea: { top, bottom, left, right },
      scales: { y },
    } = chart;

    const stepHeight = (bottom - top) / y.ticks.length;

    ctx.save();
    ctx.fillStyle = "#f9f9f9"; // light shade
    for (let i = 0; i < y.ticks.length; i += 2) {
      const yPos = y.getPixelForTick(i);
      ctx.fillRect(left, yPos, right - left, stepHeight);
    }
    ctx.restore();
  },
};

export default function Dashboard() {
  const [vendorData, setVendorData] = useState([]);
  const [purchaseOrderDatas, setPurchaseOrderDatas] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchAllDatas = async () => {
      try {
        const branchData = await getBranchDataFromBalaSilksDB();
        const branchIds = branchData.map((branch) => branch.branch.id_crypt);
        const token = localStorage.getItem("token");

        const response = await axios.get(`public/api/vendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        });
        console.log(response, "response");
        
        const rawVendorData = response.data.vendors.data;
        

        setVendorData(rawVendorData);

        const responseForPoDatas = await axios.get(
          `public/api/purchase-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Branch-Id": branchIds[0],
            },
          }
        );
        console.log(responseForPoDatas, "responseForPoDatas");
        setPurchaseOrderDatas(responseForPoDatas?.data?.purchase_orders.data);

        
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch employee data"
        );
      }
    };

    fetchAllDatas();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserDataFromBalaSilksDB();

      const userData = data?.original.user;

      setUser(userData);
    };

    fetchUser();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12)
      return {
        text: "Good Morning",
        icon: <MdWbSunny className="inline mr-2" />,
      };
    if (hour >= 12 && hour < 17)
      return {
        text: "Good Afternoon",
        icon: <MdLightMode className="inline mr-2" />,
      };
    if (hour >= 17 && hour < 20)
      return {
        text: "Good Evening",
        icon: <MdBrightness4 className="inline mr-2" />,
      };
    return {
      text: "Good Night",
      icon: <MdNightsStay className="inline mr-2" />,
    };
  };

  const greeting = getGreeting();

  const labels = vendorData.map(
    (emp) => `${emp.first_name} ${emp.last_name}`
  );

  const isSmallScreen = window.innerWidth < 640;

  const vendorChartData = {
    labels: vendorData.map((vendor) => `${vendor.vendor_name}}`),
    datasets: [
      {
        label: "Vendors",
        data: vendorData.map((vendor) => vendor.bank_account_no),
        backgroundColor: vendorData.map((_, i) =>
          transparentize(barColors[i % barColors.length], 0.5)
        ),
        borderColor: vendorData.map(
          (_, i) => barColors[i % barColors.length]
        ),
        borderWidth: 1,
        borderRadius: isSmallScreen ? 6 : 100,
        borderSkipped: false,
      },
    ],
  };

  const vendorChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const emp = vendorData[context.dataIndex];
            return [
              `Bank Account: ${emp.bank_account_no}`,
              `Email: ${emp.email}`,
              `City: ${emp.city}`,
            ];
          },
        },
      },
    },
  };

  const purchaseOrderChartData = {
    datasets: [
      {
        label: "Purchase Orders",
        data: purchaseOrderDatas.map((order, i) => ({
          x: i + 1,
          y: Number(order.order_amount) || 0,
          r: Math.max(Number(order.order_amount) / 10000, 6),
        })),
        backgroundColor: purchaseOrderDatas.map(
          (_, i) => barColors[i % barColors.length]
        ),
      },
    ],
  };

  const purchaseOrderChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Order Index",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const order = purchaseOrderDatas[index];
            return [
              `Order Amount: ₹${order.order_amount}`,
              `Date: ${order.date}`,
              `City: ${order.city}`,
            ];
          },
        },
      },
    },
  };

  const stats = [
    {
      id: 1,
      name: "Total Purchase Orders",
      stat: "71,897",
      icon: FaCartPlus,
      change: "122",
      changeType: "increase",
      bgColor: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
      // bgColor: "bg-gradient-to-r from-[#cad0ff] to-[#e3e3e3]",
      textColor: "text-white",
      bgImg: "none",
      href: "/purchase-order",
    },
    {
      id: 2,
      name: "Total Purchase Entries",
      stat: "58.16%",
      icon: FaCartArrowDown,
      change: "5.4%",
      changeType: "increase",
      bgColor: "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800",
      textColor: "text-white",
      href: "/purchase-order-entries",
    },

    {
      id: 3,
      name: "Overall Items",
      stat: "24.57%",
      icon: FaCartShopping,
      change: "3.2%",
      changeType: "decrease",
      bgColor: "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500",
      textColor: "text-white",
      href: "/masters/items",
    },
    {
      id: 4,
      name: "Total Stock Entries",
      stat: "71,897",
      icon: FaCartPlus,
      change: "122",
      changeType: "increase",
      bgColor: "bg-gradient-to-r from-violet-500 via-purple-600 to-violet-700",
      textColor: "text-white",
      href: "/stock-entry",
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div className="text-left mt-10">
        <span
          className="inline-block border border-indigo-800 text-indigo-800 font-semibold rounded shadow-sm
    text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm
    px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6
    py-1 sm:py-2"
        >
          {greeting.icon} {greeting.text}, {user ? user.name : "User"}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-10">
        {stats.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-lg ${item.bgColor} px-4 pt-5 pb-12 shadow-sm sm:px-6 sm:pt-6`}
          >
            <dt>
              <div className="absolute rounded-md bg-[var(--savebutton-bgcolor)] p-3">
                <item.icon aria-hidden="true" className="size-6 text-white" />
              </div>
              <p
                className={`ml-16 truncate text-sm font-medium ${item.textColor}`}
              >
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p
                className={`text-2xl font-semibold text-gray-900  ${item.textColor}`}
              >
                {item.stat}
              </p>
              <p
                className={classNames(
                  item.changeType === "increase"
                    ? "text-green-400"
                    : "text-red-400",
                  "ml-2 flex items-baseline text-sm font-semibold"
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowUpIcon
                    aria-hidden="true"
                    className="size-5 shrink-0 self-center text-green-500"
                  />
                ) : (
                  <ArrowDownIcon
                    aria-hidden="true"
                    className="size-5 shrink-0 self-center text-red-500"
                  />
                )}

                <span className="sr-only">
                  {" "}
                  {item.changeType === "increase"
                    ? "Increased"
                    : "Decreased"}{" "}
                  by{" "}
                </span>
                {item.change}
              </p>
              <div className="absolute inset-x-0 bottom-0 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href={`${item.href}`}
                    className="font-medium text-white hover:text-gray-400"
                  >
                    View all
                    <span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-22">
        <div className="col-span-1 w-full max-w-full p-6 bg-white rounded-lg shadow-md">
         <div className="bg-blue-300 p-4 rounded-lg">
           <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Employees
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            A graph showing the number of employees and their performance over
            time
          </p>
         </div>

          <div>
            <Bar
              data={vendorChartData}
              plugins={[stripedBackground]}
              options={vendorChartOptions}
              height={300}
            />
          </div>
        </div>

        <div className="col-span-1 w-full max-w-full p-6 bg-white rounded-lg shadow-md">
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Purchase Entries
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              A graph showing the number of purchase entries and their
              performance over time
            </p>
          </div>

          <div>
            <Line
              data={vendorChartData}
              options={vendorChartOptions}
              plugins={[stripedBackground]}
              height={300}
            />
          </div>
        </div>

        <div className="col-span-1 w-full max-w-full p-6 bg-white rounded-lg shadow-md">
          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Purchase Orders
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              A graph showing the number of purchase orders and their
              performance over time
            </p>
          </div>

          <div>
            <Bubble
              data={purchaseOrderChartData}
              plugins={[stripedBackground]}
              options={purchaseOrderChartOptions}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* </div> */}
    </>
  );
}
