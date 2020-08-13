const nodemailer = require("nodemailer");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}

const verifyEmail = (receiver, link) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: "sender@email.com", // sender address
    to: receiver, // list of receivers
    subject: "Acount activation", // Subject line
    html: `<a href="${link}" >Please continue to this link to activate your account.</a>`, // plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

module.exports = verifyEmail;
