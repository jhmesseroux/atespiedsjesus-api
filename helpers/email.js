const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')
const path = require('path')
module.exports = class Email {
  constructor (user, url) {
    this.to = user.email
    this.firstName = user.username.split(' ')[0]
    this.url = url
    this.from = `Jean Hilaire Messeroux  <${process.env.EMAIL_FROM}>`
  }

  newTransport () {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      })
    }

    return nodemailer.createTransport({
      // host: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT,
      // auth: {
      //   user: process.env.EMAIL_USERNAME,
      //   pass: process.env.EMAIL_PASSWORD,
      // },
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '5bd15bd76859d7',
        pass: '27fa67a062f87b'
      }
    })
  }

  // Send the actual email
  async send (template, subject) {
    // 1) Render HTML based on a pug template
    // using join to get the path to the template
    // const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug` ,  {
    // const html = pug.renderFile( path.join( __dirname,'/../views/email/',template , 'pug' )
    const html = pug.renderFile(path.join(__dirname, '/../views/email/', template, 'pug'), {
      firstName: this.firstName,
      url: this.url,
      subject
    })

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    }

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome () {
    await this.send('welcome', 'Welcome to the Natours Family!')
  }

  async sendPasswordReset () {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)')
  }
}

// const senEmail = async (options) => {
//   // 1) create a transporter
//   var transport = nodemailer.createTransport({
//     // store them to .env
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//       user: '5bd15bd76859d7',
//       pass: '27fa67a062f87b',
//     },
//   });

//   //2) define the email options
//   const mailOptions = {
//     from: 'JHMesseroux <jhmesseroux@jhm.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html :
//   };

//   //3) actually send the email
//   await transport.sendMail(mailOptions);
// };

// module.exports = senEmail;
