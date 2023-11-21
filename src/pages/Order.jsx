import React, { useState, useEffect } from "react";

import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { cartActions } from "../store/shopping-cart/cartSlice";
import { Link } from "react-router-dom";
import "../styles/order.css"
import axios from "axios";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
const Order = () => {
  const orderId = JSON.parse(sessionStorage.getItem('orderId'))
  const [order, setOrder] = useState({});
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const getOrder = async () => {
      try {
        const responseOrder = await axios.get(
          `${process.env.REACT_APP_BE_URL}/api/order/${orderId}`
        );

        if (responseOrder.status >= 200 && responseOrder.status < 300) {
          const responseOrderData = responseOrder.data
          const [year, month, day, hours, minutes, seconds] = responseOrderData.orderTime;
          const date = new Date(year, month - 1, day, hours, minutes, seconds);
          const data = {
            "id": responseOrderData.id,
            "tableId": responseOrderData.tableId,
            "orderStatus": responseOrderData.orderStatus,
            "orderTime": date.toLocaleString(),
            "totalPrice": responseOrderData.totalPrice,
            "orderDetails":
              responseOrderData.orderDetails.map((orderDetail) => {
                const quantity = orderDetail.quantity
                const detail = orderDetail.combo ? orderDetail.combo : orderDetail.product
                const price = detail.price * quantity
                return { name: detail.name, quantity: quantity, price: price }
              })
          }
          console.log('order:', data);
          setOrder(data)
          setError('');
        } else {
          setError(responseOrder.status);
        }
      } catch (err) {
        setError(err.message);
        setOrder([])
      }
    };
    if (orderId !== null) {
      getOrder();
    }
  }, []);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Helmet title="Order">
      <CommonSection title="Your Order" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {orderId === null ? (
                <h5 className="text-center">You have not ordered</h5>
              ) : error ? (
                <div>Error occurred: {error}</div>
              ) : order && order.orderDetails ? (
                <div class="card mt-50 mb-50">
                  <div class="main">
                    <span id="sub-title">
                      <p><b>Order detail</b></p>
                    </span>
                    <div class="row row-main justify-content-start">
                      <div class="col">
                        <div class="row d-flex">
                          <p><b>Order: {order.id}</b></p>
                        </div>
                        <div class="row d-flex">
                          <p><b>Table: {order.tableId}</b></p>
                        </div>
                        <div class="row d-flex">
                          <p><b>Date: {order.orderTime}</b></p>
                        </div>
                        <div class="row d-flex">
                          <p><b>Status: {order.orderStatus}</b></p>
                        </div>
                      </div>
                    </div>
                    <hr></hr>
                    {
                      order.orderDetails.map((detail) => (
                        <div class="row row-main justify-content-around">
                          <div class="col-6">
                            <p><b>{detail.name}</b></p>
                            <p>x {detail.quantity}</p>
                          </div>
                          <div class="col-4 d-flex justify-content-end">
                            <p><b>${detail.price}</b></p>
                          </div>
                        </div>
                      ))
                    }
                    <hr></hr>
                    <div class="total">
                      <div class="row justify-content-around">
                        <div class="col-6"> <b> Total:</b> </div>
                        <div class="col-4 d-flex justify-content-end"> <b>${order.totalPrice}</b> </div>
                      </div>
                      <ButtonGroup className="my-4" size="large" aria-label="large button group">
                        <Button className="btn d-flex mx-auto" variant="outlined" color="success" href="/foods">
                          Add food
                        </Button>
                        <Button className="btn d-flex mx-auto" variant="outlined" color="success" onClick={handleClick}>
                          Call staff
                        </Button>
                      </ButtonGroup>
                      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                              Staff is comming
                            </Alert>
                          </Snackbar>
                      {/* <button class="btn d-flex mx-auto"> Track your order </button> */}
                    </div>
                  </div>
                </div>
              ) : (
                <div>Loading...</div>
              )}

            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};



export default Order;
