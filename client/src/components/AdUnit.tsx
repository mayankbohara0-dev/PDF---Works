import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdUnitProps {
    className?: string;
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    layoutKey?: string;
}

const AdUnit = ({ className = '', slot = 'YOUR_AD_SLOT_ID', format = 'auto', layoutKey }: AdUnitProps) => {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            if (window.adsbygoogle && adRef.current) {
                // Determine if ad is already filled to avoid duplicates if re-rendering issues occur
                const alreadyFilled = adRef.current.innerHTML.trim().length > 0;
                if (!alreadyFilled) {
                    // Check if script is loaded, otherwise adsbygoogle might not be ready immediately.
                    // In a real app, you might want a more robust loader.
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            }
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    // Placeholder for development so layout doesn't jump
    const isDev = import.meta.env.DEV;

    return (
        <div className={`ad-container w-full flex justify-center my-8 ${className}`}>
            {isDev ? (
                <div className="w-full max-w-[728px] h-[90px] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-bold">
                    AdSense Placeholder (Slot: {slot})
                </div>
            ) : (
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-client="ca-pub-8982120361297725"
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                    data-ad-layout-key={layoutKey}
                    ref={adRef}
                />
            )}
        </div>
    );
};

export default AdUnit;
