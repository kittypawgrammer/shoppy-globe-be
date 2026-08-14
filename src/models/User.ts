import { Schema, model, type InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  { timestamps: true }
);

// Hash the password before persisting, but only when it actually changed so
// unrelated saves (e.g. profile updates) do not re-hash an already hashed value.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/** Verifies a candidate password against the stored bcrypt hash. */
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export type User = InferSchemaType<typeof userSchema>;

export interface UserDocument extends User {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export default model<UserDocument>("User", userSchema);
