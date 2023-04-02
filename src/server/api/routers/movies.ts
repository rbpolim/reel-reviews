import { privateProcedure } from './../trpc';
import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod';

const filterUser = (user: User) => {
  return {
    id: user.id,
    username: user.username || user.firstName,
    avatar: user.profileImageUrl
  }
}

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const moviesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const movies = ctx.prisma.movie.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = (await clerkClient.users.getUserList({
      userId: (await movies).map((movie) => movie.userId),
      limit: 100,
    })).map(filterUser);

    return (await movies).map((movie) => {
      const user = users.find((user) => user.id === movie.userId);

      if (!user) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "User not found" 
        })
      }

      return {
        movie,
        user: {
          ...user,
          username: user.username,
        },
      }
    });
  }),

  create: privateProcedure
  .input(
    z.object({
      title: z.string().min(1).max(280),
    })
  ).mutation(async ({ ctx, input }) => {
    const userId = ctx.currentUserId;

    const { success } = await ratelimit.limit(userId);

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "You are being rate limited",
      });
    }

    const movie = await ctx.prisma.movie.create({
      data: {
        userId,
        title: input.title,
      }
    })

    return movie;
  })
});
