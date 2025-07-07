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
  // Line,
  // Bar,
  Doughnut,
  Pie,
  Radar,
  PolarArea,
  // Bubble,
  Scatter,
} from "react-chartjs-2";
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
import MiniChart from "./MiniChart";
import { PurchaseOrdersChart } from "./Charts/PurchaseOrderChart";
import { PurchaseEntriesChart } from "./Charts/PurchaseEntriesChart";
import { EyeIcon } from "@heroicons/react/24/outline";

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

  const labels = vendorData.map((emp) => `${emp.first_name} ${emp.last_name}`);

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
        borderColor: vendorData.map((_, i) => barColors[i % barColors.length]),
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
      change: "122",
      changeType: "increase",
      textColor: "text-white",
      bgColor: "bg-indigo-600",
      href: "/purchase-order",
      chartType: "bar", // 👈 use "bar" here
      chartData: [50, 52, 55, 60, 65, 69, 71],
      chartColor: "#3B82F6", // Tailwind blue-500
    },
    {
      id: 2,
      name: "Total Purchase Entries",
      stat: "58.16%",
      change: "5.4%",
      changeType: "increase",
      textColor: "text-white",
      bgColor: "bg-indigo-600",
      href: "/purchase-order-entries",
      chartType: "radar", // 👈 use "bar" here

      chartData: [40, 42, 44, 48, 50, 53, 58],
      chartColor: "#3B82F6", // blue-500
    },
    {
      id: 3,
      name: "Overall Items",
      stat: "24.57%",
      change: "3.2%",
      changeType: "decrease",
      textColor: "text-white",
      bgColor: "bg-indigo-600",
      href: "/masters/items",
      chartType: "bubble",
      chartData: [30, 29, 28, 27, 26, 25, 45],
      chartColor: "#EF4444", // red-500
    },
    {
      id: 4,
      name: "Total Stock Entries",
      stat: "71,897",
      change: "122",
      changeType: "increase",
      textColor: "text-white",
      bgColor: "bg-indigo-600",
      chartType: "doughnut",
      href: "/stock-entry",
      chartData: [60, 62, 64, 67, 69, 70, 71],
      chartColor: "#22C55E", // green-500
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

      {/* <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-10">
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
                className={`text-2xl font-semibold  text-white  ${item.textColor}`}
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
      </dl> */}

      <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-xl bg-white shadow-md p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm  text-black font-medium">{item.name}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {item.stat}
                </p>
                <p
                  className={classNames(
                    item.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600",
                    "mt-1 text-sm font-medium flex items-center"
                  )}
                >
                  {item.changeType === "increase" ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  ) : (
                    <ArrowDownIcon
                      className="h-4 w-4 mr-1"
                      aria-hidden="true"
                    />
                  )}
                  {item.change} last week
                </p>
              </div>
              {/* <div className="h-12 w-12 rounded-md bg-[var(--savebutton-bgcolor)] flex items-center justify-center">
          <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div> */}
              <div className="h-12 w-12">
                <MiniChart
                  type={item.chartType}
                  dataPoints={item.chartData}
                  borderColor={item.chartColor}
                />
              </div>
            </div>

            {/* Optional mini line chart placeholder */}
            <div className="mt-4">
              <MiniChart
                type={item.chartType || "doughnut"} // or "bar", "doughnut", etc.
                dataPoints={item.chartData}
                borderColor={item.chartColor}
                backgroundColor="rgba(59,130,246,0.3)" // Optional, for bar charts
              />
            </div>
          </div>
        ))}
      </dl>

      {/* Stock entry chart */}

      <div className="bg-indigo-500 text-white py-18 sm:py-22 mt-10 rounded-md relative overflow-hidden">
        {/* View Button - top right */}

        <div className="mx-auto max-w-7xl px-6 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4">
            {/* LEFT: Content */}
            <div className="flex flex-col">
              <h2 className="text-5xl font-semibold tracking-tight  text-white sm:text-5xl">
                Stock Overview
              </h2>

              <p className="mt-8 text-lg font-medium text-pretty  text-white sm:text-xl/8">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
                fugiat.
              </p>

              {/* Total Count */}
              <div className="mt-6">
                <p className="text-2xl font-semibold text-white">
                  Total Stock Count:{" "}
                  <span className="bg-white px-2 py-1 rounded text-indigo-800 font-semibold">
                    2,345
                  </span>
                </p>
              </div>

              {/* This Month Summary */}
              <div className="mt-4">
                <p className="text-base text-white font-medium">This Month</p>
                <div className="mt-2 flex flex-col sm:flex-row gap-4 sm:gap-10">
                  <div className="flex items-center gap-2">
                    <ArrowUpIcon className="h-5 w-5 text-green-400" />
                    <p className="inline-flex items-center gap-1 text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Stock Entries:{" "}
                      <span className="text-green-600 font-semibold">+312</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDownIcon className="h-5 w-5 text-red-400" />
                    <p className="inline-flex items-center gap-1 text-sm font-medium bg-red-100 text-red-800 px-3 py-1 rounded-full">
                      Sales Entries:{" "}
                      <span className="text-red-600 font-semibold">-174</span>
                    </p>
                  </div>
                </div>
                <button className="mx-auto mt-4 inline-flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition">
                  <EyeIcon className="w-5 h-5" />
                  View
                </button>
              </div>
            </div>

            {/* RIGHT: Bar Chart */}
            <div className="h-[300px] w-full bg-white rounded-md p-4">
              <Bar
                data={vendorChartData}
                options={{ ...vendorChartOptions, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* end */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        <PurchaseEntriesChart
          data={vendorChartData}
          options={vendorChartOptions}
          stripedBackground={stripedBackground}
        />

        <PurchaseOrdersChart
          data={purchaseOrderChartData}
          options={purchaseOrderChartOptions}
          stripedBackground={stripedBackground}
        />
      </div>

      {/* </div> */}
    </>
  );
}
