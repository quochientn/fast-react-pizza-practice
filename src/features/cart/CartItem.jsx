import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import EditItemQuantity from "./EditItemQuantity";

function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li className="py-2 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <EditItemQuantity pizzaId={pizzaId} />
        <DeleteItem pizzaId={pizzaId} />
      </div>
    </li>
  );
}

export default CartItem;
