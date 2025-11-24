import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { saveAuth } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.accessToken) {
        toast.success("Login successful!");

        saveAuth(result.user, result.accessToken, result.refreshToken);

        setTimeout(() => (window.location.href = "/"), 1200);
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error. Try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen rounded-lg bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mb-3">{errors.email.message}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-600 text-sm mb-3">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Login
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
