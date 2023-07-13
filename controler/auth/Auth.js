const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.use(cors());
var con = require("../../db/Db_connection");
const nodemailer = require("nodemailer");
const sendMail = require("../utils/SendMail");
const upload = require("../multer/multer");
const AsyncError = require("../Middleware/AsyncError");
const ErrorHandler = require("../utils/ErrorHandler");


// img storage confing



router.post("/api",upload.single("photo"),  AsyncError(async(req, res,next) => {
    const { filename } = req.file;

  console.log("file",filename);
  console.log(req.body);
  console.log(req.file);

  // return
  try {
    const date = new Date().toISOString().slice(0, -5).replace("T", " ");
    con.query(
      `SELECT * FROM schoolregisteration WHERE LOWER(email)=LOWER(${con.escape(
        req.body.email
      )})`,
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: "This User already in use!",
          });
        } else {
          //hash pass
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err,
              });
            } else {
              //has hased pss
              con.query(
                `INSERT INTO schoolregisteration (first_name,last_name,institute_Name,contact_no, email, password,schoolimage,CreatedDate,isAdmin,isVerified) VALUES ('${
                  req.body.name
                }','${req.body.lastname}','${req.body.InstituteName}',${
                  req.body.contact
                }, ${con.escape(req.body.email)},${con.escape(hash)},'${
                  filename
                }','${date}',1,0)`,
                async (err, result) => {
                  if (err) {
                    return res.status(400).send({
                      msg: err,
                    });
                  }

                  await sendMail({
                    username: req.body.name,
                    email: req.body.email,
                    instituteName: req.body.InstituteName,
                    contactNo: req.body.contact,
                  });

                  // await SendSms({
                  //   contactNo: req.body.contact,
                  //   text: "Your Account Has been REgister Please wait until your account is Verify",
                  // });
                  return res.status(201).send({
                    msg: "The User Has Been Register",
                  });
                }
              );
            }
          });
        }
      }
    );
  } catch (err) {
    return next(new ErrorHandler("somthing went wrong",500))
  }
}));

router.post("/login", (req, res) => {
  console.log(req.body, req.body.password);
  con.query(
    `SELECT * FROM schoolregisteration WHERE email=${con.escape(
      req.body.email
    )}`,
    (err, result) => {
      console.log("result", result);
      if (err) {
        throw err;
      }

      if (result[0].isVerified === 1) {
        if (!result.length) {
          return res.status(401).send({
            //check email
            msg: "Email or  Password  incorrect",
          });
        }
        //check pas
        bcrypt.compare(
          req.body.password,
          result[0]["password"],
          (err, BResult) => {
            console.log("BResult", BResult);
            if (err) {
              throw err;
            }
            if (BResult) {
              const token = jwt.sign(
                {
                  id: result[0].id,
                  institute_Name: result[0].institute_Name,
                  email: result[0].email,
                },
                process.env.jwt_secret_key,
                {
                  expiresIn: "15d",
                }
              );
              con.query(
                `UPDATE schoolregisteration SET isAdmin = 1 WHERE id = '${result[0].id}'`
              );
              return res.status(200).send({
                msg: "Logged in!",
                token,
                registerdUser: result[0],
              });
            }
            return res.status(401).send({
              //check pass
              msg: "Username or password is incorrect!",
            });
          }
        );
      } else {
        res.status(426).send({
          msj: "An Account is nots verified our support team will soon contact you",
        });
      }
    }
  );
});
// password Reset

router.post("/forgot-password", (req, res) => {
  const email = req.body.email;

  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" });
  }
  try {
    const sqlinsert = `SELECT * FROM schoolregisteration WHERE email='${email}'`;
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        const Token = jwt.sign(
          { id: result[0].id, email: result[0].email },
          process.env.jwt_secret_key,
          { expiresIn: "1d" }
        );
        const link = `http://localhost:3000/register/reset-password/${result[0].id}/${Token}`;
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SENDMAIL,
            pass: process.env.PASS,
          },
        });

        var mailOptions = {
          from: process.env.SENDMAIL,
          to: email,
          subject: "Password Reset",
          text: link,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        console.log(link);
        console.log(Token);
        res.send("Link sent to email");
      } else {
        res.status(404).json({ status: 404, message: "invalid user" });
      }
    });
  } catch (err) {
    res.status(401).json({ status: 401, message: "invalid user" });
  }
  // res.send("done")
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  try {
    const sqlinsert = `SELECT * FROM schoolregisteration WHERE id=${id}`;
    con.query(sqlinsert, (err, result) => {
      if (!result) {
        // res.status(500).json(err);
        console.log("user nit exist");
      }
      if (err) throw err;
    });
    const verify = jwt.verify(token, process.env.jwt_secret_key);
    console.log(verify);
    if (verify.id) {
      res.send(201).json({ status: 201 });
    } else {
      res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (err) {
    res.send("not verify");
    return res.send(401).send({ status: 401, message: "invalid user" });
  }
  console.log(req.params);
});

router.post("/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const password = req.body.data;
  console.log("pass", password);
  console.log("params", req.params);
  //  return
  try {
    const sqlinsert = `SELECT * FROM schoolregisteration WHERE id=${id}`;
    const verifyToken = jwt.verify(token, process.env.jwt_secret_key);
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
      if (result && verifyToken.id) {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            con.query(
              `UPDATE schoolregisteration SET password=${con.escape(
                hash
              )} WHERE Id=${id}`
            );
            (err, result) => {
              if (err) throw err;
            };
          }
        });
      }
      res.status(201).send({ status: 201, message: "Password Updated" });
    });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

router.get("/umair", async (req, res) => {
  const { number, text } = req.query;

  await SendSms();
  // res.send({ hi: "hello umair" });
});

module.exports = router;
