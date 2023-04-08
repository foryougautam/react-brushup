
import { CDN_URL } from "../utils/constant";
const RestaurentCard = (props) => {
    const { resData } = props;
    const {
      cloudinaryImageId,
      name,
      cuisines,
      avgRating,
      deliveryTime,
      costForTwo,
    } = resData?.data;
    return (
      <div className="res-card" style={{ backgroundColor: "#f0f0f0" }}>
        <img
          alt="res-logo"
          className="res-logo"
          src={
            CDN_URL +
            cloudinaryImageId
          }
        />
        <h3>{name}</h3>
        <h4>{cuisines.join(", ")}</h4>
        <h4>{avgRating} Stars</h4>
        <h4>{costForTwo / 100} For two</h4>
        <h4>{deliveryTime} Minutes</h4>
      </div>
    );
  };

  export default RestaurentCard;