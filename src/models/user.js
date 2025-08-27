import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) =>
          value.includes("@") && value.endsWith(".com"),
        message: "Email must contain @ and end with .com",
      },
    },

    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
            const hasLetter = [...value].some(c => c.toLowerCase() !== c.toUpperCase());
            const hasNumber = [...value].some(c => "0123456789".includes(c));
            return value.length >= 6 && hasLetter && hasNumber;
            },
            message: "Password must be at least 6 characters and contain letters and numbers",
        }
    },


    mobile: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          value.length === 10 && !isNaN(value),
        message: "Mobile number must be exactly 10 digits",
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
