import React, { useState, useEffect } from "react";
import { Button } from "../components/button/Button";
import Nav from '../components/Nav'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import './Caixa.scss'
import APIService from "../services/api";
import { toast } from "react-toastify";

export default function Caixa() {
  const schema = yup.object().shape({
    numero_pedido: yup.string().min(1, "campo obrigatório").required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    // watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [caixa, setCaixa] = useState([])
  const [qtPedido, setQtPedido] = useState("")

  useEffect(() => {
    const showCashFlow = async () => {
      const { fluxo_caixa, quantidade_pedido } = await APIService.exibirCaixa()
      setCaixa(fluxo_caixa)
      setQtPedido(quantidade_pedido)
    }
    showCashFlow()
    // var date = new Date();
    // var day = date.getDate();
    // var month = date.getMonth() + 1;
    // var year = date.getFullYear();

    // if (month < 10) month = "0" + month;
    // if (day < 10) day = "0" + day;

    // var today = year + "-" + month + "-" + day;

    // document.getElementById("startdateId").value = today;
  }, [])

  const [formValues, setFormValues] = useState([{ numero_pedido: "", datas: "", hora: "", nome_cliente: "", nome_pizza: "", bairro: "", entregador: "", pagamento: "", valor: "" }])

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  }

  let addFormFields = () => {
    setCaixa([...caixa, { numero_pedido: "", datas: "", hora: "", nome_cliente: "", nome_pizza: "", bairro: "", entregador: "", pagamento: "", valor: "" }])
  }

 /*  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues)
  } */

  // let handleSubmit = (event) => {
  //   event.preventDefault();
  //   alert(JSON.stringify(formValues));
  // }

  async function cashSave(data) {
    try {
      await APIService.salvarCaixa(data)
      setCaixa(prevState => [...prevState, data])
      setQtPedido(prevState => prevState + 1)
      toast.success("Registro salvo com sucesso")
      reset()
      console.log("caixa", data)

    } catch (e) {
      console.log("Ocorreu um erro ao registrar caixa", e)
      toast.error("Erro ao registrar caixa")
    }
  }

  async function deletarRegistro(id) {
    try {
      await APIService.excluirRegistro(id)
      setCaixa(caixa.filter(cx => cx.codigo_pedido !== id))
      setQtPedido(prevState => prevState - 1)
      toast.success("Registro removido")
    } catch (e) {
      console.log("erro ao excluir registro", e)
      toast.error("Erro ao remover registro")
    }
  }

  return (
    <div id="caixa">
      <div className="component-nav">
        <Nav />
      </div>
      <h2>Caixa</h2>
      <h3>Número de pedidos: {qtPedido}</h3>
      {console.log("caixa", caixa)}

      <div className="cash-flow">
        <Button onClick={() => addFormFields()} color="turquoise">Novo registro</Button>

        {/* Pedido, Data, Hora, Cliente, Bairro, Entregador, Situação, Valor */}
        {formValues.length > 0 ?
          <>
            <form onSubmit={handleSubmit(cashSave)}>
              <table>
                <thead>
                  <tr>
                    <th>Nº Pedido</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Cliente</th>
                    <th>Pizza</th>
                    <th>Bairro</th>
                    <th>Entregador</th>
                    <th>Pagamento</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                {formValues.map((element, index) => {
                  return (

                    <tbody key={index}>
                      
                      <tr>
                        <td><input type="text" id="numero_pedido" name="numero_pedido" size={7} onChange={(e) => handleChange(index, e)}  {...register("numero_pedido", { required: true })} />  {errors.numero_pedido && <p>Campo Obrigatório</p>}</td>
                        <td><input type="date" id="datas" name="datas" size={8} onChange={(e) => handleChange(index, e)}  {...register("datas", { required: true })} style={{ "width": "137px" }} /></td>
                        <td><input type="time" name="hora" size={5} onChange={(e) => handleChange(index, e)} {...register("hora", { required: true })} /></td>
                        <td><input type="text" name="nome_cliente" onChange={(e) => handleChange(index, e)} {...register("nome_cliente", { required: true })} /></td>
                        <td><input type="text" name="nome_pizza" onChange={(e) => handleChange(index, e)} {...register("nome_pizza", { required: true })} /></td>
                        <td><input type="text" name="bairro" onChange={(e) => handleChange(index, e)} {...register("bairro", { required: true })} /></td>
                        <td><input type="text" id="entregador" name="entregador" size={8} onChange={(e) => handleChange(index, e)} {...register("entregador", { required: true })} /></td>
                        <td>
                          <select
                            id="pagamento"
                            name="pagamento"
                            defaultValue=""
                            required
                            onChange={(e) => handleChange(index, e)}
                            {...register("pagamento", { required: true })}
                          >
                            <option value="" disabled>Selecione</option>
                              <option value="DINHEIRO">DINHEIRO</option>
                              <option value="CARTAO">CARTAO</option>
                              <option value="IFOOD">IFOOD</option>
                          </select>
                        </td>
                        <td><input type="number" step="0.010" name="valor" min={0} max={1000} onChange={(e) => handleChange(index, e)} {...register("valor", { required: true })} /></td>
                      {/*   <td><button type="button" className="button remove" onClick={() => removeFormFields(index)}>Remover</button>
                        </td> */}
                      </tr>
                      {caixa.map((cx) => {
                        return (
                          <tr>
                            <td><input type="text" value={cx.numero_pedido} disabled size={7} /></td>
                            <td><input type="date" value={cx.datas} size={8} disabled style={{ "width": "137px" }} /></td>
                            <td><input type="time" value={cx.hora} size={5} disabled /></td>
                            <td><input type="text" value={cx.nome_cliente} disabled /></td>
                            <td><input type="text" value={cx.nome_pizza} disabled /></td>
                            <td><input type="text" value={cx.bairro} disabled /></td>
                            <td><input type="text" value={cx.entregador} disabled size={8} /></td>
                            <td>
                              <select
                                defaultValue={cx.pagamento}
                                disabled
                              >
                                <option value={cx.pagamento} >{cx.pagamento}</option>
                                <option value="DINHEIRO">DINHEIRO</option>
                                <option value="CARTAO">CARTAO</option>
                                <option value="IFOOD">IFOOD</option>
                              </select>
                            </td>
                            <td><input type="number" step="0.010" value={cx.valor} disabled min={0} max={1000} /></td>
                            <td><button type="button" className="button-remove" onClick={() => deletarRegistro(cx.codigo_pedido)}>Remover</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  )
                })}
              </table>
              <input className="close_cash" type="submit" value="Salvar" />
            </form>
          </>
          : ""}
      </div>
    </div>
  )
}
