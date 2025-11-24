import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
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
}

type LoansTableProps = {
  loans: Loan[]
}

export function LoansTable({ loans }: LoansTableProps) {
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
          {loans.map((loan) => {
            const isReturned = Boolean(loan.returnedAt)
            const textColorClass = isReturned ? "text-gray-500" : "text-gray-900"

            return (
              <TableRow
                key={loan._id}
                className="border-gray-200/80 bg-gray-50/60 odd:bg-gray-50/80 even:bg-white/95 hover:bg-green-50/80 transition-colors"
              >
                <TableCell className={`px-3 py-2 text-sm font-medium ${textColorClass}`}>
                  {loan.sequenceNumber}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm ${textColorClass}`}>
                  {loan.borrowedAt
                    ? new Date(loan.borrowedAt).toLocaleDateString("pt-BR")
                    : ""}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm ${textColorClass}`}>
                  {loan.armt}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm ${textColorClass}`}>
                  {loan.armtNumber}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm ${textColorClass}`}>
                  {loan.rank}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm ${textColorClass}`}>
                  {loan.soldierName}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm ${textColorClass}`}>
                  {loan.destination ? (
                    <Badge
                      variant="outline"
                      className={`border-green-900/30 bg-green-50/70 text-[11px] font-medium uppercase tracking-[0.08em] ${
                        isReturned ? "text-gray-500 border-gray-400/50 bg-gray-50/80" : "text-green-900"
                      }`}
                    >
                      {loan.destination}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className={`px-3 py-2 text-sm text-center ${textColorClass}`}>
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
    </div>
  )
}


