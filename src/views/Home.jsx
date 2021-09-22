import "./Home.scss";

import Logo from "../assets/logo.png";

function Home() {
  return (
    <div className="home">
      <h1>DISK PIZZA CALIFÓRNIA</h1>
      <img src={Logo} alt={"logo"} className="logo" />
    </div>
  );
}

export default Home;
