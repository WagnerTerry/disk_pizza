import React, { useState } from "react";
import { Button } from "../components/button/Button";
import Nav from '../components/Nav'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import './Caixa.scss'

export default function Caixa() {
  const schema = yup.object().shape({
    name: yup.string().min(1, "campo obrigatório").required(),
  });

  const {
    register,
    //handleSubmit,
    reset,
    // watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [formValues, setFormValues] = useState([{ name: "", email: "" }])

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  }

  let addFormFields = () => {
    setFormValues([...formValues, { name: "", email: "" }])
  }

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues)
  }

  let handleSubmit = (event) => {
    event.preventDefault();
    alert(JSON.stringify(formValues));
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
        <form onSubmit={handleSubmit}>
          {formValues.map((element, index) => (
            <div className="form-inline" key={index}>
              <label>Name</label>
              <input type="text" name="name" value={element.name || ""} onChange={(e) => handleChange(index, e)} />
              <label>Email</label>
              <input type="text" name="email" value={element.email || ""} onChange={e => handleChange(index, e)} />

              <button type="button" className="button remove" onClick={() => removeFormFields(index)}>Remover</button>

            </div>
          ))}
          <div className="button-section">
            <button className="button submit" type="submit" onClick={handleSubmit}>Submit</button>
          </div>
        </form>

      </div>
    </div>
  )
}
