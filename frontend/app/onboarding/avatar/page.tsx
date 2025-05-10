'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdateUserProfile } from '@/hooks/users'

export default function AvatarStep() {
  const router = useRouter()
  const [sel, setSel] = useState<string>('🐶')
  const mutation = useUpdateUserProfile()

  const avatars = ['🐶','🐱','🐰','🦊','🐼']
  const onNext = async () => {
    await mutation.mutateAsync({ avatar: sel })
    router.push('/onboarding/goal')
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Выберите аватар</h2>
      <div className="flex gap-4 mb-6">
        {avatars.map(a=>(
          <button 
            key={a}
            onClick={()=>setSel(a)}
            className={`text-4xl p-2 ${sel===a?'ring':'opacity-50'}`}
          >{a}</button>
        ))}
      </div>
      <button
        onClick={onNext}
        className="btn"
        disabled={mutation.isLoading}
      >
        Далее
      </button>
    </div>
  )
}