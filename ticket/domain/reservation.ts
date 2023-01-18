import { Seat } from "./seat";
import { Screen } from "./screen";
import { Discount } from "./discount";
import { baseTicketPrice, Customer } from "./customer";
import { sumOfArr } from "../lib/math";

export type Reservation = {
  id: number;
  seat: Seat;
  customer: Customer;
  price: number;
  discounts: Discount[];
  reservedAt: Date;
};

export const getReservationPrice = (
  reservation: Pick<Reservation, "discounts">,
  screen: Pick<Screen, "options">,
  customer: Pick<Customer, "birth">
): number => {
  return (
    baseTicketPrice(customer) +
    sumOfArr(screen.options.map((o) => o.extraPrice)) -
    sumOfArr(reservation.discounts.map((d) => d.price))
  );
};
