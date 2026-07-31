"use client";

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Trash2, GripHorizontal, Loader2, Type, 
  Settings2, Baseline, AlignLeft, AlignCenter, AlignRight, QrCode, Eye,
  CalendarDays,UserCircle2
} from 'lucide-react';
import { getCertificateTemplate, updateCertificateTemplate } from '@/app/lib/utilities/apis';
import CertificatePreviewModal from '@/app/(admin)/components/certificateModel';
import { AnimatePresence } from 'framer-motion';
 
type Placeholder = {
  id: string;
  type: 'text' | 'qr' |'photo';
  key: string;
  x: number;
  y: number;
  fontSize: string;
  fontColor: string;
  align: 'left' | 'center' | 'right';
  fontFamily: string;
   // Photo-only fields
   photoWidth?: number;
   photoHeight?: number;
   photoShape?: 'circle' | 'square';
};

const PREVIEW_DATA: Record<string, string> = {
  '{{name}}': 'Dr. Sarah Venkata Reddy',
  '{{date}}': 'August 15, 2026',
  '{{registrationNum}}' : 'EAAP/LTM/2026/0001',
  '{{eventName}}': 'Annual Clinical Embryology Symposium',
  '{{id}}': 'CERT-123456789',
  '{{photo}}': 'https://i.pravatar.cc/300'
};

export default function CertificateEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [template, setTemplate] = useState<any>(null);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreviewText, setShowPreviewText] = useState(false);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  
  const [imageNativeSize, setImageNativeSize] = useState({ w: 0, h: 0 });
  const [renderScale, setRenderScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ id: string, startX: number, startY: number, initialElX: number, initialElY: number } | null>(null);

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  // Robust Scale Calculator to keep everything perfectly locked
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

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const data = await getCertificateTemplate(id);
      setTemplate(data);
      setPlaceholders(data.placeholders || []);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateCertificateTemplate(id, { name: template.name, placeholders });
      alert('Coordinates & Template saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const addPlaceholder = (type: 'text' | 'qr' | 'photo', defaultKey: string) => {
    const newPh: Placeholder = {
      id: `${type}_${Date.now()}`,
      type,
      key: defaultKey,
      x: imageNativeSize.w ? imageNativeSize.w / 2 : 500,
      y: imageNativeSize.h ? imageNativeSize.h / 2 : 500,
      fontSize: type === 'qr' ? '200px' : '60px',
      fontColor: '#1a365d',
      align: 'center',
      fontFamily: 'serif',
      // Photo defaults
      ...(type === 'photo' && { photoWidth: 200, photoHeight: 200, photoShape: 'circle' })
    };
    setPlaceholders([...placeholders, newPh]);
    setSelectedId(newPh.id);
  };

  const updateSelected = (updates: Partial<Placeholder>) => {
    setPlaceholders(phs => phs.map(p => p.id === selectedId ? { ...p, ...updates } : p));
  };

  const removeSelected = () => {
    setPlaceholders(phs => phs.filter(p => p.id !== selectedId));
    setSelectedId(null);
  };

  // --- Pixel-Perfect Dragging Logic ---
  const handlePointerDown = (e: React.PointerEvent, phId: string, currentNativeX: number, currentNativeY: number) => {
    e.stopPropagation();
    setSelectedId(phId);
    if (!containerRef.current || !imageNativeSize.w) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = { id: phId, startX: e.clientX, startY: e.clientY, initialElX: currentNativeX, initialElY: currentNativeY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !containerRef.current || !imageNativeSize.w) return;

    const currentDraggingId = draggingRef.current.id;
    const screenDx = e.clientX - draggingRef.current.startX;
    const screenDy = e.clientY - draggingRef.current.startY;

    // Convert exact screen movement back to native image pixels
    const currentScale = containerRef.current.clientWidth / imageNativeSize.w;
    const newNativeX = Math.round(draggingRef.current.initialElX + (screenDx / currentScale));
    const newNativeY = Math.round(draggingRef.current.initialElY + (screenDy / currentScale));

    setPlaceholders(phs => phs.map(p => p.id === currentDraggingId ? { ...p, x: newNativeX, y: newNativeY } : p));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      draggingRef.current = null;
    }
  };

  // Keyboard Nudging
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId || (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) return;
      const step = e.shiftKey ? 10 : 1;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setPlaceholders(phs => phs.map(p => {
          if (p.id !== selectedId) return p;
          if (e.key === 'ArrowUp') return { ...p, y: p.y - step };
          if (e.key === 'ArrowDown') return { ...p, y: p.y + step };
          if (e.key === 'ArrowLeft') return { ...p, x: p.x - step };
          if (e.key === 'ArrowRight') return { ...p, x: p.x + step };
          return p;
        }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const selectedPh = placeholders.find(p => p.id === selectedId);

  if (isLoading) return <div className="w-full h-[80vh] flex flex-col items-center justify-center"><Loader2 className="w-10 h-10 text-[#0096a4] animate-spin mb-4" /><p className="text-slate-500 font-bold">Loading Canvas...</p></div>;

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-100px)] rounded-3xl overflow-hidden flex flex-col border border-slate-200 shadow-xl">
      
      {/* Top Navbar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4 w-1/3">
          <Link href="/admin/certificates" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors border border-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <input 
            type="text" value={template?.name || ''} onChange={e => setTemplate({...template, name: e.target.value})}
            className="text-lg font-bold text-[#1a365d] bg-transparent border border-transparent hover:border-slate-200 outline-none focus:bg-slate-50 focus:border-[#0096a4] rounded-lg px-3 py-1.5 transition-all w-full"
          />
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowPreviewText(!showPreviewText)}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${showPreviewText ? 'bg-[#0096a4]/10 text-[#0096a4] border-[#0096a4]/30' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
           >
             <Eye className="w-4 h-4" /> {showPreviewText ? 'Previewing Data' : 'Simulate Data'}
           </button>
           <button 
             onClick={() => setIsRenderModalOpen(true)}
             className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md"
           >
             Render & Download
           </button>
           <button 
             onClick={handleSave} disabled={isSaving}
             className="flex items-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#0096a4] hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-md"
           >
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Layout
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar - Elements List */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Add Elements</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => addPlaceholder('text', '{{name}}')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-[#0096a4] hover:bg-[#0096a4]/5 text-[#1a365d] hover:text-[#0096a4] transition-all bg-slate-50 shadow-sm">
                <Type className="w-5 h-5 mb-1.5" /> <span className="text-[10px] font-bold uppercase tracking-wide">Name</span>
              </button>
              <button onClick={() => addPlaceholder('text', '{{date}}')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-[#0096a4] hover:bg-[#0096a4]/5 text-[#1a365d] hover:text-[#0096a4] transition-all bg-slate-50 shadow-sm">
                <CalendarDays className="w-5 h-5 mb-1.5" /> <span className="text-[10px] font-bold uppercase tracking-wide">Date</span>
              </button>
              <button onClick={() => addPlaceholder('text', '{{eventName}}')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-[#0096a4] hover:bg-[#0096a4]/5 text-[#1a365d] hover:text-[#0096a4] transition-all bg-slate-50 shadow-sm">
                <Baseline className="w-5 h-5 mb-1.5" /> <span className="text-[10px] font-bold uppercase tracking-wide">Event Name</span>
              </button>
              <button onClick={() => addPlaceholder('qr', '{{id}}')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-[#0096a4] hover:bg-[#0096a4]/5 text-[#1a365d] hover:text-[#0096a4] transition-all bg-slate-50 shadow-sm">
                <QrCode className="w-5 h-5 mb-1.5" /> <span className="text-[10px] font-bold uppercase tracking-wide">QR Code</span>
              </button>
              <button onClick={() => addPlaceholder('photo', '{{photo}}')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-[#0096a4] hover:bg-[#0096a4]/5 text-[#1a365d] hover:text-[#0096a4] transition-all bg-slate-50 shadow-sm">
                <UserCircle2 className="w-5 h-5 mb-1.5" /> <span className="text-[10px] font-bold uppercase tracking-wide">Photo</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">Layers <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500">{placeholders.length}</span></h3>
            <div className="space-y-3">
              {placeholders.map(ph => (
                <div key={ph.id} onClick={() => setSelectedId(ph.id)} className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all shadow-sm ${selectedId === ph.id ? 'border-[#0096a4] bg-[#0096a4]/5 text-[#0096a4] shadow-[#0096a4]/10' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3 truncate">
                    <div className={`p-1.5 rounded-md ${selectedId === ph.id ? 'bg-[#0096a4]/10' : 'bg-slate-100'}`}>
                    {ph.type === 'qr' 
                        ? <QrCode className="w-4 h-4 shrink-0" /> 
                        : ph.type === 'photo' 
                          ? <UserCircle2 className="w-4 h-4 shrink-0" />
                          : <Type className="w-4 h-4 shrink-0" />
                      }</div>
                    <span className="text-sm font-bold truncate">{ph.key}</span>
                  </div>
                  <GripHorizontal className={`w-4 h-4 ${selectedId === ph.id ? 'opacity-100' : 'opacity-30'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 overflow-auto bg-slate-200/50 flex flex-col items-center justify-center p-8 relative custom-scrollbar" onClick={() => setSelectedId(null)}>
          {template?.backgroundUrl && (
            <div 
              ref={containerRef}
              className="relative shadow-[0_10px_50px_rgba(0,0,0,0.15)] bg-white select-none overflow-hidden"
              style={{
                width: '100%',
                maxWidth: '1200px', // Prevent it from stretching infinitely on ultrawides
                aspectRatio: imageNativeSize.w && imageNativeSize.h ? `${imageNativeSize.w}/${imageNativeSize.h}` : 'auto'
              }}
            >
              <img 
                src={template.backgroundUrl} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  setImageNativeSize({ w: img.naturalWidth, h: img.naturalHeight });
                }}
              />
              
              {/* Dynamic Coordinate Rendering */}
              {imageNativeSize.w > 0 && placeholders.map(ph => {
                const isSelected = selectedId === ph.id;
                const displayText = showPreviewText ? (PREVIEW_DATA[ph.key] || ph.key) : ph.key;
                
                return (
                  <div
                    key={ph.id}
                    onPointerDown={(e) => handlePointerDown(e, ph.id, ph.x, ph.y)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className={`absolute cursor-move transition-colors duration-75 ${isSelected ? 'border-2 border-blue-500 bg-blue-500/10 z-20' : 'border border-transparent hover:border-blue-400 hover:border-dashed z-10'}`}
                    style={{
                      left: `${ph.x * renderScale}px`,
                      top: `${ph.y * renderScale}px`,
                      transform: ph.type === 'photo'
                    ? 'translate(-50%, -50%)'
                    : ph.align === 'center' ? 'translate(-50%, -50%)' 
                    : ph.align === 'right' ? 'translate(-100%, -50%)' 
                    : 'translate(0, -50%)',

                      fontSize: `${parseFloat(ph.fontSize) * renderScale}px`,
                      color: ph.fontColor,
                      fontFamily: ph.fontFamily,
                      textAlign: ph.align,
                      whiteSpace: 'nowrap',
                      touchAction: 'none' 
                    }}
                  >
                    {ph.type === 'photo' ? (
                          <div
                            className="border-2 border-dashed border-purple-400 bg-purple-50/40 flex flex-col items-center justify-center overflow-hidden"
                            style={{
                              width: `${(ph.photoWidth ?? 200) * renderScale}px`,
                              height: `${(ph.photoHeight ?? 200) * renderScale}px`,
                              borderRadius: ph.photoShape === 'circle' ? '50%' : '8px',
                            }}
                          >
                            {showPreviewText 
                              ? <img src={PREVIEW_DATA['{{photo}}']} alt="Preview" className="w-full h-full object-cover" style={{ borderRadius: ph.photoShape === 'circle' ? '50%' : '8px' }} />
                              : <UserCircle2 className="text-purple-300 w-1/2 h-1/2" />
                            }
                          </div>
                        ) : ph.type === 'qr' ? (
                       <div className="bg-white p-1 rounded-sm border border-slate-200 flex items-center justify-center shadow-sm" style={{ width: `${parseFloat(ph.fontSize) * renderScale}px`, height: `${parseFloat(ph.fontSize) * renderScale}px` }}>
                          <QrCode className="w-full h-full text-slate-800" />
                       </div>
                    ) : (
                       <span style={{ textShadow: showPreviewText ? 'none' : '0 0 2px rgba(255,255,255,0.8)' }}>{displayText}</span>
                    )}
                    {isSelected && (
                      <div className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-md" 
                        style={{ top: '50%', transform: 'translateY(-50%)', left: ph.align === 'center' ? '50%' : ph.align === 'right' ? '100%' : '0', marginLeft: '-6px' }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto shrink-0 z-10 custom-scrollbar shadow-sm">
          <div className="p-6">
            <h3 className="text-base font-bold text-[#1a365d] flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <Settings2 className="w-5 h-5 text-[#0096a4]" /> Settings
            </h3>
            
            {selectedPh ? (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Display Data Variable</label>
                  <input type="text" value={selectedPh.key} onChange={e => updateSelected({ key: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-[#1a365d] focus:ring-2 focus:ring-[#0096a4]/20 outline-none shadow-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">X Coord (Native Px)</label>
                    <input type="number" value={selectedPh.x} onChange={e => updateSelected({ x: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0096a4]/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Y Coord (Native Px)</label>
                    <input type="number" value={selectedPh.y} onChange={e => updateSelected({ y: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0096a4]/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Size / Width (Px)</label>
                    <input type="number" value={selectedPh.fontSize.replace('px','')} onChange={e => updateSelected({ fontSize: `${e.target.value}px` })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0096a4]/20 outline-none" />
                  </div>
                  {selectedPh.type === 'text' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={selectedPh.fontColor} onChange={e => updateSelected({ fontColor: e.target.value })} className="w-10 h-10 rounded-xl cursor-pointer border-none p-0 shrink-0" />
                        <input type="text" value={selectedPh.fontColor} onChange={e => updateSelected({ fontColor: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 uppercase focus:ring-2 focus:ring-[#0096a4]/20 outline-none" />
                      </div>
                    </div>
                  )}
                </div>

                {selectedPh.type === 'text' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Font Family</label>
                      <select value={selectedPh.fontFamily} onChange={e => updateSelected({ fontFamily: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0096a4]/20 outline-none appearance-none">
                        <option value="serif">Serif (Classic & Formal)</option>
                        <option value="sans-serif">Sans-Serif (Modern)</option>
                        <option value="monospace">Monospace</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Text Pivot Alignment</label>
                      <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-inner">
                        <button onClick={() => updateSelected({ align: 'left' })} className={`flex-1 flex justify-center py-2.5 rounded-lg transition-all ${selectedPh.align === 'left' ? 'bg-white shadow-md text-[#0096a4]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}><AlignLeft className="w-4 h-4" /></button>
                        <button onClick={() => updateSelected({ align: 'center' })} className={`flex-1 flex justify-center py-2.5 rounded-lg transition-all ${selectedPh.align === 'center' ? 'bg-white shadow-md text-[#0096a4]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}><AlignCenter className="w-4 h-4" /></button>
                        <button onClick={() => updateSelected({ align: 'right' })} className={`flex-1 flex justify-center py-2.5 rounded-lg transition-all ${selectedPh.align === 'right' ? 'bg-white shadow-md text-[#0096a4]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}><AlignRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </>
                )}
                {selectedPh.type === 'photo' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Width (Native Px)</label>
                            <input 
                              type="number" 
                              value={selectedPh.photoWidth ?? 200} 
                              onChange={e => updateSelected({ photoWidth: Number(e.target.value) })} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0096a4]/20 outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Height (Native Px)</label>
                            <input 
                              type="number" 
                              value={selectedPh.photoHeight ?? 200} 
                              onChange={e => updateSelected({ photoHeight: Number(e.target.value) })} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0096a4]/20 outline-none" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Photo Shape</label>
                          <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-inner gap-2">
                            <button 
                              onClick={() => updateSelected({ photoShape: 'circle' })} 
                              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedPh.photoShape === 'circle' ? 'bg-white shadow-md text-[#0096a4]' : 'text-slate-400 hover:text-slate-600'}`}
                            >⬤ Circle</button>
                            <button 
                              onClick={() => updateSelected({ photoShape: 'square' })} 
                              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedPh.photoShape === 'square' ? 'bg-white shadow-md text-[#0096a4]' : 'text-slate-400 hover:text-slate-600'}`}
                            >■ Square</button>
                          </div>
                        </div>
                      </div>
                    )}

                <div className="pt-8 border-t border-slate-100 mt-8">
                  <button onClick={removeSelected} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-all shadow-sm">
                    <Trash2 className="w-4 h-4" /> Delete Element
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <GripHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-500">Select an element on the canvas to edit properties.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Modal passed down with local template state */}
      <AnimatePresence>
        {isRenderModalOpen && (
          <CertificatePreviewModal 
            isOpen={isRenderModalOpen}
            onClose={() => setIsRenderModalOpen(false)}
            previewData={{
              backgroundUrl: template?.backgroundUrl,
              renderData: placeholders.map(p => ({
                ...p, 
                text: PREVIEW_DATA[p.key] || p.key
              }))
            }}
            isLoading={false}
            title="Download Certificate Template"
          />
        )}
      </AnimatePresence>
    </div>
  );
}