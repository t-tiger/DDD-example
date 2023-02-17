import { Reservation, Seat } from "@prisma/client";
import { z } from "zod";
import { ShowingRepository } from "./showing";
import { SeatRepository } from "./seat";

const ReservationCreateSchema = ({
  seatRepository,
  showingRepository,
  reservationRepository,
}: {
  seatRepository: SeatRepository;
  showingRepository: ShowingRepository;
  reservationRepository: ReservationRepository;
}) =>
  z
    .object({
      showingId: z
        .string()
        .refine(async (id) => await showingRepository.exists(id), {
          message: "Showing does not exist",
        }),
      customerId: z.string(),
      numberOfAdults: z.number().min(0),
      numberOfChildren: z.number().min(0),
      showing: z.object({
        datetime: z.date(),
      }),
      payment: z.object({
        type: z.union([z.literal("credit"), z.literal("cash")]),
      }),
      priceOptions: z.array(
        z.object({
          name: z.string(),
          price: z.number().int(),
        })
      ),
      seats: z.array(
        z.object({
          id: z.string().refine(async (id) => await seatRepository.exists(id), {
            message: "Seat does not exist",
          }),
        })
      ),
    })
    .refine((val) => val.numberOfAdults > 0 || val.numberOfChildren > 0, {
      message: "Number of tickets must be greater than 0",
    })
    .refine(async (val) => !(await reservationRepository.isReserved(val)), {
      message: "Seats are already reserved",
    })
    .transform((val) => ({ ...val, kind: "CreateValidated" as const }));

export type ReservationCreate = z.infer<
  ReturnType<typeof ReservationCreateSchema>
>;

export const validateReservationCreate =
  (repos: {
    seatRepository: SeatRepository;
    showingRepository: ShowingRepository;
    reservationRepository: ReservationRepository;
  }) =>
  async (
    reservation: Omit<ReservationCreate, "kind">
  ): Promise<ReservationCreate> =>
    ReservationCreateSchema(repos).parseAsync(reservation);

export type ReservationRepository = {
  isReserved(reservation: { seats: Array<Pick<Seat, "id">> }): Promise<boolean>;
  create(reservation: ReservationCreate): Promise<Reservation>;
};

export const calculateReservationPrice = (reservation: ReservationCreate) => {
  const { showing, priceOptions, numberOfAdults, numberOfChildren } =
    reservation;

  const dayOfWeekDiscount = showing.datetime.getDay() === 2 ? 200 : 0;
  const baseAdultPrice =
    1800 +
    -dayOfWeekDiscount +
    priceOptions
      .map(({ price }) => price)
      .reduce((acc, price) => acc + price, 0);
  const baseChildPrice = baseAdultPrice - 600;

  return (
    Math.max(800, baseAdultPrice) * numberOfAdults +
    Math.max(800, baseChildPrice) * numberOfChildren
  );
};
