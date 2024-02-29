import { useEffect, useState } from "react";
import useGetRequest from "./useGetRequest";

//This hook is called from bids.jsx component
const useBids = (houseId) => {

  console.log("ObjectID in useBid.jsx hook = " + houseId);
  
  const [bids, setBids] = useState([]);
  
  //useBids() function reuses the useGetRequest hook to get the 
  //bids from the API. 'houseId' appended to the url is the 
  //prop "houseId".
  //It uses bids.json as a data source
  const { get, loadingState } = useGetRequest(`/api/bids/${houseId}`);

  //The code in useEffect is basically the same as useHouses (study this)
  useEffect(() => {
    const fetchBids = async () => {
      const bids = await get();
      setBids(bids);
    };
    fetchBids();
  }, [get]);

  //this function takes a bid and post it to the API.
  //Javascript fetch API can also do POSTS requests.
  //This code also sets the needed headers and serializes
  //the bid to JSON
  const postBid = async (bid) => {
    await fetch(`/api/bids/${bid.houseId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bid),
    });
  };

  //postBid isn't exported but called in here
  //which also changes the state
  const addBid = (bid) => {
    postBid(bid);
    setBids([...bids, bid]); //changes the state. It uses the spread
                          //operator taking all the elements from 
                          //the previous state array of "bids" while adding
                          //a new one - this will cause a rerender which
                          //will cause the newly entered bid to be displayed.
  };

  //the addBid, loadingState, bids are returned by useBids. 
  //So in the Bids.jsx we can destructure it in order to use the 
  //values
  return { bids, loadingState, addBid }; //
};

export default useBids;
