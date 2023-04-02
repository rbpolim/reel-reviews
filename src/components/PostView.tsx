import Image from "next/image"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { type RouterOutputs } from "~/utils/api"
type PostViewProps = RouterOutputs["movies"]["getAll"][number]

export const PostView = (props: PostViewProps) => {
  const { movie, user } = props

  return (
    <div key={movie.id} className="p-6 flex items-center gap-4 border-b w-full">
      <Image
        src={user.avatar}
        alt={`${user.username || 'User'} profile image}`}
        className="rounded-full object-cover"
        width={64}
        height={64}
      />

      <div className="flex flex-col">
        <div className="text-slate-300">
          <span>{`@${user.username || 'username'}`}</span>
          <span className="">{` · ${dayjs(movie.createdAt).fromNow()}`}</span>
        </div>
        <h2 className="text-lg mt-2">{movie.title}</h2>
      </div>
    </div>
  )
}