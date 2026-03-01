import React from "react";

const SUPPORT_EMAIL = "support@scholarx.com";

const footer = ({onOpenInfo}) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-slate-400">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Branding */}
                    <div className="md:col-span-4 space-y-5">
                        <div className="flex items-center gap-2.5">
                            <img
                                src="/logoscholar.png"
                                alt="ScholarX"
                                className="h-34 w-34 object-contain"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                            Your gateway to higher education and AI-powered research. Expert-led preparation for IELTS, TOEFL, GRE and collaborative virtual labs.
                        </p>
                        <div className="flex gap-3 pt-1">
                            <a
                                href="https://www.facebook.com/scholarx.education"
                                aria-label="Facebook"
                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg 
                                           bg-slate-800/80 border border-slate-700/50
                                           hover:bg-indigo-600 hover:border-indigo-500 hover:text-white 
                                           transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a
                                href="#"
                                aria-label="WhatsApp"
                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg 
                                           bg-slate-800/80 border border-slate-700/50
                                           hover:bg-emerald-600 hover:border-emerald-500 hover:text-white 
                                           transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 md:col-start-6">
                        <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-300 mb-5">
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => onOpenInfo("refund")}
                                    className="text-sm text-slate-500 hover:text-indigo-400 transition-colors"
                                >
                                    Refund Policy
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => onOpenInfo("terms")}
                                    className="text-sm text-slate-500 hover:text-indigo-400 transition-colors"
                                >
                                    Terms & Conditions
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => onOpenInfo("about")}
                                    className="text-sm text-slate-500 hover:text-indigo-400 transition-colors"
                                >
                                    About Us
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-4">
                        <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-300 mb-5">
                            Get in Touch
                        </h4>
                        <form className="space-y-3">
                            <input
                                type="email"
                                name="fromEmail"
                                placeholder="Your email address"
                                className="w-full px-4 py-2.5 text-sm rounded-xl 
                                           bg-slate-800/80 border border-slate-700/50 
                                           text-slate-200 placeholder-slate-500
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50
                                           transition-all"
                                required
                            />
                            <textarea
                                placeholder="Your message..."
                                name="message"
                                rows="2"
                                className="w-full px-4 py-2.5 text-sm rounded-xl 
                                           bg-slate-800/80 border border-slate-700/50 
                                           text-slate-200 placeholder-slate-500
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50
                                           transition-all resize-none"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full py-2.5 text-sm font-semibold rounded-xl text-white
                                           bg-gradient-to-r from-indigo-600 to-violet-600
                                           hover:from-indigo-500 hover:to-violet-500
                                           shadow-sm hover:shadow-md hover:shadow-indigo-500/20
                                           transition-all duration-200"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-600">
                        &copy; {currentYear} ScholarX Academy. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-700">
                        Built with purpose for learners worldwide.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default footer;