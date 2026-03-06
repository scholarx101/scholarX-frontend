// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import InfoPanel from "./components/InfoPanel";
import { useState } from 'react';

// Lazy load pages for better performance
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const TeacherCourseProgress = lazy(() => import("./pages/teacher/TeacherCourseProgress"));
const TeacherLessons = lazy(() => import("./pages/teacher/TeacherLessons"));
const ChangePasswordPage = lazy(() => import("./pages/ChangePasswordPage"));
const BecomeMentorPage = lazy(() => import("./pages/BecomeMentorPage"));
// const MyCoursesPage = lazy(() => import("./pages/MyCoursePage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import("./pages/PaymentFailedPage"));
const PaymentCancelledPage = lazy(() => import("./pages/PaymentCancelledPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCoursesPage = lazy(() => import("./pages/admin/AdminCoursesPage"));
const AdminCourseForm = lazy(() => import("./pages/admin/AdminCourseForm"));
const AdminCourseLessonsPage = lazy(() => import("./pages/admin/AdminCourseLessonsPage"));
const AdminTeachersPage = lazy(() => import("./pages/admin/AdminTeachersPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminLabsPage = lazy(() => import("./pages/admin/AdminLabsPage"));
const AdminLabForm = lazy(() => import("./pages/admin/AdminLabForm"));
const AdminLabSubscribersPage = lazy(() => import("./pages/admin/AdminLabSubscribersPage"));
const LabDetailPage = lazy(() => import("./pages/LabDetailPage"));
const StudentLabsPage = lazy(() => import("./pages/StudentLabsPage"));
const TeacherLabsPage = lazy(() => import("./pages/teacher/TeacherLabsPage"));

export default function App() {
    const [infoPanel, setInfoPanel] = useState(null);
    const location = useLocation();

    // Google Analytics page view tracking
    useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    // null | "about" | "refund" | "terms"
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <Routes>
                {/* public + auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/become-mentor" element={<BecomeMentorPage />} />
                <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />
                <Route path="/payment/fail" element={<PaymentFailedPage />} />
                <Route path="/payment/cancel" element={<PaymentCancelledPage />} />

                {/* student dashboard */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/labs"
                    element={
                        <ProtectedRoute>
                            <StudentLabsPage />
                        </ProtectedRoute>
                    }
                />

                {/* teacher dashboard and routes */}
                <Route
                    path="/teacher/dashboard"
                    element={
                        <ProtectedRoute>
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/courses/:courseId/progress"
                    element={
                        <ProtectedRoute>
                            <TeacherCourseProgress />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/courses/:courseId/lessons"
                    element={
                        <ProtectedRoute>
                            <TeacherLessons />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/labs"
                    element={
                        <ProtectedRoute>
                            <TeacherLabsPage />
                        </ProtectedRoute>
                    }
                />

                {/* public course details */}
                <Route path="/courses/:id" element={<CourseDetailPage />} />

                {/* public lab details */}
                <Route path="/labs/:id" element={<LabDetailPage />} />

                {/* admin-only area */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/courses" element={<AdminCoursesPage />} />
                    <Route
                        path="/admin/courses/new"
                        element={<AdminCourseForm mode="create" />}
                    />
                    <Route
                        path="/admin/courses/:id/edit"
                        element={<AdminCourseForm mode="edit" />}
                    />
                    <Route
                        path="/admin/courses/:id/lessons"
                        element={<AdminCourseLessonsPage />}
                    />
                    <Route path="/admin/teachers" element={<AdminTeachersPage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/labs" element={<AdminLabsPage />} />
                    <Route path="/admin/labs/new" element={<AdminLabForm mode="create" />} />
                    <Route path="/admin/labs/:id/edit" element={<AdminLabForm mode="edit" />} />
                    <Route path="/admin/labs/:labId/subscribers" element={<AdminLabSubscribersPage />} />
                </Route>

                <Route path="/" element={<HomePage />} />
            </Routes>
            </Suspense>

            {infoPanel && (
                <InfoPanel
                    type={infoPanel}
                    onClose={() => setInfoPanel(null)}
                />
            )}
            <Footer onOpenInfo={setInfoPanel} />

        </>
    );
}
