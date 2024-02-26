import * as React from 'react';
//import { useContext } from "react";
import currencyFormatter from "../helpers/currencyFormatter";
import navValues from "../helpers/navValues";
import { navigationContext } from "/src/app"; //exported from app.js

//prop ahouserow is a one row to be written to HouseList component
const HouseRow = ({ahouserow, onRemoveItem, onSelectHouse}) => {
   
   console.log("House Row fired")
   const myHouse = JSON.stringify(ahouserow);
   console.log("Clicked House prop = " + myHouse);

    //Call useContext on the navigationContext.
    //This returns the state "object" consisting of 
    //    navTo 
    //    navigate
    //  setNavState({current:navTo, navigate})
    //we passed setNavState. (See line 304 inApp.jsx)

    //Since an object is returned (state) instead of a single
    //variable, we need to destructure "navigate" so that we 
    //can access its properties 
    const {navigate} = React.useContext(navigationContext);

    //After destructuring we can call navigate(): 
    //   navigate(navValues.housedetail, housedetail)}
    //     1. navValues.housedetail key-value pair points to 
    //        HouseDetail component
    //     2. housedetail the second parameter points to an INSTANCE
    //        of HouseDetail component that we want to display
    
    return(
    <tr> 
        <td onClick={() => navigate(navValues.housedetail, ahouserow)}> 
        <a>{ahouserow.objectID} </a> 
     </td>
     <td>{ahouserow.address}</td>
     <td>{ahouserow.country}</td>
    
     { 
     ahouserow.price && (
     <td className={`${ahouserow.price >= 500000 ? "text-primary" : ""}`}> 
       {currencyFormatter.format(ahouserow.price)}
     </td>
     )
     }
     <td>
     <span>
      <button className="btn btn-primary" type="button" onClick={() => onRemoveItem(ahouserow)}>
        Delete
      </button>
    </span>
     </td>
    </tr>
     );
    };

//Memoizing is way to cache the output of JSX component 
//so that it doesn't re-render. It is done by wrapping the 
//component with React.memo hook
const HouseRowMemoized = React.memo(HouseRow)

export default HouseRow;
//exporting the memoized version will let you use that 
//version in the HouseList
export {HouseRowMemoized}; 