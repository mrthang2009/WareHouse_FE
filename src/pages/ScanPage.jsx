// import styles from "./stylesPage/ScanPage.module.scss"
import { useState } from "react";
import QrScanner from "react-qr-scanner";
const ScanPage = () => {
  const [result, setResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      console.log('««««« result »»»»»', result);
    }
  };

  const handleError = (error) => {
    console.error("Error while scanning QR code:", error);
  };

  return (
    <main className="container">
      <QrScanner
        onScan={handleScan}
        onError={handleError}
        style={{ width: "50%", aspectRatio: "1/1" }} // Thiết lập aspect ratio để tạo thành hình vuông
        idealFacingMode={2} // Sử dụng 1 để chọn camera phía sau, 2 để chọn camera phía trước
      />
      <p>{result && result.text}</p>
    </main>
  );
};

export default ScanPage;
