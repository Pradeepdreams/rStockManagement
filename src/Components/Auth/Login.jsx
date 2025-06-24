import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// // import Logo from "../../assets/images/Profile.png";
// import Logo from "../../assets/images/logo-dreams.png";
import axios from "../Utils/AxiosInstance";
import { FaRegUser } from "react-icons/fa";
import { MdHail, MdMarkEmailRead } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoLogIn } from "react-icons/io5";
import {
  savePermissionsToBalaSilksDB,
  saveRolesToBalaSilksDB,
  saveSelectedBranchNameToBalaSilksDB,
  saveSelectedBranchToBalaSilksDB,
  saveBranchDataToBalaSilksDB,
  saveUserDataToBalaSilksDB,
} from "../Utils/indexDB";
import Buttons from "../Buttons/Buttons";
import loginbg from '../../assets/images/loginbg.jpg';

function Login() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [requiredFields, setRequiredFields] = useState("");
  const [validation, setValidation] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeForLogin = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitForLogin = async (e) => {
    e.preventDefault();

    console.log(requiredFields, "requiredFields");

    try {
      const response = await axios.post("public/api/login", loginForm);
      const data = response.data;

      if (!data?.user) {
        console.error("Login failed or user data not found");
        return;
      }

      // Save user data
      await saveUserDataToBalaSilksDB(data.user);

      // Save token
      localStorage.setItem("token", data.token);

      // Save branches
      const branches = data.user?.original?.branches || data.branches || [];
      console.log("Branches:", branches);

      await saveBranchDataToBalaSilksDB(branches);

      if (branches.length > 0) {
        await saveSelectedBranchToBalaSilksDB(
          branches.map((branch) => branch.branch.id)
        );
        await saveSelectedBranchNameToBalaSilksDB(
          branches.map((branch) => branch.branch.name)
        );
      }

      // Save roles & permissions
      const rolesData =
        data.user?.original?.branches?.map((branch) => branch.roles) || [];

      await saveRolesToBalaSilksDB(rolesData);

      const permissionsData =
        data.user?.original?.branches?.map((branch) =>
          branch.roles?.map((role) => role.permissions)
        ) || [];

      await savePermissionsToBalaSilksDB(permissionsData);

      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 401) {
        setRequiredFields(error.response.data?.message || "");

        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      if (error.response) {
        setRequiredFields(error.response.data?.message || "");
        setValidation(error.response.data?.errors || {});
      }
    }
  };

  return (
    <div>
      {/* <div className="bg-[#f5f2ea] p-10"> */}
      {/* <div className="bg-[var(--login-bg)] p-10 text-left">
        <h2 className="text-xl font-semibold text-black inline-block mb-3">
          Dreams Digitall
        </h2>
      </div> */}

      <div
  className="h-screen bg-cover bg-center flex justify-center items-center relative"
 style={{
  backgroundImage: `url(${loginbg})`, // correct usage
}}

>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-70"></div>

  {/* Login Card */}
  <div className="relative z-10 p-6 max-w-sm w-full bg-white shadow-xl rounded-xl h-[480px] sm:mt-10">
    <div className="mb-6 text-center mt-10">
      <div className="flex items-center justify-center gap-2">
        <FaRegUser className="w-6 h-6 p-1 rounded border text-[var(--hd-bg)]" />
        <h2 className="text-xl font-semibold text-black">User/Admin Login</h2>
      </div>
      <p className="text-sm text-black mt-4" style={{ fontWeight: "400", lineHeight: "1.5" }}>
        Hey, enter your credentials to <br />
        log in to your account
      </p>
    </div>

    {/* Email Input */}
    <div className="mb-4 relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MdMarkEmailRead className="w-5 h-5 text-[var(--hd-bg)]" />
      </span>
      <input
        className="pl-10 p-3 w-full text-sm rounded-md text-black border border-gray-200 placeholder-[#767676] outline-none"
        type="email"
        name="email"
        value={loginForm.email}
        onChange={handleChangeForLogin}
        placeholder="Enter Username ..."
        onKeyDown={(e) => e.key === "Enter" && handleSubmitForLogin(e)}
        required
      />
      {validation?.email && <p className="text-red-500 text-sm mt-1">{validation?.email}</p>}
    </div>

    {/* Password Input */}
    <div className="mb-2 relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <RiLockPasswordLine className="w-5 h-5 text-[var(--hd-bg)]" />
      </span>
      <input
        className="pl-10 pr-16 p-3 w-full text-sm rounded-md text-black border border-gray-200 placeholder-[#767676] outline-none"
        type={!showPassword ? "password" : "text"}
        name="password"
        value={loginForm.password}
        onChange={handleChangeForLogin}
        placeholder="Passcode ..."
        onKeyDown={(e) => e.key === "Enter" && handleSubmitForLogin(e)}
        required
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-[#767676] cursor-pointer"
      >
        {showPassword ? "Hide" : "Show"}
      </span>
      {validation?.password && <p className="text-red-500 text-sm mt-1">{validation?.password}</p>}
    </div>

    {/* Forgot Password */}
    <div className="text-right mb-4">
      <a href="#" className="text-xs text-black hover:text-black underline">
        Forgot Password?
      </a>
    </div>

    {/* Error Message */}
    <div className="text-center mb-2">
      {requiredFields === "Invalid credentials" && (
        <p className="text-red-500 text-sm mt-1">{requiredFields}</p>
      )}
    </div>

    {/* Submit Button */}
    <Buttons
      buttonText={
        <span className="flex items-center text-white text-sm justify-center gap-2">
          <IoLogIn className="w-5 h-5" />
          Login
        </span>
      }
      buttonFunction={handleSubmitForLogin}
    />
  </div>
</div>

    </div>
  );
}

export default Login;
