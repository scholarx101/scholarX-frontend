import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const path = location.pathname;
  const isHome = path === "/";
  const isLogin = path.startsWith("/login");
  const isRegister = path.startsWith("/register");
  const isStudentDashboard = path.startsWith("/student/dashboard");
  const isTeacherDashboard = path.startsWith("/teacher/dashboard");
  const isAdminDashboard = path.startsWith("/admin");
  const isDashboard = isStudentDashboard || isTeacherDashboard || isAdminDashboard;

  const goHome = () => navigate("/");
  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");
  const goStudentPanel = () => navigate("/student/dashboard");
  const goTeacherPanel = () => navigate("/teacher/dashboard");
  const goAdminPanel = () => navigate("/admin");
  const goBecomeMentor = () => navigate("/become-mentor");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { links, cta } = useMemo(() => {
    const linkItems = [];
    const ctaItem = {
      key: "become-mentor",
      label: "Become a Mentor",
      onClick: goBecomeMentor,
    };

    if (!user) {
      linkItems.push({ key: "home", label: "Home", onClick: goHome });
      if (isRegister) {
        linkItems.push({ key: "login", label: "Log in", onClick: goLogin });
      } else if (isLogin) {
        linkItems.push({ key: "register", label: "Register", onClick: goRegister });
      } else {
        linkItems.push({ key: "register", label: "Register", onClick: goRegister });
        linkItems.push({ key: "login", label: "Log in", onClick: goLogin });
      }
    } else {
      if (isHome) {
        linkItems.push({
          key: "dashboard",
          label: "Dashboard",
          onClick: user.role === "admin" ? goAdminPanel : user.role === "teacher" ? goTeacherPanel : goStudentPanel,
        });
      } else if (isDashboard) {
        linkItems.push({ key: "home", label: "Home", onClick: goHome });
      } else {
        linkItems.push({ key: "home", label: "Home", onClick: goHome });
        linkItems.push({
          key: "dashboard",
          label: "Dashboard",
          onClick: user.role === "admin" ? goAdminPanel : user.role === "teacher" ? goTeacherPanel : goStudentPanel,
        });
      }
      linkItems.push({ key: "logout", label: "Log out", onClick: handleLogout });
    }

    return { links: linkItems, cta: ctaItem };
  }, [user, isRegister, isLogin, isHome, isDashboard]);

  const ThemeToggle = () => (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center justify-center rounded-full w-9 h-9 
                 text-slate-400 hover:text-white transition-colors duration-200
                 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );

  return (
    <header
      className={
        "sticky top-0 z-50 transition-all duration-300 " +
        (scrolled
          ? "bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-black/10"
          : "bg-slate-950/90 backdrop-blur-md")
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={goHome}
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <img
              src="/logoscholar.png"
              alt="ScholarX Logo"
              className="h-28 w-28 object-contain transition-transform duration-200 group-hover:scale-105"
              onError={(e) => (e.target.style.display = "none")}
            />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className="relative px-4 py-2 text-[13px] font-medium text-slate-300 
                           hover:text-white transition-colors duration-200
                           after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                           after:w-0 after:h-[2px] after:bg-indigo-400 after:rounded-full
                           after:transition-all after:duration-200 hover:after:w-4/5"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side: CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {cta && (
              <button
                type="button"
                onClick={cta.onClick}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-[13px] font-semibold 
                           text-white rounded-full border border-indigo-400/50
                           bg-gradient-to-r from-indigo-500/10 to-violet-500/10
                           hover:from-indigo-500/25 hover:to-violet-500/25
                           hover:border-indigo-400/80 hover:shadow-lg hover:shadow-indigo-500/10
                           transition-all duration-300"
              >
                {cta.label}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 
                       text-slate-300 hover:text-white hover:bg-white/10 
                       transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out " +
            (mobileOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0")
          }
        >
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-3 space-y-1">
            {links.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium 
                           text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {item.label}
              </button>
            ))}
            {cta && (
              <button
                type="button"
                onClick={cta.onClick}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 
                           text-sm font-semibold text-white rounded-xl
                           bg-gradient-to-r from-indigo-600 to-violet-600
                           hover:from-indigo-500 hover:to-violet-500 transition-all"
              >
                {cta.label}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
