import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../../App.css";
import Select from "react-select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
} from "recharts";

import {
  FaUsers,
  FaProjectDiagram,
  FaTasks,
  FaRocket,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaStore,
  FaBoxes,
  FaCheckCircle,
} from "react-icons/fa";
import HeadersAndAddButton from "../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB, getUserDataFromBalaSilksDB } from "../Utils/indexDB";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { TfiShoppingCartFull } from "react-icons/tfi";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  MdWbSunny,
  MdNightsStay,
  MdBrightness4,
  MdLightMode,
} from "react-icons/md";
import { FaCartPlus, FaCartArrowDown } from "react-icons/fa";
import axios from "../Utils/AxiosInstance";
import { Legend } from "@headlessui/react";

const cards = [
  {
    title: "Employees",
    value: 26,
    icon: <FaUsers className="text-3xl text-indigo-600" />,
    bg: "bg-white",
    color: " text-indigo-600",
    filters: true,
    colSpan: "col-span-2",
  },

  {
    title: "Purchase Orders",
    value: 15,
    icon: <FaShoppingCart className="text-3xl text-cyan-500" />,
    bg: "bg-[#e59866]",
    color: "text-red-800",
    filters: false,
    colSpan: "col-span-1",
  },
  {
    title: "Purchase Entries",
    value: 12,
    icon: <FaFileInvoiceDollar className="text-3xl text-[#1f5e4d]" />,
    bg: "bg-[#6495ED]",
    color: "#1f5e4d",
    filters: true,
    colSpan: "col-span-1",
  },
  {
    title: "Vendors",
    value: 30,
    icon: <FaStore className="text-3xl text-[#15675b]" />,
    bg: "bg-[#CCCCFF]",
    color: "#15675b",
    filters: false,
    colSpan: "col-span-1",
  },
  {
    title: "Stock Entries",
    value: 50,
    icon: <FaBoxes className="text-3xl text-[#145c52]" />,
    bg: "bg-[#808000]",
    color: "#145c52",
    filters: false,
    colSpan: "col-span-1",
  },
];

// animation variants for framer-motion
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

// months for data
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// generate some sample data for charts per card
const generateCardData = (baseValue) => {
  return months.map((month, idx) => ({
    name: month,
    value: baseValue + idx * Math.floor(Math.random() * 10),
  }));
};

// Pie data for pie chart cards (e.g. Tasks)
const generatePieData = (baseValue) => [
  { name: "Done", value: baseValue * 0.7 },
  { name: "In Progress", value: baseValue * 0.3 },
];

// Radar data example
const radarData = [
  { subject: "Quality", A: 120, B: 110, fullMark: 150 },
  { subject: "Speed", A: 98, B: 130, fullMark: 150 },
  { subject: "Reliability", A: 86, B: 130, fullMark: 150 },
  { subject: "Efficiency", A: 99, B: 100, fullMark: 150 },
  { subject: "Support", A: 85, B: 90, fullMark: 150 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white text-black p-5 rounded-xl shadow-md border border-gray-300 max-w-xs">
  <p className="mb-2 text-sm font-semibold text-gray-900 flex items-center">
 <p className="text-sm">Name:</p>{" "}
         <span className="inline-block bg-slate-100 text-slate-800  text-xs  font-semibold px-2.5 py-0.5 rounded capitalize">

     {data.name}
      </span>

  </p>


  <p className="mb-3 text-gray-700 flex items-center">
    <p className="text-sm">Salary:</p>{" "}
         <span className="inline-block bg-yellow-100 text-yellow-800  text-xs  font-semibold px-2.5 py-0.5 rounded capitalize">

      ₹{data.salary}
      </span>
  </p>

  <p className="mb-3 flex items-center">
    <p className="text-sm">Gender:</p>{" "}
    <span className="inline-block bg-blue-100 text-blue-800  text-xs  font-semibold px-2.5 py-0.5 rounded capitalize">
      {data.gender}
    </span>
  </p>

  <p className="mb-3 flex items-center">
    <p className="text-sm">Status:</p>{" "}
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded ${
        data.is_active === "Active"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {data.is_active}
    </span>
  </p>

  <p className="text-gray-600 text-xs flex items-center">
    <p className="text-sm">Join Date:</p> 
     <span className="inline-block bg-purple-100 text-purple-800  text-xs  font-semibold px-2.5 py-0.5 rounded capitalize">
    {data.date_of_join}
    </span>
  </p>
</div>


    );
  }

  return null;
};

const colorPalette = ['#4f46e5', '#16a34a', '#f59e0b', '#ef4444', '#0ea5e9', '#9333ea'];

const CustomLegend = ({ data }) => (
  <ul className="flex flex-wrap gap-4 mt-4 justify-center">
    {data.map((entry, index) => (
      <li key={index} className="flex items-center space-x-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
        ></div>
        <span className="text-sm text-gray-700">{entry.name}</span>
      </li>
    ))}
  </ul>
);

// Chart components mapping based on index (cycles through charts)
const ChartComponents = [
  ({ data, color }) => {
    const employeeData = transformEmployeeDataToChartData(data);

  return (
    <div className="rounded-xl p-4 bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb] shadow-md">
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={employeeData}>
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity={0.3} />
          <stop offset="100%" stopColor="black" stopOpacity={0} />
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="3 3" stroke="black" />
      <XAxis dataKey="name" stroke="blue" />
      <YAxis stroke="blue" />
      <Tooltip content={<CustomTooltip />} />
      <Legend verticalAlign="bottom" iconType="circle" height={36} />

      <Bar
        dataKey="value"
        stroke="black"
        strokeWidth={1.5}
        radius={[4, 4, 0, 0]}
        barSize={20}
      >
        {employeeData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={
              ['#4f46e5', '#16a34a', '#f59e0b', '#ef4444', '#0ea5e9', '#9333ea'][
                index % 6
              ]
            }
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

  );
  },
  ({ data }) => (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(34, 193, 195, 0.85) 0%, rgba(25, 135, 84, 0.95) 100%)",

        // light transparent gradient bg
        borderRadius: 8,
        padding: 12,
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart width={600} height={300} data={data}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#424ae3" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#424ae3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff44" />
          <XAxis dataKey="name" stroke="#8e44ad " />
          <YAxis stroke="#8e44ad " />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 8,
              color: "black",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#424ae3"
            fillOpacity={1}
            fill="url(#areaGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ),

  ({ data, color }) => {
    // Pie chart expects different data structure
    const pieData = generatePieData(data[0].value);
    return (
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(14, 182, 255, 0.85) 0%, rgba(3, 66, 204, 0.95) 100%)",
          // light transparent gradient bg
          borderRadius: 8,
          padding: 12,
        }}
      >
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Tooltip />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill={color}
              animationDuration={800}
              label
            >
              {pieData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={idx === 0 ? color : "#ccc"}
                  stroke="#fff"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  },
  ({ data, color }) => (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 94, 0, 0.85) 0%, rgba(255, 195, 113, 0.95) 100%)",
        // light transparent gradient bg
        borderRadius: 8,
        padding: 12,
      }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill="url(#colorArea)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ),
  ({ data, color }) => (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(128, 90, 213, 0.9) 0%, rgba(72, 61, 139, 0.95) 100%)",

        // light transparent gradient bg
        borderRadius: 8,
        padding: 12,
      }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar
            name="Score"
            dataKey="A"
            stroke={color}
            fill={color}
            fillOpacity={0.6}
            animationDuration={800}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  ),
];

const transformEmployeeDataToChartData = (data) => {
  return data.map(emp => ({
    name: emp.first_name ?? "N/A",
    salary: emp.salary ?? "N/A",
    gender: emp.gender ?? "N/A",
    is_active: emp.is_active ? "Active" : "Inactive",
    date_of_join: emp.date_of_join ?? "N/A",
    value: Number(emp.salary) || 0,  // use salary as the numeric value for the line chart
  }));
};







export default function Dashboard() {
  const [user, setUser] = useState();
  const [employeeChartData, setEmployeeChartData] = useState([]);
  const [employeeChartFormattedData, setEmployeeChartFormattedData] = useState([]);


 const fetchAllDatas = async (page = 1) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");

    try {
  const response = await axios.get(`public/api/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Branch-Id": branchIds[0],
    },
  });

  const rawEmployeeData = response.data.data;

  setEmployeeChartData(rawEmployeeData);

  const chartFormatted = transformEmployeeDataToChartData(rawEmployeeData);
  setEmployeeChartFormattedData(chartFormatted);
} catch (error) {
  toast.error(
    error.response?.data?.message || "Failed to fetch employee data"
  );
}

  };

  useEffect(() => {
    fetchAllDatas();
  },[])

  const stats = [
    {
      id: 1,
      name: "Total Purchase Orders",
      stat: "71,897",
      icon: FaCartPlus,
      change: "122",
      changeType: "increase",
      bgColor: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
      textColor: "text-white",
      bgImg: "none",
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
    },

    {
      id: 3,
      name: "Overall Items",
      stat: "24.57%",
      icon: TfiShoppingCartFull,
      change: "3.2%",
      changeType: "decrease",
      bgColor: "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500",
      textColor: "text-white",
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
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

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

      <div className="min-h-screen">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 ">
          <div className="text-left col-span-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <HeadersAndAddButton
                  title={"Dashboard Overview"}
                  buttonHidden={true}
                />
                <p className="mt-2 text-sm text-gray-500 ml-2">
                  Welcome back {user ? user.name : "User"}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                  type="button"
                  className="ml-3 inline-flex items-center rounded-md bg-[var(--savebutton-bgcolor)] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Last 30 days
                </button>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-lg ${item.bgColor} px-4 pt-5 pb-12 shadow-sm sm:px-6 sm:pt-6`}
                >
                  <dt>
                    <div className="absolute rounded-md bg-[var(--savebutton-bgcolor)] p-3">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-white"
                      />
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
                          href="#"
                          className="font-medium text-white hover:text-indigo-500"
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
          </div>
        </div>

        {/* Charts */}

           <motion.div
        {...fadeInUp}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10"
      >
        {cards.map((card, i) => {
          const ChartComp = ChartComponents[i % ChartComponents.length];
          const data = i === 0 ? employeeChartData : generateCardData(card.value);

          return (
            <motion.div
              key={card.title}
              className={`rounded-xl col-span-1  border text-left border-gray-200 shadow-lg p-5 transition-transform transform hover:-translate-y-1 hover:shadow-xl sm:${card.colSpan}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-indigo-100 shadow-sm">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>
                    <p
                      className="text-xl font-bold tracking-tight"
                      style={{ color: "var(--savebutton-bgcolor)" }}
                    >
                      {card.value}
                    </p>
                  </div>
                </div>

                {card.filters && (
                  <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                    <Select className="text-sm" />
                    <input
                      type="date"
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button className="bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-md shadow-sm hover:bg-indigo-700 transition">
                      Filter
                    </button>
                    <button className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-200 transition">
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Chart Section */}
              <div className="bg-gray-50 rounded-md px-2 py-1">
                <ChartComp data={data} color={card.color} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      </div>
    </>
  );
}
