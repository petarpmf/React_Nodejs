const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const speakeasy = require('speakeasy')
const QRCode = require('qrcode')

exports.signup = (req, res) => {
  try{
    const temp_secret = speakeasy.generateSecret({encoding: 'base32', name:'APP'});
    QRCode.toDataURL(temp_secret.otpauth_url).then(qrcode =>{
      temp_secret.data_url = qrcode;
        // Save User to Database
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        secret: JSON.stringify(temp_secret)
      }).then(user => {
          if (req.body.roles) {
            Role.findAll({
              where: {
                name: {
                  [Op.or]: req.body.roles
                }
              }
            }).then(roles => {
              user.setRoles(roles).then(() => {
                res.status(200).send({ message: "User registered successfully!", data: user.toJSON() });
              });
            });
          } else {
            // user role = 1
            user.setRoles([1]).then(() => {
              res.status(200).send({ message: "User registered successfully!", data: user.toJSON() });
            });
          }
        })
        .catch(err => {
          res.status(500).send({ message: err.message, data: null });
        });
     })
  }catch(err){
    next(err)
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        //const { base32: secret} = user.temp_secret;
        // const userSecret = user.toJSON().secret;
        // const secret = JSON.parse(userSecret).base32;
        // console.log('-=-=--=---=')
        // console.log(secret);

        // // verifying the token
        // const tokenValidate = speakeasy.totp.verify({
        //   secret,
        //   encoding: 'base32',
        //   token
        // });
        // console.log("tokenValidate-=-=-=--=-=-");
        // console.log(tokenValidate);
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          secret: user.secret
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.validateQrCode = (req, res) => {
    const { qrCode, userId } = req.body;

    let qrCodeTrim = qrCode.trim();
    let token = qrCodeTrim;
    try {
      User.findOne({
        where: {
          id: userId
        }
      }).then(user => {
          const { base32: secret } = JSON.parse(user.secret);
          // verifying the qrCode
          const tokenValidate = speakeasy.totp.verifyDelta({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 6
          })
          if (tokenValidate && tokenValidate.delta == 0) {
            // change temp_secret in our db to secret(permanent)           
            res.json({
              validated: true,
            });
          } else {
            res.json({
              validated: false,
            });
          }
        })

    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error validating and finding user",
      });
    }
}
