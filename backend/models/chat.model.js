import mongoose, { Schema } from 'mongoose'

const chatSchema = new Schema(
  {
    recipients: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    isGroupChat: {
      required: true,
      type: Boolean,
    },
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Chat', chatSchema)
