// import styles from "./stylesPage/ScanPage.module.scss"
import { useState } from "react";
import QrScanner from "react-qr-scanner";
const ScanPage = () => {
  const [result, setResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setResult(data);
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
        style={{ width: "100%" }}
        facingMode="environment" // Chọn camera ở phía sau
      />
      <p>Result: {result}</p>
    </main>
  );
};

export default ScanPage;
