// "use client";

// import { createContext, useContext, useState, useCallback, useEffect } from "react";
// import { Transition } from "@headlessui/react";
// import {
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   XCircleIcon,
// } from "@heroicons/react/24/outline";
// import { XMarkIcon } from "@heroicons/react/20/solid";

// const ToastContext = createContext();

// export const useToast = () => useContext(ToastContext);

// export const ToastProvider = ({ children }) => {
//   const [show, setShow] = useState(false);
//   const [message, setMessage] = useState("");
//   const [description, setDescription] = useState("");
//   const [type, setType] = useState("success");

//   useEffect(() => {
//   const handleGlobalToast = (e) => {
//     const { title, message, type } = e.detail;
//     triggerToast(title, message, type);
//   };

//   window.addEventListener("trigger-global-toast", handleGlobalToast);
//   return () => window.removeEventListener("trigger-global-toast", handleGlobalToast);
// }, []);


//   const triggerToast = useCallback((msg, desc = "", type = "success") => {
//     setMessage(msg);
//     setDescription(desc);
//     setType(type);
//     setShow(true);
//     setTimeout(() => setShow(false), 3000);
//   }, []);

//   const getColor = () => {
//     switch (type) {
//       case "error":
//         return "text-red-600";
//       case "warning":
//         return "text-yellow-600";
//       case "success":
//         return "text-green-600";
//       default:
//         return "text-green-600";
//     }
//   };

//   const getIcon = () => {
//     switch (type) {
//       case "error":
//         return <XCircleIcon className="size-6 text-red-600" />;
//       case "warning":
//         return <ExclamationTriangleIcon className="size-6 text-yellow-600" />;
//       case "success":
//       default:
//         return <CheckCircleIcon className="size-6 text-green-600" />;
//     }
//   };

//   return (
//     <>
//     <ToastContext.Provider value={{ triggerToast }}>
//       {children}
//       <div
//         aria-live="assertive"
//         className="pointer-events-none fixed inset-0 z-100 flex items-end px-4 py-6 sm:items-start sm:p-6"
//       >
//         <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
//           <Transition
//             show={show}
//             enter="transform ease-out duration-300 transition"
//             enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
//             enterTo="translate-y-0 opacity-100 sm:translate-x-0"
//             leave="transition ease-in duration-100"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
//               <div className="p-4">
//                 <div className="flex items-start">
//                   <div className="shrink-0">{getIcon()}</div>
//                   <div className="ml-3 w-0 flex-1 pt-0.5">
//                     <p className={`text-sm font-medium ${getColor()}`}>
//                       {message}
//                     </p>
//                     {description && (
//                       <p className="mt-1 text-sm text-gray-500">
//                         {description}
//                       </p>
//                     )}
//                   </div>
//                   <div className="ml-4 flex shrink-0">
//                     <button
//                       onClick={() => setShow(false)}
//                       className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
//                     >
//                       <span className="sr-only">Close</span>
//                       <XMarkIcon className="size-5" aria-hidden="true" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Transition>
//         </div>
//       </div>
//     </ToastContext.Provider>
    

//     </>
//   );
// };


"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("success");

  const triggerToast = useCallback((msg, desc = "", type = "success") => {
    setMessage(msg);
    setDescription(desc);
    setType(type);
    setShow(true);
    setTimeout(() => setShow(false), 5000);
  }, []);

  // Handle global trigger
  useEffect(() => {
    const handleGlobalToast = (e) => {
      const { title, message, type } = e.detail;
      triggerToast(title, message, type);
    };

    window.addEventListener("trigger-global-toast", handleGlobalToast);
    return () => {
      window.removeEventListener("trigger-global-toast", handleGlobalToast);
    };
  }, [triggerToast]);

  const getColor = () => {
    switch (type) {
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "success":
      default:
        return "text-green-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return <XCircleIcon className="size-6 text-red-600" />;
      case "warning":
        return <ExclamationTriangleIcon className="size-6 text-yellow-600" />;
      case "success":
      default:
        return <CheckCircleIcon className="size-6 text-green-600" />;
    }
  };

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      {children}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-100 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={show}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">{getIcon()}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className={`text-sm font-medium ${getColor()}`}>
                      {message}
                    </p>
                    {description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      onClick={() => setShow(false)}
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

