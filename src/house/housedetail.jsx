/*
  Host this component in app.js. Display this component 
  conditionally (display houselist or this component)
*/

import { useContext } from "react";
import currencyFormatter from "../helpers/currencyFormatter";
import defaultPhoto from "../images/defaultPhoto";
import { navigationContext } from "/src/app";
import navValues from "../helpers/navValues";
import Bids from "./bids";

const HouseDetail = () => {
  console.log("House Detail fired")

   //const detailHouse = JSON.stringify(house);
   //console.log("Detail House prop = " + detailHouse);
   
  //Access the navigation context
  //First destructure param and RENAME it to housedetail 
  //for clarity AND WE DON'T HAVE TO CHANGE IN THE 
  //ORIGINAL JSX (e.g  housedetail.country, housedetail.address)
  const {param: housedetail} = useContext(navigationContext);
  const {navigate: navigate} = useContext(navigationContext);
  const myHouse = JSON.stringify(housedetail);
  console.log("House Detail STORED IN PARAM IS = " + myHouse);
  return (
    <div>
      <div className="row">
        <div className="col-6">
          <div className="row">
          <img
            className="img-fluid"
            src={
              housedetail.photo ? `./src/images/houseImages/${housedetail.photo}.jpeg` : defaultPhoto
            }
            alt="HouseDetail picture"
          />
          </div>
        </div>
        <div className="col-6">
        <div className="row mt-2">
          <h5 className="col-12">{housedetail.country}</h5>
        </div>
        <div className="row">
          <h3 className="col-12">{housedetail.address}</h3>
        </div>
        <div className="row">
          <h2 className="themeFontColor col-12">
            {currencyFormatter.format(housedetail.price)}
          </h2>
        </div>
        <div className="row">
          <div className="col-12 mt-3">{housedetail.description}</div>
        </div>
       
         <Bids house={housedetail} />
      </div>


       <div className="row">
          <div className="col-1">
          <button className="btn btn-success btn-sm float-right"
              type="btn"  onClick={() => navigate(navValues.houselist)} >
                Cancel 
          </button>
         </div>  
       </div>
     </div>
      
    </div>
    
  );
};

export default HouseDetail;

