var https = require("https");


const SendSms = (paid,Rem) => {

    console.log(paid);
    var textmessage = `You have Paid ${paid.paid} and your remaining Fee is ${paid.RemaingFee} FROM ${paid.institute_Name}`;
    console.log(textmessage);

  var options = {
    host: "api.veevotech.com",
    port: 443,
    path:
      "/sendsms?hash=" +
      (process.env.API_Key) +
      "&receivenum=" +
      paid.contactNo +
      "&sendernum=" +
      encodeURIComponent(process.env.SMS_PORTNUMBER) +
      "&textmessage=" +
      encodeURIComponent(paid.text ? paid.text : textmessage),
    method: "GET",
    setTimeout: 30000,
  };
  var req = https.request(options, function (res) {
    console.log("UAIRSTATUS: " + res.statusCode);
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      console.log(chunk.toString());
    });
  });
  req.on("error", function (e) {
    console.log("problem with request: " + e.message);
  });

  req.end();
};

module.exports= SendSms;
