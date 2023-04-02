import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { LoadingPage } from "~/components/Loading";
import { api, type RouterOutputs } from "~/utils/api";
import { useState } from "react";

const CreateMovieWizard = () => {
  const [titleMovie, setTitleMovie] = useState('')

  const { user } = useUser()

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.movies.create.useMutation({
    onSuccess: () => {
      setTitleMovie('')
      void ctx.movies.getAll.invalidate()
    }
  })

  if (!user) return null

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user?.profileImageUrl}
        alt={`${user?.username} profile image` || "profile image"}
        className="rounded-full object-cover"
        width={56}
        height={56}
      />

      <input
        placeholder="Type some movie name..."
        className="bg-transparent text-xl grow outline-none"
        value={titleMovie}
        onChange={(e) => setTitleMovie(e.target.value)}
      />

      <button
        type="submit"
        disabled={isPosting}
        onClick={() => mutate({ title: titleMovie })}
      >
        Post
      </button>
    </div>
  )
}

type PostViewProps = RouterOutputs["movies"]["getAll"][number]
const PostView = (props: PostViewProps) => {
  const { movie, user } = props

  return (
    <div key={movie.id} className="p-6 flex items-center gap-4 border-b w-full">
      <Image
        src={user.avatar}
        alt={`${user.username} profile image}`}
        className="rounded-full object-cover"
        width={64}
        height={64}
      />

      <div className="flex flex-col">
        <div className="text-slate-300">
          <span >{`@${user.username}`}</span>
          <span className="">{` · ${dayjs(movie.createdAt).fromNow()}`}</span>
        </div>
        <h2 className="text-lg mt-2">{movie.title}</h2>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading } = api.movies.getAll.useQuery();

  if (isLoading) return <LoadingPage />
  if (!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {data.map(({ user, movie }) => (
        <PostView key={movie.id} user={user} movie={movie} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isSignedIn, isLoaded } = useUser();

  // Start fetching data as soon as the page loads
  api.movies.getAll.useQuery();

  // Show a loading page while we wait for the user to be loaded
  if (!isLoaded) return <div />

  return (
    <>
      <Head>
        <title>Cine Movies</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="mx-auto w-full max-w-2xl border-x ">
          <div className="flex items-center justify-between border-b p-8">
            {!isSignedIn && (
              <SignInButton mode="modal">SIGN IN</SignInButton>
            )}
            {!!isSignedIn && (
              <CreateMovieWizard />
            )}
          </div>

          <Feed />
        </div>
      </main >
    </>
  );
};

export default Home;
