import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, ArrowRight, Download, Share2 } from 'lucide-react';
import { API_URL } from '../config';
import Header from '../components/Header';
import FeedNavbar from '../feed/components/FeedNavbar';

const mediaItems = [
    { type: 'image', src: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748376266/449052580_321019774407387_4748102913008891394_n.heic_ghxfoc.jpg', alt: 'Image 1' },
    { type: 'image', src: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748376272/Screenshot_2025_0528_013100_xemj9w.jpg', alt: 'Image 2' },
    { type: 'image', src: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748376271/Screenshot_2025_0528_013029_ndim8e.jpg', alt: 'Image 3' },
    { type: 'image', src: 'https://res.cloudinary.com/deoegf9on/image/upload/v1748376278/449077954_358485550680836_5156015429420931185_n.heic_asd7jt.jpg', alt: 'Image 4' },
    { type: 'video', src: 'https://res.cloudinary.com/deoegf9on/video/upload/v1748376421/AQO6dHb1BaPjC67krAxRpQ2uiDtSU01kmNPU07I5Ld9SID-Rxkodp1Av8y-t9BxCNTKo35M7kCgZEHTgZG4ouR5a6qgpgIR7TxCEyOU_ztcsl6.mp4' },
    { type: 'video', src: 'https://res.cloudinary.com/deoegf9on/video/upload/v1748376334/AQNqQhaW-VkyxU8K77MW46jWBz9sJCwHFPYjF7XZYnG9rdXdUPrEPNgcRgpLtfeNpeMXLGcBNIuo4MLS1TtCmZRJvvbFQttniuzywOo_awzxjt.mp4' },
    { type: 'video', src: 'https://res.cloudinary.com/deoegf9on/video/upload/v1748376295/AQP7WQQ2UGoBFlK5TfvpFNUBgqMal4j5E3wScfTx4EjvQzsm1SKXbxMVJ1OVnqCZH4fyGA6IzyRPzRwTZYYFnRpbmbU6LR1RAZ8153o_zcikj3.mp4' },
    { type: 'video', src: 'https://res.cloudinary.com/deoegf9on/video/upload/v1748376450/AQOWf2YWPNA9B7TzEdmw_BSM0GMK9omSTgJ00TtCCp_jj_hKcY1KPMgBH40YR6-RrYMg6L_i5lhEfyZmP25cgvIKGmR8Vbgf4gEt9vY_zb7lgb.mp4' },
    { type: 'video', src: 'https://res.cloudinary.com/deoegf9on/video/upload/v1748376440/AQO6t9BJLDT_tPypuDykpnOdwqxae4jy0IS_8RXdD8240gsLg91ggqoQqkJewveTYFJXYeipUc4cPEvF0BslZVUCBIonv2GeOdGbaGc_dsmm1d.mp4' },
];

const Album = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIndex, setModalIndex] = useState(null);
    const [zoomed, setZoomed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Check if token exists
                const token = localStorage.getItem('token');
                if (!token) {
                    // If no token, we still show the album but without user-specific features
                    setLoading(false);
                    return;
                }

                // Fetch user data from backend
                const response = await fetch(`${API_URL}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Unauthorized - token expired or invalid
                        localStorage.removeItem('token');
                        setLoading(false);
                        return;
                    }
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const closeModal = () => {
        setModalIndex(null);
        setZoomed(false);
    };

    const handleKeyDown = useCallback((e) => {
        if (modalIndex === null) return;
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowRight') setModalIndex((i) => (i + 1) % mediaItems.length);
        else if (e.key === 'ArrowLeft') setModalIndex((i) => (i - 1 + mediaItems.length) % mediaItems.length);
    }, [modalIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const downloadMedia = (src) => {
        const a = document.createElement('a');
        a.href = src;
        a.download = 'media';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const shareMedia = async (src) => {
        if (navigator.share) {
            try {
                await navigator.share({ url: src });
            } catch (err) {
                alert('Share failed:', err.message);
            }
        } else {
            navigator.clipboard.writeText(src);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    return (
        <>
            {user && <FeedNavbar user={user} />}
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-10" id="album">
                <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">Photo & Video Album</h2>
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                    {mediaItems.map((item, index) => (
                        <div key={index} className="break-inside-avoid cursor-pointer" onClick={() => setModalIndex(index)}>
                            {item.type === 'image' ? (
                                <img src={item.src} alt={item.alt} className="w-full rounded-lg hover:opacity-90 transition" loading="lazy" />
                            ) : (
                                <video src={item.src} className="w-full rounded-lg" muted playsInline preload="metadata" />
                            )}
                        </div>
                    ))}
                </div>

                {modalIndex !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                        <div className="absolute top-5 right-5 flex gap-4 z-50">
                            <button onClick={closeModal}><X className="text-white w-8 h-8" /></button>
                            <button onClick={() => setModalIndex((modalIndex - 1 + mediaItems.length) % mediaItems.length)}><ArrowLeft className="text-white w-8 h-8" /></button>
                            <button onClick={() => setModalIndex((modalIndex + 1) % mediaItems.length)}><ArrowRight className="text-white w-8 h-8" /></button>
                            <button onClick={() => downloadMedia(mediaItems[modalIndex].src)}><Download className="text-white w-8 h-8" /></button>
                            <button onClick={() => shareMedia(mediaItems[modalIndex].src)}><Share2 className="text-white w-8 h-8" /></button>
                        </div>

                        <div onClick={() => setZoomed(!zoomed)} className={`max-w-full max-h-full overflow-hidden ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} flex items-center justify-center`}>
                            {mediaItems[modalIndex].type === 'image' ? (
                                <img src={mediaItems[modalIndex].src} alt={mediaItems[modalIndex].alt} className={`transition duration-300 ${zoomed ? 'scale-150' : 'scale-100'} object-contain max-w-full max-h-screen`} />
                            ) : (
                                <video src={mediaItems[modalIndex].src} controls autoPlay className="object-contain max-w-full max-h-screen rounded-lg" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Album;