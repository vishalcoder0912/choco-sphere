import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, FolderTree, LogOut, Menu, X } from "lucide-react";
import "./admin.css";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: FolderTree,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-root">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
      >
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div>
            <h1 className="brand">NOIRSANE</h1>
            <p className="subbrand">Admin Console</p>
          </div>
          <button
            onClick={closeSidebar}
            className="admin-mobile-only"
            style={{ 
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-nav-section">
          <div className="admin-nav-label">Management</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon className="nav-icon" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">SA</div>
          <div className="admin-sidebar-user-info">
            <div className="name">Store Admin</div>
            <div className="email">vishal.kumar@admin.com</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Mobile Topbar */}
        <div className="admin-topbar admin-mobile-only">
          <div className="admin-topbar-actions">
            <button
              onClick={toggleSidebar}
              className="admin-btn admin-btn-ghost admin-btn-icon"
              style={{ 
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 style={{ 
                color: "var(--gold)", 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '18px',
                fontWeight: '500',
                margin: 0
              }}>NOIRSANE</h1>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-notification-btn">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="admin-topbar-avatar">SA</div>
          </div>
        </div>

        {/* Desktop Topbar */}
        <div className="admin-topbar admin-desktop-only">
          <div className="admin-search">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search orders, products..." />
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-notification-btn">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="admin-topbar-user">
              <div className="admin-topbar-avatar">SA</div>
              <div className="name">Store Admin</div>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}