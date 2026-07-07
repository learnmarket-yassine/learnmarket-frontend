import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { useStore } from '@/store/store'
import useAnnonces from '@/features/annonces/hooks/useAnnonces'
import useCreateAnnonce from '@/features/annonces/hooks/useCreateAnnonce'
import useSubmitProposal from '@/features/proposals/hooks/useSubmitProposal'
import useConnectsBalance from '@/features/connects/hooks/useConnectsBalance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import DemoNav from '@/components/layout/DemoNav'

const AnnoncesPage = () => {
  const user = useStore((state) => state.auth.user)
  const isTutor = user?.role === 'TUTOR'
  const annoncesQuery = useAnnonces()
  const createAnnonce = useCreateAnnonce()
  const submitProposal = useSubmitProposal()
  const balanceQuery = useConnectsBalance()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [proposalCost, setProposalCost] = useState(2)

  const [proposalMessages, setProposalMessages] = useState<Record<string, string>>({})
  const [proposalErrors, setProposalErrors] = useState<Record<string, string>>({})

  const handleCreateAnnonce = (e: FormEvent) => {
    e.preventDefault()
    createAnnonce.mutate(
      { title, description: description || undefined, proposalCost },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setProposalCost(2)
        },
      }
    )
  }

  const handleSubmitProposal = (annonceId: string) => {
    setProposalErrors((prev) => ({ ...prev, [annonceId]: '' }))
    submitProposal.mutate(
      { annonceId, message: proposalMessages[annonceId] },
      {
        onError: (error) => {
          const message = isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message
            : undefined
          setProposalErrors((prev) => ({
            ...prev,
            [annonceId]: message ?? 'Something went wrong',
          }))
        },
        onSuccess: () => {
          setProposalMessages((prev) => ({ ...prev, [annonceId]: '' }))
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <DemoNav />

      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Annonces</h1>
        {isTutor && (
          <p className="text-sm text-gray-500">
            Your connects balance:{' '}
            <span className="font-semibold">{balanceQuery.data?.connects ?? '…'}</span>
          </p>
        )}
      </section>

      {!isTutor && (
        <section className="flex flex-col gap-3 rounded-lg border p-4">
          <h2 className="text-xl font-semibold">Post a new annonce</h2>
          <form onSubmit={handleCreateAnnonce} className="flex flex-col gap-3">
            <Input
              placeholder="Title (e.g. Need help with calculus)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Proposal cost (connects):</label>
              <Input
                type="number"
                min={1}
                max={50}
                className="w-24"
                value={proposalCost}
                onChange={(e) => setProposalCost(Number(e.target.value))}
              />
            </div>
            <Button type="submit" disabled={createAnnonce.isPending} className="w-fit">
              Post annonce
            </Button>
          </form>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Open annonces</h2>
        {annoncesQuery.data?.length === 0 && <p>No open annonces yet.</p>}
        {annoncesQuery.data?.map((annonce) => (
          <div key={annonce.id} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{annonce.title}</h3>
              <Badge>{annonce.proposalCost} connects to apply</Badge>
            </div>
            {annonce.description && <p className="text-sm text-gray-600">{annonce.description}</p>}

            {isTutor && (
              <div className="flex flex-col gap-2">
                <Textarea
                  placeholder="Your proposal message (optional)"
                  value={proposalMessages[annonce.id] ?? ''}
                  onChange={(e) =>
                    setProposalMessages((prev) => ({ ...prev, [annonce.id]: e.target.value }))
                  }
                />
                <Button
                  onClick={() => handleSubmitProposal(annonce.id)}
                  disabled={submitProposal.isPending}
                  className="w-fit"
                >
                  Submit proposal ({annonce.proposalCost} connects)
                </Button>
                {proposalErrors[annonce.id] && (
                  <p className="text-sm text-red-600">{proposalErrors[annonce.id]}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}

export default AnnoncesPage
