const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

let transporter = null;

const createTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Use real SMTP credentials from .env
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
            requireTLS: process.env.EMAIL_PORT == 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            // Force IPv4 binding for OS compatibility
            family: 4
        });
    } else {
        // Automatically generate an Ethereal test account if credentials are not provided
        console.log("⚠️ No valid EMAIL credentials found in .env. Generating a free Ethereal Test Account...");
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }
    return transporter;
};

/**
 * Sends an email using Nodemailer and Handlebars templates
 * @param {Object} options - { email, subject, template, context }
 */
const sendEmail = async ({ email, subject, template, context }) => {
    try {
        const mailer = await createTransporter();

        const templatePath = path.join(__dirname, '../templates/emails', `${template}.hbs`);
        const templateSource = await fs.readFile(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(templateSource);
        const html = compiledTemplate(context);

        const mailOptions = {
            from: `"VeriPoint" <${process.env.EMAIL_FROM || 'noreply@veripoint.babcock.edu.ng'}>`,
            to: email,
            subject: subject,
            html: html,
        };

        const info = await mailer.sendMail(mailOptions);
        console.log(`\n📧 Email successfully sent to ${email}`);

        // Always log Ethereal URLs if using ethereal
        if (info.messageId && mailer.options.host === 'smtp.ethereal.email') {
            console.log(`🔗 PREVIEW URL: ${nodemailer.getTestMessageUrl(info)}\n`);
        }

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;
