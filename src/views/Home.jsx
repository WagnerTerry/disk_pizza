import "./Home.scss";

import Nav from '../components/Nav'
import Logo from "../assets/logo.png";

function Home() {
  return (
    <div id="home">
      <Nav />
      {/* <Nav name="Cadastro" path="cadastro" name2="Caixa" path2="caixa" name3="Cardapio" path3="cardapio" /> */}

      <div className="home-logo">
        <h1>DISK PIZZA CALIFÓRNIA</h1>
        <img src={Logo} alt={"logo"} className="logo" />
      </div>
    </div>
  );
}

export default Home;
