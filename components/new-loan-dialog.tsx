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

type NewLoanDialogProps = {
  onSuccess?: () => void
}

export function NewLoanDialog({ onSuccess }: NewLoanDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      setIsOpen(false)
      onSuccess?.()
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  )
}


