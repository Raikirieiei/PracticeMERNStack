import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = props => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName ] = useState("");
  const [searchZip, setSearchZip ] = useState("");
  const [searchCuisine, setSearchCuisine ] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"]);

  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchZip = e => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  };

  const onChangeSearchCuisine = e => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
    
  };

  const retrieveRestaurants = () => {
    RestaurantDataService.getAll()
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then(response => {
        console.log(response.data);
        setCuisines(["All Cuisines"].concat(response.data));
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveRestaurants();
  };

  const find = (query, by) => {
    RestaurantDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name")
  };

  const findByZip = () => {
    find(searchZip, "zipcode")
  };

  const findByCuisine = () => {
    if (searchCuisine == "All Cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine")
    }
  };

  
  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip}
            onChange={onChangeSearchZip}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">

          <select onChange={onChangeSearchCuisine}>
             {cuisines.map(cuisine => {
               return (
                 <option value={cuisine}> {cuisine.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCuisine}
            >
              Search
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        {restaurants.map((restaurant) => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                    <strong>Address: </strong>{address}
                  </p>
                  <div className="row">
                  <Link to={"/restaurants/"+restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}


      </div>
    </div>
  );
};

export default RestaurantsList;

// import React, { useState, useEffect } from "react";
// import RestaurantDataService from "../services/restaurant";
// import { Link } from "react-router-dom";

// const Restaurant = props => {
//   const initialRestaurantState = {
//     id: null,
//     name: "",
//     address: {},
//     cuisine: "",
//     reviews: []
//   };
//   const [restaurant, setRestaurant] = useState(initialRestaurantState);

//   const getRestaurant = id => {
//     RestaurantDataService.get(id)
//       .then(response => {
//         setRestaurant(response.data);
//         console.log(response.data);
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   };

//   useEffect(() => {
//     getRestaurant(props.match.params.id);
//   }, [props.match.params.id]);

//   const deleteReview = (reviewId, index) => {
//     RestaurantDataService.deleteReview(reviewId, props.user.id)
//       .then(response => {
//         setRestaurant((prevState) => {
//           prevState.reviews.splice(index, 1)
//           return({
//             ...prevState
//           })
//         })
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   };

//   return (
//     <div>
//       {restaurant ? (
//         <div>
//           <h5>{restaurant.name}</h5>
//           <p>
//             <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
//             <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
//           </p>
//           <Link to={"/restaurants/" + props.match.params.id + "/review"} className="btn btn-primary">
//             Add Review
//           </Link>
//           <h4> Reviews </h4>
//           <div className="row">
//             {restaurant.reviews.length > 0 ? (
//              restaurant.reviews.map((review, index) => {
//                return (
//                  <div className="col-lg-4 pb-1" key={index}>
//                    <div className="card">
//                      <div className="card-body">
//                        <p className="card-text">
//                          {review.text}<br/>
//                          <strong>User: </strong>{review.name}<br/>
//                          <strong>Date: </strong>{review.date}
//                        </p>
//                        {props.user && props.user.id === review.user_id &&
//                           <div className="row">
//                             <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
//                             <Link to={{
//                               pathname: "/restaurants/" + props.match.params.id + "/review",
//                               state: {
//                                 currentReview: review
//                               }
//                             }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
//                           </div>                   
//                        }
//                      </div>
//                    </div>
//                  </div>
//                );
//              })
//             ) : (
//             <div className="col-sm-4">
//               <p>No reviews yet.</p>
//             </div>
//             )}

//           </div>

//         </div>
//       ) : (
//         <div>
//           <br />
//           <p>No restaurant selected.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Restaurant;