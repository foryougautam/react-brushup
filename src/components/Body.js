import RestaurantCard from "./RestaurantCard";
import { useEffect, useState } from "react"; /* This is named export */
import Shimmer from "./Shimmer"; /* This is default export */
import { swiggy_api_URL } from "../constants";
import { Link } from "react-router-dom";
import { filterData } from "./Utils/Helper"; // For reusability or readability filterData function is added in Helper.js file of Utils folder

// Body Component for body section: It contain all restaurant cards
const Body = () => {
  const [searchText, setSearchText] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  let offSet = 0;

  const handleScroll = (e) => {
    console.log("Hi");
    if(window.innerHeight+e.target.documentElement.scrollTop+1 > e.target.documentElement.scrollHeight){
      getMoreRestaurent();
    }
  };

  useEffect(() => {
    getRestaurants();
    window.addEventListener("scroll", handleScroll);
  }, []);

  // async function getRestaurant to fetch Swiggy API data
  async function getRestaurants() {
    try {
      const response = await fetch(swiggy_api_URL);
      const json = await response.json();
      // updated state variable restaurants with Swiggy API data
      setAllRestaurants(json?.data?.cards[2]?.data?.data?.cards);
      setFilteredRestaurants(json?.data?.cards[2]?.data?.data?.cards);
      console.log(json?.data?.cards[2]?.data?.data?.cards);
    } catch (error) {
      console.log(error);
    }
  }

  
  // async function getRestaurant to fetch Swiggy API data
  async function getMoreRestaurent() {
    try {

console.log(offSet);
      const response = await fetch(`https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.5874806&lng=77.3683319&offset=${offSet}&sortBy=RELEVANCE&pageType=SEE_ALL&page_type=DESKTOP_SEE_ALL_LISTING`
      );
      const json = await response.json();
      let newAllRestaurent =[]
      // updated state variable restaurants with Swiggy API data
      json?.data?.cards.forEach((element) => {
        newAllRestaurent.push(element.data);

      });
        //setAllRestaurants(oldRestaurent => [...oldRestaurent, ...newAllRestaurent]);
        setFilteredRestaurants(oldRestaurent => [...oldRestaurent, ...newAllRestaurent]);

      offSet+= 15;
    } catch (error) {
      console.log(error);
    }
  }


  // use searchData function and set condition if data is empty show error message
  const searchData = (searchText, restaurants) => {
    if (searchText !== "") {
      const data = filterData(searchText, restaurants);
      setFilteredRestaurants(data);
      setErrorMessage("");
      if (data.length === 0) {
        setErrorMessage(
          `Sorry, we couldn't find any results for "${searchText}"`
        );
      }
    } else {
      setErrorMessage("");
      setFilteredRestaurants(restaurants);
    }
  };

  // if allRestaurants is empty don't render restaurants cards
  if (!allRestaurants) return null;

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search a restaurant you want..."
          value={searchText}
          // update the state variable searchText when we typing in input box
          onChange={(e) => {
            setSearchText(e.target.value);
            // when user will enter the data, it automatically called searchData function so it work same as when you click on Search button
            searchData(e.target.value, allRestaurants);
          }}
        ></input>
        <button
          className="search-btn"
          onClick={() => {
            // user click on button searchData function is called
            searchData(searchText, allRestaurants);
          }}
        >
          Search
        </button>
      </div>
      {errorMessage && <div className="error-container">{errorMessage}</div>}

      {/* if restaurants data is not fetched then display Shimmer UI after the fetched data display restaurants cards */}
      {allRestaurants?.length === 0 ? (
        <Shimmer />
      ) : (
        <div className="restaurant-list">
          {/* We are mapping restaurants array and passing JSON array data to RestaurantCard component as props with unique key as restaurant.data.id */}
          {filteredRestaurants.map((restaurant) => {
            return (
              <Link
                to={"/restaurant/" + restaurant.data.id}
                key={restaurant.data.id}
              >
                {" "}
                {/* if we click on any restaurant card it will redirect to that restaurant menu page */}
                <RestaurantCard {...restaurant.data} />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Body;
