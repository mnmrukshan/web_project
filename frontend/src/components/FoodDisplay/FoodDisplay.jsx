import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../Fooditem/Fooditem'
import { StoreContext } from '../../Context/StoreContext'

// MongoDB ObjectIds are 24-character hex strings
const isMongoId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

const FoodDisplay = ({category}) => {

  const {food_list} = useContext(StoreContext);

  const filteredItems = food_list.filter(item =>
    category === "All" || category === item.category
  );

  return (
    <div className='food-display' id='food-display'>
      <h2>{category === "All" ? "Top dishes near you" : `${category}`}</h2>
      <p className='food-display-subtitle'>
        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
      </p>
      {filteredItems.length === 0 ? (
        <div className='food-display-empty'>
          <p>No items found{category !== "All" ? ` in "${category}"` : ""}.</p>
          <span>Check back later or browse another category.</span>
        </div>
      ) : (
        <div className='food-display-list'>
          {filteredItems.map((item) => (
            <FoodItem
              key={item._id}
              image={item.image}
              name={item.name}
              desc={item.description}
              price={item.price}
              id={item._id}
              isNew={isMongoId(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
