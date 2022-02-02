import React, { useState, useEffect } from "react";
//import { Button } from "../components/button/Button";
import Nav from '../components/Nav'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { jsPDF } from "jspdf";

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
  const [valorTotal, setValorTotal] = useState(0)
  const [data, setData] = useState("")

  useEffect(() => {
    const showCashFlow = async () => {
      const { fluxo_caixa, quantidade_pedido } = await APIService.exibirCaixa()
      setCaixa(fluxo_caixa)
      setQtPedido(quantidade_pedido)

      const valor = fluxo_caixa.map((cx) => cx.valor)
      const valor_acumulado = valor.reduce((acumulador, elemento) => acumulador += elemento, 0)
      const valor_total = (parseFloat(valor_acumulado.toFixed(2)).toLocaleString('pt-BR', {
        currency: 'BRL',
        minimumFractionDigits: 2
      }));
      setValorTotal(valor_total)

      const data = new Date();
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const dataAtual = dia + '/' + mes + '/' + ano;
      console.log(dataAtual);

      setData(dataAtual)

    }
    showCashFlow()
  }, [valorTotal])

  /*  let handleChange = (i, e) => {
     let newFormValues = [...formValues];
     newFormValues[i][e.target.name] = e.target.value;
     setFormValues(newFormValues);
   } */

  /*  let removeFormFields = (i) => {
     let newFormValues = [...formValues];
     newFormValues.splice(i, 1);
     setFormValues(newFormValues)
   } */

  // let handleSubmit = (event) => {
  //   event.preventDefault();
  //   alert(JSON.stringify(formValues));
  // }

  const criarPDF = () => {
    // Default export is a4 paper, portrait, using millimeters for units

    const lMargin = 15; //left margin in mm
    const rMargin = 15; //right margin in mm
    const pdfInMM = 210;  // width of A4 in mm

    const doc = new jsPDF("p", "mm", "a4");

    const valor_ifood = caixa.map((cx) => cx.pagamento === 'IFOOD' && cx.valor)
    const valor_cartao = caixa.map((cx) => cx.pagamento === 'CARTAO' && cx.valor)
    const valor_dinheiro = caixa.map((cx) => cx.pagamento === 'DINHEIRO' && cx.valor)
    const valor_pix = caixa.map((cx) => cx.pagamento === 'PIX' && cx.valor)

    const text_ifood = `IFOOD R$ ${valor_ifood.reduce((acc, elemento) => acc += elemento, 0)}`
    const text_cartao = `CARTAO R$ ${valor_cartao.reduce((acc, elemento) => acc += elemento, 0)}`
    const text_dinheiro = `DINHEIRO R$ ${valor_dinheiro.reduce((acc, elemento) => acc += elemento, 0)}`
    const text_pix = `PIX R$ ${valor_pix.reduce((acc, elemento) => acc += elemento, 0)}`

    const lines = doc.splitTextToSize(text_ifood, (pdfInMM - lMargin - rMargin));
    doc.text(85, 10, "Relatório de Pedidos");
    doc.text(lMargin, 20, `Quantidade de pizzas : ${qtPedido}`);
    doc.text(85, 30, "Formas de Pagamento");
    doc.text(lMargin, 40, lines);
    doc.text(lMargin, 50, text_cartao)
    doc.text(lMargin, 60, text_dinheiro)
    doc.text(lMargin, 70, text_pix)
    doc.text(lMargin, 80, `Valor Total : R$ ${valorTotal}`)

    // doc.text(30, 10, "Hello");
    // doc.text(50, 25, "World");
    doc.save('Generated.pdf');
  }

  async function cashSave(data) {
    try {
      const pedido = data.numero_pedido
      const pedido_duplicado = caixa.filter((cx) => cx.numero_pedido === +pedido)
      if (pedido_duplicado.length > 0) {
        return toast.error("Pedido duplicado, os pedidos devem ser únicos")
      }
      await APIService.salvarCaixa(data)
      setCaixa(prevState => [...prevState, data])
      setQtPedido(prevState => prevState + 1)
      setValorTotal(prevState => prevState + +data.valor)
      toast.success("Registro salvo com sucesso")
      reset()
      console.log("caixa", data)

    } catch (e) {
      console.log("Ocorreu um erro ao registrar caixa", e)
      toast.error("Erro ao registrar caixa")
    }
  }

  async function deletarRegistro(data) {
    try {
      await APIService.excluirRegistro(data.codigo_pedido)
      setCaixa(caixa.filter(cx => cx.codigo_pedido !== data.codigo_pedido))
      setQtPedido(prevState => prevState - 1)
      setValorTotal(prevState => prevState - +data.valor)
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
      <h2>Caixa {data}</h2>

      <h3>Número de pedidos: {qtPedido}</h3>

      <div className="cash-flow">
        {/* Pedido, Data, Hora, Cliente, Bairro, Entregador, Situação, Valor */}
        <form onSubmit={handleSubmit(cashSave)}>
          <div className="box-form">
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
              <tbody>
                <tr>
                  <td><input type="text" id="numero_pedido" name="numero_pedido" size={7}   {...register("numero_pedido", { required: true })} />  {errors.numero_pedido && <p>Campo Obrigatório</p>}</td>
                  <td><input type="date" id="datas" name="datas" size={8} required {...register("datas", { required: true })} style={{ "width": "137px" }} /></td>
                  <td><input type="time" name="hora" size={5} required {...register("hora", { required: true })} /></td>
                  <td><input type="text" name="nome_cliente" required {...register("nome_cliente", { required: true })} /></td>
                  <td><input type="text" name="nome_pizza" required {...register("nome_pizza", { required: true })} /></td>
                  <td><input type="text" name="bairro" required {...register("bairro", { required: true })} /></td>
                  <td><input type="text" id="entregador" required name="entregador" size={8} {...register("entregador", { required: true })} /></td>
                  <td>
                    <select
                      id="pagamento"
                      name="pagamento"
                      defaultValue=""
                      required
                      {...register("pagamento", { required: true })}
                    >
                      <option value="" disabled>Selecione</option>
                      <option value="DINHEIRO">DINHEIRO</option>
                      <option value="CARTAO">CARTAO</option>
                      <option value="IFOOD">IFOOD</option>
                      <option value="PIX">PIX</option>
                    </select>
                  </td>
                  <td><input type="number" step="0.010" name="valor" required min={0} max={1000} {...register("valor", { required: true })} /></td>
                </tr>
                {caixa.map((cx, index) => {
                  return (
                    <tr key={`cx${index}`}>
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
                          <option value="PIX">PIX</option>
                        </select>
                      </td>
                      <td><input type="number" step="0.010" value={cx.valor} disabled min={0} max={1000} /></td>
                      <td><button type="button" className="button-remove" onClick={() => deletarRegistro(cx)}>Remover</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="box_options">
            <input type="submit" value="Salvar" />
            <button onClick={criarPDF}>Relatório</button>
            <strong>Valor total : R$ {valorTotal}</strong>

          </div>
        </form>
      </div>
    </div>
  )
}
