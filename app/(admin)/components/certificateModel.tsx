import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Loader2, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf'; // <-- ADD THIS IMPORT

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: { backgroundUrl: string; renderData: any[] } | null;
  isLoading: boolean;
  title?: string;
}

export default function CertificatePreviewModal({ isOpen, onClose, previewData, isLoading, title = "Certificate Preview" }: CertificatePreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageNativeSize, setImageNativeSize] = useState({ w: 0, h: 0 });
  const [renderScale, setRenderScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync scale perfectly with screen resizes
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && imageNativeSize.w > 0) {
        setRenderScale(containerRef.current.clientWidth / imageNativeSize.w);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [imageNativeSize.w]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!previewData?.backgroundUrl) return;
    try {
      setIsDownloading(true);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Failed to initialize canvas");

      // Load Background Image securely via Proxy
      const img = new Image();
      img.crossOrigin = 'anonymous'; 
      img.src = `/api/proxy-image?url=${encodeURIComponent(previewData.backgroundUrl)}`;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw Placeholders exactly at Native X/Y
      for (const item of previewData.renderData) {
        if (item.type === 'text') {
          ctx.font = `${item.fontSize} ${item.fontFamily}`;
          ctx.fillStyle = item.fontColor;
          ctx.textAlign = item.align;
          ctx.textBaseline = 'middle';
          ctx.fillText(item.text, item.x, item.y);
        } else if (item.type === 'qr') {
          const size = parseInt(item.fontSize.replace('px', '')) || 150;
          const qrImg = new Image();
          qrImg.crossOrigin = 'anonymous';
          
          // Using proxy for QR code to prevent CORS issues
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(item.text)}`;
          qrImg.src = `/api/proxy-image?url=${encodeURIComponent(qrUrl)}`;
          
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.onerror = resolve; 
          });

          let startX = item.x;
          if (item.align === 'center') startX -= size / 2;
          if (item.align === 'right') startX -= size;
          const startY = item.y - (size / 2);

          ctx.drawImage(qrImg, startX, startY, size, size);
        }
      }

      // --- NEW PDF GENERATION LOGIC ---
      
      // 1. Convert canvas to high-quality image data
      const imgData = canvas.toDataURL('image/jpeg', 1.0); 

      // 2. Determine orientation based on canvas dimensions
      const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';

      // 3. Initialize PDF matching the exact pixel dimensions of the canvas
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      // 4. Add the image to the PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

      // 5. Trigger download
      pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
      
      // --- END NEW PDF LOGIC ---
      
    } catch (error) {
      console.error(error);
      alert("Failed to generate and download the certificate. Please check console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#0f213b]/80 backdrop-blur-sm"
        onClick={() => !isDownloading && onClose()}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] border border-white/40"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <h3 className="text-xl font-bold text-[#1a365d]">{title}</h3>
          <button disabled={isDownloading} onClick={onClose} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-100 custom-scrollbar">
          {isLoading ? (
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-[#0096a4] animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Rendering Certificate...</p>
            </div>
          ) : !previewData?.backgroundUrl ? (
            <div className="text-center text-red-500">
              <AlertCircle className="w-10 h-10 mx-auto mb-4" />
              <p className="font-bold">Failed to load template data.</p>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className="relative shadow-2xl bg-white select-none overflow-hidden"
              style={{
                width: '100%',
                maxWidth: '1000px', 
                aspectRatio: imageNativeSize.w && imageNativeSize.h ? `${imageNativeSize.w}/${imageNativeSize.h}` : 'auto'
              }}
            >
              <img 
                src={previewData.backgroundUrl} 
                alt="Certificate Background" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  setImageNativeSize({ w: img.naturalWidth, h: img.naturalHeight });
                }}
              />
              
              {/* Dynamic Coordinate Rendering using the exact same logic as Editor */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                {imageNativeSize.w > 0 && previewData.renderData.map((ph: any) => {
                  return (
                    <div
                      key={ph.id}
                      className="absolute font-bold drop-shadow-sm"
                      style={{
                        left: `${ph.x * renderScale}px`,
                        top: `${ph.y * renderScale}px`,
                        transform: ph.align === 'center' ? 'translate(-50%, -50%)' : ph.align === 'right' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
                        fontSize: `${parseFloat(ph.fontSize) * renderScale}px`,
                        color: ph.fontColor,
                        fontFamily: ph.fontFamily,
                        textAlign: ph.align,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {ph.type === 'qr' ? (
                        <div className="bg-white p-1 rounded-sm shadow-sm" style={{ width: `${parseFloat(ph.fontSize) * renderScale}px`, height: `${parseFloat(ph.fontSize) * renderScale}px` }}>
                           <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ph.text)}`} alt="QR" className="w-full h-full" />
                        </div>
                      ) : (
                        ph.text
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200/50 bg-slate-50 flex justify-end gap-4">
          <button onClick={onClose} disabled={isDownloading} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            Close
          </button>
          <button 
            onClick={handleDownload} 
            disabled={isLoading || isDownloading || !previewData?.backgroundUrl || imageNativeSize.w === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1a365d] to-[#0096a4] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download Certificate
          </button>
        </div>
      </motion.div>
    </div>
  );
}