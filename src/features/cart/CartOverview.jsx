import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getCart, getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  const cartTotalQuantity = useSelector(getTotalCartQuantity);
  const cartTotalPrice = useSelector(getTotalCartPrice);
  const cart = useSelector(getCart);

  if (!cart.length) return;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-800 p-4 uppercase text-stone-200 sm:px-6">
      <p className="space-x-4 text-stone-300 sm:space-x-6">
        <span>{cartTotalQuantity} pizzas</span>
        <span>{formatCurrency(cartTotalPrice)}</span>
      </p>
      <Link to="cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
