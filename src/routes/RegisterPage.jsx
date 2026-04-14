import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "author" }),
      });

      const data = await res.json();

      if (data.accessToken) {
        toast.success("Registration successful!");
        setTimeout(() => (window.location.href = "/login"), 1200);
      } else {
        toast.error(data.message || "Registration failed");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Server error. Try again!");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen rounded-lg bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
          Register
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mb-3">{errors.name.message}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format"
            }
          })}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mb-3">{errors.email.message}</p>
        )}

        {/* Phone Number */}
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full mb-4 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          {...register("phone", { required: "Phone number is required" })}
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mb-3">{errors.phone.message}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-600 text-sm mb-3">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
