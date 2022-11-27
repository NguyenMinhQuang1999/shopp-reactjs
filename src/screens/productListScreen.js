import React, { useEffect, useRef, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  listProducts,
  deleteProduct,
  createProduct,
  importProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { useHistory, useParams } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const ProductListScreen = () => {
  const history = useHistory();
  const { pageNumber } = useParams();

  const pageNumbers = pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productImport = useSelector((state) => state.productImport);
  const {
    loading: loadingImport,
    error: errorImport,
    success: successImport,
  } = productImport;

  console.log(productImport);



  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }


    //import
    if (successImport || successDelete) {
      dispatch(listProducts("", pageNumbers));
    }

  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    pageNumbers,
    successImport,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
        toast.success('Delete Susscessfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    history.push(`/admin/product/create`);
  };

  const exportProductHandler = () => {
    const fileName = "export-products";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const ws = XLSX.utils.json_to_sheet(products);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const fileRef = useRef();
  const handleRemove = () => {
    fileRef.current.value = "";
    setfileName(null);
    setFile(null);
  };
  const excepableFileName = ["xlsx", "xls"];
  const checkFileName = (name) => {
    return excepableFileName.includes(name.split(".").pop().toLowerCase());
  };

  const [fileName, setfileName] = useState(null);
  const [file, setFile] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [sheetData, setSheetData] = useState([]);


  //import

  const readDataFormExcel = (data) => {
    const wb = XLSX.read(data);
    setSheet(wb.SheetNames);
    let mySheetData = [];

    for (let i = 0; i < wb.SheetNames.length; i++) {
      let sheetname = wb.SheetNames[i];
      const worksheet = wb.Sheets[sheetname];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      mySheetData = jsonData;
    }
    setSheetData(mySheetData);
    dispatch(importProduct(mySheetData));
    handleRemove();
  };

  const handleFile = async (e) => {
    const myfile = e.target.files[0];

    if (!myfile) {
      return;
    }
    if (!checkFileName) {
      alert("File invalid");
      return;
    }

    const data = await myfile.arrayBuffer();
    const wb = XLSX.read(data);
    readDataFormExcel(data);
    setSheet(wb.SheetNames);
    setFile(myfile);
    setfileName(myfile.name);
  };


  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
      </Row>

      <Row>
        <Col className="text-left">
          <Button className="my-3" onClick={exportProductHandler}>
            <i class="fa fa-file-export"> Export Excel</i>
          </Button>
        </Col>
        <Col className="text-left">
          <Button className="my-3" onClick={() => fileRef.current.click()}>
            <i className="fas fa-file-import"></i> Import Excel
          </Button>
          {fileName && (
            <i onClick={handleRemove} className="fas fa-time">
              {" "}
              {/* Remove file{" "} */}
            </i>
          )}
          <Form.Control
            type="file"
            ref={fileRef}
            hidden
            accept="xlsx, xls"
            multiple={false}
            onChange={(e) => handleFile(e)}
          />
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"> Create product</i>
          </Button>

        </Col>
      </Row>

      {/* {loadingDelete && <Loader />} */}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {/* {loadingImport && <Loader />} */}
      {errorImport && <Message variant="danger">{errorImport}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
          <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
        {/* Same as */}
        <ToastContainer />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
