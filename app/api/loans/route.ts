import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase, Loan } from '@/lib/mongoose'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const {
      armt,
      numeroArmt,
      postoGrad,
      nomeMilitar,
      destino,
    }: {
      armt: string
      numeroArmt: string
      postoGrad: string
      nomeMilitar: string
      destino: string
    } = body

    if (!armt || !numeroArmt || !nomeMilitar)
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios ausentes.' },
        { status: 400 },
      )

    const borrowerName = [postoGrad, nomeMilitar].filter(Boolean).join(' ')

    const loan = await Loan.create({
      itemId: numeroArmt,
      itemName: armt,
      borrowerName,
      destination: destino,
      borrowedAt: new Date(),
    })

    return NextResponse.json({ success: true, loan }, { status: 201 })
  }
  catch (error) {
    console.error('Erro ao registrar empréstimo', error)

    return NextResponse.json(
      { success: false, error: 'Erro interno ao registrar empréstimo.' },
      { status: 500 },
    )
  }
}


