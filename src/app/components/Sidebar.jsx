"use client"

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';


const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'students', label: 'Students', href: '/pages/students' },
    { id: 'hosts', label: 'Host Companies', href: '/pages/hosts' },
    { id: 'setas', label: 'SETAs', href: '/pages/setas' },
    { id: 'reports', label: 'Reports', href: '/pages/reports' },
    { id: 'documents', label: 'Documents', href: '/pages/documents' }
  ];

  const handleItemClick = (href) => {
    router.push(href);
  };

  return (
    <div className="w-56 h-screen bg-[#201c52] flex flex-col fixed top-0 left-0 z-40 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]">

      {/* Logo Section */}    
      <div className="bg-white p-6 border-b border-gray-200 flex-shrink-0">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/5f/VUT_logo-TM.png" 
          alt="Logo" 
          className=""
        />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.href)}
                  className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 border-none cursor-pointer text-md ${
                    isActive 
                      ? 'bg-[#d08a00] text-[#201c52] font-semibold shadow-md' 
                      : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-[#d08a00] hover:font-medium'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{item.label}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;