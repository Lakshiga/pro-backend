import nodemailer from 'nodemailer';

export const sendRegistrationEmail = async (userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lakshiga20021216@gmail.com',
        pass: 'Lachchu16'
      }
    });

    const mailOptions = {
      from: 'lakshiga20021216@gmail.com',
      to: userEmail,
      subject: 'Registration Confirmation',
      text: 'Thank you for registering! Your account has been successfully created.',
      html: `<h1>Welcome!</h1><p>Thank you for registering on our platform. Your account has been successfully created.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Registration confirmation email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
