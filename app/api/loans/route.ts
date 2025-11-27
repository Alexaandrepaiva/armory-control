import { NextRequest, NextResponse } from 'next/server'

import { Admin, Loan, connectToDatabase } from '@/lib/mongoose'

export async function GET() {
  try {
    await connectToDatabase()

    const loans = await Loan.find({ deletedAt: null })
      .sort({ sequenceNumber: -1 })
      .lean()

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
      isFieldActivity,
      password,
    }: {
      armt: string
      armtNumber: string
      rank: string
      soldierName: string
      destination: string
      isFieldActivity?: boolean
      password: string
    } = body

    if (!armt || !armtNumber || !soldierName || !rank || !password)
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios ausentes.' },
        { status: 400 },
      )

    const admin = await Admin.findOneAndUpdate(
      {},
      {
        $setOnInsert: {
          passwords: [{ name: 'Admin', password: 'changeme' }],
          password: 'changeme',
          itemsLoanedCount: 0,
        },
      },
      {
        new: true,
        upsert: true,
      },
    )

    if (!admin)
      return NextResponse.json(
        { success: false, error: 'Erro interno ao obter administrador.' },
        { status: 500 },
      )

    let responsibleName: string | null = null

    if (Array.isArray(admin.passwords) && admin.passwords.length > 0) {
      const matchedEntry = admin.passwords.find((entry) => entry.password === password)
      if (matchedEntry)
        responsibleName = matchedEntry.name
    }
    else if (admin.password === password) {
      responsibleName = 'Admin'
    }

    if (!responsibleName)
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 },
      )

    const adminWithUpdatedCount = await Admin.findOneAndUpdate(
      { _id: admin._id },
      {
        $inc: { itemsLoanedCount: 1 },
      },
      {
        new: true,
      },
    )

    if (!adminWithUpdatedCount)
      return NextResponse.json(
        { success: false, error: 'Erro interno ao atualizar contador.' },
        { status: 500 },
      )

    const nextSequenceNumber = adminWithUpdatedCount.itemsLoanedCount

    const loan = await Loan.create({
      armt,
      armtNumber,
      rank,
      soldierName,
      destination,
      isFieldActivity: Boolean(isFieldActivity),
      sequenceNumber: nextSequenceNumber,
      borrowedAt: new Date(),
      responsibleName,
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

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const {
      sequenceNumber,
      password,
    }: {
      sequenceNumber: number
      password: string
    } = body

    if (!sequenceNumber || !password)
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios ausentes.' },
        { status: 400 },
      )

    const admin = await Admin.findOne().select('passwords password')

    if (!admin)
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 },
      )

    let returnedByName: string | null = null

    if (Array.isArray(admin.passwords) && admin.passwords.length > 0) {
      const matchedEntry = admin.passwords.find((entry) => entry.password === password)
      if (matchedEntry)
        returnedByName = matchedEntry.name
    }
    else if (admin.password === password) {
      returnedByName = 'Admin'
    }

    if (!returnedByName)
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 },
      )

    const loan = await Loan.findOneAndUpdate(
      { sequenceNumber, deletedAt: null },
      { $set: { returnedAt: new Date(), returnedByName } },
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
    console.error('Erro ao confirmar recebimento', error)

    return NextResponse.json(
      { success: false, error: 'Erro interno ao confirmar recebimento.' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const {
      sequenceNumber,
      password,
    }: {
      sequenceNumber: number
      password: string
    } = body

    if (!sequenceNumber || !password)
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios ausentes.' },
        { status: 400 },
      )

    const admin = await Admin.findOne().select('passwords password itemsLoanedCount')

    if (!admin)
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 },
      )

    const hasValidPassword = Array.isArray(admin.passwords)
      && admin.passwords.some((entry) => entry.password === password)
      || (!admin.passwords?.length && admin.password === password)

    if (!hasValidPassword)
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 },
      )

    const loan = await Loan.findOneAndUpdate(
      { sequenceNumber, deletedAt: null },
      {
        $set: {
          armtNumber: '',
          deletedAt: new Date(),
        },
      },
      { new: true },
    )

    if (!loan)
      return NextResponse.json(
        { success: false, error: 'Empréstimo não encontrado.' },
        { status: 404 },
      )

    if (admin.itemsLoanedCount > 0) {
      await Admin.updateOne(
        { _id: admin._id, itemsLoanedCount: { $gt: 0 } },
        { $inc: { itemsLoanedCount: -1 } },
      )
    }

    return NextResponse.json({ success: true, loan }, { status: 200 })
  }
  catch (error) {
    console.error('Erro ao excluir empréstimo', error)

    return NextResponse.json(
      { success: false, error: 'Erro interno ao excluir empréstimo.' },
      { status: 500 },
    )
  }
}


