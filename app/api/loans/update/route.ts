import { NextRequest, NextResponse } from 'next/server'

import { Admin, Loan, connectToDatabase } from '@/lib/mongoose'

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const {
      sequenceNumber,
      password,
      armt,
      armtNumber,
      rank,
      soldierName,
      destination,
      isFieldActivity,
    }: {
      sequenceNumber: number
      password: string
      armt: string
      armtNumber: string
      rank: string
      soldierName: string
      destination?: string
      isFieldActivity?: boolean
    } = body

    if (
      !sequenceNumber
      || !password
      || !armt
      || !armtNumber
      || !soldierName
      || !rank
    )
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios ausentes.' },
        { status: 400 },
      )

    const admin = await Admin.findOne().select('password')

    if (!admin || admin.password !== password)
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 },
      )

    const loan = await Loan.findOneAndUpdate(
      { sequenceNumber },
      {
        $set: {
          armt,
          armtNumber,
          rank,
          soldierName,
          destination,
          isFieldActivity: Boolean(isFieldActivity),
        },
      },
      { new: true },
    )

    if (!loan)
      return NextResponse.json(
        { success: false, error: 'Empréstimo não encontrado.' },
        { status: 404 },
      )

    return NextResponse.json({ success: true, loan }, { status: 200 })
  }
  catch (error) {
    console.error('Erro ao atualizar empréstimo', error)

    return NextResponse.json(
      { success: false, error: 'Erro interno ao atualizar empréstimo.' },
      { status: 500 },
    )
  }
}



