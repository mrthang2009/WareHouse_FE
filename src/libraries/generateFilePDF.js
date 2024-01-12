// import numeral from "numeral";
// import "numeral/locales/vi";
// numeral.locale("vi");
// import "jspdf-autotable";
// import html2pdf from "html2pdf.js";

// const generateFilePDF = (data) => {
//   const content = `
//       <html>
//         <head>
//           <style>
//           h1 {
//             text-align: center;
//           }
//             table { width: 100%; text-align: center}
//           </style>
//         </head>
//         <body>
//           <h1>Danh sách sản phẩm</h1>
//           <table>
//             <thead>
//               <tr>
//                 <th>STT</th>
//                 <th>Tên sản phẩm</th>
//                 <th>Mã QR code</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${data
//                 .map(
//                   (item, index) => `
//                     <tr>
//                       <td>${index + 1}</td>
//                       <td>${item.name}</td>
//                       <td><img src="${item.media?.qrCodeUrl}" alt="QR Code">
//                       <p>${item.name}</p></td>
//                     </tr>
//                   `
//                 )
//                 .join("")}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;
//   const options = {
//     margin: 10,
//     filename: "Danh sách sản phẩm.pdf",
//     image: { type: "image/png", quality: 1 },
//     html2canvas: {
//       scale: 2,
//       useCORS: true, // Thêm tùy chọn này để buộc sử dụng CORS
//     },
//     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//   };

//   html2pdf().set(options).from(content).save();
// };
// export default generateFilePDF;

import "numeral/locales/vi";
import "jspdf-autotable";
import html2pdf from "html2pdf.js";
import QRCode from "qrcode-generator";

const generateFilePDF = (data) => {
  const content = `
    <html>
      <head>
        <style>
          h1 {
            text-align: center;
          }
          table {
            width: 100%;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>Danh sách sản phẩm</h1>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th>Mã QR code</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map((item, index) => {
                // Tạo mã QR
                const qrCodeData = JSON.stringify({
                  productId: item._id,
                });
                const qrCode = QRCode(0, "L");
                qrCode.addData(qrCodeData);
                qrCode.make();
                const qrDataURL = qrCode.createDataURL();

                return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.name}</td>
                      <td>
                        <img style="width: 60%" src="${qrDataURL}" alt="QR Code">
                        <p>${item.name}</p>
                      </td>
                    </tr>
                  `;
              })
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const options = {
    margin: 10,
    filename: "Danh sách sản phẩm.pdf",
    image: { type: "image/png", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(content).save();
};

export default generateFilePDF;
