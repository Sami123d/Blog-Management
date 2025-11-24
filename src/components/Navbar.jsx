import { useState, useRef, useEffect } from "react";
import Image from "./Image";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  // Dropdown Ref
  const dropdownRef = useRef();

  // Auth user
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Random color for avatar
  const colors = ["#FF6B6B", "#4ECDC4", "#1A535C", "#FFA500", "#6A5ACD"];
  const randomColor = colors[user ? user.name.charCodeAt(0) % colors.length : 0];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    setDropdown(false);
    navigate("/login");
  };

  // ✔ Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between relative">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="logo.png" alt="Logo" w={32} h={32} />
        <span>Samilog</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <div className="cursor-pointer text-4xl" onClick={() => setOpen(!open)}>
          <div className="flex flex-col gap-[5.4px]">
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ${
                open && "rotate-45"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black transition-all ${
                open && "opacity-0"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ${
                open && "-rotate-45"
              }`}
            ></div>
          </div>
        </div>

        {/* MOBILE LINKS */}
        <div
          className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/write" onClick={() => setOpen(false)}>Add Post</Link>
          <Link to="/posts?sort=popular" onClick={() => setOpen(false)}>Most Popular</Link>
          <Link to="/" onClick={() => setOpen(false)}>About</Link>

          {!user && (
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
                Login 👋
              </button>
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded-3xl bg-red-600 text-white"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">

        <Link to="/">Home</Link>
        <Link to="/write">Add Post</Link>
        <Link to="/posts?sort=popular">Most Popular</Link>
        <Link to="/">About</Link>

        {!user && (
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login 👋
            </button>
          </Link>
        )}

        {/* LOGGED IN USER DROPDOWN WITH OUTSIDE CLICK */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdown(!dropdown)}
              style={{ backgroundColor: randomColor }}
              className="w-10 h-10 flex items-center justify-center rounded-full text-white cursor-pointer select-none"
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            {dropdown && (
  <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-xl p-3 z-[9999]">

                {/* USER NAME + BADGE */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium capitalize text-gray-800">
                    {user.name}
                  </p>

                  {user.role === "admin" && (
                    <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md">
                      Admin
                    </span>
                  )}
                </div>

                <hr className="my-2" />

                {/* LOGOUT BUTTON WITH ICON */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-left px-2 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
                >
                  <FiLogOut size={18} /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
