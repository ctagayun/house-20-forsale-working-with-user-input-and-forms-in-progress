import { navigationContext } from "./App";
import { logo } from "./header.module.css";
import { useContext } from "react";
import navValues from "./helpers/navValues";

const subtitleStyle = {
  fontStyle: "italic",
  fontSize: "x-large",
  color: "coral",
};

const Header = (props) => {
   
  const {navigate} = useContext(navigationContext);

  //console.log("Props= " + props.headerText.title + props.headerText.title);
  return (
    <header className="row mb-4">
      <div className="col-2">
        <img src="./src/images/GloboLogo.png" 
        alt="logo" 
        className={logo}
        onClick={() => navigate(navValues.houselist)} />
      </div>
      <div className="col-7 mt-5" style={subtitleStyle}>
         {props.headerText.subject + props.headerText.title}
      </div>
    </header>
  );
};

export default Header;
