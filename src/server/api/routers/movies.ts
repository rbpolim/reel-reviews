import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUser = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    avatar: user.profileImageUrl
  }
}

export const moviesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const movies = ctx.prisma.movie.findMany({
      take: 100,
    });

    const users = (await clerkClient.users.getUserList({
      userId: (await movies).map((movie) => movie.userId),
      limit: 100,
    })).map(filterUser);

    return (await movies).map((movie) => {
      const user = users.find((user) => user.id === movie.userId);

      if (!user || !user.username) {
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
});
