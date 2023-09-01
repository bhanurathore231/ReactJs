import React,{useState} from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = () => {
    const [qrCodeData, setQRCodeData] = useState(null);
    const [error, setError] = useState(null);
  const handleScan = (data) => {
    if (data) {
      console.log('QR code scanned:', data);
      setQRCodeData(data);
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code:', error);
    setError(err);
  };
  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrReader
      delay={300}
      onError={handleError}
      onScan={handleScan}
      style={{ width: '100%' }}
    />
    {error && <p>Error scanning QR code: {error.message}</p>}
      {qrCodeData && <p>QR code scanned: {qrCodeData}</p>}
    </div>
  );
};

export default QRCodeScanner;