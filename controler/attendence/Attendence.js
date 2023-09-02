const express = require("express");
const router = express.Router();
const cors = require("cors");
const date = require("date-and-time");
router.use(cors());

var con = require("../../db/Db_connection");
const { verifyToken } = require("../Middleware/Jwt");

router.get("/api/attendence", verifyToken,(req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const params = req.query;

  const sqlinsert = `SELECT st.*, cl.className as class,sec.name as section FROM students st LEFT JOIN class cl ON st.classid=cl.id LEFT JOIN sections sec ON st.sectionid=sec.id  WHERE classid=${params.classid} AND sectionid=${params.sectionid} AND st.status=1 And st.CollegeID=${data.user.id}`;
  console.log(sqlinsert)
  con.query(sqlinsert, (err, result) => {
    if(err) throw err;
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.get("/api/attendenceList", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  console.log(req.query)
  const params = req.query;
  const d = date.format(new Date(params.date), "YYYY/MM/DD");
  const endDates = date.format(new Date(params.endDate), "YYYY/MM/DD");
  console.log(endDates)
  //   const sqlinsert = `SELECT att.*,cl.className as class,sec.name as section  FROM attendence att LEFT JOIN class cl ON att.classid=cl.id  LEFT JOIN sections sec ON att.sectionid=sec.id
  //  WHERE cl.classid=${params.classid} AND sec.sectionid=${params.sectionid} AND date=${params.data}`;
  let att = "";
  let startDate = d;
  let EndDate = "";
  let singleDate="";

  if (endDates == "0NaN/aN/aN") {
    singleDate = `AND att.date=${`"${endDates ? d : "d"}"`}`;
  }
  if (endDates != "" && endDates != "0NaN/aN/aN") {
    EndDate = `${
      endDates ? "AND" : ""
    }  att.date BETWEEN ${`"${startDate}"`} AND ${`"${endDates}"`}`;
  }
  if (params.attendence_list != "5") {
    att = `AND att.attendence_list=${params.attendence_list}`;
  }

  const sqlinsert = `SELECT
    att.*,
    st.name ,
    c.className,
    sec.name as secname,
CASE
WHEN att.attendence_list = 1 THEN 'Present'
WHEN att.attendence_list = 2 THEN 'Absent'
WHEN att.attendence_list = 3 THEN 'Late'
WHEN att.attendence_list = 4 THEN 'Leave'

    ELSE 'Absent'
END as attend


FROM
    attendence att

LEFT JOIN class c ON att.classid = c.id
LEFT JOIN students st ON att.rollno=st.rollno
LEFT JOIN sections sec ON att.sectionid = sec.id

WHERE
  att.classid=${params.classid} AND att.sectionid=${params.sectionid}    
     ${singleDate} ${att} ${EndDate} And  st.CollegeID=${
    data.user.id
  } GROUP BY att.id`;
  con.query(sqlinsert, (err, result) => {
    if(err) throw err
    console.log(sqlinsert)
    // return
    const result2 = JSON.stringify(result);
    res.send(result2);
    // console.log(result2);
  });
});

router.post("/attendence/post", verifyToken, (req, res) => {
  const attend = req.body;
  const d = date.format(new Date(attend.date), "YYYY/MM/DD");

  const sqlinsert2 = `SELECT COUNT(*) as attends from attendence WHERE classid=${attend.classid} AND sectionid='${attend.sectionid}' AND date='${d}'`;
  con.query(sqlinsert2, (err, result) => {
    const result2 = JSON.parse(JSON.stringify(result))[0];
    // console.log(result2.attends);
    if (result2.attends > 0) {
      attend.attendence_list.forEach((ele) => {
        // console.log("ele",ele)

        const sqlinsert3 = `UPDATE attendence SET attendence_list=${ele.absentPresent} WHERE rollno=${ele.rollno}`;
        con.query(sqlinsert3, (err, result) => {});
      });
      res.send({ message: "Update Taken", status: 403 });
    } else {
      attend.attendence_list.forEach((ele) => {
        const sqlinsert = `INSERT INTO attendence (rollno,classid,sectionid,attendence_list,date) VALUES 
           ('${ele.rollno}','${attend.classid}','${attend.sectionid}','${ele.absentPresent}','${d}')`;
        con.query(sqlinsert, (err, result) => {
          if (err) throw err;
        });
      });
      res.send({ status: 200 });
    }
  });
});

router.post("/staff/attendence/post", verifyToken, (req, res) => {
  const attend = req.body;
  console.log(attend)
  const d = date.format(new Date(attend.date), "YYYY/MM/DD");

  const sqlinsert2 = `SELECT COUNT(*) as attends from staffattendence WHERE  date='${d}'`;
  con.query(sqlinsert2, (err, result) => {
    const result2 = JSON.parse(JSON.stringify(result))[0];
    // console.log(result2.attends);
    if (result2.attends > 0) {
      attend.attendence_list.forEach((ele) => {
        // console.log("ele",ele)

        const sqlinsert3 = `UPDATE staffattendence SET attendence_list=${ele.absentPresent} WHERE Staff_id=${ele.TeacherId}`;
        con.query(sqlinsert3, (err, result) => {});
      });
      res.send({ message: "Update Taken", status: 403 });
    } else {
      attend.attendence_list.forEach((ele) => {
        const sqlinsert = `INSERT INTO staffattendence (Staff_id,attendence_list,date) VALUES 
           ('${ele.TeacherId}','${ele.absentPresent}','${d}')`;
        con.query(sqlinsert, (err, result) => {
          if (err) throw err;
        });
      });
      res.send({ status: 200 });
    }
  });
});

router.get("/total-attendence-detail",verifyToken, (req, res) => {
  const rollno = req.query;
  const Dates = req.query;
  const endDates = date.format(new Date(Dates.endDate), "YYYY/MM/DD");
  const startDates = date.format(new Date(Dates.startDate), "YYYY/MM/DD");

  const sqlinsert2 = `SELECT att.rollno, ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 1 AND att2.rollno = att.rollno AND att2.date BETWEEN "${startDates}" AND "${endDates}" ) as 'present', ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 2 AND att2.rollno = att.rollno AND att2.date BETWEEN "${startDates}" AND "${endDates}" ) as 'absent', ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 3 AND att2.rollno = att.rollno AND att2.date BETWEEN "${startDates}" AND "${endDates}") as 'late', ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 4 AND att2.rollno = att.rollno AND att2.date BETWEEN "${startDates}" AND "${endDates}") as 'leave' FROM attendence att WHERE att.date BETWEEN  "${startDates}" AND "${endDates}" AND att.rollno = ${rollno.rollNo} GROUP BY att.rollno`;
  console.log(sqlinsert2)
  con.query(sqlinsert2, (err, result) => {
    // return console.log(sqlinsert2)
    if (err) throw err;
    // if (result == "") {
    //   res.send({ message: "no data" });
    // } else {
      res.send(result);
      console.log(result)
    // }
  });
 
});
router.get("/total-staff-detail",verifyToken, (req, res) => {
  const rollno = req.query;
  const Dates = req.query;
  console.log(Dates, rollno);
  // return
  const endDates = date.format(new Date(Dates.endDate), "YYYY/MM/DD");
  const startDates = date.format(new Date(Dates.startDate), "YYYY/MM/DD");

  const sqlinsert2 = `SELECT att.Staff_Id, ( SELECT COUNT(*) FROM staffattendence att2 WHERE att2.attendence_list = 1 AND att2.Staff_Id = att.Staff_Id AND att2.date BETWEEN "${startDates}" AND "${endDates}" ) as 'present', ( SELECT COUNT(*) FROM staffattendence att2 WHERE att2.attendence_list = 2 AND att2.Staff_Id = att.Staff_Id AND att2.date BETWEEN "${startDates}" AND "${endDates}" ) as 'absent', ( SELECT COUNT(*) FROM staffattendence att2 WHERE att2.attendence_list = 3 AND att2.Staff_Id = att.Staff_Id AND att2.date BETWEEN "${startDates}" AND "${endDates}") as 'late', ( SELECT COUNT(*) FROM staffattendence att2 WHERE att2.attendence_list = 4 AND att2.Staff_Id = att.Staff_Id AND att2.date BETWEEN "${startDates}" AND "${endDates}") as 'leave' FROM staffattendence att WHERE att.date BETWEEN  "${startDates}" AND "${endDates}" AND att.Staff_Id = ${rollno.staffId} GROUP BY att.Staff_Id`;
  console.log(sqlinsert2)
  con.query(sqlinsert2, (err, result) => {
    if (err) throw err;
    
      res.send(result);
      console.log(result)
    // }
  });
 
});

module.exports = router;
