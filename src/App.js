import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Container, Col, Row} from 'react-bootstrap'
import HomeScreen from "./screens/HomeScreen";
import {BrowserRouter  as Router, Link, Route, Switch} from 'react-router-dom';
import ProductScreen from "./screens/ProductScreen";
import { history } from "./history";
import CartScreen from "./screens/CartScreen";
import ErrorPage from "./components/ErrorPage";
import LoginScreen from "./screens/LoginScreen";
import ProductListScreen from "./screens/productListScreen";
import ProductEditScreen from "./screens/productEditScreen";
import ProductCreateScreen from "./screens/ProductCreateCreen";
function App() {
  return (
    <Router>
      <Header />
    <main>
      <Container>
        <Switch>
          <Route exact path="/" >
            <HomeScreen />
          </Route>
          <Route path="/admin/product/create">
            <ProductCreateScreen/>
          </Route>
          <Route path="/admin/product/:id/edit">
            <ProductEditScreen/>
          </Route>
          <Route path="/product/:id">
            <ProductScreen/>
          </Route>
          <Route path="/admin/productlist/:pageNumber" exact>
            <ProductListScreen/>
          </Route>
          <Route path="/admin/productlist" exact>
            <ProductListScreen/>
          </Route>
          <Route path="/login">
            <LoginScreen/>
          </Route>


          <Route path="/cart/:id?">
            <CartScreen/>
          </Route>
          <Route  path="/search/:keyword" exact>
            <HomeScreen />
          </Route>
          <Route  path="/search/:keyword/page/:pageNumber" >
            <HomeScreen />
          </Route>
          <Route  path="/page/:pageNumber" >
            <HomeScreen />
          </Route>
          <Route  path="/error" >
            <ErrorPage />
          </Route>
        </Switch>
      </Container>
    </main>
      <Footer />
    </Router>
  );
}

export default App;
