import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
// import products from '../products'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useHistory, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";

const HomeScreen = () => {
  const { keyword, pageNumber = 1 } = useParams();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  console.log("productList", productList);
  const { loading, error, products, page, pages } = productList;



  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [keyword, dispatch, pageNumber]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h1>Lastest Product</h1>

          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
