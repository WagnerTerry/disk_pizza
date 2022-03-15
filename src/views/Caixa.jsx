import React, { useState, useEffect } from "react";
//import { Button } from "../components/button/Button";
import Nav from "../components/Nav";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { jsPDF } from "jspdf";

import "./Caixa.scss";
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

  const [clients, setClients] = useState([]);
  const [caixa, setCaixa] = useState([]);
  const [qtPedido, setQtPedido] = useState("");
  const [valorTotal, setValorTotal] = useState(0);
  const [data, setData] = useState("");
  const [pizzas, setPizzas] = useState([]);
  const [group, setGroup] = useState([]);
  const [, setName] = useState("");
  const [, setNamePizza] = useState("");

  // the search result
  const [foundUsers, setFoundUsers] = useState(clients);
  const [foundPizzas, setFoundPizzas] = useState(pizzas);

  useEffect(() => {
    const showCustomers = async () => {
      const { clientes } = await APIService.getClientes();
      setClients(clientes);
    };
    showCustomers();

    const showGroup = async () => {
      const { pizzas } = await APIService.getPizzas();
      const { grupos } = await APIService.getGrupos();
      setPizzas(pizzas);
      setGroup(grupos);
    };
    showGroup();

    const showCashFlow = async () => {
      const { fluxo_caixa, quantidade_pedido } = await APIService.exibirCaixa();
      setCaixa(fluxo_caixa);
      setQtPedido(quantidade_pedido);

      const valor = fluxo_caixa.map((cx) => cx.valor);
      const valor_acumulado = valor.reduce(
        (acumulador, elemento) => (acumulador += elemento),
        0
      );
      const valor_total = new Intl.NumberFormat("pt-br", {
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(valor_acumulado);
      setValorTotal(valor_total);

      const data = new Date();
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const ano = data.getFullYear();
      const dataAtual = dia + "/" + mes + "/" + ano;

      setData(dataAtual);
    };
    showCashFlow();
  }, [valorTotal]);

  const filtroNome = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = clients.filter((user) => {
        return user.nome.toLowerCase().startsWith(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundUsers(results);
    } else {
      setFoundUsers("");
      // If the text field is empty, show all users
    }

    setName(keyword);
  };

  const filtroPizza = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = pizzas.filter((pizza) => {
        return pizza.nome_pizza.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setFoundPizzas(results);
    } else {
      setFoundPizzas("");
    }
    setNamePizza(keyword);
  };

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
    const pdfInMM = 210; // width of A4 in mm

    const doc = new jsPDF("p", "mm", "a4");

    const valor_ifood = caixa.map((cx) => cx.pagamento === "IFOOD" && cx.valor);
    const valor_cartao = caixa.map(
      (cx) => cx.pagamento === "CARTAO" && cx.valor
    );
    const valor_dinheiro = caixa.map(
      (cx) => cx.pagamento === "DINHEIRO" && cx.valor
    );
    const valor_pix = caixa.map((cx) => cx.pagamento === "PIX" && cx.valor);

    const text_ifood = `IFOOD R$ ${valor_ifood.reduce(
      (acc, elemento) => (acc += elemento),
      0
    )}`;
    const text_cartao = `CARTAO R$ ${valor_cartao.reduce(
      (acc, elemento) => (acc += elemento),
      0
    )}`;
    const text_dinheiro = `DINHEIRO R$ ${valor_dinheiro.reduce(
      (acc, elemento) => (acc += elemento),
      0
    )}`;
    const text_pix = `PIX R$ ${valor_pix.reduce(
      (acc, elemento) => (acc += elemento),
      0
    )}`;

    const lines = doc.splitTextToSize(text_ifood, pdfInMM - lMargin - rMargin);
    doc.text(85, 10, `Relatório de Pedidos ${data}`);
    doc.text(lMargin, 20, `Quantidade de pizzas : ${qtPedido}`);
    doc.text(85, 30, "Formas de Pagamento");
    doc.text(lMargin, 40, lines);
    doc.text(lMargin, 50, text_cartao);
    doc.text(lMargin, 60, text_dinheiro);
    doc.text(lMargin, 70, text_pix);
    doc.text(lMargin, 80, `Valor Total : R$ ${valorTotal}`);

    // doc.text(30, 10, "Hello");
    // doc.text(50, 25, "World");
    doc.save("Relatorio_Pizza.pdf");
  };

  async function cashSave(dados) {
    const dadosData = { ...dados, datas: data };
    try {
      const pedido = dados.numero_pedido;
      const pedido_duplicado = caixa.filter(
        (cx) => cx.numero_pedido === +pedido
      );
      if (pedido_duplicado.length > 0) {
        return toast.error("Pedido duplicado, os pedidos devem ser únicos");
      }
      await APIService.salvarCaixa(dadosData);
      setCaixa((prevState) => [...prevState, dadosData]);
      setQtPedido((prevState) => prevState + 1);
      setValorTotal((prevState) => prevState + +dados.valor);
      setFoundUsers("");
      setFoundPizzas("");
      toast.success("Registro salvo com sucesso");
      reset();
      console.log("caixa", dadosData);
    } catch (e) {
      console.log("Ocorreu um erro ao registrar caixa", dadosData);
      toast.error("Erro ao registrar caixa");
    }
  }

  async function deletarRegistro(data) {
    try {
      await APIService.excluirRegistro(data.codigo_pedido);
      setCaixa(caixa.filter((cx) => cx.codigo_pedido !== data.codigo_pedido));
      setQtPedido((prevState) => prevState - 1);
      setValorTotal((prevState) => prevState - +data.valor);
      setFoundUsers("");
      toast.success("Registro removido");
    } catch (e) {
      console.log("erro ao excluir registro", e);
      toast.error("Erro ao remover registro");
    }
  }

  async function deletaTodosRegistros() {
    try {
      if (window.confirm("Tem certeza que quer apagar todos os registros?")) {
        await APIService.excluirTodosRegistros();
        toast.success("Todos os registros foram removidos");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        return false;
      }
    } catch (e) {
      console.log("Ocorreu um erro ao remover todos os registros", e);
      toast.error("Erro ao remover todos os registros");
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
        {foundUsers && foundUsers.length > 0
          ? foundUsers.map((user, index) => (
              <li key={index} className="user_li">
                <span className="user-name">Cliente: {user.nome}</span>
                <span className="user-bairro">Bairro: {user.bairro}</span>
                <span className="user-observacao">Obs: {user.observacoes}</span>
              </li>
            ))
          : ""}
        {foundPizzas && foundPizzas.length > 0
          ? foundPizzas.map((pizza, i) => (
              <div key={i}>
                {group.map(
                  (gr, a) =>
                    gr.codigo_grupo === pizza.codigo_grupo && (
                      <li key={a} className="pizza_li">
                        <span>Pizza: {pizza.nome_pizza}</span>
                        <span>Grupo: {gr.nome_grupo}</span>
                        <span>Pequena: {gr.preco_pequena}</span>
                        <span>Grande : {gr.preco_grande}</span>
                        <span>Família : {gr.preco_familia}</span>
                        <span>Gigante : {gr.preco_gigante}</span>
                      </li>
                    )
                )}
              </div>
            ))
          : ""}

        <form onSubmit={handleSubmit(cashSave)}>
          <div className="box-form">
            <table>
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  {/* <th>Data</th> */}
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Pizza</th>
                  <th>Bairro</th>
                  <th>Entregador</th>
                  <th>Pagamento</th>
                  <th>Observação</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Numero_Pedido">
                    <input
                      type="text"
                      id="numero_pedido"
                      name="numero_pedido"
                      size={7}
                      {...register("numero_pedido", { required: true })}
                    />{" "}
                    {errors.numero_pedido && <p>Campo Obrigatório</p>}
                  </td>
                  {/* <td><input type="date" id="datas" name="datas" size={8} value={data} required {...register("datas", { required: true })} style={{ "width": "137px" }} /></td> */}
                  <td data-label="Hora">
                    <input
                      type="time"
                      name="hora"
                      size={5}
                      required
                      {...register("hora", { required: true })}
                    />
                  </td>
                  <td data-label="Nome_Cliente" onChange={(e) => filtroNome(e)}>
                    <input
                      type="text"
                      name="nome_cliente"
                      required
                      {...register("nome_cliente", { required: true })}
                    />{" "}
                  </td>
                  <td data-label="Nome_Pizza" onChange={(e) => filtroPizza(e)}>
                    <input
                      type="text"
                      name="nome_pizza"
                      required
                      {...register("nome_pizza", { required: true })}
                    />
                  </td>
                  <td data-label="Bairro">
                    <input
                      type="text"
                      name="bairro"
                      required
                      {...register("bairro", { required: true })}
                    />
                  </td>
                  <td data-label="Entregador">
                    <input
                      type="text"
                      id="entregador"
                      required
                      name="entregador"
                      size={8}
                      {...register("entregador", { required: true })}
                    />
                  </td>
                  <td data-label="Pagamento">
                    <select
                      id="pagamento"
                      name="pagamento"
                      defaultValue=""
                      required
                      {...register("pagamento", { required: true })}
                    >
                      <option value="" disabled>
                        Selecione
                      </option>
                      <option value="DINHEIRO">DINHEIRO</option>
                      <option value="CARTAO">CARTAO</option>
                      <option value="IFOOD">IFOOD</option>
                      <option value="PIX">PIX</option>
                    </select>
                  </td>
                  <td data-label="Observação">
                    <input
                      type="text"
                      name="observacao"
                      {...register("observacao", { required: true })}
                    />
                  </td>
                  <td data-label="Valor">
                    <input
                      type="number"
                      step="0.010"
                      name="valor"
                      required
                      min={0}
                      max={1000}
                      style={{ width: "75px" }}
                      {...register("valor", { required: true })}
                    />
                  </td>
                </tr>
                {caixa.map((cx, index) => {
                  return (
                    <tr key={`cx${index}`}>
                      <td data-label="Numero_Pedido">
                        <input
                          type="text"
                          value={cx.numero_pedido}
                          disabled
                          size={7}
                        />
                      </td>
                      {/* <td><input type="date" value={cx.datas} size={8} disabled style={{ "width": "137px" }} /></td> */}
                      <td data-label="Hora">
                        <input type="time" value={cx.hora} size={5} disabled />
                      </td>
                      <td data-label="Nome_Cliente">
                        <input type="text" value={cx.nome_cliente} disabled />
                      </td>
                      <td data-label="Nome_Pizza">
                        <input type="text" value={cx.nome_pizza} disabled />
                      </td>
                      <td data-label="Bairro">
                        <input type="text" value={cx.bairro} disabled />
                      </td>
                      <td data-label="Entregador">
                        <input
                          type="text"
                          value={cx.entregador}
                          disabled
                          size={8}
                        />
                      </td>
                      <td data-label="Pagamento">
                        <select defaultValue={cx.pagamento} disabled>
                          <option value={cx.pagamento}>{cx.pagamento}</option>
                          <option value="DINHEIRO">DINHEIRO</option>
                          <option value="CARTAO">CARTAO</option>
                          <option value="IFOOD">IFOOD</option>
                          <option value="PIX">PIX</option>
                        </select>
                      </td>
                      <td data-label="Observação">
                        <input
                          type="text"
                          value={cx.observacao || ""}
                          disabled
                        />
                      </td>
                      <td data-label="Valor">
                        <input
                          type="number"
                          step="0.010"
                          value={cx.valor}
                          disabled
                          min={0}
                          max={1000}
                          style={{ width: "75px" }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="button-remove"
                          onClick={() => deletarRegistro(cx)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="box_options">
            <button onClick={criarPDF}>Relatório</button>
            <button onClick={deletaTodosRegistros}>Excluir tudo</button>
            <input type="submit" value="Salvar" />
            <strong>Valor total : R$ {valorTotal}</strong>
          </div>
        </form>
      </div>
    </div>
  );
}
