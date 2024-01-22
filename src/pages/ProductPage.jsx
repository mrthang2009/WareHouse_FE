import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "jspdf-autotable";
import {
  Dropdown,
  Table,
  Pagination,
  Button,
  Modal,
  Form,
  message,
  Card,
  Divider,
  Select,
  Row,
  Col,
  Collapse,
  Spin,
  Popconfirm,
  Input,
} from "antd";
const { Panel } = Collapse;
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import axiosClient from "../libraries/axiosClient";
import ProductForm from "../components/ProductForm/ProductForm";
import generateFilePDF from "../libraries/generateFilePDF";
import styles from "./stylesPage/ProductPage.module.scss";
import DetailModal from "../components/DetailProductModal/DetailProductModal";
const { Option } = Select;
import numeral from "numeral";
import "numeral/locales/vi";
import ExcelReader from "../components/ExcelReader/ExcelReader ";
numeral.locale("vi");
const DEFAULT_LIMIT = 18;

const ProductPage = () => {
  const navigate = useNavigate();
  //Trạng thái loading của button
  const [loadings, setLoadings] = useState([false]);

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [sortDiscount, setSortDiscount] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [updateProductModalVisible, setUpdateProductModalVisible] =
    useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [filterResult, setFilterResult] = useState([]);
  const [noFilterResult, setNoFilterResult] = useState(false); // State để theo dõi kết quả tìm kiếm
  const [pagination, setPagination] = useState({
    total: 1,
    page: 1,
    pageSize: DEFAULT_LIMIT,
  });

  const filterProducts = async () => {
    try {
      setLoadings([true]);
      const res = await axiosClient.get(
        `products/filter?keyword=${keyword}&categoryId=${selectedCategory}&sortPrice=${sortPrice}&sortDiscount=${sortDiscount}`
      );

      const Results = res.data.payload || [];
      setFilterResult(Results);
      // Nếu không có kết quả tìm kiếm, đặt giá trị noFilterResult thành true
      setNoFilterResult(Results.length === 0);
      setLoadings([false]);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoadings([false]);
    }
  };

  const getProducts = useCallback(async (pagination) => {
    try {
      const res = await axiosClient.get(
        `/products?page=${pagination.page}&pageSize=${pagination.pageSize}`
      );
      setProducts(res.data.payload);
      setPagination((prev) => ({
        ...prev,
        total: res.data.totalProduct,
      }));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      const res = await axiosClient.get("/categories/all");
      setCategories(res.data.payload || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getProducts(pagination);
    if (pagination.page === 1) {
      navigate(`/products`);
    } else {
      navigate(`/products?page=${pagination.page}`);
    }
  }, [navigate, pagination.page, pagination.pageSize]);
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const [updateForm] = Form.useForm();

  const showUpdateModal = (product) => {
    setProductToUpdate(product);
    setUpdateProductModalVisible(true);
    updateForm.setFieldsValue(product);
  };

  const handleUpdate = async (values) => {
    try {
      if (productToUpdate) {
        setLoadings([true]);
        await axiosClient.patch(`/products/${productToUpdate._id}`, values);
        if (filterResult && filterResult.length > 0) {
          await filterProducts();
        } else if (products.length > 0) {
          await getProducts(pagination);
        }
        setUpdateProductModalVisible(false);
        message.success("Cập nhật sản phẩm thành công");
        setLoadings([false]);
      }
    } catch (error) {
      message.error("Cập nhật sản phẩm thất bại");
      console.error("Lỗi khi cập nhật sản phẩm: ", error);
      setLoadings([false]);
    }
  };

  const handleDelete = async (record) => {
    try {
      await axiosClient.patch(`/products/delete/${record._id}`);
      if (filterResult.length > 0) {
        await filterProducts();
      } else {
        await getProducts(pagination);
      }
      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm: ", error);
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoadings([true]);
      await axiosClient.post("/products/create2", values);
      if (filterResult.length > 0) {
        filterProducts();
      }
      await getProducts(pagination);
      setAddProductModalVisible(false);
      message.success("Tạo sản phẩm mới thành công");
      setLoadings([false]);
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm: ", error);
      setLoadings([false]);
    }
  };

  const onChangePage = useCallback(
    (page, pageSize) => {
      setPagination((prev) => ({
        ...prev,
        page,
        pageSize,
      }));
      getProducts();
    },
    [getProducts]
  );
  const handleFilter = () => {
    filterProducts(keyword, selectedCategory, sortPrice, sortDiscount);
  };

  const handleFilterOnEnter = (e) => {
    if (e.key === "Enter") {
      handleFilter();
    }
  };
  const columns = [
    {
      title: "STT",
      width: "1%",
      align: "center",
      responsive: ["lg"],
      render: function (text, record, index) {
        return (
          <span>
            {filterResult.length > 0
              ? index + 1
              : index + 1 + pagination.pageSize * (pagination.page - 1)}
          </span>
        );
      },
    },

    {
      title: `Sản phẩm`,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text, record) => (
        <span
          className={styles.name_product}
          onClick={() => {
            setSelectedProduct(record);
            setDetailModalOpen(true);
          }}
        >
          <p>{record.name}</p>
        </span>
      ),
    },
    {
      title: "Mã QR Code",
      width: "1%",
      align: "center",

      render: function (text, record) {
        return (
          <img
            className={styles.thumb}
            src={record.media?.qrCodeUrl}
            alt={record.name}
          />
        );
      },
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   key: "description",
    //   responsive: ["md"],
    //   align: "center",
    //   render: (text, record) => (
    //     <p className={styles.description}>{record.description}</p>
    //   ),
    // },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "categoryName",
      responsive: ["md"],
      align: "center",
      render: function (text, record) {
        return <p className={styles.category}>{record.category?.name}</p>;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      responsive: ["md"],
      render: function (text, record) {
        return (
          <p className={styles.price}>{numeral(record.price).format("0,0$")}</p>
        );
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      align: "center",
      responsive: ["md"],
      render: function (text, record) {
        return <p>{`${record.discount}%`}</p>;
      },
    },

    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (text, record) => {
        return (
          <div className={styles.action_colum}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Cập nhật thông tin sản phẩm",
                    onClick: () => showUpdateModal(record),
                  },
                  { key: "2", label: "Cập nhật hình ảnh sản phẩm" },
                ],
              }}
              placement="topRight"
              arrow
            >
              <Button
                type="dashed"
                icon={<EditOutlined />}
                // onClick={() => showUpdateModal(record)}
              />
            </Dropdown>
            <Popconfirm
              placement="topRight"
              title={`Bạn đồng ý với việc xóa sản phẩm dưới đây?`}
              description={`${record.name}`}
              onConfirm={() => handleDelete(record)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button danger type="dashed" icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const clearFilters = () => {
    setKeyword("");
    setSelectedCategory("");
    setSortPrice("");
    setSortDiscount("");
    setFilterResult([]);
    setNoFilterResult(false);
    getProducts();
  };
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handlePrint = () => {
    generateFilePDF(filterResult.length > 0 ? filterResult : products);
  };
  return (
    <main className="container">
      <Card>
        <div className={styles.action}>
          <ExcelReader/>
          <Button
            className={styles.print}
            onClick={() => handlePrint()}
            icon={<PrinterOutlined />}
            type="primary"
          >
            In Danh Sách
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="link"
            onClick={() => setAddProductModalVisible(true)}
          >
            Thêm sản phẩm
          </Button>
        </div>
        <Divider />

        <Collapse
          bordered={false}
          defaultActiveKey={["searchFilter"]}
          style={{ backgroundColor: "#E6F4FF" }}
        >
          <Panel header="Bộ lọc tìm kiếm sản phẩm" key="searchFilter">
            <div className={styles.filter}>
              <Form>
                <Row gutter={16}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                    <Form.Item label="Tên SP">
                      <Input
                        placeholder="Nhập tên sản phẩm"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={handleFilterOnEnter}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={8} xl={6}>
                    <Form.Item
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 21 }}
                      label="Giá"
                    >
                      <Select
                        placeholder="Giá"
                        value={sortPrice}
                        onChange={(value) => setSortPrice(value)}
                      >
                        <Option value="asc">Tăng dần</Option>
                        <Option value="desc">Giảm dần</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={8} xl={6}>
                    <Form.Item
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label="Giảm giá"
                    >
                      <Select
                        placeholder="Giảm giá"
                        value={sortDiscount}
                        onChange={(value) => setSortDiscount(value)}
                      >
                        <Option value="asc">Từ thấp đến cao</Option>
                        <Option value="desc">Từ cao đến thấp</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                    <Form.Item
                      labelCol={{ span: 9 }}
                      wrapperCol={{ span: 15 }}
                      label="Danh mục"
                    >
                      <Select
                        placeholder="Chọn danh mục"
                        value={selectedCategory}
                        onChange={(value) => setSelectedCategory(value)}
                      >
                        {categories.map((category) => (
                          <Option key={category._id} value={category._id}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                    <Button
                      loading={loadings[0]}
                      type="primary"
                      onClick={handleFilter}
                    >
                      Lọc
                    </Button>
                    <Button
                      onClick={clearFilters}
                      style={{ marginLeft: "10px" }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Panel>
        </Collapse>
        <Divider />

        {noFilterResult ? (
          <Table
            columns={columns}
            pagination={false}
            rowKey="_id"
            locale={{
              emptyText: (
                <span style={{ fontSize: "110%" }}>
                  <WarningOutlined style={{ color: "#FFC522" }} /> Không tìm
                  thấy sản phẩm nào
                </span>
              ),
            }}
          />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={filterResult.length > 0 ? filterResult : products}
              pagination={false}
              rowKey="_id"
              locale={{
                emptyText: <Spin size="large" />,
              }}
            />

            {filterResult.length < DEFAULT_LIMIT ||
            products.length < DEFAULT_LIMIT ? null : (
              <div className={styles.pagination}>
                <Pagination
                  defaultCurrent={1}
                  total={pagination.total}
                  pageSize={DEFAULT_LIMIT}
                  current={pagination.page}
                  onChange={onChangePage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </Card>
      <Modal
        width={800}
        centered
        title="Tạo sản phẩm mới"
        open={addProductModalVisible}
        onCancel={() => setAddProductModalVisible(false)}
        footer={null}
      >
        <ProductForm
          loading={loadings[0]}
          onSubmit={handleCreate}
          handleCancel={() => setAddProductModalVisible(false)}
          nameSubmit="Tạo"
        />
      </Modal>
      <Modal
        width={800}
        centered
        title="Cập nhật sản phẩm"
        open={updateProductModalVisible}
        onCancel={() => setUpdateProductModalVisible(false)}
        footer={null}
      >
        <ProductForm
          loading={loadings[0]}
          form={updateForm}
          onSubmit={handleUpdate}
          handleCancel={() => setUpdateProductModalVisible(false)}
          nameSubmit="Lưu"
        />
      </Modal>
      <Modal
        width={600}
        centered
        title="Chi tiết sản phẩm"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
      >
        <DetailModal
          thumb={selectedProduct?.media.coverImageUrl}
          name={selectedProduct?.name}
          description={selectedProduct?.description}
          category={selectedProduct?.category.name}
          supplier={selectedProduct?.supplier.name}
          price={selectedProduct?.price}
          discount={selectedProduct?.discount}
          stock={selectedProduct?.stock}
        />
      </Modal>
    </main>
  );
};

export default ProductPage;
