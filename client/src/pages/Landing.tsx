import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Layers, Scissors, Minimize2, ArrowRight, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';
import AdUnit from '../components/AdUnit';

const Landing = () => {
    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, []);

    return (
        <div className="min-h-screen bg-secondary font-body overflow-x-hidden">
            <SEO
                title="Free PDF Tools - Merge, Split, Compress"
                description="The best free online PDF tools to merge, split, and compress your documents. Secure, fast, and easy to use."
            />
            <Navbar />

            <main className="pt-24 lg:pt-32">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8 pb-20 lg:pb-32 overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-float"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-float" style={{ animationDelay: '2s' }}></div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className={`transition-all duration-1000 ${mount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-gray-100">
                                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                                <span className="text-sm font-bold text-text-main">#1 Free PDF Tool Suite</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-text-main leading-tight">
                                Because your PDFs <br />
                                <span className="text-primary relative">
                                    deserve better.
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-xl text-text-body mb-8 max-w-lg leading-relaxed">
                                Skip the stress of complex software. We make merging, splitting, and compressing PDFs easy, fast, and completely free.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/signup"
                                    className="btn-primary group"
                                    data-analytics-id="landing-cta-hero"
                                >
                                    Start Creating
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="#features" className="btn-secondary">
                                    Explore Tools
                                </a>
                            </div>

                            <div className="mt-12 flex items-center gap-8">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                            User
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex text-accent mb-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                    </div>
                                    <p className="text-sm font-bold text-text-main">Trusted by 10,000+ users</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Illustration Placeholder */}
                        <div className={`relative hidden lg:block transition-all duration-1000 delay-300 ${mount ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            <div className="relative z-10 bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-secondary rounded-[2rem] p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                                    {/* Abstract Shapes resembling documents */}
                                    <div className="absolute top-10 left-10 w-32 h-40 bg-white rounded-xl shadow-lg rotate-[-6deg] flex flex-col p-4 gap-2 animate-bounce-slow">
                                        <div className="w-full h-2 bg-gray-100 rounded"></div>
                                        <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                                        <div className="w-full h-16 bg-blue-50 rounded mt-2"></div>
                                    </div>
                                    <div className="absolute bottom-20 right-10 w-40 h-48 bg-white rounded-xl shadow-lg rotate-[3deg] flex flex-col p-4 gap-3 animate-float" style={{ animationDelay: '1s' }}>
                                        <div className="w-10 h-10 bg-accent/20 rounded-full mb-2"></div>
                                        <div className="w-full h-2 bg-gray-100 rounded"></div>
                                        <div className="w-5/6 h-2 bg-gray-100 rounded"></div>
                                        <div className="w-full h-2 bg-gray-100 rounded"></div>
                                    </div>

                                    <div className="relative z-20 text-center">
                                        <div className="w-24 h-24 bg-primary text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
                                            <Heart className="w-12 h-12 fill-current" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-text-main">We love PDFs</h3>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative blobs behind */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent rounded-full opacity-20 blur-xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary rounded-full opacity-20 blur-xl"></div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-white rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-primary font-bold tracking-wide uppercase text-sm">Our Tools</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-2 mb-6 text-text-main">Everything you need to handle PDFs</h2>
                            <p className="text-lg text-text-body">Powerful features wrapped in a simple, friendly interface. No manuals required.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Merge Card */}
                            <div className="card-base group">
                                <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Layers className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-text-main">Merge PDFs</h3>
                                <p className="text-text-body mb-8 leading-relaxed">
                                    Combine multiple documents into a single, organized file. Perfect for reports and portfolios.
                                </p>
                                <Link to="/merge" className="inline-flex items-center font-bold text-primary group-hover:text-primary-dark">
                                    Try Merging <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </div>

                            {/* Split Card */}
                            <div className="card-base group">
                                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Scissors className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-text-main">Split PDF</h3>
                                <p className="text-text-body mb-8 leading-relaxed">
                                    Extract specific pages or separate one big file into several smaller ones with ease.
                                </p>
                                <Link to="/split" className="inline-flex items-center font-bold text-purple-600 group-hover:text-purple-800">
                                    Try Splitting <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </div>

                            {/* Compress Card */}
                            <div className="card-base group">
                                <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Minimize2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-text-main">Compress PDF</h3>
                                <p className="text-text-body mb-8 leading-relaxed">
                                    Make your files smaller without losing quality. Save space and email faster.
                                </p>
                                <Link to="/compress" className="inline-flex items-center font-bold text-pink-600 group-hover:text-pink-800">
                                    Try Compressing <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 px-4 bg-secondary">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                            {/* Background patterns */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/3"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 text-center">
                                <div>
                                    <div className="text-5xl lg:text-6xl font-black mb-2">1M+</div>
                                    <p className="text-blue-100 font-medium">Documents Processed</p>
                                </div>
                                <div>
                                    <div className="text-5xl lg:text-6xl font-black mb-2">0.2s</div>
                                    <p className="text-blue-100 font-medium">Average Time</p>
                                </div>
                                <div>
                                    <div className="text-5xl lg:text-6xl font-black mb-2">100%</div>
                                    <p className="text-blue-100 font-medium">Secure & Private</p>
                                </div>
                                <div>
                                    <div className="text-5xl lg:text-6xl font-black mb-2">4.9/5</div>
                                    <p className="text-blue-100 font-medium">User Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ad Unit Placeholder */}
                <section className="bg-white py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <AdUnit slot="4648283178" />
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 px-4 bg-gray-50 relative z-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-text-main">How it works</h2>
                            <p className="text-lg text-text-body">Three simple steps to perfect documents.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-200 -z-10"></div>

                            {[
                                { step: 1, title: 'Upload', desc: 'Select your files from your computer or drag and drop them here.' },
                                { step: 2, title: 'Process', desc: 'Choose your options and let our servers do the magic instantly.' },
                                { step: 3, title: 'Download', desc: 'Get your high-quality result immediately, ready to share.' }
                            ].map((item) => (
                                <div key={item.step} className="flex flex-col items-center text-center group">
                                    <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-primary mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-text-main">{item.title}</h3>
                                    <p className="text-text-body max-w-xs">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 px-4 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-text-main">Frequently Asked Questions</h2>
                        </div>

                        <div className="space-y-6">
                            {[
                                { q: 'Is SwiftPDF really free?', a: 'Yes! All our tools are 100% free to use for standard tasks. We believe in open access to productivity.' },
                                { q: 'Are my files safe?', a: 'Absolutely. We process your files securely and they are automatically deleted from our servers after processing. We do not peek at your data.' },
                                { q: 'Is there a file size limit?', a: 'Currently, we support files up to 100MB, which covers most standard documents and ebooks.' },
                                { q: 'Can I use it on mobile?', a: 'Yes, SwiftPDF is fully responsive and works great on smartphones and tablets.' }
                            ].map((faq, idx) => (
                                <div key={idx} className="bg-secondary rounded-2xl p-8 hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-text-main mb-3">{faq.q}</h3>
                                    <p className="text-text-body">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Ad Unit 2 */}
                <section className="bg-secondary py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <AdUnit slot="4648283178" />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4 text-center">
                    <div className="max-w-4xl mx-auto">
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
