// app/lib/utilities/certificateGenerator.ts

export const renderAndDownloadCertificate = async (
    backgroundUrl: string,
    renderData: any[],
    action: 'preview' | 'download' = 'preview',
    fileName: string = 'certificate.png'
  ) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // CRITICAL: Supabase S3 bucket MUST have CORS configured to allow GET requests for this to work
      img.crossOrigin = 'Anonymous'; 
      img.src = `${backgroundUrl}&nocache=${new Date().getTime()}`;
  
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return reject(new Error('Failed to get canvas context'));
  
        ctx.drawImage(img, 0, 0);
  
        for (const item of renderData) {
          if (item.type === 'text') {
            ctx.font = `${item.fontSize} ${item.fontFamily || 'serif'}`;
            ctx.fillStyle = item.fontColor || '#000000';
            ctx.textAlign = item.align || 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.text || item.key, item.x, item.y);
          } else if (item.type === 'qr') {
            const qrSize = parseInt(item.fontSize) || 150;
            // Using free API to generate QR code on the fly
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(item.text || item.key)}`;
            
            try {
              const qrImg = new Image();
              qrImg.crossOrigin = 'Anonymous';
              qrImg.src = qrUrl;
              await new Promise((res, rej) => {
                qrImg.onload = res;
                qrImg.onerror = rej;
              });
  
              let drawX = item.x;
              if (item.align === 'center') drawX -= qrSize / 2;
              if (item.align === 'right') drawX -= qrSize;
              let drawY = item.y - (qrSize / 2);
              
              ctx.drawImage(qrImg, drawX, drawY, qrSize, qrSize);
            } catch (e) {
              console.error("Failed to load QR code image", e);
            }
          }
        }
  
        try {
          const dataUrl = canvas.toDataURL('image/png');
          
          if (action === 'download') {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            const win = window.open();
            if (win) {
              win.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
            }
          }
          resolve(true);
        } catch (e) {
          reject(new Error('Canvas tainted by CORS. Ensure Supabase storage has CORS enabled.'));
        }
      };
  
      img.onerror = () => reject(new Error('Failed to load background image. Check URL or CORS settings.'));
    });
  };