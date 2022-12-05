const express = require("express");
const router = express.Router();
const cors = require("cors");
const date = require("date-and-time");
router.use(cors());

var con = require("../../db/Db_connection");
const moment = require("moment/moment");

router.get("/api/attendence", (req, res) => {
  const params = req.query;

  const sqlinsert = `SELECT st.*, cl.className as class,sec.name as section FROM students st LEFT JOIN class cl ON st.classid=cl.id LEFT JOIN sections sec ON st.sectionid=sec.id  WHERE classid=${params.classid} AND sectionid=${params.sectionid}`;
  // console.log(classid,sectionid)
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.get("/api/attendenceList", (req, res) => {
  const params = req.query;
  const d = date.format(new Date(params.date), "MM/D/YYYY");

  //   const sqlinsert = `SELECT att.*,cl.className as class,sec.name as section  FROM attendence att LEFT JOIN class cl ON att.classid=cl.id  LEFT JOIN sections sec ON att.sectionid=sec.id
  //  WHERE cl.classid=${params.classid} AND sec.sectionid=${params.sectionid} AND date=${params.data}`;

  const sqlinsert = `SELECT
    att.*,
    st.name ,
    c.className,
    sec.name as secname,
CASE
WHEN att.attendence_list = 1 THEN 'present'
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
     AND att.date=${`"${d}"`}
 AND att.attendence_list=${params.attendence_list} `;
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
    // console.log(result2);
  });
});

router.post("/attendence/post", (req, res) => {
  const attend = req.body;
  const d = date.format(new Date(attend.date), "YYYY/MM/DD");

  // const data = {
  //   classid: 15,
  //   sectionid: 1,
  //   date: 11 / 02 / 2022,
  //   attendence_list: [
  //     {
  //       studentname: "umair",
  //       studentid: "1",
  //       attend: "1",
  //     },
  //     { studentname: "junaid", studentid: "2", attend: "2" },
  //   ],

  // attend.attendence_list.forEach((ele) => {

  const sqlinsert2 = `SELECT COUNT(*) as attends from attendence WHERE classid=${attend.classid} AND sectionid='${attend.sectionid}' AND date='${attend.date}'`;
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
        const sqlinsert = `INSERT INTO attendence (rollno,classid,sectionid,attendence_list,date) VALUES ('${ele.rollno}','${attend.classid}','${attend.sectionid}','${ele.absentPresent}','${d}')`;
        con.query(sqlinsert, (err, result) => {
          if (err) throw err;
        });
      });
      res.send({ status: 200 });
    }
  });

  // });
  // const sqlinsert = ``
  // con.query(sqlinsert,(err,result)=>{
  //   if(err) throw err
});

router.get("/total-attendence-detail", (req, res) => {
  const rollno = req.query;
  const Dates = req.query;
  const endDates = date.format(new Date(Dates.endDate), "YYYY/MM/DD");
  const startDates = date.format(new Date(Dates.startDate), "YYYY/MM/DD");

  const sqlinsert2 = `SELECT att.rollno, ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 1 AND att2.rollno = att.rollno AND att2.date BETWEEN "${startDates}" AND "${endDates}" ) as 'present', ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 2 AND att2.rollno = att.rollno AND att2.date BETWEEN "${startDates}" AND "${endDates}" ) as 'absent', ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 3 AND att2.rollno = att.rollno AND att2.date BETWEEN "${startDates}" AND "${endDates}") as 'late', ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 4 AND att2.rollno = att.rollno AND att2.date BETWEEN "${startDates}" AND "${endDates}") as 'leave' FROM attendence att WHERE att.date BETWEEN  "${startDates}" AND "${endDates}" AND att.rollno = ${rollno.rollNo} GROUP BY att.rollno`;
  con.query(sqlinsert2, (err, result) => {
    if(err) throw err
    if (result == "") {
      res.send({ message: "no data" });
    } else {
      res.send(result);
    }
  });
  return;
  const sqlinsert = `
  
  SELECT
    att.rollno,
    ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 1 AND att2.rollno = att.rollno AND att2.date BETWEEN ${startDates} AND ${endDates} ) as 'present',
    ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 2 AND att2.rollno = att.rollno AND att2.date BETWEEN ${startDates} AND ${endDates} ) as 'absent',
    ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 3 AND att2.rollno = att.rollno AND att2.date BETWEEN ${startDates} AND ${endDates}) as 'late',
    ( SELECT COUNT(*) FROM attendence att2 WHERE att2.attendence_list = 4 AND att2.rollno = att.rollno AND att2.date BETWEEN ${startDates} AND ${endDates}) as 'leave'
    FROM
        attendence att
        WHERE att.date BETWEEN ${startDates} AND ${endDates} AND att.rollno = ${rollno.rollNo}
    GROUP BY
        att.rollno`;
  con.query(sqlinsert, (err, result) => {
    // res.send(sqlinsert)
    // return
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
