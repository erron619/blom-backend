const nodemailer = require("nodemailer");
const log = require("debug")("app:mailer");

const FROM = "Blom team <info@mail.kiarashasady.ir>";

module.exports = async function (to, subject, html) {
    try {
        const transporter = nodemailer.createTransport({
            port: 587,
            host: "smtp.c1.liara.email",
            auth: {
                user: "admiring_lederberg_8q59ll",
                pass: "b62ef1f6-fe91-436c-9ee8-6f9fd8d88f7c",
            },
            tls: true,
        });
        await transporter.sendMail({
            from: FROM,
            to,
            subject,
            html
        })
        log("a mail was sent to " + to)
    }
    catch(err) { log(err.message) }
}