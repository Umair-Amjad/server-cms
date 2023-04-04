exports.Random=()=>{
 var chars = "0123456789";
 var InvoiceLength = 8;
 var InvoiceNumber = "";
 for (var i = 0; i <= InvoiceLength; i++) {
   var randomNumber = Math.floor(Math.random() * chars.length);
   InvoiceNumber += chars.substring(randomNumber, randomNumber + 1);
 }
 return InvoiceNumber;
}