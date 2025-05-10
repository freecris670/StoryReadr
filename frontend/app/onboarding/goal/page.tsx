'use client'
import { useRouter } from 'next/navigation'
import { useUpdateUserProfile } from '@/hooks/users'

export default function GoalStep() {
  const router = useRouter()
  const mutation = useUpdateUserProfile()
  const options = [5,10,20]

  const select = async (min: number) => {
    await mutation.mutateAsync({ dailyGoal: min })
    router.replace('/dashboard')
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Сколько минут читать в день?</h2>
      <div className="space-x-4">
        {options.map(o=>(
          <button
            key={o}
            onClick={()=>select(o)}
            className="btn"
            disabled={mutation.isLoading}
          >
            {o} мин
          </button>
        ))}
      </div>
    </div>
  )
}