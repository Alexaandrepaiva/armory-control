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
  isFieldActivity?: boolean
}

interface AdminDocument extends Document {
  password: string
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
    isFieldActivity: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

const adminSchema = new Schema<AdminDocument>(
  {
    password: { type: String, required: true },
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

  if (!cached?.promise)
    cached!.promise = mongoose.connect(mongoDbUri as string).then(() => mongoose)

  cached!.conn = await cached!.promise
  return cached!.conn
}

if (mongoose.models.Loan)
  delete mongoose.models.Loan

if (mongoose.models.Admin)
  delete mongoose.models.Admin

export const Loan: Model<LoanDocument> =
  mongoose.model<LoanDocument>('Loan', loanSchema)

export const Admin: Model<AdminDocument> =
  mongoose.model<AdminDocument>('Admin', adminSchema)


