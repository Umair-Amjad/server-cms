const express = require("express");
const nodemailer = require("nodemailer");

const PaidEmail = (options) => {
    
  console.log(options);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDMAIL,
        pass: process.env.PASS,
      },
    });
    // from: options.Collegeemail,

    const MailOption = {
      from: process.env.SENDMAIL,
      to: options.email,
      subject: "Payment ", // Subject line
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>School Payment Details</title>
    <style>
      body {
        background-color: #F5F5F5;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5em;
        color: #444;
      }
      
      h1 {
        font-size: 24px;
        color: #4CAF50;
        margin-bottom: 0;
      }
      
      p {
        margin-top: 0;
      }
      
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #FFF;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .footer {
        margin-top: 20px;
        font-size: 14px;
        text-align: center;
        color: #999;
      }
      
      .notice {
        margin-top: 20px;
        padding: 20px;
        background-color: #FFEFD5;
        border-radius: 5px;
        border: 1px solid #FFDAB9;
        color: #FF8C00;
      }
      
      .payment-details {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        border-top: 1px solid #DDD;
        border-bottom: 1px solid #DDD;
        padding: 10px 0;
      }
      
      .payment-details span {
        flex: 1;
      }
      
      .payment-details .total-amount {
        font-size: 24px;
        font-weight: bold;
        color: #4CAF50;
      }
      
      .payment-details .label {
        font-weight: bold;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>School Payment Details</h1>
      <div class="payment-details">
        <span class="label">ROLL NO:</span>
        <span class="value">${options.RollNo}</span>
      </div>
      <div class="payment-details">
        <span class="label">Fee Type:</span>
        <span class="value">${options.Type}</span>
      </div>
      <div class="payment-details">
        <span class="label"> Date:</span>
        <span class="value">${options.Date}</span>
      </div>
      <div class="payment-details">
        <span class="label">Total Amount:</span>
        <span class="value">${options.Balance}</span>
      </div>
      <div class="payment-details">
        <span class="label">PAID:</span>
        <span class="value">Rs ${options.paid}</span>
      </div>
      <div class="payment-details">
        <span class="label">Total Amount Due:</span>
        <span class="value">${options.RemaingFee}</span>
      </div>
     
      <div class="notice">
        <p>Please note that failure to pay fees by the due date may result in a late fee charge.</p>
      </div>
      <div class="footer">
        <p>Thank you for your payment!<br>
       ${options.School}<br>
        
</body>
`, // html body
    };

    transporter.sendMail(MailOption, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  } catch (error) {
    console.log("Error" + error);
    res.status(401).json({ status: 401, error });
  }
};

module.exports = PaidEmail;
