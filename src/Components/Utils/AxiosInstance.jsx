// import axios from "axios";

// const AxiosInstance = axios.create({
//   baseURL: axios.defaults.baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// console.log(AxiosInstance, "hello");

// // Global response interceptor
// AxiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error?.response?.status;
//     const message = error?.response?.data?.message;
//     if (window.location.pathname !== "/") {
//       const unauthorized =
//         status === 403 || message?.toLowerCase() === "unauthorized";
//       const unauthenticated =
//         status === 401 || message?.toLowerCase() === "unauthenticated";

//       if (unauthorized) {
//         window.location.href = "/unauthorized";
//       } else if (unauthenticated) {
//         localStorage.removeItem("token");
//         window.location.href = "/";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default AxiosInstance;


import axios from "axios";
import { triggerGlobalToast } from "./GlobalToast";


const BASE_URL = axios.defaults.baseURL; 


const AxiosInstance = axios.create({
  baseURL: axios.defaults.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});



AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    // ✅ No internet connection
    if (!error.response) {
      // alert("Please check your internet connection.");
triggerGlobalToast("Error", "Please check your internet connection.", "error");
      return Promise.reject(error);
    }

    // ✅ Auth checks
    // if (window.location.pathname !== "/") {
    //   const unauthorized =
    //     status === 403 || message?.toLowerCase() === "unauthorized";
    //   const unauthenticated =
    //     status === 401 || message?.toLowerCase() === "unauthenticated";

    //   if (unauthorized) {
    //     window.location.href = "/unauthorized";
    //   } else if (unauthenticated) {
    //     localStorage.removeItem("token");
    //     window.location.href = "/";
    //   }
    // }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
