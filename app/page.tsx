"use client"

import { useEffect, useState } from "react"

import { ArmoryFooter } from "@/components/armory-footer"
import { ArmoryHeader } from "@/components/armory-header"
import { LoansTable, type Loan } from "@/components/loans-table"
import { NewLoanDialog } from "@/components/new-loan-dialog"
import { ReturnLoanDialog } from "@/components/return-loan-dialog"
import { LoadingState } from "@/components/loading-state"

export default function Home() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchLoans() {
    try {
      setIsLoading(true)
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
    finally {
      setIsLoading(false)
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
        <section className="flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Empréstimos em andamento</h2>
              <p className="text-sm text-gray-600">
                Registre a saída e devolução de itens da armaria.
              </p>
            </div>

            <div className="flex shrink-0 items-start gap-3">
              <ReturnLoanDialog onSuccess={fetchLoans} />
              <NewLoanDialog onSuccess={fetchLoans} />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {isLoading
              ? <LoadingState />
              : <LoansTable loans={loans} onRefresh={fetchLoans} />}
          </div>
        </section>
      </main>

      <ArmoryFooter />
    </div>
  )
}
