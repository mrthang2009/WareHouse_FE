import numeral from "numeral";
import "numeral/locales/vi";
numeral.locale("vi");
import "jspdf-autotable";
import html2pdf from "html2pdf.js";

const generateFilePDF = (data) => {
  const content = `
      <html>
        <head>
          <style>
          h1 {
            text-align: center;
          }
            table { width: 100%; text-align: center}
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
                .map(
                  (item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.name}</td>
                      <td><img src="${item.media?.qrCodeUrl}" alt="QR Code">
                      <p>${item.name}</p></td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
  const options = {
    margin: 10,
    filename: "Danh sách sản phẩm.pdf",
    image: { type: "png", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true, // Thêm tùy chọn này để buộc sử dụng CORS
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(content).set(options).save();
};
export default generateFilePDF;

// import { PDFViewer, Document, Page, Text, View, Image } from 'react-pdf-viewer';
// import { saveAs } from 'file-saver';
// import numeral from 'numeral';
// import PropTypes from "prop-types";
// const PDFDocument = ({ data }) => (
//   <Document>
//     <Page>
//       <View>
//         <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 16 }}>
//           Danh sách sản phẩm
//         </Text>
//         <table>
//           <thead>
//             <tr>
//               <th>STT</th>
//               <th>Tên sản phẩm</th>
//               <th>Mã QR code</th>
//               <th>Danh mục</th>
//               <th>Giá</th>
//               <th>Giảm giá</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>
//                   <ImageComponent src={item.qrCode?.qrCodeUrl} alt="QR Code" />
//                 </td>
//                 <td>{item.category?.name}</td>
//                 <td>{numeral(item.price).format('0,0$')}</td>
//                 <td>{item.discount}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </View>
//     </Page>
//   </Document>
// );

// const ImageComponent = ({ src, alt }) => (
//   <View>
//     <Image src={src} style={{ width: 50, height: 50 }} />
//     <Text>{alt}</Text>
//   </View>
// );

// const generateFilePDF = (data) => {
//   const blob = (
//     <PDFViewer width="1000px" height="600px">
//       <PDFDocument data={data} />
//     </PDFViewer>
//   ).toBlob();
//   saveAs(blob, 'Danh sách sản phẩm.pdf');
// };
// PDFDocument.propTypes = {
//   data: PropTypes.array.isRequired,
// };
// ImageComponent.propTypes = {
//   src: PropTypes.string.isRequired,
//   alt: PropTypes.string.isRequired,
// };

// export default generateFilePDF;

//export file excel
// import ExcelJS from 'exceljs';
// import saveAs from 'file-saver';

// const generateFilePDF = (data) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Sheet 1');

//   // Tùy chỉnh cấu trúc HTML trong file Excel
//   worksheet.addRow(['Danh sách sản phẩm']).font = { size: 16, bold: true };
//   worksheet.addRow(['Địa chỉ:']).font = { size: 14 };
//   worksheet.addRow([]); // Dòng trống để tạo khoảng cách

//   // Tiêu đề cột
//   const headerRow = worksheet.addRow(['STT', 'Tên sản phẩm', 'Tồn kho', 'Danh mục', 'Giá', 'Giảm giá']);
//   headerRow.font = { size: 14, bold: true };

//   // Dữ liệu
//   data.forEach((item, index) => {
//     worksheet.addRow([
//       index + 1,
//       item.name,
//       item.stock,
//       item.category?.name,
//       numeral(item.price).format('0,0$'),
//       `${item.discount}%`,
//     ]);
//   });

//   // Tạo file Excel và tải về
//   workbook.xlsx.writeBuffer().then((buffer) => {
//     saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'Danh_sach_san_pham.xlsx');
//   });
// };
