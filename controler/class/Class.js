const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

var con = require("../../db/Db_connection");
const { verifyToken } = require("../Middleware/Jwt");

router.get("/api", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const sqlinsert = `SELECT * FROM class WHERE status=1 AND CollegeID=${data.user.id} `;
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.get("/api/assignteacher", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const sqlinsert = `SELECT  ast.*, tec.first_name,sec.name as sectionName,ses.year as yearName,cl.className as className FROM assignteacher ast LEFT JOIN teachers tec ON ast.teacherid = tec.id LEFT JOIN sections sec ON ast.sectionid=sec.id LEFT JOIN sessions ses ON ast.yearid = ses.id LEFT JOIN class cl ON ast.classid =cl.id where ast.status=1 AND tec.activation_status=1 AND tec.CollegeID=${data.user.id}`;

  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.get("/session", verifyToken, (req, res) => {
  const sqlinsert = "SELECT * FROM `sessions` WHERE 1";
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.get("/api/section", verifyToken, (req, res) => {
  const sqlinsert = "SELECT * FROM sections WHERE 1";
  con.query(sqlinsert, (err, result) => {
    if(err) throw err;
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.post("/class", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };
  const Class = req.body;
  console.log(Class);

      if (Class.id !== "") {
        const sqlinsert2 = `UPDATE class SET className="${Class.className}",description="${Class.description}" WHERE id=${Class.id} `;
        con.query(sqlinsert2, (err, result) => {
          if (err) throw err;
          // res.send({ messeage: "Class Update Successfully" });
          // console.log(result)
        });
      } else {
        const sqlinsert3 = `INSERT INTO class (className,description,CollegeID,status) VALUES ("${Class.className}","${Class.description}",${data.user.id},1)`;
        con.query(sqlinsert3, (err, result) => {
          if (err) throw err;
          res.send({ messeage: "Class Add Successfully" });
          // console.log(result)
        });
      }
  });

router.put("/classes/del", (req, res) => {
  const ID = req.body.data;
  console.log(ID.id);
  const sqlinsert = `UPDATE class SET status=0 WHERE id IN (${ID.id})`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw new Error();
    res.send(result);
  });
});

router.post("/addassignteacher", verifyToken, (req, res) => {
  const add = req.body;
  const sqlinsert = `INSERT INTO assignteacher ( yearid, teacherid, classid, sectionid,status) VALUES ("${add.yearid}","${add.teacherid}","${add.classid}","${add.sectionid}",1)`;

  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send({ message: "added " });
    // console.log(result);
  });
});

router.put("/deleteTeacher/:id", verifyToken, (req, res) => {
  const ID = req.params.id;
  console.log(ID);
  const sqlinsert = `UPDATE assignteacher SET status=0 WHERE id=${ID}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send({ msg: "Successfully Deleted" });
  });
});

module.exports = router;
