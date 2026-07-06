import { createContext, useEffect, useState } from "react";
import { menu_list, food_list as static_food_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000"
    const [food_list, setFoodList] = useState(static_food_list); // static items shown immediately
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const currency = "$";
    const deliveryCharge = 5;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }  
            } catch (error) {
                console.error("Error calculating cart amount:", error);
            }
        }
        return totalAmount;
    }

    // Category display order matches ExploreMenu
    const CATEGORY_ORDER = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data.success) {
                const backendItems = response.data.data || [];
                // Merge static dummies + real DB items, then sort by category order
                // so admin-added items (e.g. "Cheese Cake") appear AMONG the same
                // category items, not appended at the very end of the list.
                const merged = [...static_food_list, ...backendItems];
                merged.sort((a, b) => {
                    const ai = CATEGORY_ORDER.indexOf(a.category);
                    const bi = CATEGORY_ORDER.indexOf(b.category);
                    // Unknown categories go to end
                    const aIdx = ai === -1 ? 999 : ai;
                    const bIdx = bi === -1 ? 999 : bi;
                    return aIdx - bIdx;
                });
                setFoodList(merged);
            } else {
                setFoodList(static_food_list);
            }
        } catch (error) {
            console.error("Backend not reachable, using static food list:", error.message);
            setFoodList(static_food_list);
        }
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            if (response.data.success && response.data.cartData) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("Error loading cart data:", error.message);
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;