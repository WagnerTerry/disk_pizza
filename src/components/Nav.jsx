import React from "react";
import "./Nav.scss";
import { Link } from "react-router-dom";

function Nav(props) {
  return (
    <nav id="component_nav">
      <br />
      <Link className="navLogo" to='/'>
        <span>Disk Pizza Califórnia</span>
      </Link>
      <ul className="nav-links">
        <Link className="navStyle" to={props.path ? props.path : "/#"}>
          <li>{props.name}</li>
        </Link>
        <Link className="navStyle" to={props.path2 ? props.path2 : "/#"}>
          <li>{props.name2}</li>
        </Link>
        <Link className="navStyle" to={props.path2 ? props.path3 : "/#"}>
          <li>{props.name3}</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
