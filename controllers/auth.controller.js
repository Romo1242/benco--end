const nodemailer = require("nodemailer");

const UserModel = require('../models/user.model');
const WalletModel = require('../models/wallet.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/error.utils');

const bcrypt = require('bcryptjs')


const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

module.exports.signUp = async (req, res) => {
    const pseudo = req.body.pseudo;
    const email = req.body.email;
    const password = req.body.password;
    const fullname = req.body.fullname || '';
    const tel = req.body.tel || '';
    

    try {
        const user = await UserModel.create({pseudo, email, password, fullname, tel });

        if(user){
          const newWallet = WalletModel({
            solde: 24000,
            user: user._id,
          });

          const wallet = await newWallet.save();

          res.status(201).json({ 
            message: "Inscription éffectuée",
            user: user._id
          });
        }
    }
    catch(err) {
      const errors = signUpErrors(err);
        res.status(200).send({errors})
    }
}

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;


    try {

      const user =  await UserModel.findOne({email});


      if (!user || (!await bcrypt.compare(password, user.password))) {
        throw new Error('no user !');
      }

      const otp = Buffer.from(`${email}-${password}-${Date.now()}`).toString('base64');

      UserModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            otp: otp
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
          if (!err) {
            
            let transporter = nodemailer.createTransport({
              host: "smtp.mailtrap.io",
              port: 2525,
              auth: {
                user: "1a2816dcd5abf7",
                pass: "984d499191899a"
              }
            });


        
            // send mail with defined transport object
            let info = transporter.sendMail({
              from: '"Benco App" <benco.app@telegmail.com>', // sender address
              to: email, // list of receivers
              subject: "otp confirmation ✔", // Subject line
              text: otp, // plain text body
              html: `Benco otp : ${otp}`, // html body
            });
            
            return res.send({
            status: 201,
            message: "Sucessfuly login in.",
            ressource: docs
          });
        }
          if (err) return res.status(500).send({ message: err });

          if (err) {
            console.log(err)
          }
        }
      );
    } catch (err){
      console.log(err);

      const errors = signInErrors(err);
      res.status(200).json({errors});
    }
}

module.exports.signInOtp = async (req, res) => {
  const { otp } = req.body;

  const nbMinutes = 2;

  try {

    let user = await UserModel.findOne({ otp });

    if (user) {
      const otpDate = new Date(user.updatedAt);


      if ((Date.now() - otpDate.valueOf()) <= (1000 * 60  * nbMinutes)) {
        // await UserModel.login(user.email, user.password);

        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge});
        res.status(200).json({ user: user, token})
      } else {
        throw Error('Otp Expiré')
      }
      throw Error('Erreur réessayé');
    }
    throw Error('Invalid Otp')

  } catch (err){
    console.log(err)
    const errors = signInErrors(err);
    res.status(200).json({errors});
  }
}



  module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
