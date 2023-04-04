const express = require("express");
const nodemailer = require("nodemailer");

const SendMail = (options) => {

    console.log("umair",options)
  try {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDMAIL,
      pass: process.env.PASS,
    },
  });


  const MailOption = {
    from: process.env.SENDMAIL,
    to: options.email,
    subject: "ACCOUNT REGISTRATION", // Subject line
    text: "Hello world?", // plain text body
    html: `
      <head>
    <meta charset="UTF-8">
    <title>Welcome!</title>
    <style>
      body {
        background-color: #F5F5F5;
        font-family: Arial, sans-serif;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }
      
      h1 {
        color: #4CAF50;
        font-size: 3em;
        margin-bottom: 0;
      }
      
      p {
        color: #444;
        font-size: 1.2em;
        line-height: 1.5em;
      }
      
      .cta {
        background-color: #4CAF50;
        color: #FFF;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 1.2em;
        transition: background-color 0.2s ease-in-out;
      }
      
      .cta:hover {
        background-color: #3E8E41;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome ${options.username}!</h1>
      <p>Hello there, user! We're excited to have you on board.</p>
      <p>Thank you for choosing our service.</p>
      <p>If you did not register for an account on [Website Name], please disregard this message.<p/>
      <p>Soon You will Recive Confirmation E-Mail/Message To Verify You School Account  </p>
     <p>If you have any questions or need further assistance, please do not hesitate to contact our support team at <br/>
     E-mail:uamjad508@gmail.com <br/>
     Contact No:0312094180,
     <p/>
    </div>
  </body>
</html>` // html body
  };

  transporter.sendMail(MailOption,(err,result)=>{
    if (err) throw err
    console.log(result) 
  })
  } catch (error) {
    console.log("Error" + error);
    res.status(401).json({ status: 401, error });
  }
};


module.exports = SendMail;