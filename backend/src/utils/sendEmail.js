const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

const transporter = nodemailer.createTransport({
    // We can use Ethereal for local testing if env vars are missing, or a real SMTP if provided
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER || 'ethereal_user',
        pass: process.env.EMAIL_PASS || 'ethereal_pass'
    }
});

/**
 * Sends an email using Nodemailer and Handlebars templates
 * @param {Object} options - { email, subject, template, context }
 */
const sendEmail = async ({ email, subject, template, context }) => {
    try {
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

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        // If using ethereal email for dev, log the preview URL:
        if (process.env.EMAIL_HOST === 'smtp.ethereal.email' || !process.env.EMAIL_HOST) {
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;
