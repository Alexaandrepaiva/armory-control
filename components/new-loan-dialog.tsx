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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type NewLoanDialogProps = {
  onSuccess?: () => void
}

export function NewLoanDialog({ onSuccess }: NewLoanDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rank, setRank] = useState("")
  const [isFieldActivity, setIsFieldActivity] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordError(null)
    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      armt: String(formData.get("armt") ?? "").trim(),
      armtNumber: String(formData.get("armtNumber") ?? "").trim(),
      rank: rank.trim(),
      soldierName: String(formData.get("soldierName") ?? "").trim(),
      destination: String(formData.get("destination") ?? "").trim(),
      isFieldActivity,
      password: String(formData.get("password") ?? "").trim(),
    }

    if (
      !payload.armt
      || !payload.armtNumber
      || !payload.soldierName
      || !payload.rank
      || !payload.password
    )
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

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        if (data?.error === "Senha incorreta")
          setPasswordError("Senha incorreta")
        else if (data?.error)
          setPasswordError(data.error)

        return
      }

      form.reset()
      setRank("")
      setIsFieldActivity(false)
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="armt">Armt</Label>
                <Input
                  id="armt"
                  name="armt"
                  required
                  className="border-gray-500"
                />
              </div>

            <div className="w-full space-y-1.5 md:w-1/4">
                <Label htmlFor="armtNumber">Número Armt</Label>
                <Input
                  id="armtNumber"
                  name="armtNumber"
                  required
                  className="border-gray-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="w-full space-y-1.5 md:w-1/4">
                <Label htmlFor="rank">P/Grad</Label>
                <Select
                  value={rank}
                  onValueChange={setRank}
                >
                  <SelectTrigger className="w-full border-gray-500">
                    <SelectValue placeholder="Selecione a graduação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sd">Sd</SelectItem>
                    <SelectItem value="Cb">Cb</SelectItem>
                    <SelectItem value="3o Sgt">3o Sgt</SelectItem>
                    <SelectItem value="2o Sgt">2o Sgt</SelectItem>
                    <SelectItem value="1o Sgt">1o Sgt</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="Asp Of">Asp Of</SelectItem>
                    <SelectItem value="2o Ten">2o Ten</SelectItem>
                    <SelectItem value="1o Ten">1o Ten</SelectItem>
                    <SelectItem value="Cap">Cap</SelectItem>
                    <SelectItem value="Maj">Maj</SelectItem>
                    <SelectItem value="TC">TC</SelectItem>
                    <SelectItem value="Cel">Cel</SelectItem>
                    <SelectItem value="Gen">Gen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1.5">
                <Label htmlFor="soldierName">Nome do Militar</Label>
                <Input
                  id="soldierName"
                  name="soldierName"
                  required
                  className="border-gray-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                name="destination"
                className="border-gray-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="border-gray-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="isFieldActivity"
                checked={isFieldActivity}
                onCheckedChange={(checked) => setIsFieldActivity(Boolean(checked))}
                className="data-[state=checked]:bg-green-900 data-[state=checked]:border-green-900"
              />
              <Label
                htmlFor="isFieldActivity"
                className="text-sm text-gray-700"
              >
                Atividade de campo
              </Label>
            </div>
          </div>

          {passwordError && (
            <p className="text-sm font-semibold text-green-900">
              {passwordError}
            </p>
          )}

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


