const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true
    },
    fullname: {
      type: String,
      // required: true,
      // minLength: 3,
      maxLength: 60,
      trim: true
    },
    tel: {
      type: String,
      // required: true,
      // minLength: 3,
      maxLength: 8,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["client","admin","revandeur","coursier"],
      default: "client"
    },
    password: {
      type: String,
      required: true,
      maxLength: 1024,
      minLength: 6
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio :{
      type: String,
      maxLength: 1024,
    },
    otp :{
      type: String,
      maxLength: 1024,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into display: 'block',
userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function(email, password) {
  let user = await this.findOne({ email });

  
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      user.password = '';
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};

module.exports = mongoose.model("user", userSchema);
