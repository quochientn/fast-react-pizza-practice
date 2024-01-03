import { configureStore } from "@reduxjs/toolkit";

import reducerUser from "./features/user/userSlice";
import reducerCart from "./features/cart/cartSlice";

const store = configureStore({
  reducer: { user: reducerUser, cart: reducerCart },
});

export default store;
