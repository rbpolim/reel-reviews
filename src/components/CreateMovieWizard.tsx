import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useState } from "react"
import toast from "react-hot-toast"

import { api } from "~/utils/api"

export const CreateMovieWizard = () => {
  const [titleMovie, setTitleMovie] = useState('')

  const { user } = useUser()

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.movies.create.useMutation({
    onSuccess: () => {
      setTitleMovie('')
      void ctx.movies.getAll.invalidate()
      toast.success('Movie posted!', {
        icon: '🎉',
      })
    },
    onError: (err) => {
      console.log(err)
      toast.error('Something went wrong')
    }
  })

  if (!user) return null

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user?.profileImageUrl}
        // TODO: Fix this
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
