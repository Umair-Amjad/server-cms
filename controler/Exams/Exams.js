const express = require("express");
const router = express.Router();
const cors = require("cors");
var con = require("../../db/Db_connection");
const date = require("date-and-time");
const { verifyToken } = require("../Middleware/Jwt");
router.use(cors());

router.get("/examsgroup", (req, res) => {

  const sqlinsert = `SELECT * FROM examgroup`;
  con.query(sqlinsert, (err, result) => {
    res.send(result);
  });
});

router.get("/examsName",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const sqlinsert = `SELECT ex.id,ex.name FROM exams ex where ex.CollegeID=${data.user.id}`;
  con.query(sqlinsert, (err, result) => {
    if(err) throw err;
    res.send(result);
  });
});


router.post("/api/createExams",verifyToken,(req,res)=>{
  const data = { user: { id: req.userId, institute_name: req.institute } };

  // picked is actually publish or not 1|0
  const examsData=req.body;
  console.log(examsData)
  const sqlinsert = `INSERT INTO exams (id, name, examgroup, yearid, classid, description,  publish,CollegeID) VALUES (
    NULL,'${examsData.examName}',${examsData.examsGroup},'${examsData.yearid}',${examsData.classid},'${examsData.description}',${examsData.picked},${data.user.id})`;
  con.query(sqlinsert,(err,result)=>{
    if(err) throw err;
    res.send({status:200,msg:"Exam created"})
  })
});
router.get("/api/select",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const params = req.query;
  console.log("kh", params);
  const sqlinsert = `SELECT sub.*  FROM examssubject st LEFT JOIN subjects sub on st.subject=sub.id WHERE  st.examGroup=${params.examsGroup} AND st.examName=${params.examsName} AND st.classid=${params.classid} AND st.sectionid=${params.sectionid}`;
   console.log(sqlinsert)

  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});
router.get("/api/exams",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const params = req.query;
  console.log(params.Subject);
  const sqlinsert = `SELECT st.student_id ,ex.maxMarks,ex.minMarks,S.name,S.fname,S.gender,S.rollno,cl.className as class,sec.name as section FROM assignexams st LEFT JOIN class cl ON st.classid=cl.id LEFT JOIN sections sec ON st.sectionid=sec.id
LEFT JOIN examssubject ex ON st.classid=st.classid
  LEFT JOIN students S ON st.student_id=S.id
WHERE st.examGroup=${params.examsGroup} AND st.examName=${params.examsName} AND st.classid=${params.classid} AND st.sectionid=${params.sectionid}  GROUP BY Student_id`;

  // return console.log(sqlinsert)
  con.query(sqlinsert, (err, result) => {
    if(err) throw err;
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});
//for updata-marks-input feild serch
router.get("/api/exams/marks-update",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const Marks_update = req.query;
  console.log(Marks_update);
  // return
  const sqlinsert = `SELECT ex.*,S.name,S.gender,S.fname,S.rollno FROM exams_marks ex LEFT JOIN students S ON ex.student_id=S.id
WHERE ex.classid=${Marks_update.classid} AND ex.sectionid=${Marks_update.sectionid} AND ex.examsGroup=${Marks_update.examsGroup} AND ex.examsName=${Marks_update.examsName} AND ex.Subject=${Marks_update.Subject}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post("/api/exams/marks-updated",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const examsData = req.body;
console.log(examsData)
  examsData.studentMarks.forEach((ele) => {
    const sqlinsert = `UPDATE  exams_marks SET ObtMarks=${ele.ObtMarks} WHERE student_id=${ele.student_id} AND Subject=${ele.Subject} AND CollegeID=${data.user.id}`;

    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
    });

  });
  res.send({ status: 200, message: "Marks Updated" });
});

router.get("/api/exams-remarks",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const params = req.query;
  const sqlinsert = `SELECT st.*,S.name,S.fname,S.gender,S.rollno,cl.className as class,sec.name as section FROM exams_marks st LEFT JOIN class cl ON st.classid=cl.id LEFT JOIN sections sec ON st.sectionid=sec.id LEFT JOIN students S ON st.student_id=S.id  WHERE st.examsGroup=${params.examsGroup} AND st.examsName=${params.examsName} AND st.classid=${params.classid} AND st.sectionid=${params.sectionid} AND st.CollegeID=${data.user.id}`;

  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    console.log(result);

    const result2 = JSON.parse(JSON.stringify(result));

    const output = result2.reduce((acc, current) => {
      console.log("acc", acc, "ccc", current);
      const { student_id, name, lname, rollno, MaxMarks, ObtMarks } = current;
      const previousRecord = acc[student_id];
      if (typeof previousRecord === "object") {
        return {
          ...acc,
          [student_id]: {
            ...previousRecord,
            ObtMarks: previousRecord.ObtMarks + ObtMarks,
            MaxMarkss: previousRecord.MaxMarkss + MaxMarks,
          },
        };
      } else {
        return {
          ...acc,
          [student_id]: {
            student_id,
            name,
            lname,
            rollno,
            ObtMarks: ObtMarks,
            MaxMarkss: MaxMarks,
          },
        };
      }
    }, {});
    res.send(output);
  });
});

router.get("/total-Exams",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const sqlinsert = `SELECT eg.name,eg.examtype,COUNT(e.examgroup) as 'noexams'
FROM
    exams e
LEFT JOIN examgroup eg On e.examgroup = eg.id WHERE e.CollegeID=${data.user.id}
GROUP By e.examgroup`;
console.log(sqlinsert);

  con.query(sqlinsert, (err, result) => {
    res.send(result);
  });
});

router.get("/get-exams",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const sqlinsert = `SELECT ex.id,ex.name,cl.className,ses.year as 'session',ex.description,ex.publish,exa.name as 'exgroupname' FROM exams ex LEFT JOIN class cl ON ex.classid=cl.id LEFT JOIN sessions ses ON ex.yearid=ses.id LEFT JOIN examgroup exa ON ex.examgroup =exa.id WHERE ex.CollegeID=${data.user.id}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post("/examsToStudent",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const examsStudent = req.body;

  const sqlinsert2 = `SELECT COUNT(*) as stud FROM assignexams asE LEFT JOIN students st on asE.rollno=st.rollno WHERE asE.examGroup=${examsStudent.examsGroup} AND asE.examName=${examsStudent.examsName} AND asE.classid=${examsStudent.classid} AND asE.sectionid=${examsStudent.sectionid} AND st.CollegeID=${data.user.id}`;
  
  console.log(sqlinsert2);
  con.query(sqlinsert2, (err, result) => {
    if (err) throw err;
    const result2 = JSON.parse(JSON.stringify(result))[0];
    if (result2.stud > 0) {
      res.send({ status: 200, message: "Already exist" });
    } else {
      examsStudent.studentList.forEach((ele) => {
        const sqlinsert = `INSERT INTO assignexams (id, addmission_id, Student_id,  classid, sectionid,  examGroup, examName,student_name,father_name,gender,rollno) VALUES (NULL, '${ele.addmission_id}', '${ele.Student_id}', '${examsStudent.classid}', '${examsStudent.sectionid}',  '${examsStudent.examsGroup}', '${examsStudent.examsName}','${ele.student_name}','${ele.father_name}','${ele.gender}','${ele.rollno}');`;
        con.query(sqlinsert, (err, res) => {
          // res.send(res)
          if (err) throw err;
        });
      });
      res.send({ status: 200, message: "Exams Assign Student " });
    }
  });
});

router.post("/post-exams-time",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };
// check subject already exist or not
  const examsData = req.body;
  examsData.subjecs.forEach((ele) => {
    const dates = date.format(new Date(ele.paperDate), "YYYY/MM/DD");
    if (ele.id) {
      const sqlinsert2 = `UPDATE examssubject SET subject=${ele.subject},time="${ele.time}",paperDate="${dates}" WHERE id=${ele.id}`;

      con.query(sqlinsert2, (err, result) => {
        if(err ) throw err;
        // console.log(result)
      });
      // res.send({ status: 201, message: "Data Upadated" });
    } else {
      console.log("khan");
      const sqlinsert = `INSERT INTO examssubject (id,examGroup,examName,classid,sectionid, subject,  paperDate, time, duration, class, maxMarks, minMarks,CollegeID) VALUES(NULL,${examsData.examsGroup},${examsData.examsName},${examsData.classid},${examsData.sectionid},'${ele.subject}','${dates}', '${ele.time}', '${ele.duration}', '${ele.class}', '${ele.maxMarks}', '${ele.minMarks}',${data.user.id});`;
      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
        console.log(result);
      });
    }
  });
  res.send({ status: 200, message: "Subject assign " });
});

router.get("/subject-list", verifyToken,(req, res) => {
    const data = { user: { id: req.userId, institute_name: req.institute } };
    const Data = req.query;

    if (
      Data.examsGroup &&
      Data.examsName &&
      Data.classid &&
      Data.sectionid != ""
    ) {
      const sqlinsert3 = `SELECT * FROM examssubject WHERE examGroup=${Data.examsGroup} AND examName=${Data.examsName} AND classid=${Data.classid} AND sectionid=${Data.sectionid} AND CollegeID=${data.user.id} ` ;
      console.log(sqlinsert3);
      con.query(sqlinsert3, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } else {
      res.send({ status: 404, message: "plz filled Data" });
    }
  });

router.post("/Exams-marks",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const Student_marks = req.body;
  console.log(Student_marks);
  Student_marks.studentMarks.forEach((ele) => {
    console.log("elee", ele);

    const sqlinsert = `INSERT INTO exams_marks (id, student_id, examsGroup, examsName, classid, sectionid, Subject, minMarks, MaxMarks, ObtMarks,CollegeID) VALUES (NULL, '${ele.Student_id}', '${Student_marks.examsGroup}', '${Student_marks.examsName}', '${Student_marks.classid}', '${Student_marks.sectionid}', '${Student_marks.Subject}', '${ele.minMarks}', '${ele.maxMarks}', '${ele.Obtmarks}',${data.user.id});`;
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
      console.log("else");
    });
  });
  res.send({ status: 200, message: "Congrates For Exams" });
});
// student-exams-deatails

router.get("/exams-deatils/:id/:selectedID", verifyToken,(req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const { id, selectedID, session } = req.params;
  console.log(req.params);
  // res.send("hi");
  // return;
  const sqlinsert = `SELECT ex.*,sub.subjectName,exgroup.name as ExamsGroup,exs.name as examsName,exs.id FROM exams_marks ex LEFT JOIN Subjects sub ON ex.Subject=sub.id Left JOIN examGroup exgroup ON ex.examsGroup=exgroup.id LEFT join exams exs ON ex.examsName=exs.id WHERE ex.student_id=${id} AND ex.examsName=${selectedID} AND ex.CollegeID=${data.user.id}`;
  console.log(sqlinsert)
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


module.exports = router;
