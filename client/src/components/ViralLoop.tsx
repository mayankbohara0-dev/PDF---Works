import { useState, useEffect } from 'react';
import { Check, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ViralLoop = () => {
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        // Check if we've already shown the viral loop in this session
        const hasShownViralLoop = sessionStorage.getItem('hasShownViralLoop');

        if (!hasShownViralLoop) {
            setIsVisible(true);
            sessionStorage.setItem('hasShownViralLoop', 'true');
        }
    }, []);

    const handleCopyLink = async () => {
        const url = window.location.origin;
        setCopyError(false);

        // Modern Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return;
            } catch (err) {
                console.error('Clipboard API failed: ', err);
                // Fallthrough to fallback
            }
        }

        // Fallback: execCommand('copy')
        try {
            const textArea = document.createElement('textarea');
            textArea.value = url;

            // Ensure it's not visible but part of DOM
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                throw new Error('execCommand failed');
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            setCopyError(true);
            setShowFallback(true);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center animate-fade-in-up delay-200">
            <div className="flex items-center gap-2 text-text-body font-medium mb-3 text-center">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span>If this helped you, share PDFWorks with a friend</span>
            </div>

            {showFallback ? (
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                    <p className="text-xs text-red-500 font-bold mb-1">Couldn’t copy, you can manually copy the link:</p>
                    <input
                        type="text"
                        readOnly
                        value={window.location.origin}
                        className="w-full text-center text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg select-all focus:outline-none focus:border-pink-300 text-gray-600"
                        onFocus={(e) => e.target.select()}
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <button
                        onClick={handleCopyLink}
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all transform hover:-translate-y-0.5
                            ${copied
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-text-main hover:bg-gray-200 hover:shadow-sm'
                            }
                        `}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4" />
                                Copy Link
                            </>
                        )}
                    </button>
                    {copyError && <p className="text-xs text-red-500 mt-2 font-medium animate-pulse">Failed to copy automatically</p>}
                </div>
            )}

            {/* Configurable branding line */}
            <Link
                to="/"
                className="mt-6 text-xs font-medium text-gray-300 hover:text-gray-400 transition-colors flex items-center gap-1"
            >
                Made with PDFWorks
            </Link>
        </div>
    );
};

export default ViralLoop;
