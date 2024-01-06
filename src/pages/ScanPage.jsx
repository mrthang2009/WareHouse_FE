// import styles from "./stylesPage/ScanPage.module.scss"
// import { useState } from "react";
// import QrScanner from "react-qr-scanner";
// const ScanPage = () => {
//   const [result, setResult] = useState("");

//   const handleScan = (data) => {
//     if (data) {
//       setResult(data);
//     }
//   };

//   const handleError = (error) => {
//     console.error("Error while scanning QR code:", error);
//   };

//   return (
//     <main className="container">
//       <QrScanner
//         onScan={handleScan}
//         onError={handleError}
//         style={{ width: "500px", height: "500px" }}
//         facingMode="environment" // Chọn camera ở phía sau
//       />
//       <p>Result: {result}</p>
//     </main>
//   );
// };

// export default ScanPage;

import { useEffect, useRef } from "react";
import Instascan from "instascan";

const QRScanner = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startScanner = async () => {
      if (!Instascan) {
        console.error("Instascan library not found.");
        return;
      }

      try {
        const cameras = await Instascan.Camera.getCameras();

        if (cameras.length > 0) {
          const scanner = new Instascan.Scanner({ video: videoRef.current });
          scanner.addListener("scan", (content) => {
            // Xử lý dữ liệu khi quét được mã QR
            console.log("Scanned:", content);
          });
          scanner.start(cameras[0]);
        } else {
          console.error("No cameras found.");
        }
      } catch (error) {
        console.error("Error getting cameras:", error);
      }
    };

    startScanner();

    // Dọn sạch khi component unmount
    return () => {
      Instascan.Camera.getCameras().then((cameras) => {
        if (cameras.length > 0) {
          const scanner = new Instascan.Scanner({ video: videoRef.current });
          scanner.stop();
        }
      });
    };
  }, [videoRef]);

  return <video ref={videoRef} />;
};

const ScanPage = () => {
  return (
    <main className="container">
      <QRScanner />
    </main>
  );
};

export default ScanPage;
