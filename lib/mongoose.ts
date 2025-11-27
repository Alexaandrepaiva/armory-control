import mongoose, { Schema, Model, Document } from 'mongoose'

const mongoDbUri = process.env.MONGODB_URI

if (!mongoDbUri)
  throw new Error('MONGODB_URI environment variable is not defined')

interface LoanDocument extends Document {
  armt: string
  armtNumber: string
  rank?: string
  soldierName: string
  destination?: string
  sequenceNumber: number
  borrowedAt: Date
  returnedAt?: Date | null
  deletedAt?: Date | null
  isFieldActivity?: boolean
  responsibleName?: string
  returnedByName?: string
}

interface AdminPasswordEntry {
  name: string
  password: string
}

interface AdminDocument extends Document {
  passwords: AdminPasswordEntry[]
  password?: string
  itemsLoanedCount: number
}
const loanSchema = new Schema<LoanDocument>(
  {
    armt: { type: String, required: true },
    armtNumber: { type: String, required: true },
    rank: { type: String },
    soldierName: { type: String, required: true },
    destination: { type: String },
    sequenceNumber: { type: Number, required: true },
    borrowedAt: { type: Date, required: true, default: Date.now },
    returnedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    isFieldActivity: { type: Boolean, default: false },
    responsibleName: { type: String },
    returnedByName: { type: String },
  },
  {
    timestamps: true,
  },
)

const adminSchema = new Schema<AdminDocument>(
  {
    passwords: {
      type: [
        {
          name: { type: String, required: true },
          password: { type: String, required: true },
        },
      ],
      required: true,
      default: [],
    },
    password: { type: String },
    itemsLoanedCount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
)

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1)
    return

  await mongoose.connect(mongoDbUri as string, {
    dbName: 'blogsi',
  })
}

export async function connectToDatabase() {
  await connectDB()
  return mongoose
}

if (mongoose.models.Loan)
  delete mongoose.models.Loan

if (mongoose.models.Admin)
  delete mongoose.models.Admin

export const Loan: Model<LoanDocument> =
  mongoose.model<LoanDocument>('Loan', loanSchema)

export const Admin: Model<AdminDocument> =
  mongoose.model<AdminDocument>('Admin', adminSchema)


