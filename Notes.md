/* What is transporter in Nodemailer*/
A transporter is an object that knows how to connect to an email service (SMTP server or email provider) and send emails.

 like this:

Email = Letter 📄
SMTP Server = Post Office 🏤
Transporter = Delivery Agent 🚚

In Create Transporter

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port :465
    auth: {
        user: "yourgmail@gmail.com",
        pass: "your_app_password"
    }
});

*service: "gmail" tells Nodemailer to use Gmail's SMTP server.
*auth provides the credentials used to log in.
*port: on which this smtp server is running

The returned object is stored in transporter.



What functions does a transporter provide?
1. sendMail() ⭐ (Most Important)
Used to send Email

await transporter.sendMail({
    from: "yourgmail@gmail.com",
    to: "abc@gmail.com",
    subject: "Hello",
    text: "Welcome!"
});

It:
Connects to the SMTP server
Authenticates,Sends the email
Returns information about the delivery

2. verify()
Checks whether your SMTP configuration is correct.

await transporter.verify();
console.log("SMTP Server is ready");

Useful before sending emails.
