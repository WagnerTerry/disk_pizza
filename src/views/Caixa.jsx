import React, { useState } from "react";
import { Button } from "../components/button/Button";
import Nav from '../components/Nav'

import './Caixa.scss'

export default function Caixa() {

  const [values, setValues] = useState([{ name: "", email: "" }])

  let handleChange = (i, e) => {
    let newFormValues = [...values]
    newFormValues[i][e.target.value] = e.target.value
    setValues(newFormValues)
  }

  let addFormFields = () => {
    setValues([...values, { name: "", email: "" }])
  }

  let removeFormFields = (i) => {
    let newFormValues = [...values]
    newFormValues.splice(i, 1)
    setValues(newFormValues)
  }

  let handleSubmit = (e) => {
    e.preventDefault()
    alert(JSON.stringify(values))
  }

  return (
    <div id="caixa">
      <div className="component-nav">
        <Nav />
      </div>
      <h2>Caixa</h2>
      <div className="cash-flow">
        <Button onClick={() => addFormFields()} color="turquoise">Abrir Caixa</Button>

        {/* Pedido, Data, Hora, Cliente, Bairro, Entregador, Situação, Valor total */}

        {values.map((element, index) => (
          <div className="form-inline" key={index}>
            <label>Name</label>
            <input type="text" name="name" value={element.name || ""} onChange={(e) => handleChange(index, e)} />
            <label>Email</label>
            <input type="text" name="email" value={element.email || ""} onChange={e => handleChange(index, e)} />

            <button type="button" className="button remove" onClick={() => removeFormFields(index)}>Remover</button>

          </div>
        ))}
        <div className="button-section">
          {/* <button className="button add" type="button" onClick={() => addFormFields()}>Add</button> */}
          <button className="button submit" type="submit" onClick={handleSubmit}>Submit</button>
        </div>

      </div>
    </div>
  )
}
