import {
  Customer,
  Discount,
  Play,
  Reservation,
  Screen,
  ScreenOption,
  Seat,
} from "@prisma/client";
import { customerAgeOnDate } from "./customer";

export type ReservationCreate = {
  play: Pick<Play, "datetime">;
  customer: Pick<Customer, "birth">;
  screenOptions: Array<Pick<ScreenOption, "extraPrice">>;
  discounts: Array<Pick<Discount, "price">>;
};

export type ReservationRepository = {
  create(reservation: ReservationCreate): Promise<Screen["id"]>;
};

export const calculateReservationPrice = (reservation: {
  play: Pick<Play, "datetime">;
  customer: Pick<Customer, "birth">;
  screenOptions: Array<Pick<ScreenOption, "extraPrice">>;
  discounts: Array<Pick<Discount, "price">>;
}) => {
  const { play, customer, screenOptions, discounts } = reservation;

  const basePrice = 1800;
  const ageDiscount =
    customerAgeOnDate(customer, play.datetime) <= 18 ? 500 : 0;
  const weekDayDiscount = play.datetime.getDay() === 2 ? 200 : 0; // Tuesday discount
  const screenOptionExtraPrice = screenOptions
    .map((o) => o.extraPrice)
    .reduce((a, b) => a + b, 0);
  const reservationDiscount = discounts
    .map((d) => d.price)
    .reduce((a, b) => a + b, 0);

  const appliedPrice =
    basePrice -
    ageDiscount -
    weekDayDiscount +
    screenOptionExtraPrice -
    reservationDiscount;

  return Math.max(500, appliedPrice);
};
