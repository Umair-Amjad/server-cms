const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

var con = require("../../db/Db_connection");

router.get("/api", (req, res) => {
  const sqlinsert = "SELECT * FROM `class` WHERE 1";
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});


router.get("/api/assignteacher",(req,res)=>{
  const sqlinsert =
    "SELECT  ast.id, tec.name,sec.name as sectionName,ses.year as yearName,cl.className as className FROM `assignteacher` ast LEFT JOIN teachers tec ON ast.teacherid = tec.id LEFT JOIN sections sec ON ast.sectionid=sec.id LEFT JOIN sessions ses ON ast.yearid = ses.id LEFT JOIN class cl ON ast.classid =cl.id";

    con.query(sqlinsert,(err,result)=>{
      const result2=JSON.stringify(result)
      res.send(result2)
    })
})


router.get("/session", (req, res) => {
  const sqlinsert = "SELECT * FROM `sessions` WHERE 1";
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.get("/api/section", (req, res) => {
  const sqlinsert = "SELECT * FROM sections WHERE 1";
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.post("/class",(req,res)=>{
    const Class=req.body;
 const sqlinsert = `SELECT COUNT (*) as total FROM class  WHERE className='${Class.className}' `;
 con.query(sqlinsert,(err,result)=>{
  const result2 = JSON.parse(JSON.stringify(result))[0];
// console.log(result2);
  if (result2.total > 0) {
    // result2[0].status = 200;
    // res.send(JSON.stringify(result2[0]));
    res.send({message:"Already Exist",status:400})
  }
  else{
    const sqlinsert = `INSERT INTO class (className,description) VALUES ("${Class.className}","${Class.description}")`;
    con.query(sqlinsert,(err,result)=>{
        if(err) throw err
        res.send({messeage:"Class Add Successfully"});
        // console.log(result)
    });
  }
 })
});


router.post("/addassignteacher",(req,res)=>{
  const add=req.body;
  const sqlinsert = `INSERT INTO assignteacher ( yearid, teacherid, classid, sectionid) VALUES ("${add.yearid}","${add.teacherid}","${add.classid}","${add.sectionid}")`;

  con.query(sqlinsert,(err,result)=>{
    if(err) throw err
    res.send({message:"added "})
        // console.log(result);

  })
})
module.exports=router;