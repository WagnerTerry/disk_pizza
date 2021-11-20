import "./App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from './components/NavBar'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './views/Home'
import Caixa from './views/Caixa'
import Cardapio from './views/Cardapio'


//import Routes from "./routes";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/caixa" component={Caixa} />
          <Route path="/cardapio" component={Cardapio} />
        </Switch>
      </Router>
      <ToastContainer />
    </>
  );
}

/* function App() {
  return (
    <>
      <ToastContainer />
      <Routes />
    </>
  );
} */

export default App;
