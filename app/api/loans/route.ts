import { NextRequest, NextResponse } from 'next/server'

import { Admin, Loan, connectToDatabase } from '@/lib/mongoose'

export async function GET() {
  try {
    await connectToDatabase()

    const loans = await Loan.find().sort({ sequenceNumber: -1 }).lean()

    return NextResponse.json({ success: true, loans }, { status: 200 })
  }
  catch (error) {
    console.error('Erro ao listar empréstimos', error)

    return NextResponse.json(
      { success: false, error: 'Erro interno ao listar empréstimos.' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const {
      armt,
      armtNumber,
      rank,
      soldierName,
      destination,
    }: {
      armt: string
      armtNumber: string
      rank: string
      soldierName: string
      destination: string
    } = body

    if (!armt || !armtNumber || !soldierName)
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios ausentes.' },
        { status: 400 },
      )
    
    const admin = await Admin.findOneAndUpdate(
      {},
      {
        $inc: { itemsLoanedCount: 1 },
        $setOnInsert: { password: 'changeme' },
      },
      {
        new: true,
        upsert: true,
      },
    )

    const nextSequenceNumber = admin.itemsLoanedCount

    const loan = await Loan.create({
      armt,
      armtNumber,
      rank,
      soldierName,
      destination,
      sequenceNumber: nextSequenceNumber,
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

