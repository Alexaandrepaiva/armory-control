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

type ReturnLoanDialogProps = {
  onSuccess?: () => void
}

export function ReturnLoanDialog({ onSuccess }: ReturnLoanDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    const form = event.currentTarget
    const formData = new FormData(form)

    const sequenceNumberRaw = String(formData.get("sequenceNumber") ?? "").trim()
    const password = String(formData.get("password") ?? "").trim()

    if (!sequenceNumberRaw || !password) {
      setErrorMessage("Preencha todos os campos.")
      return
    }

    const sequenceNumber = Number(sequenceNumberRaw)

    if (Number.isNaN(sequenceNumber)) {
      setErrorMessage("Número de sequência inválido.")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/loans", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sequenceNumber, password }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        if (data?.error === "Senha incorreta")
          setErrorMessage("Senha incorreta")
        else if (data?.error)
          setErrorMessage(data.error)
        else
          setErrorMessage("Erro ao confirmar recebimento.")

        return
      }

      form.reset()
      setIsOpen(false)
      setErrorMessage(null)
      onSuccess?.()
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open)
          setErrorMessage(null)
      }}
    >
      <DialogTrigger asChild>
        <Button className="border border-green-900 bg-transparent px-4 py-2 text-sm font-semibold text-green-900 hover:bg-green-900/5 cursor-pointer">
          Devolver Armt
        </Button>
      </DialogTrigger>
      <DialogContent className="border-gray-500 bg-gray-100">
        <DialogHeader>
          <DialogTitle>Devolução de armamento</DialogTitle>
          <DialogDescription className="text-gray-500">
            Informe o número de sequência do empréstimo e a senha para
            confirmar o recebimento do armamento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="sequenceNumber">Número de Sequência</Label>
            <Input
              id="sequenceNumber"
              name="sequenceNumber"
              className="border-gray-500"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              className="border-gray-500"
            />
          </div>

          {errorMessage && (
            <p className="text-sm font-semibold text-green-900">
              {errorMessage}
            </p>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className="bg-green-900 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-green-900/90 cursor-pointer"
              disabled={isSubmitting}
            >
              Confirmar Recebimento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


