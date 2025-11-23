import React, { useRef, useState, useEffect } from 'react';
import { Course, User } from '../types';
import { Button } from './Button';

interface CertificateProps {
  user: User;
  course: Course;
  onClose: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ user, course, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(1);
  
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Auto-scale logic to fit the fixed-size certificate into the viewport
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const certificateWidth = 1123; // Fixed A4 width in pixels
        const padding = 32; // buffer
        // Calculate scale, max 1, maintain aspect ratio
        const newScale = Math.min((parentWidth - padding) / certificateWidth, 1);
        setScale(Math.max(newScale, 0.1)); // Prevent scale from being 0 or negative
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = async () => {
      if (!certificateRef.current) return;
      
      setIsGenerating(true);
      
      const element = certificateRef.current;
      const filename = `Certificate - ${user.name} - ${course.title}.pdf`;
      
      // Configuration for html2pdf
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, // 2x scale for Retina-like quality
            useCORS: true,
            logging: false,
            scrollY: 0,
        },
        jsPDF: { unit: 'px', format: [1123, 794], orientation: 'landscape' } // Exact A4 landscape dimensions
      };

      try {
          // @ts-ignore
          if (window.html2pdf) {
             // html2pdf uses html2canvas which captures the element as-is.
             // Since we are capturing 'certificateRef' which is the inner un-transformed div,
             // it captures the full resolution 1123px wide element regardless of screen scale.
             // @ts-ignore
             await window.html2pdf().set(opt).from(element).save();
          } else {
              // Fallback
              window.print();
          }
      } catch (error) {
          console.error('PDF Generation Error:', error);
          alert('Could not generate PDF. Please try printing to PDF instead.');
          window.print();
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-8 px-4 relative overflow-y-auto">
       {/* Close Button */}
       <button 
         onClick={onClose}
         className="absolute top-6 right-6 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors backdrop-blur-sm"
       >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
       </button>

       <div className="w-full max-w-7xl flex flex-col items-center gap-8 z-10">
           
           <div className="text-center text-white space-y-2 mt-8 sm:mt-0">
               <h1 className="text-3xl font-bold">Course Completion Certificate</h1>
               <p className="text-indigo-200">Review and download your official credential.</p>
           </div>

           {/* Viewport Container */}
           <div 
             ref={containerRef} 
             className="w-full flex justify-center items-center overflow-hidden relative"
             style={{ height: `${794 * scale}px`, minHeight: '300px' }}
           >
               {/* Scalable Wrapper with Scale Transform */}
               <div 
                 style={{ 
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    width: '1123px',
                    height: '794px',
                    position: 'absolute' 
                 }}
                 className="shadow-2xl"
               >
                   {/* Actual Certificate Element (Fixed Dimensions: A4 Landscape @ 96DPI) */}
                   <div 
                      ref={certificateRef}
                      className="w-[1123px] h-[794px] bg-white relative flex flex-col text-gray-900 overflow-hidden"
                      style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)' }}
                   >
                      {/* Border Decoration */}
                      <div className="absolute inset-4 border-[3px] border-double border-indigo-900/20 pointer-events-none"></div>
                      <div className="absolute inset-6 border border-indigo-900/10 pointer-events-none"></div>
                      
                      {/* Corner Ornaments */}
                      <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-indigo-900 opacity-20"></div>
                      <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-indigo-900 opacity-20"></div>
                      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-indigo-900 opacity-20"></div>
                      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-indigo-900 opacity-20"></div>

                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                         <span className="text-[150px] font-serif font-bold text-indigo-950 transform -rotate-12 whitespace-nowrap select-none">
                            DEEPMETRIC
                         </span>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col items-center justify-between py-16 px-24 text-center">
                          
                          {/* Header */}
                          <div className="flex flex-col items-center">
                              <div className="w-20 h-20 bg-indigo-900 text-white flex items-center justify-center rounded-full mb-6 shadow-lg">
                                  <span className="text-4xl font-bold font-serif">D</span>
                              </div>
                              <h2 className="text-indigo-900 font-bold text-lg tracking-[0.3em] uppercase mb-2">Deepmetric Analytics Institute</h2>
                              <h1 className="text-6xl font-serif text-gray-900 mb-2">Certificate of Completion</h1>
                              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                          </div>

                          {/* Body */}
                          <div className="space-y-6 my-4">
                              <p className="text-xl text-gray-500 font-light italic">This is to certify that</p>
                              <h3 className="text-5xl font-bold text-indigo-700 font-serif px-8 py-2 border-b border-gray-200 inline-block min-w-[400px]">
                                  {user.name}
                              </h3>
                              <p className="text-xl text-gray-500 font-light italic">has satisfactorily completed the comprehensive course on</p>
                              <h4 className="text-4xl font-bold text-gray-900 font-serif max-w-4xl leading-tight">
                                  {course.title}
                              </h4>
                          </div>

                          {/* Footer / Signatures */}
                          <div className="w-full flex justify-between items-end pt-12 px-12">
                              <div className="flex flex-col items-center w-64">
                                  <div className="mb-2 font-serif text-2xl text-indigo-900 italic relative px-8">
                                     <span className="absolute -top-8 left-10 text-6xl text-indigo-900/10 font-cursive" style={{ fontFamily: 'cursive' }}>Signature</span>
                                     {course.instructor}
                                  </div>
                                  <div className="h-px w-full bg-gray-400"></div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Lead Instructor</p>
                              </div>

                              {/* Gold Seal */}
                              <div className="relative w-32 h-32 flex items-center justify-center">
                                  <div className="absolute inset-0 bg-yellow-500 rounded-full shadow-lg opacity-20"></div>
                                  <div className="w-28 h-28 border-4 border-yellow-600/50 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-inner relative overflow-hidden">
                                      <div className="absolute inset-0 border-2 border-yellow-600/30 rounded-full border-dashed m-1"></div>
                                      <div className="text-center transform -rotate-6">
                                          <span className="block text-xs font-bold text-yellow-800 tracking-widest uppercase">Official</span>
                                          <span className="block text-2xl font-serif font-bold text-yellow-900">Seal</span>
                                          <span className="block text-[10px] font-bold text-yellow-800 tracking-widest uppercase">Verified</span>
                                      </div>
                                  </div>
                              </div>

                              <div className="flex flex-col items-center w-64">
                                   <div className="mb-2 font-serif text-xl text-gray-800 relative">
                                      {today}
                                  </div>
                                  <div className="h-px w-full bg-gray-400"></div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Date Issued</p>
                              </div>
                          </div>

                      </div>
                   </div>
               </div>
           </div>

           {/* Action Buttons */}
           <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md pb-12">
                <Button 
                    onClick={handleDownload} 
                    className="flex-1 flex items-center justify-center gap-2 py-4 text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all"
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                             Download PDF Certificate
                        </>
                    )}
                </Button>
           </div>
       </div>
       
       {/* Background Pattern */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
  );
};