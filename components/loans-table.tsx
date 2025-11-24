import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
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
    )
  }

  return (
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
          <TableHead className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-center">
            Recebido
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
            <TableCell className="px-3 py-2 text-sm text-gray-900 text-center">
              <Checkbox
                checked={Boolean(loan.returnedAt)}
                disabled
                className="data-[state=checked]:bg-green-900 data-[state=checked]:border-green-900"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


