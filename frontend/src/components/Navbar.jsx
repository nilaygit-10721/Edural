// src/components/Navbar.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // i18n
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "en");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    localStorage.setItem("preferredLang", lng);
    setIsLanguageDropdownOpen(false);
  };

  // Use useMemo to prevent recreation on every render
  const avatarStyles = useMemo(
    () => [
      "fun-emoji",
      "adventurer",
      "avataaars",
      "bottts",
      "lorelei",
      "micah",
      "miniavs",
      "open-peeps",
    ],
    []
  );

  useEffect(() => {
    // Load preferred language if stored - separate this effect
    const savedLang = localStorage.getItem("preferredLang");
    if (savedLang && savedLang !== lang) {
      i18n.changeLanguage(savedLang);
      setLang(savedLang);
    }
  }, [i18n, lang]); // Only depend on i18n and lang

  useEffect(() => {
    // Generate avatar only if user is logged in
    if (token && userEmail) {
      let styleIndex = localStorage.getItem(`avatarStyle_${userEmail}`);
      let seed = localStorage.getItem(`avatarSeed_${userEmail}`);

      if (!styleIndex) {
        styleIndex = Math.floor(Math.random() * avatarStyles.length);
        localStorage.setItem(`avatarStyle_${userEmail}`, styleIndex);
      }

      if (!seed) {
        seed = Math.random().toString(36).substring(2, 15);
        localStorage.setItem(`avatarSeed_${userEmail}`, seed);
      }

      const style = avatarStyles[styleIndex];
      setAvatarUrl(
        `https://api.dicebear.com/6.x/${style}/png?seed=${encodeURIComponent(
          seed
        )}`
      );
    } else {
      setAvatarUrl(null);
    }
  }, [userEmail, token, avatarStyles]); // avatarStyles is now stable

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".language-dropdown")) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - Always visible */}
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-gray-800">
              Edural
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-gray-700">
            {/* Show navigation links ONLY when user is logged in */}
            {token ? (
              <>
                {/* Navigation Links */}
                <Link to="/" className="hover:text-green-600 transition-colors">
                  {t("home")}
                </Link>
                <Link
                  to="/about"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("about")}
                </Link>
                <Link
                  to="/labs"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("labs")}
                </Link>
                <Link
                  to="/home"
                  className="hover:text-green-600 transition-colors"
                >
                  {t("games")}
                </Link>

                {/* Language Dropdown */}
                <div className="relative language-dropdown">
                  <button
                    onClick={toggleLanguageDropdown}
                    className="flex items-center space-x-1 hover:text-green-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">
                      {lang === "en" ? "English" : "हिन्दी"}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        isLanguageDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isLanguageDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <button
                        onClick={() => changeLanguage("en")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        English
                      </button>
                      <button
                        onClick={() => changeLanguage("hi")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        हिन्दी
                      </button>
                    </div>
                  )}
                </div>

                {/* User avatar and logout */}
                <Link to="/dashboard" className="flex items-center">
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-green-500 hover:scale-110 transition"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/6.x/initials/png?seed=${encodeURIComponent(
                        userEmail || "user"
                      )}`;
                    }}
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              /* Show only language dropdown, login and signup when NOT logged in */
              <>
                {/* Language Dropdown */}
                <div className="relative language-dropdown">
                  <button
                    onClick={toggleLanguageDropdown}
                    className="flex items-center space-x-1 hover:text-green-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">
                      {lang === "en" ? "English" : "हिन्दी"}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        isLanguageDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isLanguageDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <button
                        onClick={() => changeLanguage("en")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        English
                      </button>
                      <button
                        onClick={() => changeLanguage("hi")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        हिन्दी
                      </button>
                    </div>
                  )}
                </div>

                {/* Login and Signup buttons */}
                <Link
                  to="/login"
                  className="hover:text-green-600 transition-colors px-3 py-2"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  {t("signup")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile view */}
          <div className="md:hidden flex items-center gap-4">
            {/* Language Toggle Button for Mobile */}
            <button
              onClick={() => changeLanguage(lang === "en" ? "hi" : "en")}
              className="flex items-center text-gray-700 p-2 rounded-md hover:bg-gray-100"
              title={lang === "en" ? "Switch to Hindi" : "Switch to English"}
            >
              <Globe className="w-5 h-5" />
              <span className="ml-1 text-sm font-medium">
                {lang === "en" ? "EN" : "HI"}
              </span>
            </button>

            {token ? (
              /* Mobile view for logged in users - Show avatar and mobile menu */
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border-2 border-green-500 hover:scale-110 transition"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/6.x/initials/png?seed=${encodeURIComponent(
                        userEmail || "user"
                      )}`;
                    }}
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              /* Mobile view for non-logged in users */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 text-sm px-2 py-1"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
