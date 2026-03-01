// src/pages/admin/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllCourses } from "../../api/courses";
import { getAllTeachers } from "../../api/teachers";
import { getAllUsers } from "../../api/users";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ courses: 0, teachers: 0, students: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [coursesData, teachersData, usersData] = await Promise.all([
          typeof getAllCourses === "function" ? getAllCourses().catch(() => []) : Promise.resolve([]),
          typeof getAllTeachers === "function" ? getAllTeachers().catch(() => []) : Promise.resolve([]),
          typeof getAllUsers === "function" ? getAllUsers().catch(() => []) : Promise.resolve([]),
        ]);
        const users = Array.isArray(usersData) ? usersData : [];
        setStats({
          courses: Array.isArray(coursesData) ? coursesData.length : 0,
          teachers: Array.isArray(teachersData) ? teachersData.length : 0,
          students: users.filter(u => (u.role || 'student') === 'student').length,
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const adminModules = [
    {
      title: "Course Management",
      description: "Create, edit, and manage courses",
      icon: "📚",
      path: "/admin/courses",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40",
    },
    {
      title: "Lab Management",
      description: "Create and manage virtual labs",
      icon: "🔬",
      path: "/admin/labs",
      color: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/40",
    },
    {
      title: "Teacher Management",
      description: "Manage teachers, applications, and assignments",
      icon: "👨‍🏫",
      path: "/admin/teachers",
      color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    },
    {
      title: "User Management",
      description: "Manage students and user accounts",
      icon: "👥",
      path: "/admin/users",
      color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <button
              key={module.path}
              onClick={() => navigate(module.path)}
              className={`${module.color} border-2 rounded-lg p-6 text-left transition hover:shadow-md`}
            >
              <div className="text-4xl mb-3">{module.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{module.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{module.description}</p>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Courses</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{loading ? "-" : stats.courses}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Teachers</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{loading ? "-" : stats.teachers}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Students</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{loading ? "-" : stats.students}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
