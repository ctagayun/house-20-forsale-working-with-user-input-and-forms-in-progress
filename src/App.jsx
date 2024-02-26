import * as React from 'react';
import './App.css'
import Header from "./header";
import HouseList from './house/houseList';
import Search from './house/search';
import HouseDetail from '../src/house/housedetail';
import navValues from "../src/helpers/navValues"; //Step 1 - define nav structure
import ComponentPicker from "./componentPicker";
/*
      At the moment initialHouses is unstateful variable
      To gain control over the list, lets make it stateful.
      By using it as initial state in React's useState Hook. The 
      returned values from the array are the current state (stories) 
      and the state updater function (setStories):
    */
const welcome = {
    subject: 'List of ',
    title: 'Houses for Sale',
   };   

const initialStories = 
[
    {
      "objectID": 1,
      "address": "12 Valley of Kings, Geneva",
      "country": "Switzerland",
      "description": "A superb detached Victorian property on one of the town's finest roads, within easy reach of Barnes Village. The property has in excess of 6000 sq/ft of accommodation, a driveway and landscaped garden.",
      "price": 900000,
      "photo": "277667"
    },
    {
      "objectID": 2,
      "address": "89 Road of Forks, Bern",
      "country": "Switzerland",
      "description": "This impressive family home, which dates back to approximately 1840, offers original period features throughout and is set back from the road with off street parking for up to six cars and an original Coach House, which has been incorporated into the main house to provide further accommodation. ",
      "price": 500000,
      "photo": "462358"
    },
    {
      "objectID": 3,
      "address": "Grote Hof 12, Amsterdam",
      "country": "The Netherlands",
      "description": "This house has been designed and built to an impeccable standard offering luxurious and elegant living. The accommodation is arranged over four floors comprising a large entrance hall, living room with tall sash windows, dining room, study and WC on the ground floor.",
      "price": 200500,
      "photo": "259600"
    },
    {
      "objectID": 4,
      "address": "Meel Kade 321, The Hague",
      "country": "The Netherlands",
      "description": "Discreetly situated a unique two storey period home enviably located on the corner of Krom Road and Recht Road offering seclusion and privacy. The house features a magnificent double height reception room with doors leading directly out onto a charming courtyard garden.",
      "price": 259500,
      "photo": "534182"
    },
    {
      "objectID": 5,
      "address": "Oude Gracht 32, Utrecht",
      "country": "The Netherlands",
      "description": "This luxurious three bedroom flat is contemporary in style and benefits from the use of a gymnasium and a reserved underground parking space.",
      "price": 400500,
      "photo": "164558"
    }
  ];  


 //  We need for this because we will fetch data from an array
const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      0
    )
  );  

//The first thing to do when using React.useReducer hook
//is to define a reducer function. 
//The function called "storiesReducer" receives an empty array
//returns an array with two items:
//          houses (current state) and
//          dispatchHouses (state updater function)

//The updater function updates the state "houses" IMPLICITLY (A)
//dispatching an "action" for the reducer, The "action" comes with:
//     1. Type
//     2. and optional Payload

const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT': //distinct type and payload 
                                 //received by dispatchStories 
                                 //dispatch function
                                 //so we need to add it here
        return {
          ...state,              //return new state object with KV pairs
                                 //via spread operator from current state object
          isLoading: true,
          isError: false,
        };
      case 'STORIES_FETCH_SUCCESS': //distinct type and payload 
                                    //received by dispatchStories 
                                    //dispatch function
                                    //so we need to add it here
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case 'STORIES_FETCH_FAILURE':   //another distinct type and payload 
                                      //received by dispatchStories 
                                      //dispatch function 
                                      //so we need to add it here
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case 'REMOVE_STORY':              //another distinct type and payload 
                                        //received by dispatchStories 
                                        //dispatch function
                                        //so we need to add it here
                                    //Observe how the REMOVE_STORY action 
                                    //changed as well. It operates on the 
                                    //state.data, and no longer just on the
                                    // plain "state".
        return {
          ...state,
          data: state.data.filter(  //now operate on state.data not just "state"
            (story) => action.payload.objectID !== story.objectID
          ),
        };

      case 'ADD_HOUSE':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
       };

      default:
        throw new Error();
    }
  };
  
  //key and initialState are the parameters passed to this function call
  const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem('key') || initialState //get item from localstorage 
                                        //if not there use initialState as value
    );
    
    React.useEffect(() => {
      console.log('useEffect fired. Displaying value of dependency array ' + [ value, key]  );
        localStorage.setItem(key, value); //store value in the local storage
        },
        [value, key]   //Dependency array. if this changes localStorage.setItem fires
        ); //EOF useEffect
    
    //the returned values are returned as an array.
    return [value, setValue]; 

} //EOF create custom hook
  
//Step 2: Declared navigationContxt outside of the component. Since it is 
//needed by child components we need to export it (Step3).
//Note: navValues.home is the default provider
// (see src/helper.navValues.js) 
//navValues.home points to "home" where HouseList is 
// where HouseList is rendered

//Important! When the value of the context changes
// all consumer components will be re-rendered

const navigationContext = React.createContext(navValues.houselist);

/*===============================================
// App section
/===============================================*/
const App = () => {
  console.log("App component fires");

  const [searchTerm, setSearchTerm] =  useStorageState ( //<-- custom hook
    'search', //key
    '',  //Initial state
    );

   //data: [], isLoading, isError flags hooks merged into one 
   //useReducer hook for a unified state.
   const [stories, dispatchStories] = React.useReducer( //A
   storiesReducer,
   { data: [], isLoading: false, isError: false } //We want an empty list data [] 
                                                  //for the initial state, set isloading=false
                                                  //is error=false
 ); //EOF React.useReducer

//This side effect fires because we made a call to
React.useEffect(() => {
  //dispatchStories receiving different payload
  dispatchStories({ type: 'STORIES_FETCH_INIT' }); //for init
                  //dispatchStories receives STORIES_FETCH_INIT as type

  getAsyncStories() //this function reads an inline array called "initialStories"
    .then((result) => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.stories,
      });
    })
    .catch(() =>
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    );
}, []); //EOF React.useEffect(


const handleRemoveStory = (item) => {
  dispatchStories({
    type: 'REMOVE_STORY',
    payload: item,
  });
};


  //"houses" is the array of houses newly created by the 
  //filter() method.
 // const searchedHouses = houses.filter((house) =>

 // house.country.toLowerCase().includes(stateOfSearchComponent.toLowerCase())
//);
  
const handleSearch = (event) => {
  setSearchTerm(event.target.value);
};

const handleSearchSubmit = () => {  //CC
  setUrl(`${API_ENDPOINT}${searchTerm}`);
};

  //by addressing the state as object and not as array anymore,
  //note that it operates on the state.data no longer on the plain state.
  //"stories" here is the state updated by the reducer function (see line 362)
  const searchedStories = stories.data.filter((story) =>
    story.country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddHouse = (item) => { 
    dispatchStories({
      type: 'ADD_HOUSE',  //TYPE
      payload: [...searchedStories, //contains the searchedHouses stories
      {                             //the below records will be appended to the end of ...houses
        objectID: 9,
        address: "1916 Rustic Oak Road",
        country: "USA",
        price: 25000000
      },
     
       ] }  
           
    );

  }
   
  const onSelectHouse = (event) => {
    //var myVal = e.target || window.event.target;
    alert('td clicked');
    event.stopPropagation();
  };

  /*========================================================
  // Implementation of use case: user clicks on 
  // HouseList row and displays HouseDetail component
  // and then want to be able to go back to the HouseList
  // displayed earlier
  ==========================================================*/
  //Introduce another state for displaying HouseDetail.
  //I am not passing initial value that means selectedHouse 
  //will be initiall undefined.
  //No longer needed by navigation context
  //const [selectedHouse, setSelectedHouse] = React.useState(); //remove

//Not needed by navigation context
 // Example setSelectedHouseWrapper with no useCallback hook
 // This is the coe that renders HouseList
 //  const setSelectedHouseWrapper = (house) => {  //remove
 //    setSelectedHouse(house);
 //  } 
 
  //  Define a callback function to avoid unecessary rerenders in
  //the future when other developers are going to add functionality,
  //useCallback is good to use.
  //   (navTo) => arrow  means pass it as parameter "setNavState"
  //             and use it to update "navState"
 
  
   //Let's create a wrapper function called "navigate". Use USECALLBACK
   //hook WITH empty dependency array. EMPTY IS USED because this 
   //wrapper function will be made AVAILABLE to all application components.

   //This is how it works:
   //   1. Within the useCallback hook CALL setNavState state setter
   //to update navState. 
   //   2. Pass the following paamters to setNavState
   //        navTo - where to navigate to
   //        param 
   //        and "navigate" - the name of the wrapper function
   //   3. Update the parameter to setNavState to accept an
   //      include "navigate". Since we have two parameters to the
   //      the state updater (navTo, navigater), we need to pass 
   //      it as an "object". To accomplish this a affix "current:"
   //      
   // An object is passed with "current" property containing the 
   //navValues.home (home: "Home", // where HouseList is rendered) 
   //and the function called "navigate"  
   //https://app.pluralsight.com/ilx/video-courses/9a3771fa-626e-4708-8634-c49cc8616922/972a5150-beb4-453d-9097-82a1816770e0/ba3c6dd2-a1b0-409c-91a6-2c3961b775e8
   //Note: add the "param" to houseDetail to


   const navigate = React.useCallback(
      (navTo, param) => setNavState({current:navTo, param, navigate}), 
              //Add "navTo", "param", "navigate" to the state object
              //By passing the three items in the state object,
              //we are passing a complex object instead of a simple variable:                             //the callback function "navigate", param,
              //  1. "navTo" indicates where to navigate to.
              //  2. "navigate" is the name of the callback()
              //  3. "param" points to the instance of housedetail
              //      we are going to display IN THE HOUSEDETAIL component
         
         //Impt. Current: means instead of just the navTo value an object
         //is passed in with the "CURRENT" property containing the navTo
         //and the function "navigate". Refer to line 342:  
         //            
         //    const [navState, setNavState] = 
         //        React.useState({current: navValues.houselist, navigate});
      
      [] //Impt. Use an empty dependency array because the function will
         //made available to all components and we are not sure
         //what they will do with it. In the future other developers
         //might add functionality... then useCallback is good to use

   );
 
  //Impt. Again  Current: means instead of just the navTo value an object
  //is passed in with the "CURRENT" property containing the navValues
  //and the function "navigate"      
 const [navState, setNavState] = React.useState(
              {current: navValues.houselist, navigate});
    
  return (
    //Provider give values of the context to its child components.
    //Very important! Dont provide static value. But create 
    //state:
    //     const [navState, setNavState] = React.useState()
    // and use it as a value and manipulate its value using
    //setNavState in the child components (see houseRow and houseList)
    <navigationContext.Provider value={navState}>
        <Header  headerText={welcome} /> 
        
        <Search 
                id="search"
                value={searchTerm}
                isFocused  
                onInputChange={handleSearch}  
                onClick={handleSearchSubmit} 
                > 
          </Search>
       
        
      <ComponentPicker currentNavLocation= {navState.current} 
                            //Component picker is passed the CURRENT nav location
                            //with a PROP.
                            
                            //use state instead of static value
                            //setting static values like currentNavLocation= {navValues.houselist}
                            //is not good. Instead create another state and use it
                            //for this purpose. See:
                            //   const [navState, setNavState] = 
                            //   React.useState({current: navValues.houselist, 
                            //      navigate});
                            //navState can be dynamically changed. In our case 
                            //we want the child components to be the one to 
                            //dynamically change "navState" because they are the
                            //ones who have to INITIATE NAVIGATION. To accomplish
                            //this let's create a WRAPPER FUNCTION called "navigate"
                        list={searchedStories} 
                        onRemoveHouse={handleRemoveStory} 
                        onAddHouse={handleAddHouse} 
                        onSelectHouse={onSelectHouse}
                        //selectedHouseSetter= {setSelectedHouseWrapper}
      />          
       
    </navigationContext.Provider>
  );
};
//EOF App.jsx section

export {navigationContext} //Step3 - need to export because child components need it
                           //
export default App



//========================================================== 
 //Note on Map:
 //Within the map() method, we have access to each object and its properties.
 
 //useState
 //By using useState, we are telling React that we want to have a 
 //stateful value which changes over time. And whenever this stateful value 
 //changes, the affected components (here: Search component) 
 //will re-render to use it (here: to display the recent value).

 /* 
         {selectedHouse ? (
            <HouseDetail house={selectedHouse} />   
          ) : ( 
            <>  
            <Search 
                id="search"
                value={searchTerm}
                isFocused  
                onInputChange={handleSearch}  
                onClick={handleSearchSubmit} 
                >
            <strong>Search:</strong>
            </Search>
            <HouseList list={searchedStories} 
                        onRemoveHouse={handleRemoveStory} 
                        onAddHouse={handleAddHouse} 
                        onSelectHouse={onSelectHouse}
                        selectedHouseSetter= {setSelectedHouseWrapper} 
              /> 
            </>
                        
          )}  

     The filter() method takes a function 
        as an argument, which accesses each item in the array and returns /
        true or false. If the function returns true, meaning the condition is 
        met, the item stays in the newly created array; if the function 
        returns false, it's removed from the filtered array.

  
 */
 
 /*Note on Map:
   Within the map() method, we have access to each object and its properties.

 // concatenating variables into a string
    var fullName = `${firstName} ${lastName}`
    console.log(fullName);


 //useState
    By using useState, we are telling React that we want to have a 
 stateful value which changes over time. And whenever this stateful value 
 changes, the affected components (here: Search component) 
 will re-render to use it (here: to display the recent value).

  //Work flow of a useState:
       When the user types into the input field, the input field's change event 
      runs into the event handler. The handler's logic uses the event's value 
      of the target and the state updater function to set the updated state. 
      Afterward, the component re-renders (read: the component function runs). 
      The updated state becomes the current state (here: searchTerm) and is 
      displayed in the component's JSX.

  //Arrow Function
    function getTitle(title) { - convert to arrow function see below
    
    const getTitle =(title) => 
       (
        title
       );

    Eliminate bracket and "return" statement if no business logic before 
    the function - concise
   

  //Arrow function - 
   If there is a business business logic. Otherwise retain the {} and
   put a "return" statement 
     const App = () => {
       ...
       return xyz;
     } 
 
  //How to use a React.Reducer hook 
  To use Reducer (1) first define a reducer function.
     1. A reducer action is always associated with a type. As best 
        practice with a payload.
        Example:
          const storiesReducer = (state, action) =>{
          if (action.type === 'SET_STORIES'){
            //If the type matches a condition in the reducer. Return a new
            //state based on the incoming state and action
            return action.payload;
          }
          else{
          //throw an error if isn't covered by the reducer to remind yourself
          //that the implementation is not covered
            throw new Error();
          }
        }
      2. The second thing to do is to replaceReact.useState to use a reducer hook
         like this: 

          const [stories, dispatchStories] = React.useReducer(storiesReducer,[]);

          1. receives a reducer function called "storiesReducer"
          2. receives an initial state of empty array []
          3. returns an array with 2 item: 
            - The first item is "stories" which is the current state
            - The second item is the updater function named "dispatchStories"
            Unlike useState, the updater function of Reducer sets the state
            "implicitly" by dispatching an "action". Example:
               dispatchStories({
                 type: 'SET_STORIES',   <== this is the action
               payload: result.data.stories,
             });
       
 */