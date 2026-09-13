import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-800 font-sans relative flex flex-col min-h-screen overflow-x-hidden">
      <Outlet />
    </div>
  );
};
