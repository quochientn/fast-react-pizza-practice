import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";

import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: addressError,
  } = useSelector((state) => state.user);
  const cart = useSelector(getCart);
  const dispatch = useDispatch();

  const isLoadingAddress = addressStatus === "loading";

  const cartTotalPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? cartTotalPrice * 0.2 : 0;
  const totalPrice = cartTotalPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-3">
      <h2 className="mb-6 mt-4 text-xl font-semibold">
        Ready to order? Let's go!
      </h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center">
          <label className="md:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 md:basis-40 md:flex-row md:items-center">
          <label className="md:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 px-6 py-1 text-sm text-red-600">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 md:basis-40 md:flex-row md:items-center">
          <label className="md:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              defaultValue={address}
              disabled={isLoadingAddress}
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 px-6 py-1 text-sm text-red-600">
                {addressError}
              </p>
            )}
          </div>

          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[35px] z-10 md:right-[6px] md:top-[6px]">
              <Button
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
                disabled={isLoadingAddress}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-8 flex items-center gap-4">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
            className="h-5 w-5 accent-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-offset-1"
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />

          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />

          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? "Processing..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone = "Please use valid phone number!";

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
