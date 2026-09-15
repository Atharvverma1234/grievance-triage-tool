const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendStatusUpdateEmail(toEmail, complaintSummary, newStatus, resolutionNote) {
  if (!toEmail) return;

  const statusLabels = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved' };
  const subject = `Your complaint status: ${statusLabels[newStatus] || newStatus}`;

  const body = `
Hi,

Your complaint — "${complaintSummary}" — has been updated to: ${statusLabels[newStatus] || newStatus}.

${newStatus === 'resolved' && resolutionNote ? `Resolution note: ${resolutionNote}` : ''}

You can view full details by logging into the Civic Grievance Portal.

— Civic Grievance Portal
  `.trim();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      text: body
    });
  } catch (err) {
    console.error('Email send failed (non-fatal):', err.message);
    // Deliberately non-blocking — a failed email should never fail the status update itself
  }
}

module.exports = { sendStatusUpdateEmail };