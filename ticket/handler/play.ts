import { z } from "zod";
import { RequestHandler } from "express";
import { handleError } from "./error";

const PlayDetail = z.object({
  id: z.number(),
});

export const playDetailHandler: RequestHandler = async (req, res) => {
  const { prisma } = req.context;

  try {
    const { id } = PlayDetail.parse(req.params);
    const play = await prisma.play.findFirstOrThrow({
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
        name: screen.name,
        theater: {
          id: theater.id,
          address: theater.address,
        },
      },
      movie: {
        id: movie.id,
        title: movie.title,
        releaseDate: movie.releaseDate,
      },
    });
  } catch (e: any) {
    handleError(e, res);
  }
};

const PlaySeats = z.object({
  id: z.number(),
});

export const playSeatsHandler: RequestHandler = async (req, res) => {
  const { prisma } = req.context;

  try {
    const { id } = PlaySeats.parse(req.params);
    const play = await prisma.play.findFirstOrThrow({
      where: { id },
      include: { screen: true },
    });
    const reservedSeatIds = new Set(
      (
        await prisma.reservation.findMany({
          where: { playId: id },
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
        number: seat.number,
        reserved: reservedSeatIds.has(seat.id),
      })),
    });
  } catch (e: any) {
    handleError(e, res);
  }
};
