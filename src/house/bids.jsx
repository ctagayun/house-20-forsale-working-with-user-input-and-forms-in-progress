import { useState } from "react";
import currencyFormatter from "../helpers/currencyFormatter";
import loadingStatus from "../helpers/loadingStatus";
import useBids from "/hooks/useBids";
import LoadingIndicator from "./loadingIndicator";

const Bids = ({ house }) => {

  const myHouseInBidsJSX = JSON.stringify(house);
  console.log("myHouseInBidsJSX = " + myHouseInBidsJSX);

  //Call useBids hook to fetch bids.
  //AFTER USEBID RUNS, it returns "bids", addBid" and "loadingState".
  //So in here Bids.jsx we destructure "bids", addBid" and "loadingState.
  const { bids, loadingState, addBid } = useBids(house.objectID);

  //I am defining an emptyBid
  const emptyBid = {
    houseId: house.objectID, //this is id of the "house" prop
    bidder: "",
    amount: 0,
  };

  //Next I create a state called "newBid" with initial value of "emptyBid"
  const [newBid, setNewBid] = useState(emptyBid);

  if (loadingState !== loadingStatus.loaded)
    console.log("Loading Status in Bids.jsx = " +  loadingStatus.loaded);

    console.log("Loading State in Bids.jsx = " +  loadingState);

    return <LoadingIndicator loadingState={loadingState} />;

  
  const onBidSubmitClick = () => {
    addBid(newBid); //add the bid to the state
    setNewBid(emptyBid); //after adding the bid, I am resetting the 
                        //bid to an empty bid because I want to reset
                        //the input form to the default bidder and 
                        //amount values
  };

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Bidder</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b) => (
                <tr key={b.id}>
                  <td>{b.bidder}</td>
                  <td>{currencyFormatter.format(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-5">
          <input
            id="bidder"
            className="h-100"
            type="text"
            value={newBid.bidder} //first input set to the property of newBid
            onChange={(e) => setNewBid({ ...newBid, bidder: e.target.value })}
                            //onChange handler sets the bid in the newBid
            placeholder="Bidder"
          ></input>
        </div>
        <div className="col-5">
          <input
            id="amount"
            className="h-100"
            type="number"
            value={newBid.amount} //second input is the amount so type is  number
            onChange={(e) =>
              setNewBid({ ...newBid, amount: parseInt(e.target.value) })
                         //onChange handler sets the amount in the newBid
            }            //except for the fact I converted the value to int
            placeholder="Amount"
          ></input>
        </div>
        <div className="col-2">
          <button className="btn btn-primary" onClick={onBidSubmitClick}> 
            Add
          </button>
        </div>
      </div>
    </>
  );
};

export default Bids;
