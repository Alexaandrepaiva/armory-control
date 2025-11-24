"use client"

import { useEffect, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type Loan = {
  _id: string
  armt: string
  armtNumber: string
  rank?: string
  soldierName: string
  destination?: string
  sequenceNumber: number
  borrowedAt?: string
}

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loans, setLoans] = useState<Loan[]>([])

  async function fetchLoans() {
    try {
      const response = await fetch("/api/loans")

      if (!response.ok)
        return

      const data = await response.json()

      if (!data?.success || !Array.isArray(data.loans))
        return

      setLoans(data.loans)
    }
    catch {
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      armt: String(formData.get("armt") ?? "").trim(),
      armtNumber: String(formData.get("armtNumber") ?? "").trim(),
      rank: String(formData.get("rank") ?? "").trim(),
      soldierName: String(formData.get("soldierName") ?? "").trim(),
      destination: String(formData.get("destination") ?? "").trim(),
    }

    if (!payload.armt || !payload.armtNumber || !payload.soldierName)
      return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok)
        return

      form.reset()
      setIsDialogOpen(false)
      fetchLoans()
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-green-900">
      <header className="flex h-20 items-center justify-between border-b border-gray-500 bg-green-900 px-8 text-gray-100">
        <div>
          <h1 className="text-lg font-semibold">Controle de Armaria</h1>
          <p className="text-sm text-gray-100">
            Sistema de registro de empréstimos de itens da unidade militar
          </p>
        </div>
        <div className="text-right text-xs text-gray-100">
          <p>Uso interno</p>
          <p>Responsável: Seção de Armamento</p>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-8 py-6">
        <section className="flex flex-1 flex-col rounded-md border border-gray-500 bg-gray-100 p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Empréstimos em andamento</h2>
            <p className="text-sm text-gray-500">
              Registre a saída e devolução de itens da armaria.
            </p>
          </div>

          <div className="flex-1 overflow-auto">
            {loans.length === 0 ? (
              <Empty className="border border-gray-500 bg-gray-100/60">
                <EmptyHeader>
                  <EmptyTitle className="text-green-900 font-bold">
                    Nenhum armamento cautelado
                  </EmptyTitle>
                  <EmptyDescription className="text-gray-500">
                    Utilize o botão <span className="font-semibold">“Cautelar Armt”</span> para
                    registrar o primeiro empréstimo da armaria.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table className="border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-gray-500 bg-green-900 text-gray-100">
                    <TableHead className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                      Sequência
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                      Data
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                      Armt
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                      Número Armt
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                      P/Grad
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-2/5">
                      Nome do Militar
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                      Destino
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow
                      key={loan._id}
                      className="border-b border-gray-500"
                    >
                      <TableCell className="px-3 py-2 text-sm text-gray-900">
                        {loan.sequenceNumber}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-900">
                        {loan.borrowedAt
                          ? new Date(loan.borrowedAt).toLocaleDateString("pt-BR")
                          : ""}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-900">
                        {loan.armt}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-900">
                        {loan.armtNumber}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-900">
                        {loan.rank}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-900">
                        {loan.soldierName}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-sm text-gray-900">
                        {loan.destination}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button className="bg-green-600 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-green-900 cursor-pointer">
              Registrar devolução
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-900 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-green-900/90 cursor-pointer">
                  Cautelar Armt
                </Button>
              </DialogTrigger>
              <DialogContent className="border-gray-500 bg-gray-100">
                <DialogHeader>
                  <DialogTitle>Cautelar de armamento</DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Preencha os dados do armamento que será cautelado.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="armt">Armt</Label>
                    <Input id="armt" name="armt" className="border-gray-500" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="armtNumber">Número Armt</Label>
                    <Input
                      id="armtNumber"
                      name="armtNumber"
                      className="border-gray-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="rank">P/Grad</Label>
                    <Input
                      id="rank"
                      name="rank"
                      className="border-gray-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="soldierName">Nome do Militar</Label>
                    <Input
                      id="soldierName"
                      name="soldierName"
                      className="border-gray-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="destination">Destino</Label>
                    <Input
                      id="destination"
                      name="destination"
                      className="border-gray-500"
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="submit"
                      className="bg-green-900 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-green-900/90 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Confirmar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>
        </section>
      </main>

      <footer className="flex h-16 items-center justify-between border-t border-gray-500 bg-green-900 px-8 text-xs text-gray-100">
        <span>Controle de armaria - Uso exclusivo da unidade militar</span>
        <span>Versão inicial</span>
      </footer>
    </div>
  )
}
