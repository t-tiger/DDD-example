import { z } from "zod";
import { RequestHandler } from "express";
import { handleError } from "./error";

const ShowingDetail = z.object({
  id: z.string(),
});

export const showingDetailHandler: RequestHandler = async (req, res) => {
  const { prisma } = req.context;

  try {
    const { id } = ShowingDetail.parse(req.params);
    const play = await prisma.showing.findFirstOrThrow({
      where: { id },
      include: { screen: { include: { theater: true } }, movie: true },
    });
    const {
      screen,
      screen: { theater },
      movie,
    } = play;

    res.json({
      play: {
        id: play.id,
        datetime: play.datetime,
      },
      screen: {
        id: screen.id,
        screenSize: screen.screenSize,
        theater: {
          id: theater.id,
          address: theater.address,
        },
      },
      movie: {
        id: movie.id,
        name: movie.name,
        description: movie.description,
        author: movie.author,
      },
    });
  } catch (e: any) {
    handleError(e, res);
  }
};

const ShowingSeats = z.object({
  id: z.string(),
});

export const showingSeatsHandler: RequestHandler = async (req, res) => {
  const { prisma } = req.context;

  try {
    const { id } = ShowingSeats.parse(req.params);
    const play = await prisma.showing.findFirstOrThrow({
      where: { id },
      include: { screen: true },
    });
    const reservedSeatIds = new Set(
      (
        await prisma.seat.findMany({
          where: {
            reservations: {
              some: {
                showingId: id
              }
            },
          },
          select: { id: true },
        })
      ).map(({ id }) => id)
    );
    const seats = await prisma.seat.findMany({
      where: { screenId: play.screenId },
    });

    res.json({
      seats: seats.map((seat) => ({
        id: seat.id,
        row: seat.row,
        column: seat.column,
        reserved: reservedSeatIds.has(seat.id),
      })),
    });
  } catch (e: any) {
    handleError(e, res);
  }
};
