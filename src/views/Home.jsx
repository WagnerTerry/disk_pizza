import "./Home.scss";

import Nav from '../components/Nav'
import Logo from "../assets/logo.png";

function Home() {
  return (
    <div id="home">
      <Nav name="Cadastro" path="caixa" name2="caixa" path2="caixa" name3="Cardapio" path3="cardapio" />

      <div className="home-logo">
        <h1>DISK PIZZA CALIFÓRNIA</h1>
        <img src={Logo} alt={"logo"} className="logo" />
      </div>
    </div>
  );
}

export default Home;
