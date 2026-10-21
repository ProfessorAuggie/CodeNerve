import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  registrationNumber: string;
  role: 'student' | 'teacher' | 'admin';
  track: 'global' | 'lpu';
  batch: string;
  university: string;
  semester: number;
  avatar?: string;
  approvalStatus: 'approved' | 'pending' | 'disapproved';
  solvedProblemIds: string[];
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
  status: 'online' | 'idle' | 'offline';
  currentActivity: string;
  lastActive: Date;
  googleSheetSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    track: {
      type: String,
      enum: ['global', 'lpu'],
      default: 'global',
    },
    batch: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    university: {
      type: String,
      default: 'Lovely Professional University (LPU)',
    },
    semester: {
      type: Number,
      default: 3,
    },
    avatar: {
      type: String,
      default: '',
    },
    approvalStatus: {
      type: String,
      enum: ['approved', 'pending', 'disapproved'],
      default: 'approved',
    },
    solvedProblemIds: {
      type: [String],
      default: [],
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    quizScores: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['online', 'idle', 'offline'],
      default: 'online',
    },
    currentActivity: {
      type: String,
      default: 'Registered & active on CodeNerve',
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    googleSheetSyncedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Next.js hot-reload model check
export const User: Model<IUser> =
  (mongoose.models && mongoose.models.User) || mongoose.model<IUser>('User', UserSchema);
