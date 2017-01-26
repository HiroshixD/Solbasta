var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

var smtpTransport = nodemailer.createTransport("SMTP", {
host: "mail.disolu.com", // hostname
secureConnection: true, // TLS requires secureConnection to be false
port: 465, // port for secure SMTP
auth: {
user: "informes@solbasta.com",
pass: "soluciones123"
},
debug:true,
tls: {
rejectUnauthorized: false
}
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '<informes@solbasta.com>', // sender address
    to: 'hpalacios@disolu.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});