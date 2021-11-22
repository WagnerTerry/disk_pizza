import React from "react";
import "../App.scss";
import { Link } from "react-router-dom";

function Nav(props) {
  return (
    <nav>
      <br />
      <Link className="navLogo" to={props.path}>
        <span>{props.name}</span>
      </Link>
      {/* <ul className="nav-links">
        <Link className="navStyle" to="/cadastrocliente">
          <li>Cadastro</li>
        </Link>
        <Link className="navStyle" to="/caixa">
          <li>Caixa</li>
        </Link>
        <Link className="navStyle" to="/cardapio">
          <li>Cardapio</li>
        </Link>
      </ul> */}
    </nav>
  );
}

export default Nav;
