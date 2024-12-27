const nodemailer = require("nodemailer");

// Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
  // SMPT config
  //   const transporter = nodemailer.createTransport({
  //     host: "smtp.example.com", // SMTP server
  //     port: 587,
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: process.env.EMAIL_USERNAME, // SMTP username
  //       pass: process.env.EMAIL_PASSWORD, // SMTP password
  //     },
  //   });

    // Email options
    const mailOptions = {
      from: '"UGC.nl" <no-reply@ugc.nl>',
      to: "contact@ugc.nl", // where to send the contact form emails
      subject: "[UGC.nl] Nieuw bericht",
      text: `Je hebt een bericht ontvangen van ${firstName} ${lastName} (${email}, ${phone}): ${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Bedankt voor je bericht!" });
  } catch (error) {
    console.error("Error sending contact form email: ", error);
    res.status(500).send({ message: "Er ging iets mis, probeer het nog eens!" });
  }
};
