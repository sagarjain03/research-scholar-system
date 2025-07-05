'use client'

import { ScholarProfileView } from '@/components/ScholarProfileView'
import { useParams } from 'next/navigation'

export default function AdminScholarProfilePage() {
  const { id } = useParams()

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-8">Viewing Scholar Profile: {id}</h1>
      <ScholarProfileView />
    </div>
  )
}
