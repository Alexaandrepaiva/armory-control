"use client"

import { useEffect, useState } from "react"

import { ArmoryFooter } from "@/components/armory-footer"
import { ArmoryHeader } from "@/components/armory-header"
import { LoansTable, type Loan } from "@/components/loans-table"
import { NewLoanDialog } from "@/components/new-loan-dialog"
import { ReturnLoanDialog } from "@/components/return-loan-dialog"

export default function Home() {
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
    const loadLoans = async () => {
      await fetchLoans()
    }

    void loadLoans()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-green-900">
      <ArmoryHeader />

      <main className="flex flex-1 flex-col px-8 py-6">
        <section className="flex flex-1 flex-col rounded-md border border-gray-500 bg-gray-100 p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Empréstimos em andamento</h2>
            <p className="text-sm text-gray-500">
              Registre a saída e devolução de itens da armaria.
            </p>
          </div>

          <div className="flex-1 overflow-auto">
            <LoansTable loans={loans} />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <ReturnLoanDialog onSuccess={fetchLoans} />
            <NewLoanDialog onSuccess={fetchLoans} />
          </div>
        </section>
      </main>

      <ArmoryFooter />
    </div>
  )
}
