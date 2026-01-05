
/**
 * AK PANDEY & ASSOCIATES | STRATEGIC EMAIL PROTOCOL
 * 
 * Uses internal Serverless Function (/api/send) to securely transmit emails via Resend.
 * This prevents CORS errors and protects the API key.
 */

const ADMIN_EMAIL = 'admin@anandpandey.in';

// --- VISUAL IDENTITY CONSTANTS ---
const COLORS = {
  primary: '#CC1414', // Corporate Red for accents
  brandRed: '#A6192E', // Deep Red for Logo (Matches Portal)
  black: '#000000',
  dark: '#0A1931', // Navy
  text: '#333333',
  bg: '#F4F7FE',
  panel: '#F8FAFC',
  border: '#E2E8F0'
};

/**
 * Generates a high-end, responsive HTML email template.
 * Design Philosophy: Modern Card UI - Clean, Centered, Professional.
 * Optimized for deliverability (Table-based layout).
 */
const generateExecutiveTemplate = (
  headline: string, 
  recipientName: string, 
  introText: string,
  overviewTitle: string,
  overviewBody: string,
  ctaLink: string = "https://www.thetaxjournal.in",
  ctaText: string = "Access Secure Portal"
) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${headline}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bg}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.bg}; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Brand Header - Matched to Portal Branding -->
        <table width="100%" style="max-width: 600px; margin-bottom: 30px;" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
               <span style="font-size: 20px; font-weight: 500; letter-spacing: 3px; color: ${COLORS.brandRed}; text-transform: uppercase; font-family: Arial, sans-serif;">AK PANDEY</span>
               <span style="font-size: 14px; color: ${COLORS.brandRed}; margin: 0 8px; font-family: Arial, sans-serif;">&</span>
               <span style="font-size: 20px; font-weight: 500; letter-spacing: 3px; color: ${COLORS.brandRed}; text-transform: uppercase; font-family: Arial, sans-serif;">ASSOCIATES</span>
            </td>
          </tr>
        </table>

        <!-- Main Card -->
        <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); overflow: hidden;" cellpadding="0" cellspacing="0" border="0">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="6" style="background-color: ${COLORS.primary}; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 50px 40px;">
              <!-- Headline -->
              <h1 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 700; color: ${COLORS.dark}; text-align: center; letter-spacing: -0.5px;">${headline}</h1>
              
              <!-- Intro -->
              <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #64748B; text-align: center;">
                Hello ${recipientName},<br>${introText}
              </p>

              <!-- Data Panel (Gray Box) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.panel}; border-radius: 12px; border: 1px solid ${COLORS.border};">
                <tr>
                  <td style="padding: 24px;">
                    <div style="font-size: 11px; font-weight: 700; color: ${COLORS.primary}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; text-align: center;">${overviewTitle}</div>
                    <div style="font-size: 15px; color: ${COLORS.text}; line-height: 1.6;">
                      ${overviewBody}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${ctaLink}" style="display: inline-block; padding: 16px 36px; background-color: ${COLORS.dark}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(10, 25, 49, 0.2);">${ctaText}</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 32px 0 0 0; font-size: 13px; color: #94A3B8; text-align: center; line-height: 1.5; font-style: italic;">
                "Strategic Counsel for a Complex World"
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" style="max-width: 600px; margin-top: 30px;" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="color: #94A3B8; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0; font-weight: 600;">© 2026 AK Pandey & Associates. All Rights Reserved.</p>
              <p style="margin: 4px 0 0 0;">High Court Chambers, Shanti Path, New Delhi</p>
              <div style="margin-top: 16px;">
                <a href="#" style="color: #94A3B8; text-decoration: none; margin: 0 8px;">Privacy Protocol</a>
                <span style="color: #CBD5E1;">|</span>
                <a href="#" style="color: #94A3B8; text-decoration: none; margin: 0 8px;">Legal Disclaimer</a>
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const emailService = {
  send: async (to: string, subject: string, body: string, replyTo?: string) => {
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html: body, replyTo })
      });
      if (response.ok) return true;
      if (response.status === 400) console.warn('Email Service Warning: Likely Free Tier Limit.', await response.json());
      return true;
    } catch (error) {
      console.warn("Email Network Error. UI proceeding.", error);
      return true;
    }
  },

  sendVerificationOTP: async (email: string, name: string, otp: string) => {
    const richOtpContent = `
      <div style="text-align: center; padding: 10px 0;">
        <span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: ${COLORS.primary}; background-color: #ffffff; padding: 10px 20px; border-radius: 8px; border: 1px dashed ${COLORS.primary};">${otp}</span>
      </div>
      <p style="text-align: center; font-size: 13px; color: #64748B; margin-top: 20px;">
        Use this code to verify your identity. Valid for 10 minutes.<br>Do not share this code with anyone.
      </p>
    `;
    const html = generateExecutiveTemplate(
      "Identity Verification",
      name,
      "We received a request to access the secure client portal. Please use the One-Time Password below to complete your login.",
      "SECURE ACCESS CODE",
      richOtpContent,
      "https://anand-pandey-invoices.vercel.app/login",
      "Verify & Login"
    );
    await emailService.send(email, `Verification Code: ${otp}`, html);
  },

  sendBookingConfirmation: async (data: any) => {
    const { name, email, date, time, branch, uniqueId } = data;
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const overviewBody = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;">
        <tr><td width="40" valign="top" style="padding-bottom: 24px;"><div style="background-color: #E2E8F0; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; font-size: 16px;">📅</div></td><td valign="top" style="padding-bottom: 24px;"><span style="display: block; font-size: 16px; font-weight: 700; color: ${COLORS.dark}; margin-bottom: 4px;">${formattedDate}</span><span style="display: block; font-size: 14px; color: ${COLORS.primary}; font-weight: 600;">${time.hour}:${time.minute} ${time.period} (IST)</span></td></tr>
        <tr><td width="40" valign="top"><div style="background-color: #E2E8F0; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; font-size: 16px;">📍</div></td><td valign="top"><span style="display: block; font-size: 16px; font-weight: 700; color: ${COLORS.dark}; margin-bottom: 4px;">${branch} Chamber</span><span style="display: block; font-size: 13px; color: #64748B;">Reference ID: <span style="font-family: monospace; background: #fff; padding: 2px 6px; border: 1px solid #e2e8f0; border-radius: 4px;">${uniqueId}</span></span></td></tr>
      </table>
    `;
    const html = generateExecutiveTemplate("Appointment Confirmed", name, `Your consultation request has been authorized. A Senior Partner has been notified.`, "SESSION DETAILS", overviewBody, "https://anand-pandey-invoices.vercel.app/dashboard", "Manage Appointment");
    await emailService.send(email, `Confirmed: Consultation on ${formattedDate}`, html, 'admin@thetaxjournal.in');
    await emailService.send(ADMIN_EMAIL, `New Appointment: ${uniqueId}`, `<p>New appointment from <strong>${name}</strong>.</p>`, email);
  },

  sendRFPConfirmation: async (data: any) => {
    const { firstName, lastName, email, organization, category, summary, industry, spend } = data;
    const introText = `We confirm receipt of your RFP regarding <strong>${category}</strong>.`;
    const overviewBody = `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #ffffff; border-left: 3px solid ${COLORS.primary}; font-style: italic; color: #555;">"${summary}"</div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding: 8px 0; font-size: 13px; color: #64748B;">Organization:</td><td style="text-align: right; color: ${COLORS.dark};">${organization}</td></tr>
      </table>
    `;
    const html = generateExecutiveTemplate("Proposal Received", `${firstName} ${lastName}`, introText, "RFP OVERVIEW", overviewBody);
    await emailService.send(email, `RFP Received: ${organization}`, html);
    await emailService.send(ADMIN_EMAIL, `New RFP: ${organization}`, `Category: ${category}<br>Summary: ${summary}`, email);
  },

  sendApplicationConfirmation: async (data: any) => {
    const { name, email, jobTitle, formData } = data;
    const overviewBody = `<p>We have filed your credentials for <strong>${jobTitle}</strong>.</p>`;
    const html = generateExecutiveTemplate("Application Received", name, `Thank you for your interest in joining AK Pandey & Associates.`, "DOSSIER SUMMARY", overviewBody);
    await emailService.send(email, `Application: ${jobTitle}`, html);
    await emailService.send(ADMIN_EMAIL, `New Applicant: ${jobTitle}`, `Name: ${name}`, email);
  },

  sendApplicationStatusUpdate: async (data: any) => {
    const { name, email, jobTitle, status } = data;
    let subject = `Update: ${jobTitle}`;
    let body = `<p>Your application status has changed to: <strong>${status}</strong>.</p>`;
    if (status === 'Interview') body += `<p>We will contact you shortly to schedule.</p>`;
    const html = generateExecutiveTemplate("Application Status", name, body, "STATUS UPDATE", "");
    await emailService.send(email, subject, html);
  },

  sendPremierInvitation: async (data: any) => {
    const { name, email, companyName, mobile } = data;
    const overviewBody = `
      <p style="margin-bottom: 15px;">A secure client dashboard has been provisioned for <strong>${companyName}</strong>.</p>
      <ul style="color: ${COLORS.text}; font-size: 14px; line-height: 1.6; padding-left: 20px;">
        <li>Priority Appointment Booking</li>
        <li>Direct Partner Access Line</li>
        <li>Secure Document Vault</li>
        <li>Real-time Invoice Status</li>
      </ul>
    `;
    
    // Generate special link with auto-fill parameters
    const specialLink = `https://anand-pandey-invoices.vercel.app/login?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&isSignUp=true`;

    const html = generateExecutiveTemplate(
      "Exclusive Access Invitation",
      name,
      "You have been invited to join the AK Pandey & Associates Premier Client Matrix.",
      "MEMBERSHIP PRIVILEGES",
      overviewBody,
      specialLink,
      "Activate Secure Account"
    );
    await emailService.send(email, "Invitation: Premier Client Portal", html);
  }
};
