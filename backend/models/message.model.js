import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    content: String,
  },
  { timestamps: true }
)

export default mongoose.model('Message', messageSchema)
