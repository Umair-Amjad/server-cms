const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.use(cors());
function verifyToken(req, res, next) {
  console.log("middle ware");
  // return
  let token = req.headers["authorization"];

  if (token) {
    token = token.split(" ")[1];
    console.log(token);
    try{
      const data = jwt.verify(token, process.env.jwt_secret_key);
      console.log("==>",data)
      req.userId=data.id;
      req.institute = data.institute_Name;
      req.email=data.email;
      return next()
  }catch{
    return res.status(401).send({msj:"Invalid Token"})
  }
  } else {
    res.status(404).send({ msg: "invalid token header" });
  }
  // }
}

module.exports={verifyToken};
