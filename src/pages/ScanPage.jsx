// import styles from "./stylesPage/ScanPage.module.scss"
import{ useState } from "react";
import QrReader from "react-qr-reader";
const ScanPage = () => {
  const [result, setResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      // Bạn có thể thực hiện các xử lý với dữ liệu QR ở đây
    }
  };

  const handleError = (error) => {
    console.error("Error while scanning QR code:", error);
  };

  return (
    <main className="container">
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <p>Result: {result}</p>
    </main>
  );
};

export default ScanPage;
