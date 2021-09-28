# Emails

The backend can be configure to send transactional emails via a SMTP server.

See [nodemailer.ts](../src/mailer/nodemailer.ts) for the available configuration options.

## Console fallback

If SMTP is not configured, `console.log` will be used to print essential information contained in emails. This allows you to develop locally without having to provide the SMTP configuration.
