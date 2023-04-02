import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { CreateMovieWizard } from "~/components/CreateMovieWizard";
import { Feed } from "~/components/Feed";

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
      <main className="flex justify-center min-h-screen">
        <div className="mx-auto w-full max-w-2xl border-x">
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
