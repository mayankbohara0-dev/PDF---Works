import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Layers, Scissors, Minimize2, ArrowRight, Zap, Clock, File, Wrench, Image, Shield, FileText, Table } from 'lucide-react';

interface HistoryItem {
    fileName: string;
    date: string;
    type: string;
}

const Dashboard = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('pdfHistory') || '[]');
        setHistory(storedHistory);
    }, []);

    const tools = [
        {
            icon: Layers,
            title: "Merge PDFs",
            description: "Combine multiple PDF files into one master document.",
            path: "/merge",
            color: "bg-blue-50 text-primary",
            btnColor: "text-primary group-hover:bg-primary group-hover:text-white"
        },
        {
            icon: Scissors,
            title: "Split PDF",
            description: "Extract pages or split into multiple files.",
            path: "/split",
            color: "bg-purple-50 text-purple-600",
            btnColor: "text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
        },
        {
            icon: Minimize2,
            title: "Compress PDF",
            description: "Reduce file size with AI optimization.",
            path: "/compress",
            color: "bg-pink-50 text-pink-600",
            btnColor: "text-pink-600 group-hover:bg-pink-600 group-hover:text-white"
        },
        {
            icon: Wrench,
            title: "Repair PDF",
            description: "Fix corrupted or damaged PDF files.",
            path: "/repair",
            color: "bg-orange-50 text-orange-600",
            btnColor: "text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
        },
        {
            icon: Image,
            title: "PDF to Image",
            description: "Convert to PNG, JPG, or WebP images.",
            path: "/to-image",
            color: "bg-green-50 text-green-600",
            btnColor: "text-green-600 group-hover:bg-green-600 group-hover:text-white"
        },
        {
            icon: Shield,
            title: "Protect PDF",
            description: "Add password and set permissions.",
            path: "/protect",
            color: "bg-red-50 text-red-600",
            btnColor: "text-red-600 group-hover:bg-red-600 group-hover:text-white"
        },
        {
            icon: FileText,
            title: "PDF to Word",
            description: "Convert to DOCX (coming soon).",
            path: "/to-word",
            color: "bg-blue-50 text-blue-600",
            btnColor: "text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
        },
        {
            icon: Table,
            title: "PDF to Excel",
            description: "Extract tables to XLSX (coming soon).",
            path: "/to-excel",
            color: "bg-teal-50 text-teal-600",
            btnColor: "text-teal-600 group-hover:bg-teal-600 group-hover:text-white"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-secondary font-body">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Welcome Section */}
                    <div className="mb-12 animate-fade-in-up">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-text-main">
                            Hello, <span className="text-primary">{user?.email?.split('@')[0]}!</span> 👋
                        </h1>
                        <p className="text-xl text-text-body max-w-2xl">
                            What would you like to do with your documents today?
                        </p>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {tools.map((tool, idx) => (
                            <Link
                                key={idx}
                                to={tool.path}
                                className="group card-base flex flex-col h-full hover:scale-[1.02] transition-transform duration-300 border-2 border-transparent hover:border-gray-100"
                            >
                                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                                    <tool.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-text-main">
                                    {tool.title}
                                </h3>
                                <p className="text-text-body mb-8 flex-grow leading-relaxed">
                                    {tool.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-bold text-sm text-gray-400 group-hover:text-text-main transition-colors">Start Now</span>
                                    <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-colors ${tool.btnColor}`}>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Stats */}
                        <div className="lg:col-span-1 bg-primary rounded-3xl p-8 text-white shadow-lg shadow-primary/30 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <h3 className="font-bold text-xl mb-8 flex items-center gap-2">
                                <Zap className="w-5 h-5" /> Quick Stats
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                    <div className="text-3xl font-black mb-1">12</div>
                                    <div className="text-sm font-medium text-blue-100">Files Processed</div>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                    <div className="text-3xl font-black mb-1">150 MB</div>
                                    <div className="text-sm font-medium text-blue-100">Storage Saved</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 card-base animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-xl text-text-main flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" /> Recent Activity
                                </h3>
                                <button className="text-sm font-bold text-primary hover:text-primary-dark">View All</button>
                            </div>

                            {history.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">No recent activity yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${item.type === 'MERGE' ? 'bg-blue-100 text-primary' :
                                                    item.type === 'SPLIT' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-pink-100 text-pink-600'
                                                    }`}>
                                                    {item.type === 'MERGE' ? <Layers className="w-5 h-5" /> :
                                                        item.type === 'SPLIT' ? <Scissors className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-text-main group-hover:text-primary transition-colors">{item.fileName}</div>
                                                    <div className="text-xs text-gray-400 font-medium">{new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString()}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{item.type}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
