import Mailgen from 'mailgen'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: process.env.MAIL_PRODUCT_NAME,
            link: process.env.MAIL_PRODUCT_URL
        }
    })

    const emailHtml = mailGenerator.generate(options.mailgenContent)
    const emailText = mailGenerator.generatePlaintext(options.mailgenContent)

    const mail = {
        from: options.from || `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: emailText,
        html: emailHtml
    }

    try {
        

        const { data, error } = await resend.emails.send(mail)

        if (error) {
            console.error('Email sending failed:', error)
            return { success: false, error }
        }

        return { success: true, data }

    } catch (error) {
        console.error('Resend email service failed:', error)
        return { success: false, error }
    }
}


const emailVerificationMailGen = (fullname, verificationUrl) => ({
  body: {
    name: fullname,
    intro: "Welcome to Joblytics! We're excited to help you track and analyze your job applications.",
    action: {
      instructions: 'Please verify your email address to get started:',
      button: {
        color: '#2563EB', // Joblytics blue
        text: 'Verify Email',
        link: verificationUrl
      }
    },
    outro: 'If you did not sign up for Joblytics, you can safely ignore this email.'
  }
})


const forgotPasswordReqMailGen = (fullname, resetUrl) => ({
  body: {
    name: fullname,
    intro: 'We received a request to reset your Joblytics password.',
    action: {
      instructions: 'Click the button below to reset your password:',
      button: {
        color: '#2563EB',
        text: 'Reset Password',
        link: resetUrl
      }
    },
    outro: 'If you did not request this password reset, no action is required.'
  }
})


export {
    sendMail,
    emailVerificationMailGen,
    forgotPasswordReqMailGen
}