import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {

  console.log(category)
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes crafted to satisfy every craving.
      </p>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              key={item.menu_name || index}
              className="explore-menu-list-item"
              role="button"
              tabIndex="0"
              onClick={() =>
                setCategory(prev =>
                  prev === item.menu_name ? 'All' : item.menu_name
                )
              }
            >

              <img
                className={category === item.menu_name ? 'active' : ''}
                src={item.menu_image}
                alt={`Image of ${item.menu_name}`}
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;

