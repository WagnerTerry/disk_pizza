import React from "react";
import { Button } from "../components/button/Button";
import Nav from '../components/Nav'

import './Caixa.scss'

export default function Caixa() {
  return (
    <div id="caixa">
      <div className="component-nav">
        <Nav />
      </div>
      <h2>Caixa</h2>
      <div className="cash-flow">
        <Button onClick={() => console.log("foi")} color="turquoise">Nova Entrada</Button>
      </div>
    </div>
  )
}
