import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true, versionKey: false },
);
//Hook pre('save') to set the username to be the same as the email by default when creating a user.
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});
//remove the password from the user object before sending the response
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = model('User', userSchema);
