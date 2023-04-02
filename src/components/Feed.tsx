import { api } from "~/utils/api";

import { LoadingPage } from "./Loading";
import { PostView } from "./PostView";

export const Feed = () => {
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