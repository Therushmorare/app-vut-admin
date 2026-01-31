"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  Users,
  BarChart,
  Calendar,
  FileText,
  Briefcase,
  Search,
  BriefcaseBusiness,
  Wallet
} from "lucide-react";

import SettingsPanel from "../features/Settings";
import DocumentsModal from "../features/Documents";
import NotificationsModal from "../features/Notifications/NotificationsModal";
import Charts from "./Reports/Charts";

const Navbar = () => {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const dropdownRef = useRef(null);
  const userAvatar = "";

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const adminRaw = sessionStorage.getItem("administrator");

    if (!adminRaw) {
      console.warn("No administrator session found");
      return;
    }

    try {
      const admin = JSON.parse(adminRaw);

      setUserName(admin.firstName || "");
      setUserEmail(admin.email || "");
    } catch (err) {
      console.error("Failed to parse administrator session:", err);
    }
  }, []);

  const menuItems = {
    "/pages/students": { title: "Student Management", icon: GraduationCap },
    "/pages/hosts": { title: "Host Company Management", icon: Users },
    "/pages/setas": { title: "SETA Management", icon: BriefcaseBusiness },
    "/pages/reports": { title: "Reports", icon: FileText },
    "/pages/spending": {title: "Budgets", icon: Wallet},
    "/pages/documents": { title: "Documents", icon: FileText },
    "/pages/admins": {title: "Admins", icon: Users},
    "/pages/logs": {title: "Logs", icon: BarChart}
  };

  const currentMenuItem = menuItems[pathname];
  const currentPageTitle = currentMenuItem?.title || "Student Management";
  const CurrentIcon = currentMenuItem?.icon;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.globalSearchTerm = searchTerm;
      const event = new CustomEvent('globalSearchChange', { detail: searchTerm });
      window.dispatchEvent(event);
      console.log('Navbar dispatching search:', searchTerm);
    }
  }, [searchTerm]);

  const profileMenuItems = [
    {
      icon: Settings,
      label: "Settings",
      onClick: () => setShowSettingsPanel(true),
      description: "Profile settings and more"
    }
  ];

  const AvatarComponent = ({ size = "md" }) => {
    const sizes = {
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base",
      lg: "w-12 h-12 text-lg"
    };

    if (userAvatar) {
      return (
        <img
          src={userAvatar}
          alt={userName}
          className={`${sizes[size]} rounded-full object-cover`}
        />
      );
    }

    return (
      <div
        className={`${sizes[size]} bg-[#201c52] rounded-full flex items-center justify-center text-white font-semibold`}
      >
        {getInitials(userName)}
      </div>
    );
  };

  const getSearchPlaceholder = () => {
    switch(pathname) {
      case '/pages/students':
        return 'Search students by name, number, ID, SETA, company...';
      case '/pages/hosts':
        return 'Search host companies by name, location, industry...';
      case '/pages/setas':
        return 'Search SETAs by name, skills, position...';
      case '/pages/reports':
        return 'Search reports by title, type, date...';
      case '/pages/admins':
        return 'Search admins by ID, Name(s).....';
      case '/pages/logs':
        return 'Search Logs by user types, IDs, actions, dates...';
      case '/pages/spending':
         return 'Search Programme Name...'
      default:
        return 'Search...';
    }
  };

  return (
    <>
      <nav className="h-28 bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-[0_0_10px_0_rgba(0,0,0,0.15)]">
        {/* Left side: Title + Icon */}
        <div className="ml-20 flex items-center gap-3">
          {CurrentIcon && (
            <CurrentIcon size={26} className="text-[#d08a00]" />
          )}
          <h1 className="text-2xl font-bold text-[#201c52] whitespace-nowrap">
            {currentPageTitle}
          </h1>
        </div>

        {/* Center: Search Bar - Always visible */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#0245A3] focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
              <button
              onClick={() => setShowNotificationsModal(true)}
              className="relative p-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0245A3]"
            >
              <Bell size={20} />

                <span className="absolute -top-1 -right-1 bg-[#E94E68] text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                </span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#0245A3] transition-all duration-200"
            >
              <AvatarComponent size="sm" />
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-75 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <AvatarComponent size="md" />
                    <div>
                      <p className="font-semibold text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-600">{userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Menu */}
                <div className="py-2">
                  {profileMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent
                            size={16}
                            className="text-gray-500 group-hover:text-[#0245A3] mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-[#0245A3]">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-2">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();

                      // Clear all session data
                      sessionStorage.clear();

                      // Close dropdown
                      setShowProfileDropdown(false);

                      // Redirect to login root
                      window.location.href = "/";
                    }}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors duration-150 group"
                  >
                    <LogOut
                      size={16}
                      className="text-gray-500 group-hover:text-[#E94E68]"
                    />
                    <span className="text-sm font-medium text-gray-900 group-hover:text-[#E94E68]">
                      Logout
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Settings Panel */}
      {showSettingsPanel && (
        <SettingsPanel onClose={() => setShowSettingsPanel(false)} />
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <DocumentsModal onClose={() => setShowDocumentsModal(false)} />
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <NotificationsModal
          onClose={() => setShowNotificationsModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;