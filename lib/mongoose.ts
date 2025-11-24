import mongoose, { Schema, Model, Document } from 'mongoose'

const mongoDbUri = process.env.MONGODB_URI

if (!mongoDbUri)
  throw new Error('MONGODB_URI environment variable is not defined')

interface LoanDocument extends Document {
  itemId: string
  itemName?: string
  borrowerName?: string
  borrowedAt: Date
  returnedAt?: Date | null
}

interface AdminDocument extends Document {
  passwordHash: string
  itemsLoanedCount: number
}

const loanSchema = new Schema<LoanDocument>(
  {
    itemId: { type: String, required: true },
    itemName: { type: String },
    borrowerName: { type: String },
    borrowedAt: { type: Date, required: true, default: Date.now },
    returnedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
)

const adminSchema = new Schema<AdminDocument>(
  {
    passwordHash: { type: String, required: true },
    itemsLoanedCount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
)

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
   
  var mongooseCache: MongooseCache | undefined
}

const globalForMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache
}

let cached = globalForMongoose.mongooseCache

if (!cached)
  cached = globalForMongoose.mongooseCache = { conn: null, promise: null }

export async function connectToDatabase() {
  if (cached?.conn)
    return cached.conn

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(mongoDbUri).then(() => mongoose)
  }

  cached!.conn = await cached!.promise
  return cached!.conn
}

export const Loan: Model<LoanDocument> =
  mongoose.models.Loan || mongoose.model<LoanDocument>('Loan', loanSchema)

export const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', adminSchema)


