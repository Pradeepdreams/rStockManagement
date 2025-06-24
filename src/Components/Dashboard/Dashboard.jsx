import React from "react";
import { motion } from "framer-motion";
import '../../App.css';
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

const cards = [
  {
    title: "Employees",
    value: 26,
    icon: <FaUsers className="text-3xl text-[#0c746f]" />,
    bg: "bg-[#e6f4f1]",
    color: "#0c746f",
  },
  
  {
    title: "Purchase Orders",
    value: 15,
    icon: <FaShoppingCart className="text-3xl text-[#0a5f5a]" />,
    bg: "bg-[#e59866]",
    color: "#dc7633",
  },
  {
    title: "Purchase Entries",
    value: 12,
    icon: <FaFileInvoiceDollar className="text-3xl text-[#1f5e4d]" />,
    bg: "bg-[#6495ED]",
    color: "#1f5e4d",
  },
  {
    title: "Vendors",
    value: 30,
    icon: <FaStore className="text-3xl text-[#15675b]" />,
    bg: "bg-[#CCCCFF]",
    color: "#15675b",
  },
  {
    title: "Stock Entries",
    value: 50,
    icon: <FaBoxes className="text-3xl text-[#145c52]" />,
    bg: "bg-[#808000]",
    color: "#145c52",
  },
  {
    title: "Approval Pending",
    value: 7,
    icon: <FaCheckCircle className="text-3xl text-[#0e3c34]" />,
    bg: "bg-[#bde6d6]",
    color: "#0e3c34",
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

// Chart components mapping based on index (cycles through charts)
const ChartComponents = [
  ({ data, color }) => (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={color} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  ),
  ({ data, color }) => (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          animationDuration={800}
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  ),
  ({ data, color }) => {
    // Pie chart expects different data structure
    const pieData = generatePieData(data[0].value);
    return (
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
    );
  },
  ({ data, color }) => (
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
  ),
  ({ data, color }) => (
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
  ),
];

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* <h1 className="text-2xl text-left font-semibold text-[#0c746f] mb-4 ">
        Dashboard
      </h1>
      <p className="text-gray-600 mb-6 text-left">
        All datas showed here are based on your current / previous month
      </p> */}
      <HeadersAndAddButton
            title={"Dashboard"}
            description={"All datas showed here are based on your current / previous month"}
            buttonHidden={true}
            // buttonName={"Add Vendors"}
            // setOpen={setOpen}
            // handleDialogOpen={handleDialogOpen}
            // AddVendorInputs={AddVendorInputs}
            // buttonIcon={<PlusIcon />}
            // pdfDownload={<FaDownload />}
            // pdfText={"Download Vendors Report"}
          />
      <motion.div
        {...fadeInUp}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  text-left mt-10"
      >
        {cards.map((card, i) => {
          const data = generateCardData(card.value);
          const ChartComp = ChartComponents[i % ChartComponents.length];
          return (
            <motion.div
              key={card.title}
              className={`rounded-xl shadow-md p-2 transition-transform transform hover:-translate-y-2 ${card.bg}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-full">{card.icon}</div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    {card.title}
                  </p>
                  <p
                    className="text-3xl font-extrabold"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <ChartComp data={data} color={card.color} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
