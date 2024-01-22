// import { useState } from "react";
// import { Button, Upload, message, Space } from "antd";
// import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
// import * as XLSX from "xlsx";

// const ExcelReader = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [dataReaded, setDataReaded] = useState(null);
//   const handleFile = () => {
//     if (selectedFile) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });

//         // Lấy dữ liệu từ sheet
//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         // Lấy thông tin khách hàng, nhà cung cấp, địa chỉ, ngày tháng
//         const customerName = worksheet["B3"]?.v;
//         const supplierName = worksheet["B4"]?.v;
//         const address = worksheet["B5"]?.v;
//         const date = worksheet["B15"]?.v;
//         // Tạo mảng để lưu chi tiết sản phẩm
//         const productList = [];
//         let prevDanhMuc = null; // Biến để lưu giá trị của ô danhMuc của hàng trước đó

//         // Duyệt qua các dòng (từ dòng 7 trở đi vì dòng đầu tiên thường là tiêu đề)
//         for (let rowIndex = 7; ; rowIndex++) {
//           const cellAddress = `A${rowIndex}`;
//           const cell = worksheet[cellAddress];

//           // Nếu ô A của dòng không có giá trị hoặc giá trị không phải là số, dừng vòng lặp
//           if (!cell || isNaN(cell.v)) {
//             break;
//           }

//           // Lấy giá trị từ các ô của dòng
//           const stt = worksheet[`A${rowIndex}`]?.v;
//           // Lấy giá trị danhMuc từ ô B của dòng
//           let danhMuc = worksheet[`B${rowIndex}`]?.v;

//           // Nếu danhMuc của hàng hiện tại là undefined, gán giá trị từ hàng trước đó
//           if (typeof danhMuc === "undefined") {
//             danhMuc = prevDanhMuc;
//           } else {
//             // Nếu danhMuc của hàng hiện tại khác undefined, cập nhật giá trị cho biến prevDanhMuc
//             prevDanhMuc = danhMuc;
//           }
//           const tenHang = worksheet[`C${rowIndex}`]?.v;
//           const soLuong = worksheet[`D${rowIndex}`]?.v;
//           const donGia = worksheet[`E${rowIndex}`]?.v;
//           const thanhTien = worksheet[`F${rowIndex}`]?.v;
//           const giamGia = worksheet[`G${rowIndex}`]?.v;

//           // Tạo đối tượng chi tiết sản phẩm và thêm vào mảng
//           const productDetail = {
//             stt,
//             danhMuc,
//             tenHang,
//             soLuong,
//             donGia,
//             thanhTien,
//             giamGia,
//           };
//           productList.push(productDetail);
//         }

//         // Lưu thông tin vào state data
//         setDataReaded({
//           customerName,
//           supplierName,
//           address,
//           date,
//           productList,
//         });
//         // Log mảng chi tiết sản phẩm ra console
//         console.log("Dữ liệu đọc được:", dataReaded);
//       };

//       reader.readAsArrayBuffer(selectedFile);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isExcel =
//       file.type === "application/vnd.ms-excel" || // Cho file .xls
//       file.type ===
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // Cho file .xlsx

//     if (!isExcel) {
//       message.error("Chỉ chấp nhận file Excel (xls hoặc xlsx)!");
//     } else {
//       // Lưu file đã chọn vào state
//       setSelectedFile(file);
//     }

//     return false; // Ngăn chặn Ant Design Upload tự động tải lên
//   };
//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//   };

//   return (
//     <div>
//       <Upload beforeUpload={beforeUpload} showUploadList={false}>
//         {selectedFile ? (
//           <Space>
//             <p>{selectedFile.name}</p>
//             <Button
//               icon={<CloseOutlined />}
//               size="small"
//               onClick={handleRemoveFile}
//             />
//           </Space>
//         ) : (
//           <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
//         )}
//       </Upload>
//       {selectedFile && (
//         <Button onClick={handleFile} style={{ marginLeft: "10px" }}>
//           Đọc file
//         </Button>
//       )}
//     </div>
//   );
// };

// export default ExcelReader;

import { useState } from "react";
import { Button, Upload, message, Space } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const ExcelReader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataReaded, setDataReaded] = useState(null);

  const handleFile = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Lấy dữ liệu từ sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // Lấy thông tin khách hàng, nhà cung cấp, địa chỉ, ngày tháng
        const customerName = worksheet["B3"]?.v;
        const supplierName = worksheet["B4"]?.v;
        const address = worksheet["B5"]?.v;
        const date = worksheet["B15"]?.v;

        // Lấy tên cột từ hàng 6
        const columnNames = [];
        let columnIndex = 0;
        while (true) {
          const cellAddress = XLSX.utils.encode_cell({ c: columnIndex, r: 5 });
          const columnName = worksheet[cellAddress]?.v;
          if (!columnName) {
            break;
          }
          columnNames.push(columnName);
          columnIndex++;
        }

        // Tạo mảng để lưu chi tiết sản phẩm
        const productList = [];

        // Duyệt qua các dòng (từ dòng 7 trở đi vì dòng đầu tiên thường là tiêu đề)
        for (let rowIndex = 7; ; rowIndex++) {
          const cellAddress = `A${rowIndex}`;
          const cell = worksheet[cellAddress];

          // Nếu ô A của dòng không có giá trị hoặc giá trị không phải là số, dừng vòng lặp
          if (!cell || isNaN(cell.v)) {
            break;
          }

          // Lấy giá trị từ các ô của dòng
          const stt = worksheet[`A${rowIndex}`]?.v;
          const productDetail = { stt };

          // Duyệt qua các cột và thêm giá trị vào productDetail
          columnNames.forEach((columnName, columnIndex) => {
            const cellValue =
              worksheet[XLSX.utils.encode_cell({ c: columnIndex, r: rowIndex })]
                ?.v;

            productDetail[columnName] = cellValue;
          });

          // Tạo đối tượng chi tiết sản phẩm và thêm vào mảng
          productList.push(productDetail);
        }

        // Lưu thông tin vào state data
        setDataReaded({
          customerName,
          supplierName,
          address,
          date,
          productList,
        });

        // Log mảng chi tiết sản phẩm ra console
        console.log("Dữ liệu đọc được:", dataReaded);
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const beforeUpload = (file) => {
    const isExcel =
      file.type === "application/vnd.ms-excel" || // Cho file .xls
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // Cho file .xlsx

    if (!isExcel) {
      message.error("Chỉ chấp nhận file Excel (xls hoặc xlsx)!");
    } else {
      // Lưu file đã chọn vào state
      setSelectedFile(file);
    }

    return false; // Ngăn chặn Ant Design Upload tự động tải lên
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div>
      <Upload beforeUpload={beforeUpload} showUploadList={false}>
        {selectedFile ? (
          <Space>
            <p>{selectedFile.name}</p>
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={handleRemoveFile}
            />
          </Space>
        ) : (
          <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
        )}
      </Upload>
      {selectedFile && (
        <Button onClick={handleFile} style={{ marginLeft: "10px" }}>
          Đọc file
        </Button>
      )}
    </div>
  );
};

export default ExcelReader;
