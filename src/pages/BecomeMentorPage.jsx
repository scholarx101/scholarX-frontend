// src/pages/BecomeMentorPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitTeacherApplication } from "../api/teacherApplications";
import FileUpload from "../components/FileUpload";

export default function BecomeMentorPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    professionalExperience: "",
    languageExpertise: "",
    facebook: "",
    youtube: "",
    website: "",
    message: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!photoFile || !cvFile) {
      setError("Please upload both photo and CV");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("designation", form.designation);
      formData.append("professionalExperience", form.professionalExperience);
      
      // Convert comma-separated to array
      const languageArray = form.languageExpertise.split(",").map((s) => s.trim()).filter(Boolean);
      languageArray.forEach((lang) => formData.append("languageExpertise[]", lang));

      if (form.facebook) formData.append("socials[facebook]", form.facebook);
      if (form.youtube) formData.append("socials[youtube]", form.youtube);
      if (form.website) formData.append("socials[website]", form.website);
      if (form.message) formData.append("message", form.message);

      formData.append("photo", photoFile);
      formData.append("cv", cvFile);

      await submitTeacherApplication(formData);
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-indigo-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Thank you for applying. We'll review your application and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition";

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-950">
      {/* Dark gradient header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white -mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Become a Mentor</h1>
          <p className="text-slate-300 max-w-lg mx-auto">
            Join our team of expert teachers and share your knowledge with students worldwide
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4">
        {error && (
          <div className="mb-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Your full name" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} placeholder="+1 234 567 8900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Photo *</label>
                <FileUpload accept="image/*" maxSizeMB={10} previewType="image" onFilesSelected={(files) => setPhotoFile(files[0])} />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Professional Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Designation *</label>
                <input type="text" name="designation" value={form.designation} onChange={handleChange} required className={inputClass} placeholder="e.g., Senior Arabic Teacher" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Professional Experience *</label>
                <textarea name="professionalExperience" value={form.professionalExperience} onChange={handleChange} required rows={4} className={inputClass} placeholder="Describe your teaching experience, qualifications, and achievements..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Language Expertise *</label>
                <input type="text" name="languageExpertise" value={form.languageExpertise} onChange={handleChange} required className={inputClass} placeholder="Arabic, English, Urdu (comma-separated)" />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Enter languages separated by commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CV/Resume *</label>
                <FileUpload accept=".pdf" maxSizeMB={10} previewType="list" onFilesSelected={(files) => setCvFile(files[0])} />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Social Media</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Optional</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Facebook</label>
                <input type="url" name="facebook" value={form.facebook} onChange={handleChange} className={inputClass} placeholder="https://facebook.com/yourprofile" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">YouTube</label>
                <input type="url" name="youtube" value={form.youtube} onChange={handleChange} className={inputClass} placeholder="https://youtube.com/@yourchannel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Website</label>
                <input type="url" name="website" value={form.website} onChange={handleChange} className={inputClass} placeholder="https://yourwebsite.com" />
              </div>
            </div>
          </div>

          {/* Additional Message */}
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Additional Message <span className="text-slate-400">(Optional)</span>
            </label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3} className={inputClass} placeholder="Tell us why you want to become a mentor..." />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-medium disabled:opacity-60 transition shadow-lg shadow-indigo-500/25"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
