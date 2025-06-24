import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const Barcode = () => {
  const [code, setCode] = useState(null);
  const scannerRef = useRef(null);
  const qrCodeScannerRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(scannerRef.current.id);
    qrCodeScannerRef.current = html5QrCode;

    Html5Qrcode.getCameras().then(cameras => {
      if (cameras && cameras.length) {
        // Try to find a back camera
        const backCam = cameras.find(cam => 
          cam.label.toLowerCase().includes('back') || 
          cam.label.toLowerCase().includes('environment')
        ) || cameras[0]; // fallback to first camera
        
        html5QrCode.start(
          backCam.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            setCode(decodedText);
            console.log("Detected:", decodedText);
            // Optionally stop after first detection
            // html5QrCode.stop();
          },
          (errorMessage) => {
            // console.warn("Scan error:", errorMessage);
          }
        );
      }
    }).catch(err => console.error("Camera error:", err));

    return () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.stop().catch(err => console.error("Stop error:", err));
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div id="scanner" ref={scannerRef} style={{ width: '400px' }}></div>
      {code && (
        <div style={{ marginTop: 10, background: '#333', color: '#fff', padding: '5px 10px' }}>
          Detected: {code}
        </div>
      )}
    </div>
  );
};

export default Barcode;
