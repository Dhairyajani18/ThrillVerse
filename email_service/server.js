const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');

// Load environment variables from workspace root .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 image strings

const PORT = process.env.PORT || 5000;

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for others
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('[Nodemailer SMTP Connection Error]:', error);
    } else {
        console.log('[Nodemailer SMTP Ready]: Email service is connected and ready to send mail.');
    }
});

// Helper to generate premium landscape PDF Ticket
function generateTicketPDF(data) {
    return new Promise((resolve, reject) => {
        // Landscape A4 dimensions: 841.89 x 595.28 points
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 25 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            resolve(Buffer.concat(buffers));
        });

        // Draw Borders
        doc.rect(20, 20, 801.89, 555.28).lineWidth(3).stroke('#1a6ef5');
        doc.rect(25, 25, 791.89, 545.28).lineWidth(1).stroke('#0052cc');

        // Header Panel
        doc.rect(26, 26, 789.89, 65).fill('#1a6ef5');
        doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text('THRILLVERSE AMUSEMENT PARK', 40, 42);
        doc.fontSize(10).font('Helvetica').text('PARK ENTRY PASS & TAX INVOICE', 40, 68);

        // Date & ID Info
        doc.fillColor('#1a6ef5').fontSize(12).font('Helvetica-Bold').text('BOOKING DETAILS', 40, 110);
        doc.moveTo(40, 125).lineTo(380, 125).lineWidth(1).stroke('#cbd5e1');

        doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold').text('Booking ID:', 40, 135);
        doc.font('Helvetica').text(data.booking_id, 140, 135);

        doc.font('Helvetica-Bold').text('Invoice ID:', 40, 155);
        doc.font('Helvetica').text(data.invoice_id, 140, 155);

        doc.font('Helvetica-Bold').text('Visit Date:', 40, 175);
        doc.font('Helvetica').text(data.visit_date, 140, 175);

        doc.font('Helvetica-Bold').text('Offer Name:', 40, 195);
        doc.font('Helvetica').text(data.offer_name, 140, 195);

        doc.font('Helvetica-Bold').text('Payment ID:', 40, 215);
        doc.font('Helvetica').text(data.payment_id, 140, 215);

        // Pricing Summary Box
        doc.rect(410, 110, 390, 120).fillAndStroke('#f8fafc', '#cbd5e1');
        doc.fillColor('#1a6ef5').fontSize(11).font('Helvetica-Bold').text('INVOICE PAYMENT SUMMARY', 425, 125);

        doc.fillColor('#475569').fontSize(10).font('Helvetica');
        doc.text('Park Admission Fees:', 425, 145);
        doc.text('Taxes (GST 18%):', 425, 160);
        doc.text('Convenience Fee:', 425, 175);

        // Right align prices
        doc.text('INR ' + (parseFloat(data.amount_paid) - 50.00 - (parseFloat(data.amount_paid) * 0.18)).toFixed(2), 700, 145);
        doc.text('INR ' + (parseFloat(data.amount_paid) * 0.18).toFixed(2), 700, 160);
        doc.text('INR 50.00', 700, 175);

        doc.moveTo(425, 195).lineTo(785, 195).lineWidth(1).stroke('#cbd5e1');
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b').text('GRAND TOTAL PAID:', 425, 205);
        doc.text(`INR ${data.amount_paid}`, 680, 205);

        // Divider Line
        doc.moveTo(40, 245).lineTo(800, 245).lineWidth(1).stroke('#cbd5e1');

        // Visitors Table
        doc.fillColor('#1a6ef5').fontSize(12).font('Helvetica-Bold').text('VISITOR LIST & TICKET CATEGORY', 40, 260);

        let currentY = 285;
        // Table Header
        doc.rect(40, currentY, 490, 20).fill('#0052cc');
        doc.fillColor('white').fontSize(9).font('Helvetica-Bold').text('NAME', 50, currentY + 6);
        doc.text('AGE', 230, currentY + 6);
        doc.text('GENDER', 290, currentY + 6);
        doc.text('TICKET TYPE', 380, currentY + 6);
        currentY += 20;

        // Rows
        doc.fillColor('#334155').font('Helvetica');
        data.visitor_list.forEach((v, index) => {
            const bg = index % 2 === 0 ? '#f8fafc' : '#ffffff';
            doc.rect(40, currentY, 490, 20).fill(bg);
            doc.fillColor('#1e293b').fontSize(9).text(v.name, 50, currentY + 6);
            doc.text(String(v.age), 230, currentY + 6);
            doc.text(v.gender, 290, currentY + 6);
            doc.text(v.ticket_type, 380, currentY + 6);
            currentY += 20;
        });

        // Secure QR Code Section
        doc.fillColor('#1e293b').fontSize(11).font('Helvetica-Bold').text('SCAN AT ENTRY', 610, 260);
        const qrBuffer = Buffer.from(data.qr_data.split(',')[1], 'base64');
        doc.image(qrBuffer, 570, 285, { width: 160, height: 160 });

        // Terms & Conditions
        doc.fontSize(8).fillColor('#64748b').font('Helvetica');
        doc.text('Terms & Conditions:', 40, 475);
        doc.text('1. Present this QR Ticket at the park entrance gate. A printout or digital display is accepted.', 40, 490);
        doc.text('2. This ticket guarantees a single one-time check-in and becomes void upon usage.', 40, 502);
        doc.text('3. Ticket fees are strictly non-refundable and non-transferable under any circumstances.', 40, 514);
        doc.text('4. Operating hours: 10:00 AM to 8:00 PM. Some water attractions close by 6:00 PM.', 40, 526);

        doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a6ef5').text('ThrillVerse Amusement Park - Live The Adventure!', 40, 548);

        doc.end();
    });
}

// POST endpoint to send verification emails
app.post('/send-email', async (req, res) => {
    const {
        user_name,
        email,
        booking_id,
        invoice_id,
        offer_name,
        visit_date,
        amount_paid,
        payment_id,
        qr_data,
        visitor_list
    } = req.body;

    if (!email || !booking_id || !qr_data || !visitor_list) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // 1. Generate the Premium Boarding Pass PDF in memory
        const pdfBuffer = await generateTicketPDF(req.body);

        // Convert base64 QR to Buffer for email inline embedding
        const qrImageBuffer = Buffer.from(qr_data.split(',')[1], 'base64');

        // Create visitors HTML table rows
        const visitorRows = visitor_list.map(v => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px; text-align: left; font-size: 14px; color: #334155;">${v.name}</td>
                <td style="padding: 10px; text-align: center; font-size: 14px; color: #334155;">${v.age}</td>
                <td style="padding: 10px; text-align: center; font-size: 14px; color: #334155;">${v.gender}</td>
                <td style="padding: 10px; text-align: right; font-size: 14px; font-weight: bold; color: #1a6ef5;">${v.ticket_type}</td>
            </tr>
        `).join('');

        // 2. Responsive Email HTML Body
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Your ThrillVerse Booking Confirmation</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
                <tr>
                    <td align="center">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <!-- Header Banner -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #1a6ef5, #0052cc); padding: 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">🎢 THRILLVERSE</h1>
                                    <p style="color: #bfdbfe; margin: 5px 0 0 0; font-size: 14px;">Your Adventure Awaits!</p>
                                </td>
                            </tr>
                            
                            <!-- Body Content -->
                            <tr>
                                <td style="padding: 30px;">
                                    <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Hello ${user_name},</h2>
                                    <p style="color: #475569; font-size: 15px; line-height: 1.6;">Thank you for booking your adventure with ThrillVerse! Your payment has been successfully verified, and your entry tickets are confirmed.</p>
                                    
                                    <!-- Booking Stats Box -->
                                    <div style="background-color: #f1f5f9; border-left: 4px solid #1a6ef5; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="5">
                                            <tr>
                                                <td width="40%" style="font-size: 14px; font-weight: bold; color: #475569;">Booking ID:</td>
                                                <td style="font-size: 14px; color: #1e293b; font-family: monospace; font-weight: bold;">${booking_id}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; font-weight: bold; color: #475569;">Invoice ID:</td>
                                                <td style="font-size: 14px; color: #1e293b; font-family: monospace;">${invoice_id}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; font-weight: bold; color: #475569;">Visit Date:</td>
                                                <td style="font-size: 14px; color: #1e293b; font-weight: bold;">${visit_date}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; font-weight: bold; color: #475569;">Offer Selected:</td>
                                                <td style="font-size: 14px; color: #1e293b;">${offer_name}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; font-weight: bold; color: #475569;">Amount Paid:</td>
                                                <td style="font-size: 14px; color: #16a34a; font-weight: bold;">INR ${amount_paid}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; font-weight: bold; color: #475569;">Payment Transaction ID:</td>
                                                <td style="font-size: 14px; color: #1e293b; font-family: monospace;">${payment_id}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    
                                    <!-- Visitors Table -->
                                    <h3 style="color: #1e293b; font-size: 16px; margin-top: 25px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Visitor Tickets</h3>
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                                        <thead>
                                            <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                                <th style="padding: 10px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase;">Name</th>
                                                <th style="padding: 10px; text-align: center; font-size: 12px; color: #64748b; text-transform: uppercase;">Age</th>
                                                <th style="padding: 10px; text-align: center; font-size: 12px; color: #64748b; text-transform: uppercase;">Gender</th>
                                                <th style="padding: 10px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase;">Ticket Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${visitorRows}
                                        </tbody>
                                    </table>
                                    
                                    <!-- QR Check-in Box -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #fafafa; border: 1px dashed #cbd5e1; border-radius: 8px; margin: 25px 0;">
                                        <tr>
                                            <td align="center" style="padding: 25px;">
                                                <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 15px; font-weight: bold;">YOUR DIGITAL ENTRY QR CODE</h4>
                                                <img src="${qr_data}" width="180" height="180" alt="Booking QR Code Pass" style="display: block; border: 3px solid #1a6ef5; border-radius: 8px; padding: 4px; background: #ffffff;" />
                                                <p style="margin: 15px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.5; max-width: 320px;">
                                                    Scan this QR code directly from your mobile screen at the entrance scanner to check in. Do not share this QR code.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Park details & timings -->
                                    <h3 style="color: #1e293b; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Park Entrance Instructions</h3>
                                    <ul style="color: #475569; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                                        <li><strong>Operating Hours</strong>: 10:00 AM to 8:00 PM.</li>
                                        <li><strong>Location</strong>: Mumbai-Pune Expressway, Khopoli, Maharashtra, India.</li>
                                        <li><a href="https://maps.google.com/?q=Imagicaa" style="color: #1a6ef5; text-decoration: none; font-weight: bold;">📍 Open in Google Maps</a></li>
                                        <li>Please carry a valid photo ID along with this ticket for check-in verification.</li>
                                        <li>Each ticket allows a single entry. The QR scanner prevents multiple entries.</li>
                                    </ul>
                                    
                                    <!-- Emergency Contacts -->
                                    <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px 15px; font-size: 13px; color: #b45309; margin: 25px 0 15px 0;">
                                        📞 <strong>Emergency/Support:</strong> +91 22 4213 0405 | ✉️ support@thrillversepark.com
                                    </div>
                                    
                                    <p style="color: #475569; font-size: 15px; margin-top: 30px;">See you soon for a thrilling day!</p>
                                    <p style="color: #1a6ef5; font-weight: bold; font-size: 15px; margin: 5px 0 0 0;">Team ThrillVerse</p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                                    &copy; 2026 ThrillVerse Parks & Resorts. All Rights Reserved.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        // 3. Mail options
        const mailOptions = {
            from: `"ThrillVerse Parks" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `🎢 Thank You for Booking with ThrillVerse! - Ticket Confirmed (${booking_id})`,
            html: emailHtml,
            attachments: [
                {
                    filename: `Entry_Pass_QR_${booking_id}.png`,
                    content: qrImageBuffer
                },
                {
                    filename: `ThrillVerse_Ticket_${booking_id}.pdf`,
                    content: pdfBuffer
                }
            ]
        };

        // 4. Dispatch Email
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Dispatched]: Booking ID ${booking_id} sent successfully to ${email}. ID: ${info.messageId}`);
        return res.status(200).json({ success: true, messageId: info.messageId });

    } catch (err) {
        console.error('[Email Dispatch Error]:', err);
        return res.status(500).json({ error: 'Failed to generate PDF ticket or send confirmation email', details: err.message });
    }
});

// POST endpoint for Virtual Queue Boarding Pass
app.post('/send-boarding-pass', async (req, res) => {
    const { email, user_name, ride_name, ride_emoji, token, batch_number, min_height } = req.body;
    const recipient = email || process.env.SMTP_FROM || process.env.SMTP_USER;

    if (!recipient) {
        return res.status(400).json({ error: 'Recipient email is required' });
    }

    try {
        let qrAttachments = [];
        let inlineQrHtml = '';
        try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(token || 'TV-BOARDING-PASS')}`;
            const qrRes = await fetch(qrUrl);
            if (qrRes.ok) {
                const qrArrayBuffer = await qrRes.arrayBuffer();
                const qrBuffer = Buffer.from(qrArrayBuffer);
                qrAttachments.push({
                    filename: `Boarding_Pass_QR_${token}.png`,
                    content: qrBuffer,
                    cid: 'boarding_qr_cid'
                });
                inlineQrHtml = `
                    <div style="margin: 20px auto; text-align: center;">
                        <p style="color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">Scan Turnstile QR Code</p>
                        <img src="cid:boarding_qr_cid" width="190" height="190" alt="Scannable Boarding QR Code" style="display: block; margin: 0 auto; border-radius: 16px; border: 2px solid #e2e8f0; padding: 8px; background: white;" />
                    </div>
                `;
            }
        } catch (e) {
            console.error('[QR Fetch Error]:', e);
        }

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
            <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(135deg, #1a6ef5, #0052cc); padding: 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">🎟️ THRILLVERSE BOARDING PASS</h1>
                    <p style="color: #e0f2fe; margin: 6px 0 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase;">It's Your Turn to Ride!</p>
                </div>
                
                <div style="padding: 28px; text-align: center;">
                    <span style="background: #e0f2fe; color: #0284c7; padding: 5px 14px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase;">Boarding Active Now</span>
                    <h2 style="color: #0d1f3c; margin: 14px 0 4px 0; font-size: 26px; font-weight: 900;">${ride_emoji || '🎢'} ${ride_name || 'Attraction'}</h2>
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 20px 0;">Guest: <strong>${user_name || 'Valued Visitor'}</strong></p>

                    ${inlineQrHtml}

                    <div style="margin: 15px auto; padding: 16px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 14px; display: inline-block; width: 80%;">
                        <p style="color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 6px 0;">Boarding Pass Token</p>
                        <h3 style="color: #1a6ef5; font-family: monospace; font-size: 26px; font-weight: 900; margin: 0;">${token || 'TV-PASS'}</h3>
                    </div>

                    <div style="display: flex; justify-content: space-around; margin: 20px 0; padding: 15px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                        <div>
                            <span style="color: #94a3b8; display: block; font-size: 10px; font-weight: 800; text-transform: uppercase;">Batch Number</span>
                            <strong style="color: #0d1f3c; font-size: 15px;">Batch ${batch_number || 1}</strong>
                        </div>
                        <div>
                            <span style="color: #94a3b8; display: block; font-size: 10px; font-weight: 800; text-transform: uppercase;">Boarding Window</span>
                            <strong style="color: #10b981; font-size: 15px;">5 Minutes</strong>
                        </div>
                    </div>

                    <div style="margin-top: 20px; padding: 14px; background: #eff6ff; border-radius: 12px; font-size: 12px; color: #1e40af; text-align: left;">
                        📌 <strong>Entry Instructions:</strong> Please present your digital QR code at the attraction turnstile scanner within 5 minutes. Minimum height requirement: <strong>${min_height || 'N/A'} cm</strong>.
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `ThrillVerse Parks <${process.env.SMTP_USER || process.env.SMTP_FROM}>`,
            to: recipient,
            subject: `🎟️ Boarding Pass Ready: ${ride_name || 'Ride'} - ThrillVerse`,
            html: emailHtml,
            attachments: qrAttachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Boarding Email Dispatched]: Sent to ${recipient} for token ${token}. MessageID: ${info.messageId}`);
        return res.status(200).json({ success: true, messageId: info.messageId });
    } catch (err) {
        console.error('[Boarding Email Error]:', err);
        return res.status(500).json({ error: 'Failed to dispatch boarding pass email', details: err.message });
    }
});

// POST endpoint for admin broadcasts
app.post('/send-broadcast', async (req, res) => {
    const { template, subject, message, recipients } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Recipients array is required and cannot be empty' });
    }

    try {
        let templateTitle = "ThrillVerse Announcement";
        let accentColor = "#1a6ef5"; // default blue
        let bgGradient = "linear-gradient(135deg, #1a6ef5, #0052cc)";

        // Set colors/headers based on templates
        if (template === "emergency_alert") {
            templateTitle = "🚨 EMERGENCY SYSTEM ALERT";
            accentColor = "#dc2626"; // red
            bgGradient = "linear-gradient(135deg, #dc2626, #991b1b)";
        } else if (template === "ride_maintenance") {
            templateTitle = "🚧 RIDE MAINTENANCE NOTICE";
            accentColor = "#d97706"; // amber
            bgGradient = "linear-gradient(135deg, #d97706, #92400e)";
        } else if (template === "offer_announcement") {
            templateTitle = "🎁 SPECIAL OFFER FOR YOU";
            accentColor = "#8b5cf6"; // purple
            bgGradient = "linear-gradient(135deg, #8b5cf6, #6d28d9)";
        } else if (template === "park_closing") {
            templateTitle = "🕐 PARK HOURS NOTICE";
            accentColor = "#4b5563"; // slate
            bgGradient = "linear-gradient(135deg, #4b5563, #374151)";
        } else if (template === "new_attraction") {
            templateTitle = "🚀 NEW ATTRACTION ALERT";
            accentColor = "#10b981"; // emerald
            bgGradient = "linear-gradient(135deg, #10b981, #047857)";
        } else {
            templateTitle = "📢 THRILLVERSE UPDATE";
        }

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${subject}</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
                <tr>
                    <td align="center">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <!-- Header Banner -->
                            <tr>
                                <td style="background: ${bgGradient}; padding: 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">🎢 THRILLVERSE</h1>
                                    <p style="color: #ffffff; opacity: 0.8; margin: 5px 0 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px;">${templateTitle}</p>
                                </td>
                            </tr>
                            
                            <!-- Body Content -->
                            <tr>
                                <td style="padding: 35px 30px;">
                                    <h2 style="color: #1e293b; margin-top: 0; font-size: 18px; font-weight: bold; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">${subject}</h2>
                                    <div style="color: #334155; font-size: 15px; line-height: 1.6; margin-top: 15px;">
                                        ${message.replace(/\n/g, '<br />')}
                                    </div>
                                    
                                    <div style="background-color: #f8fafc; border-left: 4px solid ${accentColor}; padding: 15px; margin: 25px 0 15px 0; border-radius: 4px; font-size: 13px; color: #475569;">
                                        This is an official system update dispatched by ThrillVerse Theme Park Administration to all registered users.
                                    </div>
                                    
                                    <p style="color: #475569; font-size: 14px; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
                                        Need support? Contact us at support@thrillverse.com or call +91 22 4213 0405.
                                    </p>
                                    <p style="color: ${accentColor}; font-weight: bold; font-size: 14px; margin: 5px 0 0 0;">Team ThrillVerse</p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
                                    &copy; 2026 ThrillVerse Parks & Resorts. Mumbai-Pune Expressway, Khopoli, Maharashtra.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.SMTP_FROM || process.env.SMTP_USER,
            bcc: recipients.join(', '),
            subject: subject,
            html: emailHtml
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Broadcast Dispatched]: Sent template "${template}" successfully to ${recipients.length} users. MessageID: ${info.messageId}`);
        return res.status(200).json({ success: true, messageId: info.messageId });

    } catch (err) {
        console.error('[Broadcast Dispatch Error]:', err);
        return res.status(500).json({ error: 'Failed to send email broadcast', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`[Email Service running]: Node express email service started on port ${PORT}`);
});
