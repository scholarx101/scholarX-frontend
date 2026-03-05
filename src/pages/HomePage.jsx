import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CourseSection } from "../components/CourseSection";
import { LabSection } from "../components/LabSection";
import { resolveAssetUrl } from "../utils/coursePricingUtils";
import { getCourses } from "../api/courses";
import { getTeachers } from "../api/teachers";
import { getLabs } from "../api/labs";
// import { Helmet } from "../lib/helmet-shim";

function HomePage() {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [labsLoading, setLabsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const [courseData, teacherData, labData] = await Promise.all([
                    typeof getCourses === "function" ? getCourses() : Promise.resolve([]),
                    typeof getTeachers === "function" ? getTeachers() : Promise.resolve([]),
                    typeof getLabs === "function" ? getLabs().catch(() => []) : Promise.resolve([]),
                ]);
                setCourses(Array.isArray(courseData) ? courseData : []);
                setTeachers(Array.isArray(teacherData) ? teacherData : []);
                setLabs(Array.isArray(labData) ? labData : []);
                setLabsLoading(false);
            } catch (err) {
                const msg =
                    err?.message ||
                    "There was a problem loading courses. Please try again later.";
                setError(msg);
            } finally {
                setLoading(false);
                setLabsLoading(false);
            }
        }
        load();
    }, []);

    const handleViewDetails = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    const handleViewLabDetails = (labId) => {
        navigate(`/labs/${labId}`);
    };

    const liveCourses = courses.filter((c) => (c.type || "recorded") === "live");
    const recordedCourses = courses.filter(
        (c) => (c.type || "recorded") !== "live",
    );

    return (
        <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex flex-col">
            {/* Hero Section */}
            {/* pull up behind sticky navbar */}
            <section className="relative overflow-hidden bg-slate-950 -mt-16">
                {/* Gradient background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                            backgroundSize: "60px 60px"
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                                        bg-indigo-500/10 border border-indigo-400/20 mb-8">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-medium text-indigo-300 tracking-wide">
                                Enrolling Now — Limited Seats
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                            Your Gateway to{" "}
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                                Higher Education
                            </span>
                            {" "}&{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Research
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
                            Expert-led IELTS, TOEFL & GRE preparation with AI-powered virtual research labs. 
                            Learn from top instructors, join collaborative labs, and achieve your academic goals.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" })}
                                className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white 
                                           rounded-full bg-gradient-to-r from-indigo-600 to-violet-600
                                           hover:from-indigo-500 hover:to-violet-500
                                           shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                                           transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Explore Courses
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => document.getElementById("labs-section")?.scrollIntoView({ behavior: "smooth" })}
                                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold 
                                           text-slate-300 rounded-full border border-slate-600/50
                                           hover:bg-white/5 hover:border-slate-500/80 hover:text-white
                                           transition-all duration-300"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Virtual Labs
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{courses.length || "10"}+</div>
                                <div className="text-xs sm:text-sm text-slate-500 mt-1">Courses</div>
                            </div>
                            <div className="text-center border-x border-slate-700/50">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{teachers.length || "5"}+</div>
                                <div className="text-xs sm:text-sm text-slate-500 mt-1">Expert Tutors</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{labs.length || "3"}+</div>
                                <div className="text-xs sm:text-sm text-slate-500 mt-1">Virtual Labs</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 56" fill="none" className="w-full h-auto">
                        <path d="M0 56V28C240 4 480 0 720 8C960 16 1200 36 1440 28V56H0Z" 
                              className="fill-slate-50 dark:fill-slate-950" />
                    </svg>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800/30">
                        {error}
                    </div>
                )}

                {/* Upcoming batches */}
                <div id="courses-section">
                    <CourseSection
                        title="Upcoming Live Batches"
                        description="Enroll before seats are full."
                        courses={liveCourses}
                        loading={loading}
                        emptyMessage="Upcoming live batches will be announced soon."
                        variant="live"
                        onViewDetails={handleViewDetails}
                    />
                </div>

                {/* Pre-recorded courses */}
                <CourseSection
                    title="Recorded Courses"
                    description="Learn on any device (mobile, tablet, or laptop)"
                    courses={recordedCourses}
                    loading={loading}
                    emptyMessage="No courses have been published yet."
                    variant="recorded"
                    onViewDetails={handleViewDetails}
                />

                {/* Virtual Labs */}
                <div id="labs-section">
                    <LabSection
                        title="Virtual Labs"
                        description="Join a research lab and learn collaboratively under expert guidance."
                        labs={labs.filter(l => l.isActive !== false)}
                        loading={labsLoading}
                        emptyMessage="Virtual labs will be announced soon."
                        onViewDetails={handleViewLabDetails}
                        actionLabel="View Lab"
                    />
                </div>

                {/* Teachers */}
                <section className="relative">
                    <div className="relative max-w-7xl mx-auto px-6 py-14">
                        <div className="text-center mb-12">
                            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                                Our Team
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-900 dark:text-slate-50">
                                Meet Our Instructors
                            </h3>
                            <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Learn from experienced instructors in IELTS, GRE, TOEFL and other higher education subjects.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {teachers.map((teacher) => (
                                <article
                                    key={teacher._id}
                                    className="group rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50 
                                               shadow-sm hover:shadow-xl hover:-translate-y-1
                                               transition-all duration-300 p-7 flex flex-col items-center text-center"
                                >
                                    {/* Photo */}
                                    {teacher.photoUrl ? (
                                        <div className="relative mb-5">
                                            <div className="absolute -inset-1.5 bg-gradient-to-br from-indigo-400 to-violet-400 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                                            <img
                                                src={resolveAssetUrl(teacher.photoUrl)}
                                                alt={teacher.name}
                                                className="relative h-28 w-28 rounded-full object-cover 
                                                           border-2 border-white dark:border-slate-700
                                                           ring-4 ring-indigo-100 dark:ring-indigo-900/50"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-5 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40
                                                        flex items-center justify-center text-indigo-600 dark:text-indigo-300
                                                        text-3xl font-semibold ring-4 ring-indigo-100 dark:ring-indigo-900/50">
                                            {String(teacher.name || "")
                                                .split(" ")
                                                .filter(Boolean)
                                                .slice(0, 2)
                                                .map((n) => n[0])
                                                .join("") || "T"}
                                        </div>
                                    )}

                                    {/* Name */}
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">
                                        {teacher.name}
                                    </h4>

                                    {/* Designation */}
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                                        {teacher.designation || "Instructor"}
                                    </p>

                                    {/* Expertise */}
                                    {Array.isArray(teacher.languageExpertise) &&
                                        teacher.languageExpertise.length > 0 && (
                                            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                                                {teacher.languageExpertise.map((lang, i) => (
                                                    <span key={i} className="px-2.5 py-0.5 text-xs font-medium rounded-full 
                                                                             bg-slate-100 dark:bg-slate-700 
                                                                             text-slate-600 dark:text-slate-300">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                    {/* Experience */}
                                    {teacher.professionalExperience && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                                            {teacher.professionalExperience}
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>

                        {teachers.length === 0 && (
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                                Instructors will be added soon.
                            </p>
                        )}
                    </div>
                </section>

            </main>
        </div>
    );
}

export default HomePage;
