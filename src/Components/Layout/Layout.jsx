import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  // const unauthorized = location.pathname === '/unauthorized';

  const mainMargin = !isLoginPage
    ? collapsed
      ? 'lg:ml-20'
      : 'lg:ml-72'
    : 'ml-0';

  const showNavbar = !isLoginPage;

  return (
    // <div className="h-screen flex flex-col bg-gray-100 ">
    //   {showNavbar && <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />}

    //     <main className={`flex-1 overflow-hidden transition-all duration-300 ${mainMargin} mt-[-20px]`}>
    //       <div className="h-full rounded px-10 pt-1 pb-10 overflow-y-auto mt-20 scroll-hidden">

    //         <Outlet context={{ collapsed }} />
    //       </div>
    //     </main>
    // </div>
    <div className="min-h-screen flex flex-col bg-gray-50">
  {showNavbar && <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />}

  <main className={`flex-1 transition-all duration-300 ${mainMargin}`}>
    <div className="h-[calc(100vh-4rem)] overflow-y-auto px-10 pt-1 pb-10 mt-16 scroll-hidden">
      <Outlet context={{ collapsed }} />
    </div>
  </main>
</div>

  );
}


