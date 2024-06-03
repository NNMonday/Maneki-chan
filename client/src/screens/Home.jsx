import React, {
  useCallback,
  useEffect,
  useState,
  // useRef,
  // useMemo,
} from "react";
import thumbnail from "../assets/thumbnail.png";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import {
  capitalizeString,
  numberWithDots,
  pushAndReturnCopy,
  removeByValue,
} from "../ultis/ReusedFunc";
import debounce from "lodash.debounce";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";

export default function Home() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [categories, setCategories] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // const thumbnailRatio = useMemo(() => 531 / 1440, []);
  // const headlineRef = useRef(null);
  // const thumbnailContainerRef = useRef(null);
  // const thumbnailImgRef = useRef(null);
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (headlineRef.current && thumbnailContainerRef.current) {
  //       const newHeight = headlineRef.current.offsetHeight + 30;
  //       const contanerWidthLongerThanImgWidth =
  //         window.innerWidth > newHeight / thumbnailRatio;
  //       thumbnailContainerRef.current.style.height =
  //         contanerWidthLongerThanImgWidth ? "auto" : `calc(${newHeight}px)`;
  //       thumbnailImgRef.current.classList = contanerWidthLongerThanImgWidth
  //         ? "w-100"
  //         : "h-100";
  //     }
  //   };

  //   handleResize();

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [headlineRef, thumbnailContainerRef]);
  useEffect(() => {
    (async () => {
      try {
        const resCategories = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/api/category"
        );
        const resItems = await axios.post(
          process.env.REACT_APP_BACKEND_URL + "/api/items",
          {
            categories: [],
          }
        );

        setItems(resItems.data.data);
        setCategories(resCategories.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const updateCart = useCallback((newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }, []);

  const addItem = useCallback(
    (item) => {
      const existIdIndex = cart.findIndex((i) => i._id === item._id);
      const newCart = [...cart];
      if (existIdIndex > -1) {
        newCart[existIdIndex] = {
          _id: item._id,
          quantity: newCart[existIdIndex].quantity + 1,
        };
        updateCart(newCart);
      } else {
        newCart.push({ _id: item._id, quantity: 1 });
        updateCart(newCart);
      }
      toast("Đã thêm vào giỏ hàng", { className: "bg-success text-white" });
    },
    [cart, updateCart]
  );

  const [search, setSearch] = useState("");
  const fetchSearch = useCallback(async (search) => {
    try {
      const res =
        search.length === 0
          ? await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/items", {
              categories: [],
            })
          : await axios.get(
              process.env.REACT_APP_BACKEND_URL + "/api/items/name/" + search
            );
      setItems(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const debounceOnChange = useCallback(
    debounce((value) => {
      fetchSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = useCallback(
    (e) => {
      const newSearch = e.target.value;
      setSearch(newSearch);
      debounceOnChange(newSearch);
    },
    [debounceOnChange]
  );

  const [filter, setFilter] = useState({
    categories: [],
  });
  const handleFilter = async () => {
    try {
      const resItems = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/api/items",
        {
          categories: filter.categories,
        }
      );
      setItems(resItems.data.data);
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  return (
    <>
      <MainLayout>
        <Row>
          <Col>
            {/* <div
            className="pt-5 ps-5 position-absolute headline"
            ref={headlineRef}
          >
            <h1 className="text-baca" style={{ fontSize: "5vw" }}>
              BACA
            </h1>
            <h1 className="mb-4" style={{ fontSize: "5vw" }}>
              Bánh Cá Ngũ Vị
            </h1>
            <p className="d-none d-md-block" style={{ width: "35%" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
              molestie libero eros, ut bibendum arcu dapibus nec. Integer nisi
              neque, convallis ut tortor eget, aliquet interdum purus.
            </p>
            <Link to={"/about"} className="btn bg-baca text-white mt-md-3">
              Tìm hiểu thêm
            </Link>
          </div>
          <div
            className="thumbnail-container"
            ref={thumbnailContainerRef}
            style={{ minHeight: "200px" }}
          >
            <img src={thumbnail} alt="thumbnail" ref={thumbnailImgRef} />
          </div> */}
            <Link to={"/about"} className="d-block">
              <img
                src={thumbnail}
                className="w-100 object-fit-cover"
                alt="thumbnail"
              />
            </Link>
          </Col>
        </Row>
        <Row className="px-2 px-md-3 px-lg-5 pb-4">
          <h2 className="text-center mb-3 pt-4 fs-1">Menu</h2>
          <div className="d-flex mb-5">
            <div
              className="p-3 d-flex align-items-center flex-grow-1 border border-dark-subtle overflow-hidden"
              style={{ borderRadius: "10px" }}
            >
              <i className="fa-solid fa-magnifying-glass me-2"></i>
              <input
                value={search}
                onChange={handleSearchChange}
                type="text"
                className="border-0 d-inline w-auto custom-input h-100 flex-grow-1"
              />
            </div>
            <Button
              className="ms-2 bg-transparent border-baca filter-btn"
              style={{ aspectRatio: "1/1" }}
              onClick={handleShow}
            >
              <i className="fa-solid fa-sliders text-baca filter-icon"></i>
            </Button>
          </div>

          {items.map((item, i) => (
            <Col key={i} lg={3} md={4} xs={6} className="baca-item mb-2">
              <Card border="0">
                <div className="item-img-container">
                  <Card.Img
                    className="w-100 h-100"
                    variant="top"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <Card.Body>
                  <Card.Title>{capitalizeString(item.name)}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button
                      className="bg-transparent border-0 p-0"
                      onClick={() => addItem(item)}
                    >
                      <i className="fa-solid fa-cart-shopping text-baca fs-4"></i>
                    </Button>
                    <span className="text-baca fw-bold">
                      {numberWithDots(item.price)}đ/{item.unit}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </MainLayout>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Menu Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {categories.map((c) => (
              <Form.Check
                key={c._id}
                label={c.name}
                type="checkbox"
                value={c._id}
                checked={filter.categories.includes(c._id)}
                onChange={() => {
                  setFilter((pre) => ({
                    ...pre,
                    categories: pre.categories.includes(c._id)
                      ? [...removeByValue(pre.categories, c._id)]
                      : [...pushAndReturnCopy(filter.categories, c._id)],
                  }));
                }}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button className="bg-baca border-0" onClick={handleFilter}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
