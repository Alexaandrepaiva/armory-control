"use client"

import { useEffect, useState, type FormEvent } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Loan = {
  _id: string
  armt: string
  armtNumber: string
  rank?: string
  soldierName: string
  destination?: string
  sequenceNumber: number
  borrowedAt?: string
  returnedAt?: string
  isFieldActivity?: boolean
}

type LoansTableProps = {
  loans: Loan[]
  onRefresh?: () => void
}

export function LoansTable({ loans, onRefresh }: LoansTableProps) {
  const pageSize = 15

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false)
  const [isUpdatingLoan, setIsUpdatingLoan] = useState(false)

  const [editArmt, setEditArmt] = useState("")
  const [editArmtNumber, setEditArmtNumber] = useState("")
  const [editRank, setEditRank] = useState("")
  const [editSoldierName, setEditSoldierName] = useState("")
  const [editDestination, setEditDestination] = useState("")
  const [editIsFieldActivity, setEditIsFieldActivity] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(loans.length / pageSize))

    if (currentPage > totalPages)
      setCurrentPage(totalPages)
  }, [loans.length, currentPage, pageSize])

  const totalPages = Math.max(1, Math.ceil(loans.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedLoans = loans.slice(startIndex, endIndex)

  function handleRowClick(loan: Loan) {
    setSelectedLoan(loan)
    setAdminPassword("")
    setPasswordError(null)
    setIsPasswordDialogOpen(true)
  }

  async function handleVerifyPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!adminPassword.trim()) {
      setPasswordError("Informe a senha de administrador.")
      return
    }

    try {
      setIsVerifyingPassword(true)
      setPasswordError(null)

      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: adminPassword.trim() }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        if (data?.error)
          setPasswordError(data.error)
        else
          setPasswordError("Não foi possível verificar a senha.")

        return
      }

      if (!selectedLoan)
        return

      setEditArmt(selectedLoan.armt)
      setEditArmtNumber(selectedLoan.armtNumber)
      setEditRank(selectedLoan.rank ?? "")
      setEditSoldierName(selectedLoan.soldierName)
      setEditDestination(selectedLoan.destination ?? "")
      setEditIsFieldActivity(Boolean(selectedLoan.isFieldActivity))

      setIsPasswordDialogOpen(false)
      setIsEditDialogOpen(true)
    }
    finally {
      setIsVerifyingPassword(false)
    }
  }

  async function handleUpdateLoan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedLoan)
      return

    const payload = {
      sequenceNumber: selectedLoan.sequenceNumber,
      password: adminPassword.trim(),
      armt: editArmt.trim(),
      armtNumber: editArmtNumber.trim(),
      rank: editRank.trim(),
      soldierName: editSoldierName.trim(),
      destination: editDestination.trim(),
      isFieldActivity: editIsFieldActivity,
    }

    if (
      !payload.armt
      || !payload.armtNumber
      || !payload.soldierName
      || !payload.rank
    )
      return

    try {
      setIsUpdatingLoan(true)

      const response = await fetch("/api/loans/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success)
        return

      setIsEditDialogOpen(false)
      if (typeof onRefresh === "function")
        onRefresh()
    }
    finally {
      setIsUpdatingLoan(false)
    }
  }

  if (loans.length === 0) {
    return (
      <Empty className="border border-gray-500/70 bg-gray-100/70 shadow-sm">
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
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-500/70 bg-white/80 shadow-sm backdrop-blur">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-green-900 to-emerald-900 text-gray-100">
            <TableHead className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              Sequência
            </TableHead>
            <TableHead className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              Data
            </TableHead>
            <TableHead className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              Armt
            </TableHead>
            <TableHead className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              Número Armt
            </TableHead>
            <TableHead className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              P/Grad
            </TableHead>
            <TableHead className="w-2/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              Nome do Militar
            </TableHead>
            <TableHead className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              Destino
            </TableHead>
            <TableHead className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-center text-white">
              Recebido
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLoans.map((loan) => {
            const isReturned = Boolean(loan.returnedAt)
            const isFieldActivity = Boolean(loan.isFieldActivity)
            const returnedDecorationClass = isReturned
              ? "line-through decoration-gray-500"
              : ""
            const rowBackgroundClass = isFieldActivity
              ? "bg-green-200 hover:bg-green-200/90"
              : "bg-gray-50/60 odd:bg-gray-50/80 even:bg-white/95 hover:bg-green-50/80"

            return (
              <TableRow
                key={loan._id}
                className={`border-gray-200/80 transition-colors cursor-pointer ${rowBackgroundClass}`}
                onClick={() => handleRowClick(loan)}
              >
                <TableCell className={`px-3 py-2 text-sm font-medium text-gray-900 ${returnedDecorationClass}`}>
                  {loan.sequenceNumber}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm text-gray-900 ${returnedDecorationClass}`}>
                  {loan.borrowedAt
                    ? new Date(loan.borrowedAt).toLocaleDateString("pt-BR")
                    : ""}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm text-gray-900 ${returnedDecorationClass}`}>
                  {loan.armt}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm text-gray-900 ${returnedDecorationClass}`}>
                  {loan.armtNumber}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm text-gray-900 ${returnedDecorationClass}`}>
                  {loan.rank}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm text-gray-900 ${returnedDecorationClass}`}>
                  {loan.soldierName}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm text-gray-900 ${returnedDecorationClass}`}>
                  {loan.destination ? (
                    <Badge
                      variant="outline"
                      className={`border-green-900/30 bg-green-50/70 text-[11px] font-medium uppercase tracking-[0.08em] text-green-900 ${returnedDecorationClass}`}
                    >
                      {loan.destination}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm text-center text-gray-900 ${returnedDecorationClass}`}>
                  <Checkbox
                    checked={isReturned}
                    disabled
                    className="data-[state=checked]:bg-green-900 data-[state=checked]:border-green-900"
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-gray-200/80 bg-gray-50/70 px-4 py-2 text-xs text-gray-600">
        <span>
          Mostrando{" "}
          <span className="font-semibold text-green-900">
            {loans.length === 0 ? 0 : startIndex + 1}
          </span>{" "}
          -{" "}
          <span className="font-semibold text-green-900">
            {Math.min(endIndex, loans.length)}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-green-900">{loans.length}</span>{" "}
          registros
        </span>

        <Pagination className="w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage > 1)
                    setCurrentPage(currentPage - 1)
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage === totalPages}
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage < totalPages)
                    setCurrentPage(currentPage + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog
        open={isPasswordDialogOpen && Boolean(selectedLoan)}
        onOpenChange={(open) => {
          setIsPasswordDialogOpen(open)
          if (!open)
            setPasswordError(null)
        }}
      >
        <DialogContent className="border-gray-500 bg-gray-100">
          <DialogHeader>
            <DialogTitle>Editar registro</DialogTitle>
            <DialogDescription className="text-gray-500">
              Informe a senha de administrador para editar este empréstimo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="adminPassword">Senha de administrador</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                className="border-gray-500"
              />
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
                disabled={isVerifyingPassword}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditDialogOpen && Boolean(selectedLoan)}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
        }}
      >
        <DialogContent className="border-gray-500 bg-gray-100">
          <DialogHeader>
            <DialogTitle>Editar empréstimo</DialogTitle>
            <DialogDescription className="text-gray-500">
              Atualize os dados do armamento cautelado.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateLoan} className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="editArmt">Armt</Label>
                  <Input
                    id="editArmt"
                    value={editArmt}
                    onChange={(event) => setEditArmt(event.target.value)}
                    className="border-gray-500"
                  />
                </div>

                <div className="w-full space-y-1.5 md:w-1/4">
                  <Label htmlFor="editArmtNumber">Número Armt</Label>
                  <Input
                    id="editArmtNumber"
                    value={editArmtNumber}
                    onChange={(event) => setEditArmtNumber(event.target.value)}
                    className="border-gray-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="w-full space-y-1.5 md:w-1/4">
                  <Label htmlFor="editRank">P/Grad</Label>
                  <Select
                    value={editRank}
                    onValueChange={setEditRank}
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
                  <Label htmlFor="editSoldierName">Nome do Militar</Label>
                  <Input
                    id="editSoldierName"
                    value={editSoldierName}
                    onChange={(event) => setEditSoldierName(event.target.value)}
                    className="border-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editDestination">Destino</Label>
                <Input
                  id="editDestination"
                  value={editDestination}
                  onChange={(event) => setEditDestination(event.target.value)}
                  className="border-gray-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="editIsFieldActivity"
                  checked={editIsFieldActivity}
                  onCheckedChange={(checked) => setEditIsFieldActivity(Boolean(checked))}
                  className="data-[state=checked]:bg-green-900 data-[state=checked]:border-green-900"
                />
                <Label
                  htmlFor="editIsFieldActivity"
                  className="text-sm text-gray-700"
                >
                  Atividade de campo
                </Label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="bg-green-900 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-green-900/90 cursor-pointer"
                disabled={isUpdatingLoan}
              >
                Confirmar edição
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


