import React from "react";

import Modal from '../components/modal/Modal'

import "./Cadastro.scss";

import CadastroCliente from "../components/CadastroCliente"
import CadastroGrupo from '../components/CadastroGrupo'

export default function Cadastro() {

  return (
    <div id="cadastro">
      <div>
        <h2>Cadastros</h2>
      </div>

      <header>
        {/* <div className={"cod-cliente"}>
          <label htmlFor="cod-cliente">Código do Cliente: </label>
          <input type="text" id="cod-cliente" name="cod-cliente" size="5" />
        </div> */}
        <div className={"menu-options"}>
          <Modal className={'first'} show={"Cadastrar Cliente"} title={"Cadastro de Clientes"}>
            <CadastroCliente />
          </Modal>
          <Modal className={'third'} show={"Cadastrar Pizza"} title={"Cadastro de pizza"}>
            caixa
          </Modal>
          <Modal className={'second'} show={"Cadastrar Grupo"} title={"Cadastro de grupos"}>
            <CadastroGrupo />
          </Modal>
        </div>
      </header >

    </div >
  );
}
