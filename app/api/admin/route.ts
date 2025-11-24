import { NextRequest, NextResponse } from 'next/server'

import { Admin, connectToDatabase } from '@/lib/mongoose'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const { password }: { password: string } = body

    if (!password)
      return NextResponse.json(
        { success: false, error: 'Senha é obrigatória.' },
        { status: 400 },
      )

    const admin = await Admin.findOne().select('password')

    if (!admin || admin.password !== password)
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 },
      )

    return NextResponse.json({ success: true }, { status: 200 })
  }
  catch (error) {
    console.error('Erro ao verificar senha de administrador', error)

    return NextResponse.json(
      { success: false, error: 'Erro interno ao verificar senha.' },
      { status: 500 },
    )
  }
}



