import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Profile.png";
import "../Variable/Variable.css";
import { RiDashboardLine, RiUserStarFill } from "react-icons/ri";
import { FaUsers, FaUsersCog, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { CiSearch, CiCircleRemove } from "react-icons/ci";
import {
  BsFillCartPlusFill,
  BsFillCartDashFill,
  BsBodyText,
  BsMinecartLoaded,
} from "react-icons/bs";
import { IoMdCloudDone } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";
import { TbReceiptTax } from "react-icons/tb";

import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  ChevronRightIcon,
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ChevronDownIcon,
  ListBulletIcon,
  PercentBadgeIcon,
  RectangleGroupIcon,
  ArrowPathRoundedSquareIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  UsersIcon,
  CubeTransparentIcon,
  ChartPieIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import {
  getPermissionsFromBalaSilksDB,
  getUserDataFromBalaSilksDB,
  removeUserDataFromBalaSilksDB,
} from "../Utils/indexDB";
import { useSearch } from "../Context/SearchContext";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";

const userNavigation = [
  { name: "Your Profile", icon: FaUserAlt },
  { name: "Sign Out", icon: FaSignOutAlt },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ collapsed, setCollapsed }) {
  const { setSearchTerm, setFlag, searchTerm } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [permission, setPermission] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchPermission = async () => {
      const permissionsNestedArray = await getPermissionsFromBalaSilksDB();

      const flatPermissions = permissionsNestedArray.flat(2);
      setPermission(flatPermissions);
    };

    fetchPermission();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserDataFromBalaSilksDB();

      const userData = data?.original.user;

      setUser(userData);
    };

    fetchUser();
  }, []);

  const navbarList = [
    { name: "Dashboard", href: "/dashboard", icon: RiDashboardLine },
    {
      name: "Vendors",
      href: "/vendors",
      icon: FaUsers,
      permission: "view_vendors",
      vendorFlag: "vendor",
    },
    {
      name: "Employees",
      href: "/employees",
      icon: GrUserWorker,
      permission: "view_employees",
    },
    {
      name: "Customers",
      href: "/customers",
      icon: GrUserWorker,
      // permission: "view_employees",
    },
    {
      name: "Sales",
      href: "/sales",
      icon: GrUserWorker,
      // permission: "view_employees",
    },
    {
      name: "Purchase Orders",
      href: "/purchase-order",
      icon: BsFillCartPlusFill,
      permission: "view_purchase_order",
    },
    {
      name: "Purchase Entries",
      href: "/purchase-order-entries",
      icon: BsFillCartDashFill,
      // permission: "view_purchase_order",
    },
    {
      name: "Product Entries",
      href: "/stock-entry",
      icon: BsBodyText,
      // permission: "view_purchase_order",
    },
    {
      name: "Approvals",
      icon: IoMdCloudDone,
      expanded: false,
      children: [
        { name: "Purchase Order Approval", href: "/purchase-orders-approval" },
        {
          name: "Purchase Entries Approval",
          href: "/purchase-entries-approval",
        },
      ],
    },
    {
      name: "Employee Masters",
      icon: FaUsersCog,
      expanded: false,
      children: [
        {
          name: "Branches",
          href: "/masters/branches",
          permission: "view_branches",
        },
        {
          name: "Qualifications",
          href: "/masters/qualifications",
          permission: "view_qualification",
        },
      ],
    },
    {
      name: "Vendor Masters",
      icon: RiUserStarFill,
      expanded: false,
      children: [
        { name: "Areas", href: "/masters/areas", permission: "view_area" },
        { name: "Groups", href: "/masters/groups", permission: "view_group" },
        // {
        //   name: "Social Media",
        //   href: "/masters/social_media",
        //   permission: "view_social_media",
        // },
        // { name: "Agents", href: "/masters/agents", permission: "view_agent" },
        {
          name: "Vendor Groups",
          href: "/masters/vendor-groups",
          permission: "view_vendor_groups",
        },
        {
          name: "Pincode",
          href: "/masters/pincode",
          permission: "view_pincode",
        },
      ],
    },
    {
      name: "Item Masters",
      icon: AiOutlineProduct,
      expanded: false,
      children: [
        { name: "Items", href: "/masters/items", permission: "view_item" },
        {
          name: "Category",
          href: "/masters/categories",
          permission: "view_category",
        },
        // {
        //   name: "Attributes",
        //   href: "/masters/attributes",
        //   permission: "view_attributes",
        // },
        // {
        //   name: "Sub Attribute",
        //   href: "/masters/attribute-values",
        //   permission: "view_attribute_values",
        // },
      ],
    },
    {
      name: "Tax Masters",
      icon: TbReceiptTax,
      expanded: false,
      children: [
        {
          name: "GST Registration",
          href: "/masters/gst-registration",
          permission: "view_gst_registration_type",
        },
        {
          name: "TDS Details",
          href: "/masters/tds-details",
          permission: "view_tds_details",
        },
        {
          name: "Payment Terms",
          href: "/masters/payment-terms",
          permission: "view_payment_terms",
        },
        {
          name: "Section",
          href: "/masters/sections",
          permission: "view_tds_sections",
        },
      ],
    },
    {
      name: "Purchase Order Masters",
      icon: BsMinecartLoaded,
      expanded: false,
      children: [
        {
          name: "Logistics",
          href: "/masters/logistics",
          permission: "view_logistics",
        },
        // {
        //   name: "Discount on Purchase",
        //   href: "/masters/discount-on-purchase",
        //   // permission: "view_logistics",
        // },
      ],
    },
    // {
    //   name: "Settings",
    //   icon: Cog8ToothIcon,
    //   expanded: false,
    //   children: [{ name: "Roles", href: "/settings/roles" }],
    // },
  ];

  useEffect(() => {
    const viewList = navbarList
      .map((item) => {
        if (item.children) {
          const filteredChildren = item.children.filter(
            (child) =>
              !child.permission || permission.includes(child.permission)
          );

          if (filteredChildren.length > 0) {
            return {
              ...item,
              children: filteredChildren,
            };
          }

          return null;
        } else {
          return !item.permission || permission.includes(item.permission)
            ? item
            : null;
        }
      })
      .filter(Boolean);

    setNavigation(viewList);
  }, [permission]);

  useEffect(() => {
    const path = location.pathname;

    setNavigation((prev) =>
      prev.map((item) => {
        if (item.children) {
          const updatedChildren = item.children.map((child) => ({
            ...child,
            current: path.startsWith(child.href),
          }));

          const isChildActive = updatedChildren.some((child) => child.current);

          return {
            ...item,
            current: isChildActive,
            expanded: item.expanded || isChildActive, // Preserve manual toggle
            children: updatedChildren,
          };
        } else {
          return {
            ...item,
            current: path === item.href,
          };
        }
      })
    );
  }, [location.pathname]);

  const toggleSubmenu = (item) => {
    setNavigation((prev) =>
      prev.map((navItem) =>
        navItem.name === item.name
          ? { ...navItem, expanded: !navItem.expanded }
          : navItem
      )
    );
  };

  const handleMenuClick = async (item) => {
    console.log("hii", item.name);

    if (item.name?.toLowerCase() === "sign out") {
      console.log("Signing out...");
      localStorage.removeItem("token");
      await removeUserDataFromBalaSilksDB();

      navigate("/"); // Redirect
      window.location.reload(); // Optional: refresh
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      {/* #ecf5e9 green bg */}
      {/* #c69244 yellow bg */}
      {/* Mobile Sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="lg:hidden z-50 relative"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <DialogPanel
          className="fixed inset-y-0 left-0 w-64 p-4 overflow-y-auto"
          style={{ backgroundColor: "var(--header-text)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <img src={Logo} className="h-8" alt="logo" />
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-neutral-300" />
            </button>
          </div>

          <nav className="flex flex-col space-y-2 mt-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item)}
                      className={classNames(
                        item.current
                          ? "items-center text-black bg-black font-semibold"
                          : "text-black hover:bg-black hover:text-[var(--header-text)]",
                        "flex items-center gap-3 p-2 rounded-md w-full text-left font-semibold"
                      )}
                    >
                      {item.icon && <item.icon className="w-5 h-5 text-[var(--icon-color)]" />}
                      <span>{item.name}</span>
                      <ChevronRightIcon
                        className={classNames(
                          "w-4 h-4 ml-auto transition-transform",
                          item.expanded && "rotate-90"
                        )}
                      />
                    </button>

                    {item.expanded && (
                      <div className="pl-6 mt-1 space-y-1">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setSidebarOpen(false)}
                            className={classNames(
                              subItem.current
                                ? "items-center text-black bg-black font-semibold"
                                : "text-black hover:bg-black hover:text-black",
                              "flex items-center gap-3 p-2 rounded-md font-semibold"
                            )}
                          >
                            {subItem.icon && (
                              <subItem.icon className="w-4 h-4" />
                            )}
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={classNames(
                      item.current
                        ? "items-center text-[var(--header-text)] bg-black font-semibold"
                        : "text-white hover:bg-black",
                      "flex items-center gap-3 p-2 rounded-md font-semibold"
                    )}
                  >
                    {item.icon && <item.icon className="w-5 h-5  text-[var(--icon-color)]" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </DialogPanel>
      </Dialog>

      <div
        className={classNames(
          "group hidden lg:flex fixed inset-y-0 left-0 z-40 transition-all duration-500 overflow-y-auto scroll-hidden",
          collapsed ? "w-20" : "w-72"
        )}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          // color: "var(--sidebar-text)",
          fontFamily: "var(--button-font-family)",
        }}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        {/* <div className="flex flex-col p-4 gap-6 w-full">
          <div className="flex items-center ">
            <div className="flex items-center gap-2">
              <h2
                className="text-md font-extrabold inline-block mb-3"
                style={{ color: "var(--hd-bg)" }}
              >
                {collapsed ? (
                  "Dreams"
                ) : (
                  <span style={{ color: " var(--icon-color)" }}>Dreams Digitall</span>
                )}
              </h2>
            </div>
          </div>

          <nav className="flex flex-col space-y-2 mt-4">
            {navigation.map((item) => {
              const {
                name,
                href,
                children,
                current,
                expanded,
                icon: Icon,
              } = item;

              const isCurrent = current
                ? "items-center text-md text-white bg-[var(--sidebar-text)] font-semibold"
                : "text-[var(--sidebar-text)] text-md hover:bg-[var(--sidebar-text)] hover:text-[var(--hover-text)]";

              if ((children && children.length > 0) || href) {
                return (
                  <div key={name}>
                    {children && children.length > 0 ? (
                      <>
                        <button
                          onClick={() => toggleSubmenu(item)}
                          className={classNames(
                            isCurrent,
                            "flex items-center text-md gap-3 p-2 rounded-md w-full text-left font-semibold"
                          )}
                        >
                          <Icon className="w-5 h-5 text-[var(--icon-color)]" />
                          {!collapsed && <span>{name}</span>}
                          {!collapsed && (
                            <ChevronRightIcon
                              className={classNames(
                                "w-4 h-4 ml-auto transition-transform",
                                expanded && "rotate-90"
                              )}
                            />
                          )}
                        </button>

                        {expanded && !collapsed && (
                          <div className="pl-6 mt-1 space-y-1">
                            {children.map((subItem) => {
                              const {
                                name: subItemName,
                                href: subItemHref,
                                current: subItemCurrent,
                              } = subItem;
                              return (
                                <Link
                                  key={subItemName}
                                  to={subItemHref}
                                  className={classNames(
                                    subItemCurrent
                                      ? "items-center text-md text-[var(--hover-text)] bg-white  font-semibold"
                                      : "text-[var(--hover-text)] text-md hover:bg-[var(--sidebar-text)] hover:text-[var(--hover-text)]",
                                    "flex items-center text-[var(--sidebar-text-size)] gap-3 p-2 rounded-full font-semibold"
                                  )}
                                >
                                  <Icon className="w-4 h-4" />
                                  <span>{subItemName}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={href}
                        className={classNames(
                          isCurrent,
                          "flex items-center text-[var(--sidebar-text-size)] gap-3 p-2 rounded-full font-semibold"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {!collapsed && <span>{name}</span>}
                      </Link>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </nav>
        </div> */}


        <div
  className={classNames(
    "group hidden lg:flex fixed inset-y-0 left-0 z-40 transition-all duration-500 overflow-y-auto scroll-hidden",
    collapsed ? "w-20" : "w-72"
  )}
  style={{
    backgroundColor: "var(--sidebar-bg)",
    color: "var(--sidebar-text)",
    fontFamily: "var(--button-font-family)",
  }}
  onMouseEnter={() => setCollapsed(false)}
  onMouseLeave={() => setCollapsed(true)}
>
  <div className="flex flex-col p-4 gap-6 w-full">
    <div className="flex items-center ">
      <div className="flex items-center gap-2">
        <h2
          className="text-md font-extrabold inline-block mb-3"
          style={{ color: "var(--logo-text)" }}
        >
          {collapsed ? (
            "Dreams"
          ) : (
            <span style={{ color: " var(--logo-text)" }}>
              Dreams Digitall
            </span>
          )}
        </h2>
      </div>
    </div>

    <nav className="flex flex-col space-y-2 mt-4">
      {navigation.map((item) => {
        const {
          name,
          href,
          children,
          current,
          expanded,
          icon: Icon,
        } = item;

        const isCurrent = current
          ? "items-center text-md text-white bg-[var(--navbar-hover-bg)] font-semibold"
          : "text-[var(--sidebar-text)] text-md hover:bg-[var(--navbar-hover-bg)] hover:text-[var(--hover-text)]";

        if ((children && children.length > 0) || href) {
          return (
            <div key={name}>
              {children && children.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item)}
                    className={classNames(
                      isCurrent,
                      "flex items-center text-md gap-3 p-2 rounded-md w-full text-left font-semibold"
                    )}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--icon-color)" }} />
                    {!collapsed && <span>{name}</span>}
                    {!collapsed && (
                      <ChevronRightIcon
                        className={classNames(
                          "w-4 h-4 ml-auto transition-transform",
                          expanded && "rotate-90"
                        )}
                        style={{ color: "var(--icon-color)" }}
                      />
                    )}
                  </button>

                  {expanded && !collapsed && (
                    <div className="pl-6 mt-1 space-y-1">
                      {children.map((subItem) => {
                        const {
                          name: subItemName,
                          href: subItemHref,
                          current: subItemCurrent,
                        } = subItem;
                        return (
                          <Link
                            key={subItemName}
                            to={subItemHref}
                            className={classNames(
                              subItemCurrent
                                ? "items-center text-md text-[var(--hover-text)] bg-[var(--navbar-hover-bg)] font-semibold"
                                : "text-[var(--hover-text)] text-md hover:bg-[var(--navbar-hover-bg)] hover:text-[var(--hover-text)]",
                              "flex items-center text-[var(--sidebar-text-size)] gap-3 p-2 rounded-full font-semibold"
                            )}
                          >
                            <Icon className="w-4 h-4" style={{ color: "var(--icon-color)" }} />
                            <span>{subItemName}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={href}
                  className={classNames(
                    isCurrent,
                    "flex items-center text-[var(--sidebar-text-size)] gap-3 p-2 rounded-full font-semibold"
                  )}
                >
                  <Icon className="w-5 h-5" style={{ color: "var(--icon-color)" }} />
                  {!collapsed && <span>{name}</span>}
                </Link>
              )}
            </div>
          );
        }
        return null;
      })}
    </nav>
  </div>
</div>


      </div>

      <div className="fixed top-0 right-0 left-0 bg-white px-4 sm:px-10 py-3 z-30 flex items-center transition-all duration-300">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-2">
          <Bars3Icon
            className="w-6 h-6"
            style={{ color: "var(--header-text)" }}
          />
        </button>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CiSearch
                className="w-5 h-5"
                style={{ color: "var(--sidebar-text)" }}
              />
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search which you want ...."
              className="w-full  pl-10 pr-10 p-1 border border-gray-400 rounded-md focus:outline-none text-black bg-white  text-[var(--sidebar-text-size)] placeholder:text-[var(placeholder-color)] placeholder:text-[var(--sidebar-text-size) ]"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-black"
                style={{ color: "var(--button-hover-bg)" }}
              >
                <CiCircleRemove className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <BellIcon className="w-6 h-6 sm:w-6 sm:h-6 text-[var(--sidebar-text)]" />

          <Menu>
            <MenuButton className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt="profile"
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-full object-cover"
              />

              <span
                className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium sm:text-sm sm:font-bold ring-1 ring-yellow-400/20 ring-inset"
                style={{ color: "var(--hd-bg)" }}
              >
                {user ? user.name : "User"}
              </span>
              <ChevronDownIcon
                className="w-4 h-4"
                style={{ color: "var(--sidebar-text)" }}
              />
            </MenuButton>

            <MenuItems className="absolute top-full right-0 mt-2 w-44 bg-white rounded ring-1 ring-black/10 focus:outline-none z-50">
              {userNavigation.map((item) => (
                <MenuItem
                  key={item.name}
                  as="button"
                  onClick={() => handleMenuClick(item)}
                  className={({ active }) =>
                    `${
                      active
                        ? "bg-white  text-[var(--sidebar-text)]"
                        : "text-gray-800"
                    } flex cursor-pointer items-center gap-3 w-full text-left px-4 py-2 text-[var(--sidebar-text-size)] transition-all duration-150`
                  }
                >
                  {item.icon && (
                    <item.icon className="w-4 h-4 text-[var(--hd-bg)]" />
                  )}
                  <span
                    className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-extrabold ring-1 ring-yellow-400/20 ring-inset"
                    style={{ color: "var(--hd-bg)" }}
                  >
                    {item.name}
                  </span>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </>
  );
}
