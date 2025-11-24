"use client"

import { useState, type FormEvent } from "react"

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

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      armt: String(formData.get("armt") ?? "").trim(),
      numeroArmt: String(formData.get("numeroArmt") ?? "").trim(),
      postoGrad: String(formData.get("postoGrad") ?? "").trim(),
      nomeMilitar: String(formData.get("nomeMilitar") ?? "").trim(),
      destino: String(formData.get("destino") ?? "").trim(),
    }

    if (!payload.armt || !payload.numeroArmt || !payload.nomeMilitar)
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
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-500 bg-green-900 text-gray-100">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Item
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Número de série
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Militar responsável
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Data de retirada
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Data de devolução
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    Situação
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-500">
                  <td
                    className="px-3 py-4 text-sm text-gray-500"
                    colSpan={6}
                  >
                    Nenhum empréstimo registrado.
                  </td>
                </tr>
              </tbody>
            </table>
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
                    <Label htmlFor="numeroArmt">Número Armt</Label>
                    <Input
                      id="numeroArmt"
                      name="numeroArmt"
                      className="border-gray-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="postoGrad">P/Grad</Label>
                    <Input
                      id="postoGrad"
                      name="postoGrad"
                      className="border-gray-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="nomeMilitar">Nome do Militar</Label>
                    <Input
                      id="nomeMilitar"
                      name="nomeMilitar"
                      className="border-gray-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="destino">Destino</Label>
                    <Input
                      id="destino"
                      name="destino"
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
