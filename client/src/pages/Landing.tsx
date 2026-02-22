import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Layers, Scissors, Minimize2, ArrowRight, Star, Wrench, Image, Shield, FileText, Table } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AdUnit from '../components/AdUnit';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* ─── Inline SVG Illustrations ─────────────────────────────────── */

const HeroIllustration = () => (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Person managing PDF documents" className="w-full h-full drop-shadow-xl">
        <ellipse cx="390" cy="340" rx="110" ry="70" fill="#EEF2FF" />
        <ellipse cx="120" cy="80" rx="70" ry="50" fill="#FFF7E6" />
        <rect x="60" y="290" width="400" height="18" rx="9" fill="#D1D5DB" />
        <rect x="120" y="308" width="14" height="60" rx="7" fill="#9CA3AF" />
        <rect x="386" y="308" width="14" height="60" rx="7" fill="#9CA3AF" />
        <rect x="140" y="200" width="240" height="92" rx="10" fill="#1E293B" />
        <rect x="148" y="207" width="224" height="78" rx="7" fill="#0F172A" />
        <rect x="148" y="207" width="224" height="78" rx="7" fill="url(#screenGrad)" opacity="0.9" />
        <rect x="220" y="222" width="80" height="48" rx="6" fill="white" opacity="0.12" />
        <text x="260" y="252" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="white" opacity="0.9">PDF</text>
        <rect x="228" y="258" width="64" height="4" rx="2" fill="white" opacity="0.3" />
        <rect x="228" y="265" width="44" height="4" rx="2" fill="white" opacity="0.2" />
        <rect x="140" y="290" width="240" height="8" rx="4" fill="#374151" />
        <rect x="120" y="298" width="280" height="10" rx="5" fill="#4B5563" />
        <ellipse cx="260" cy="298" rx="20" ry="4" fill="#6B7280" />
        <g transform="translate(52,105) rotate(-8,60,50)">
            <rect width="110" height="90" rx="14" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
            <rect x="14" y="14" width="36" height="42" rx="5" fill="#EEF2FF" />
            <text x="32" y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#4F6EF7" fontFamily="sans-serif">PDF</text>
            <rect x="14" y="60" width="82" height="5" rx="2.5" fill="#E5E7EB" />
            <rect x="14" y="69" width="55" height="5" rx="2.5" fill="#E5E7EB" />
            <text x="80" y="42" textAnchor="middle" fontSize="22" fill="#4F6EF7" opacity="0.8" fontFamily="sans-serif">⇌</text>
            <text x="55" y="83" textAnchor="middle" fontSize="8" fill="#6B7280" fontFamily="sans-serif">Merge</text>
        </g>
        <g transform="translate(358,60) rotate(6,55,48)">
            <rect width="105" height="86" rx="14" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
            <rect x="12" y="12" width="80" height="38" rx="5" fill="#FEF9EE" />
            <text x="52" y="34" textAnchor="middle" fontSize="18" fill="#F59E0B" fontFamily="sans-serif">✂</text>
            <line x1="12" y1="50" x2="93" y2="50" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
            <rect x="12" y="58" width="80" height="5" rx="2.5" fill="#E5E7EB" />
            <rect x="12" y="67" width="55" height="5" rx="2.5" fill="#E5E7EB" />
            <text x="52" y="81" textAnchor="middle" fontSize="8" fill="#6B7280" fontFamily="sans-serif">Split</text>
        </g>
        <g transform="translate(390,190)">
            <rect width="98" height="80" rx="14" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
            <text x="49" y="38" textAnchor="middle" fontSize="24" fill="#EC4899" fontFamily="sans-serif">⬇</text>
            <rect x="12" y="52" width="74" height="5" rx="2.5" fill="#FCE7F3" />
            <rect x="12" y="61" width="48" height="5" rx="2.5" fill="#FCE7F3" />
            <text x="49" y="75" textAnchor="middle" fontSize="8" fill="#6B7280" fontFamily="sans-serif">Compress</text>
        </g>
        <path d="M220 235 Q230 200 260 195 Q290 200 300 235" fill="#4F6EF7" />
        <path d="M240 210 Q260 205 280 210" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
        <rect x="252" y="183" width="16" height="16" rx="4" fill="#FBBF8D" />
        <ellipse cx="260" cy="170" rx="26" ry="24" fill="#FBBF8D" />
        <path d="M234 162 Q237 140 260 138 Q283 140 286 162 Q278 150 260 150 Q242 150 234 162Z" fill="#92400E" />
        <ellipse cx="251" cy="168" rx="3.5" ry="4" fill="#1E293B" />
        <ellipse cx="252" cy="167" rx="1.2" ry="1.2" fill="white" />
        <ellipse cx="269" cy="168" rx="3.5" ry="4" fill="#1E293B" />
        <ellipse cx="270" cy="167" rx="1.2" ry="1.2" fill="white" />
        <path d="M253 177 Q260 182 267 177" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M230 215 Q195 240 175 255" stroke="#4F6EF7" strokeWidth="14" strokeLinecap="round" fill="none" />
        <ellipse cx="170" cy="257" rx="9" ry="7" fill="#FBBF8D" />
        <path d="M290 215 Q315 240 330 255" stroke="#4F6EF7" strokeWidth="14" strokeLinecap="round" fill="none" />
        <ellipse cx="335" cy="257" rx="9" ry="7" fill="#FBBF8D" />
        <rect x="240" y="270" width="18" height="28" rx="6" fill="#1E293B" />
        <rect x="262" y="270" width="18" height="28" rx="6" fill="#1E293B" />
        <rect x="235" y="294" width="28" height="10" rx="5" fill="#374151" />
        <rect x="257" y="294" width="28" height="10" rx="5" fill="#374151" />
        <text x="90" y="75" fontSize="14" fill="#FFB703" fontFamily="sans-serif">✦</text>
        <text x="420" y="145" fontSize="11" fill="#4F6EF7" fontFamily="sans-serif">✦</text>
        <text x="330" y="90" fontSize="9" fill="#EC4899" fontFamily="sans-serif">✦</text>
        <text x="150" y="195" fontSize="10" fill="#FFB703" fontFamily="sans-serif">✦</text>
        <defs>
            <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4F6EF7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
            </linearGradient>
        </defs>
    </svg>
);

const UploadIllustration = () => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        <ellipse cx="60" cy="62" rx="38" ry="26" fill="#EEF2FF" />
        <ellipse cx="44" cy="66" rx="20" ry="18" fill="#EEF2FF" />
        <ellipse cx="76" cy="66" rx="20" ry="18" fill="#EEF2FF" />
        <ellipse cx="60" cy="55" rx="28" ry="22" fill="#EEF2FF" />
        <line x1="60" y1="80" x2="60" y2="42" stroke="#4F6EF7" strokeWidth="4" strokeLinecap="round" />
        <polyline points="46,56 60,42 74,56" stroke="#4F6EF7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="20" y="82" width="80" height="26" rx="8" stroke="#4F6EF7" strokeWidth="2" strokeDasharray="5 3" fill="white" />
        <text x="60" y="99" textAnchor="middle" fontSize="9" fill="#4F6EF7" fontFamily="sans-serif" fontWeight="bold">Drop files here</text>
    </svg>
);

const ProcessIllustration = () => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        <circle cx="50" cy="58" r="22" fill="#EEF2FF" />
        <circle cx="50" cy="58" r="12" fill="white" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 50 + 22 * Math.cos(rad);
            const y = 58 + 22 * Math.sin(rad);
            return <rect key={i} x={x - 4} y={y - 4} width="8" height="8" rx="2" fill="#4F6EF7" transform={`rotate(${angle}, ${x}, ${y})`} />;
        })}
        <circle cx="50" cy="58" r="7" fill="#4F6EF7" />
        <circle cx="82" cy="42" r="14" fill="#FFF7E6" />
        <circle cx="82" cy="42" r="7" fill="white" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 82 + 14 * Math.cos(rad);
            const y = 42 + 14 * Math.sin(rad);
            return <rect key={i} x={x - 3} y={y - 3} width="6" height="6" rx="1.5" fill="#FFB703" transform={`rotate(${angle}, ${x}, ${y})`} />;
        })}
        <circle cx="82" cy="42" r="4.5" fill="#FFB703" />
        <polygon points="60,78 52,95 60,91 58,108 70,88 60,92" fill="#FFB703" opacity="0.8" />
    </svg>
);

const DownloadIllustration = () => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        <rect x="32" y="18" width="56" height="72" rx="8" fill="#EEF2FF" />
        <rect x="32" y="18" width="56" height="72" rx="8" stroke="#4F6EF7" strokeWidth="2" />
        <path d="M72 18 L88 34 L72 34 Z" fill="#C7D2FE" />
        <path d="M72 18 L88 34" stroke="#4F6EF7" strokeWidth="2" />
        <rect x="42" y="44" width="36" height="4" rx="2" fill="#C7D2FE" />
        <rect x="42" y="52" width="24" height="4" rx="2" fill="#C7D2FE" />
        <circle cx="60" cy="96" r="18" fill="#4F6EF7" />
        <line x1="60" y1="85" x2="60" y2="100" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <polyline points="52,93 60,102 68,93" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="60" cy="66" r="10" fill="#4F6EF7" opacity="0.15" />
        <polyline points="54,66 58,70 66,62" stroke="#4F6EF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

const SecurityIllustration = () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto mb-6" aria-label="Security shield">
        <path d="M100 12 L152 34 L152 82 Q152 118 100 142 Q48 118 48 82 L48 34 Z" fill="#4F6EF7" />
        <path d="M100 24 L140 42 L140 82 Q140 110 100 130 Q60 110 60 82 L60 42 Z" fill="#6366F1" opacity="0.7" />
        <polyline points="80,80 95,96 122,65" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="20" y="55" fontSize="16" fill="#FFB703" fontFamily="sans-serif">✦</text>
        <text x="164" y="55" fontSize="12" fill="#FFB703" fontFamily="sans-serif">✦</text>
        <text x="30" y="115" fontSize="10" fill="#4F6EF7" fontFamily="sans-serif">✦</text>
        <text x="158" y="115" fontSize="14" fill="#EC4899" fontFamily="sans-serif">✦</text>
    </svg>
);

/* ─── Reusable Reveal Wrapper ───────────────────────────────────── */
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal ${className}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};

/* ─── Main Component ──────────────────────────────────────────── */

const Landing = () => {
    const [mount, setMount] = useState(false);

    // Section refs for scroll-reveal
    const featuresRef = useScrollReveal<HTMLDivElement>();
    const statsRef = useScrollReveal<HTMLDivElement>();
    const howRef = useScrollReveal<HTMLDivElement>();
    const faqRef = useScrollReveal<HTMLDivElement>();
    const ctaRef = useScrollReveal<HTMLDivElement>();

    useEffect(() => {
        const t = setTimeout(() => setMount(true), 50);
        return () => clearTimeout(t);
    }, []);

    const tools = [
        { icon: Layers, title: 'Merge PDFs', desc: 'Combine multiple documents into one file.', path: '/merge', color: 'bg-blue-50 text-primary', btnColor: 'text-primary' },
        { icon: Scissors, title: 'Split PDF', desc: 'Extract specific pages from your PDF.', path: '/split', color: 'bg-purple-50 text-purple-600', btnColor: 'text-purple-600' },
        { icon: Minimize2, title: 'Compress PDF', desc: 'Reduce file size without losing quality.', path: '/compress', color: 'bg-pink-50 text-pink-600', btnColor: 'text-pink-600' },
        { icon: Wrench, title: 'Repair PDF', desc: 'Fix corrupted or damaged PDF files.', path: '/repair', color: 'bg-orange-50 text-orange-600', btnColor: 'text-orange-600' },
        { icon: Image, title: 'PDF to Image', desc: 'Convert pages to PNG, JPG, or WebP.', path: '/to-image', color: 'bg-green-50 text-green-600', btnColor: 'text-green-600' },
        { icon: Shield, title: 'Protect PDF', desc: 'Add password encryption and permissions.', path: '/protect', color: 'bg-red-50 text-red-600', btnColor: 'text-red-600' },
        { icon: FileText, title: 'PDF to Word', desc: 'Convert to editable DOCX (coming soon).', path: '/to-word', color: 'bg-blue-50 text-blue-600', btnColor: 'text-blue-600' },
        { icon: Table, title: 'PDF to Excel', desc: 'Extract tables to XLSX (coming soon).', path: '/to-excel', color: 'bg-teal-50 text-teal-600', btnColor: 'text-teal-600' },
    ];

    const steps = [
        { step: 1, title: 'Upload', desc: 'Select your files from your computer or drag and drop them here.', illustration: <UploadIllustration /> },
        { step: 2, title: 'Process', desc: 'Choose your options and let our servers do the magic instantly.', illustration: <ProcessIllustration /> },
        { step: 3, title: 'Download', desc: 'Get your high-quality result immediately, ready to share.', illustration: <DownloadIllustration /> },
    ];

    return (
        <div className="min-h-screen bg-secondary font-body overflow-x-hidden">
            <SEO
                title="Free PDF Tools - Merge, Split, Compress"
                description="The best free online PDF tools to merge, split, and compress your documents. Secure, fast, and easy to use."
            />
            <Navbar />

            <main className="pt-24 lg:pt-32">

                {/* ── Hero Section ── */}
                <section className="relative px-4 sm:px-6 lg:px-8 pb-20 lg:pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-float"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-float" style={{ animationDelay: '2s' }}></div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                        {/* Left copy */}
                        <div>
                            <div className={`inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-gray-100 transition-all duration-700 ${mount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                                <span className="text-sm font-bold text-text-main">#1 Free PDF Tool Suite</span>
                            </div>

                            <h1 className={`text-5xl lg:text-7xl font-bold mb-6 text-text-main leading-tight transition-all duration-700 delay-100 ${mount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                Because your PDFs <br />
                                <span className="text-primary relative">
                                    deserve better.
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                                    </svg>
                                </span>
                            </h1>

                            <p className={`text-xl text-text-body mb-8 max-w-lg leading-relaxed transition-all duration-700 delay-200 ${mount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                Skip the stress of complex software. We make merging, splitting, and compressing PDFs easy, fast, and completely free.
                            </p>

                            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${mount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                <Link to="/signup" className="btn-primary group" data-analytics-id="landing-cta-hero">
                                    Start Creating
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="#features" className="btn-secondary">Explore Tools</a>
                            </div>

                            <div className={`mt-12 flex items-center gap-8 transition-all duration-700 delay-[400ms] ${mount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500 hover:scale-110 transition-transform cursor-default">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex text-accent mb-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-sm font-bold text-text-main">Trusted by 10,000+ users</p>
                                </div>
                            </div>
                        </div>

                        {/* Right illustration */}
                        <div className={`relative hidden lg:flex items-center justify-center transition-all duration-1000 delay-500 ${mount ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            <div className="absolute w-[420px] h-[420px] rounded-full border-2 border-dashed border-primary/20 animate-spin-slow"></div>
                            <div className="absolute w-[320px] h-[320px] rounded-full bg-primary/5"></div>
                            <div className="relative z-10 w-[480px] h-[380px]">
                                <HeroIllustration />
                            </div>
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent rounded-full opacity-20 blur-xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary rounded-full opacity-20 blur-xl"></div>
                        </div>
                    </div>
                </section>

                {/* ── Features Section ── */}
                <section id="features" className="py-24 bg-white rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div ref={featuresRef} className="reveal text-center max-w-3xl mx-auto mb-16">
                            <span className="text-primary font-bold tracking-wide uppercase text-sm">Our Tools</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6 text-text-main">Everything you need to handle PDFs</h2>
                            <p className="text-lg text-text-body">Powerful features wrapped in a simple, friendly interface. No manuals required.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {tools.map((tool, idx) => (
                                <Reveal key={idx} delay={idx * 0.06}>
                                    <Link
                                        to={tool.path}
                                        className="card-base group hover:scale-[1.03] transition-transform duration-300 block h-full"
                                    >
                                        <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform duration-300`}>
                                            <tool.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-text-main">{tool.title}</h3>
                                        <p className="text-sm text-text-body mb-4 leading-relaxed min-h-[40px]">{tool.desc}</p>
                                        <div className={`inline-flex items-center font-bold text-sm ${tool.btnColor} group-hover:gap-2 transition-all duration-200`}>
                                            Try Now <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Stats Section ── */}
                <section className="py-24 px-4 bg-secondary">
                    <div className="max-w-7xl mx-auto">
                        <div ref={statsRef} className="reveal-scale bg-primary rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 text-center">
                                {[
                                    { val: '1M+', label: 'Documents Processed' },
                                    { val: '0.2s', label: 'Average Time' },
                                    { val: '100%', label: 'Secure & Private' },
                                    { val: '4.9/5', label: 'User Rating' },
                                ].map((stat, i) => (
                                    <Reveal key={i} delay={i * 0.08}>
                                        <div>
                                            <div className="text-5xl lg:text-6xl font-black mb-2">{stat.val}</div>
                                            <p className="text-blue-100 font-medium">{stat.label}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Ad Unit ── */}
                <section className="bg-white py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <AdUnit slot="4648283178" />
                    </div>
                </section>

                {/* ── How It Works ── */}
                <section className="py-24 px-4 bg-gray-50 relative z-20">
                    <div className="max-w-7xl mx-auto">
                        <div ref={howRef} className="reveal text-center mb-16">
                            <span className="text-primary font-bold tracking-wide uppercase text-sm">Simple Process</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6 text-text-main">How it works</h2>
                            <p className="text-lg text-text-body">Three simple steps to perfect documents.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            <div className="hidden md:block absolute top-[52px] left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-primary/30"></div>

                            {steps.map((item, i) => (
                                <Reveal key={item.step} delay={i * 0.12}>
                                    <div className="flex flex-col items-center text-center group">
                                        <div className="relative mb-2">
                                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black z-10 shadow-md group-hover:scale-110 transition-transform">
                                                {item.step}
                                            </div>
                                            <div className="w-28 h-28 bg-white rounded-3xl shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 relative z-0">
                                                {item.illustration}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold mt-4 mb-3 text-text-main">{item.title}</h3>
                                        <p className="text-text-body max-w-xs">{item.desc}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ Section ── */}
                <section className="py-24 px-4 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div ref={faqRef} className="reveal text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-text-main">Frequently Asked Questions</h2>
                        </div>

                        <div className="space-y-6">
                            {[
                                { q: 'Is SwiftPDF really free?', a: 'Yes! All our tools are 100% free to use for standard tasks. We believe in open access to productivity.' },
                                { q: 'Are my files safe?', a: 'Absolutely. We process your files securely and they are automatically deleted from our servers after processing. We do not peek at your data.' },
                                { q: 'Is there a file size limit?', a: 'Currently, we support files up to 100MB, which covers most standard documents and ebooks.' },
                                { q: 'Can I use it on mobile?', a: 'Yes, SwiftPDF is fully responsive and works great on smartphones and tablets.' }
                            ].map((faq, idx) => (
                                <Reveal key={idx} delay={idx * 0.08}>
                                    <div className="bg-secondary rounded-2xl p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                                        <h3 className="text-xl font-bold text-text-main mb-3">{faq.q}</h3>
                                        <p className="text-text-body">{faq.a}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Ad Unit 2 ── */}
                <section className="bg-secondary py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <AdUnit slot="4648283178" />
                    </div>
                </section>

                {/* ── CTA Section ── */}
                <section className="py-24 px-4 text-center bg-white">
                    <div ref={ctaRef} className="reveal max-w-4xl mx-auto">
                        <SecurityIllustration />
                        <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-text-main">Ready to simplify your workflow?</h2>
                        <p className="text-xl text-text-body mb-10 max-w-2xl mx-auto">Join thousands of users who trust SwiftPDF for their daily document needs.</p>
                        <Link
                            to="/signup"
                            className="btn-primary text-lg px-12 py-5 shadow-glow hover:shadow-primary/60"
                            data-analytics-id="landing-cta-bottom"
                        >
                            Get Started for Free
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Landing;
