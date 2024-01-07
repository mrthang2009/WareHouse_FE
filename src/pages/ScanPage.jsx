import styles from "./stylesPage/ScanPage.module.scss";
import { useState, useEffect } from "react";
import QrScanner from "react-qr-scanner";
import axiosClient from "../libraries/axiosClient";
const ScanPage = () => {
  const [result, setResult] = useState("");
  const [productId, setProductId] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      try {
        const decodedData = JSON.parse(data.text);
        setProductId(decodedData.productId);
      } catch (error) {
        console.error("Error decoding QR code data:", error);
      }
    }
  };

  const handleError = (error) => {
    console.error("Error while scanning QR code:", error);
  };

  useEffect(() => {
    const getDetailProduct = async () => {
      if (productId) {
        try {
          const res = await axiosClient.get(`/products/${productId}`);
          setDetailProduct(res.data.payload || null);
          console.log("««««« detailProduct »»»»»", detailProduct);
        } catch (error) {
          console.error(error);
        }
      }
    };

    getDetailProduct();
  }, [productId]);

  return (
    <main className="container">
      <div className={styles.content}>
        <div className={styles.box_left}>
          <QrScanner
            delay={200}
            onScan={handleScan}
            onError={handleError}
            style={{ width: "100%" }}
          />
          <p>{result && result.text}</p>
        </div>

        <div className={styles.box_right}>
          <h3>Chi tiết sản phẩm</h3>
          {detailProduct && (
            <>
              <p>ID: {detailProduct._id}</p>
              <p>Name: {detailProduct.name}</p>
              <p>Giá: {detailProduct.price}</p>
              <p>Giảm giá: {detailProduct.discount}</p>
              {/* Thêm các thông tin khác cần hiển thị */}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ScanPage;

// import { useState, useEffect } from "react";
// import axiosClient from "../libraries/axiosClient";
// import Instascan from "instascan";

// import styles from "./stylesPage/ScanPage.module.scss";

// const ScanPage = () => {
//   const [result, setResult] = useState("");
//   const [productId, setProductId] = useState(null);
//   const [detailProduct, setDetailProduct] = useState(null);

//   useEffect(() => {
//     const startScanner = async () => {
//       try {
//         const scanner = new Instascan.Scanner({
//           video: document.getElementById("video"),
//         });

//         scanner.addListener("scan", function (content) {
//           setResult(content);
//           try {
//             const decodedData = JSON.parse(content);
//             setProductId(decodedData.productId);
//           } catch (error) {
//             console.error("Error decoding QR code data:", error);
//           }
//         });

//         const cameras = await Instascan.Camera.getCameras();
//         if (cameras.length > 0) {
//           // Sử dụng camera đầu tiên
//           scanner.start(cameras[0]);
//         } else {
//           console.error("No cameras found.");
//         }

//         return () => {
//           scanner.stop();
//         };
//       } catch (error) {
//         console.error("Error initializing scanner:", error);
//       }
//     };

//     startScanner();
//   }, []);

//   useEffect(() => {
//     const getDetailProduct = async () => {
//       if (productId) {
//         try {
//           const res = await axiosClient.get(`/products/${productId}`);
//           setDetailProduct(res.data.payload || null);
//           console.log("««««« detailProduct »»»»»", detailProduct);
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     };

//     getDetailProduct();
//   }, [productId]);

//   return (
//     <main className="container">
//       <div className={styles.content}>
//         <div className={styles.box_left}>
//           <video id="video" />
//           <p>{result && result.text}</p>
//         </div>

//         <div className={styles.box_right}>
//           <h3>Chi tiết sản phẩm</h3>
//           {detailProduct && (
//             <>
//               <p>ID: {detailProduct._id}</p>
//               <p>Name: {detailProduct.name}</p>
//               <p>Giá: {detailProduct.price}</p>
//               <p>Giảm giá: {detailProduct.discount}</p>
//               {/* Thêm các thông tin khác cần hiển thị */}
//             </>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ScanPage;
