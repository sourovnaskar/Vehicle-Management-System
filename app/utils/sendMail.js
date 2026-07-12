const transporter = require("../config/emailConfig");
const crypto = require("crypto");
const otpModel = require("../models/otpModel");

const sendOtpMail = async (req, user) => {
  const generateOtp = crypto.randomInt(1000, 10000).toString();
  const saveOtp = await new otpModel({
    userId: user._id,
    otp: generateOtp,
  }).save();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: user.email, // list of recipients
    subject: "OTP verification ", // subject line
    text: "Hello world?", // plain text body
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F7FF; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F7FF; padding:50px 20px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" 
          style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.06); border: 1px solid #EAEEF5;">

          <!-- Header -->
          <tr>
            <td 
              style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 45px 35px; text-align: center;">
              
              <!-- Optional: Add a logo image here -->
              <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; line-height: 60px; margin: 0 auto 20px auto; font-size: 28px;">
                🔒
              </div>

              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight: 700; letter-spacing: 0.5px;">
                Verify Your Account
              </h1>

              <p style="margin-top:12px; color:#E0E7FF; font-size:15px; font-weight: 400;">
                Secure One-Time Password Verification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:45px 40px; color:#374151;">

              <p style="font-size:16px; margin-top:0; font-weight: 600; color: #111827;">
                Hi ${user.name},
              </p>

              <p style="font-size:15px; line-height:1.6; color: #4B5563;">
                Thank you for signing up. To complete your registration and secure your account, please use the verification code below.
              </p>

              <!-- OTP Box -->
              <div style="margin: 40px 0; text-align: center;">
                <div style="
                  display: inline-block;
                  background: #EEF2FF;
                  color: #4338CA;
                  padding: 20px 45px;
                  border-radius: 12px;
                  font-size: 36px;
                  font-weight: 800;
                  letter-spacing: 12px;
                  border: 2px dashed #C7D2FE;
                ">
                  ${generateOtp}
                </div>
              </div>

              <div style="background-color: #F9FAFB; padding: 20px; border-radius: 10px; border-left: 4px solid #4F46E5;">
                <p style="font-size:14px; line-height:1.6; color:#4B5563; margin: 0 0 10px 0;">
                  ⏳ This OTP is valid for <strong>15 minutes</strong>. For your security, please do not share this code with anyone.
                </p>
                <p style="font-size:14px; line-height:1.6; color:#4B5563; margin: 0;">
                  🛡️ If you did not request this verification, you can safely ignore this email.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td 
              style="background:#F9FAFB; padding:30px; text-align:center; border-top:1px solid #E5E7EB;">

              <p style="margin:0 0 10px 0; font-size:13px; color:#6B7280;">
                Need help? <a href="#" style="color: #4F46E5; text-decoration: none; font-weight: 600;">Contact our support team</a>
              </p>

              <p style="margin:0; font-size:12px; color:#9CA3AF;">
                © 2026 Your Company Name. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

        <!-- Sub-footer text (optional) -->
        <p style="text-align: center; font-size: 12px; color: #9CA3AF; margin-top: 20px;">
          You received this email because a request was made to verify this address.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>`,
  });
};

const sendMechanicWelcomeMail = async (mechanic, plainTextPassword) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: mechanic.email, // mechanic's email
    subject: "Welcome to the Team! Your Mechanic Account Details 🛠️",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Created</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F7FF; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F7FF; padding:50px 20px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" 
          style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.06); border: 1px solid #EAEEF5;">

          <tr>
            <td 
              style="background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%); padding: 45px 35px; text-align: center;">
              
              <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; line-height: 60px; margin: 0 auto 20px auto; font-size: 28px;">
                🛠️
              </div>

              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight: 700; letter-spacing: 0.5px;">
                Welcome to the Team!
              </h1>

              <p style="margin-top:12px; color:#E0E7FF; font-size:15px; font-weight: 400;">
                Your Mechanic Portal Account is Ready
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:45px 40px; color:#374151;">

              <p style="font-size:16px; margin-top:0; font-weight: 600; color: #111827;">
                Hi ${mechanic.name},
              </p>

              <p style="font-size:15px; line-height:1.6; color: #4B5563;">
                An administrator has successfully created your account. You can now log in to the mechanic portal to view your assigned job cards and manage ongoing services.
              </p>

              <div style="margin: 30px 0; background: #F8FAFC; padding: 25px; border-radius: 12px; border: 1px solid #E2E8F0;">
                <h3 style="margin-top: 0; color: #1E293B; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Your Login Credentials</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #334155; line-height: 2;">
                  <tr>
                    <td width="90"><strong>Email:</strong></td>
                    <td><a href="mailto:${mechanic.email}" style="color: #2563EB; text-decoration: none;">${mechanic.email}</a></td>
                  </tr>
                  <tr>
                    <td><strong>Password:</strong></td>
                    <td><span style="background: #E2E8F0; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-weight: bold; color: #0F172A; letter-spacing: 1px;">${plainTextPassword}</span></td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #FEF2F2; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #EF4444; margin-bottom: 25px;">
                <p style="font-size:14px; line-height:1.5; color:#991B1B; margin: 0;">
                  🔒 <strong>Security Notice:</strong> For your security, please log in and change this temporary password immediately from your dashboard settings.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:3000/login" style="display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
                  Go to Login Page
                </a>
              </div>

            </td>
          </tr>

          <tr>
            <td 
              style="background:#F9FAFB; padding:30px; text-align:center; border-top:1px solid #E5E7EB;">

              <p style="margin:0 0 10px 0; font-size:13px; color:#6B7280;">
                Having trouble logging in? <a href="#" style="color: #2563EB; text-decoration: none; font-weight: 600;">Contact Administrator</a>
              </p>

              <p style="margin:0; font-size:12px; color:#9CA3AF;">
                © 2026 Your Company Name. All rights reserved.
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  });
};

const sendMechanicAssignedMail = async (user, vehicle) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: user.email, // recipient
    subject: "Mechanic Assigned - Work in Progress 🔧",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Service Update</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F7FF; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F7FF; padding:50px 20px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" 
          style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.06); border: 1px solid #EAEEF5;">

          <tr>
            <td 
              style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 45px 35px; text-align: center;">
              
              <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; line-height: 60px; margin: 0 auto 20px auto; font-size: 28px;">
                🧑‍🔧
              </div>

              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight: 700; letter-spacing: 0.5px;">
                Mechanic Assigned
              </h1>

              <p style="margin-top:12px; color:#D1FAE5; font-size:15px; font-weight: 400;">
                Your vehicle service is now In Progress
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:45px 40px; color:#374151;">

              <p style="font-size:16px; margin-top:0; font-weight: 600; color: #111827;">
                Hi ${user.name},
              </p>

              <p style="font-size:15px; line-height:1.6; color: #4B5563;">
                Great news! We have successfully assigned a mechanic to your job card. Work on your vehicle has officially started and is currently marked as <strong>In Progress</strong>.
              </p>

              <div style="margin: 30px 0; background: #F3F4F6; padding: 25px; border-radius: 12px; border-left: 4px solid #10B981;">
                <h3 style="margin-top: 0; color: #111827; font-size: 16px; margin-bottom: 15px;">Vehicle Details:</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #4B5563; line-height: 1.8;">
                  <tr>
                    <td width="100"><strong>Brand:</strong></td>
                    <td>${vehicle.brand}</td>
                  </tr>
                  <tr>
                    <td><strong>Model:</strong></td>
                    <td>${vehicle.model}</td>
                  </tr>
                  <tr>
                    <td><strong>Number:</strong></td>
                    <td><span style="background: #E5E7EB; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-weight: bold; color: #111827;">${vehicle.vehicleNumber}</span></td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #ECFDF5; padding: 20px; border-radius: 10px;">
                <p style="font-size:14px; line-height:1.6; color:#065F46; margin: 0;">
                  ✨ We will notify you again as soon as the service is completed and your vehicle is ready for pickup!
                </p>
              </div>

            </td>
          </tr>

          <tr>
            <td 
              style="background:#F9FAFB; padding:30px; text-align:center; border-top:1px solid #E5E7EB;">

              <p style="margin:0 0 10px 0; font-size:13px; color:#6B7280;">
                Need help? <a href="#" style="color: #059669; text-decoration: none; font-weight: 600;">Contact our support team</a>
              </p>

              <p style="margin:0; font-size:12px; color:#9CA3AF;">
                © 2026 Your Company Name. All rights reserved.
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  });
};

const sendServiceCompletedMail = async (user, vehicle, serviceDetails) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Your Vehicle is Ready for Pickup! 🎉",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Service Completed</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F7FF; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F7FF; padding:50px 20px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" 
          style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.06); border: 1px solid #EAEEF5;">

          <tr>
            <td 
              style="background: linear-gradient(135deg, #4338CA 0%, #3B82F6 100%); padding: 45px 35px; text-align: center;">
              
              <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; line-height: 60px; margin: 0 auto 20px auto; font-size: 28px;">
                🚘
              </div>

              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight: 700; letter-spacing: 0.5px;">
                Service Completed!
              </h1>

              <p style="margin-top:12px; color:#E0E7FF; font-size:15px; font-weight: 400;">
                Your vehicle is ready for pickup
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:45px 40px; color:#374151;">

              <p style="font-size:16px; margin-top:0; font-weight: 600; color: #111827;">
                Hi ${user.name},
              </p>

              <p style="font-size:15px; line-height:1.6; color: #4B5563;">
                Great news! Our mechanic has finished working on your vehicle. It has passed all final checks and is now ready for you to collect.
              </p>

              <div style="margin: 30px 0; background: #F8FAFC; padding: 25px; border-radius: 12px; border-left: 4px solid #3B82F6;">
                <h3 style="margin-top: 0; color: #1E293B; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Service Summary</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #334155; line-height: 1.8;">
                  <tr>
                    <td width="120"><strong>Vehicle:</strong></td>
                    <td>${vehicle.brand} ${vehicle.model} (<span style="font-family: monospace; font-weight: bold; color: #111827;">${vehicle.number}</span>)</td>
                  </tr>
                  
                  <tr>
                    <td valign="top"><strong>Mechanic Notes:</strong></td>
                    <td style="font-style: italic; color: #64748B;">"${serviceDetails.repairNotes}"</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #EFF6FF; padding: 20px; border-radius: 10px;">
               <p style="font-size: 14px; line-height: 1.6; color: #1E40AF; margin: 0 0 10px 0;">
    📍 <strong>Quick Update:</strong> Your vehicle is ready! Your official invoice is being generated and will be sent to you shortly.
</p>
                <p style="font-size:14px; line-height:1.6; color:#1E40AF; margin: 0 0 10px 0;">
                  📍 <strong>Next Steps:</strong> Please visit our service center during working hours to complete your payment and collect your vehicle.
                </p>
                <p style="font-size:14px; line-height:1.6; color:#1E40AF; margin: 0;">
                  📸 You can log in to your dashboard to view the "After Service" photos uploaded by your mechanic!
                </p>
              </div>

            </td>
          </tr>

          <tr>
            <td 
              style="background:#F9FAFB; padding:30px; text-align:center; border-top:1px solid #E5E7EB;">

              <p style="margin:0 0 10px 0; font-size:13px; color:#6B7280;">
                Have questions? <a href="#" style="color: #3B82F6; text-decoration: none; font-weight: 600;">Contact our support team</a>
              </p>

              <p style="margin:0; font-size:12px; color:#9CA3AF;">
                © 2026 VSMS. All rights reserved.
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  });
};

const sendInvoiceMail = async (user, vehicle, service, invoice) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Your Service Invoice is Ready 🧾",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Service Invoice</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F7FF; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F7FF; padding:50px 20px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" 
          style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.06); border: 1px solid #EAEEF5;">

          <tr>
            <td style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); padding: 45px 35px; text-align: center;">
              
              <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; line-height: 60px; margin: 0 auto 20px auto; font-size: 28px;">
                🧾
              </div>

              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight: 700; letter-spacing: 0.5px;">
                Invoice Generated
              </h1>

              <p style="margin-top:12px; color:#DBEAFE; font-size:15px; font-weight: 400;">
                Invoice #${invoice._id.toString().slice(-6).toUpperCase()}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:45px 40px; color:#374151;">

              <p style="font-size:16px; margin-top:0; font-weight: 600; color: #111827;">
                Hi ${user.name},
              </p>

              <p style="font-size:15px; line-height:1.6; color: #4B5563;">
                Your final invoice for the recent service on your vehicle has been generated by our admin team. Please review the billing details below.
              </p>

              <div style="margin: 30px 0; background: #F8FAFC; padding: 25px; border-radius: 12px; border: 1px solid #E2E8F0;">
                <h3 style="margin-top: 0; color: #1E293B; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Billing Summary</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #334155; line-height: 2;">
                  <tr>
                    <td style="border-bottom: 1px solid #E2E8F0; padding-bottom: 10px;"><strong>Vehicle:</strong></td>
                    <td align="right" style="border-bottom: 1px solid #E2E8F0; padding-bottom: 10px;">${vehicle.brand} ${vehicle.model} <br><span style="font-family: monospace; font-size: 13px; color: #64748B;">${vehicle.number}</span></td>
                  </tr>
                  <tr>
                    <td style="padding-top: 10px;">Service Cost:</td>
                    <td align="right" style="padding-top: 10px;">₹${service.finalCost}</td>
                  </tr>
                  <tr>
                    <td>Estimated Tax:</td>
                    <td align="right">₹${invoice.tax}</td>
                  </tr>
                  <tr>
                    <td style="padding-top: 15px;">
                      <strong style="font-size: 18px; color: #111827;">Total Amount:</strong>
                    </td>
                    <td align="right" style="padding-top: 15px;">
                      <strong style="font-size: 20px; color: #2563EB;">₹${invoice.totalAmount}</strong>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin-top: 35px;">
                <a href="http://localhost:8001/payment/${invoice._id}" style="display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
                  Pay Now
                </a>
              </div>

            </td>
          </tr>

          <tr>
            <td style="background:#F9FAFB; padding:30px; text-align:center; border-top:1px solid #E5E7EB;">
              <p style="margin:0 0 10px 0; font-size:13px; color:#6B7280;">
                Need help with this invoice? <a href="#" style="color: #2563EB; text-decoration: none; font-weight: 600;">Contact our support team</a>
              </p>
              <p style="margin:0; font-size:12px; color:#9CA3AF;">
                © 2026 Auto Space. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  });
};


module.exports = {
  sendOtpMail,
  sendMechanicAssignedMail,
  sendMechanicWelcomeMail,
  sendServiceCompletedMail,sendInvoiceMail
};
