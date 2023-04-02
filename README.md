![MacBook Pro 14_ - 3](https://user-images.githubusercontent.com/66570560/229381059-a3b21029-883f-4f4b-9e33-9e52858e75cc.png)

## Reel Reviews 🎥

Reel Reviews is a movie review project that allows registered users to create posts about their favorite films. To create a post, users must be logged in to the platform.

## Demo

You can view a live demo of the project here:

<https://cine-five-nu.vercel.app/>

## Technologies

This project was built using the following technologies:

- [tRPC](https://trpc.io): TRPC is a lightweight and flexible RPC (Remote Procedure Call) framework for Node.js.

- [Next.js](https://nextjs.org): NextJS is a React-based framework for building web applications with server-side rendering and static site generation capabilities.

- [Prisma](https://prisma.io): Prisma is a modern ORM (Object-Relational Mapping) used to interact with databases.

- [Tailwind CSS](https://tailwindcss.com): Tailwindcss is a highly customizable CSS framework that provides a set of utility classes to style HTML elements. It is used in this project to style the UI.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

- PRISMA DATABASE <br>
`DATABASE_URL=`

- CLERK AUTHENTICATION <br>
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=` <br>
`CLERK_SECRET_KEY=`

- UNSPLASH <br>
`UPSTASH_REDIS_REST_URL=` <br>
`UPSTASH_REDIS_REST_TOKEN=`
