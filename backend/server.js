require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const Application = require('./models/Application');
const { syncToExcel, buildWorkbook } = require('./utils/excel');
const { sendWhatsAppMessage } = require('./utils/whatsapp');
const { sendEmailMessage } = require('./utils/email');
const { requireAdmin } = require('./middleware/adminAuth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gdg_vimeet';

// Behind Railway's reverse proxy so req.ip / secure cookies reflect the
// real client instead of the proxy.
app.set('trust proxy', 1);

// CORS: restrict to the deployed Vercel frontend (+ local dev) when configured,
// otherwise allow all origins so local/dev setups keep working out of the box.
// Note: the admin login cookie is cross-site, so CORS_ORIGIN MUST be set to
// the exact frontend origin(s) in production — credentialed requests are
// rejected by browsers when the origin is left as a wildcard.
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Middleware
app.use(cors(
  allowedOrigins.length
    ? {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
          callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
      }
    // `origin: true` reflects the request's Origin header instead of `*`,
    // which is required for credentialed (cookie-based) requests to work.
    : { origin: true, credentials: true }
));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

/**
 * Trigger Excel sync with all applications from DB
 */
async function updateExcelSheet() {
  try {
    const apps = await Application.find().sort({ submittedAt: -1 });
    await syncToExcel(apps);
  } catch (err) {
    console.error('Failed to trigger excel sync:', err);
  }
}

// Routes

app.use('/api/admin', adminRoutes);

// POST (not GET) so a filtered export can send any number of application IDs.
app.post('/api/applications/export', requireAdmin, async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String) : null;
    const applications = await Application.find(ids ? { id: { $in: ids } } : {})
      .sort({ submittedAt: -1 })
      .lean();

    const buffer = await buildWorkbook(applications).xlsx.writeBuffer();
    const filename = `GDG_ViMEET_Recruitment_${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error exporting applications:', error);
    res.status(500).json({ error: 'Failed to export applications' });
  }
});

// GET all applications — admin only
app.get('/api/applications', requireAdmin, async (req, res) => {
  try {
    const applications = await Application.find().sort({ submittedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// POST a new application
app.post('/api/applications', async (req, res) => {
  try {
    const newApplication = new Application({
      id: 'gdg-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      ...req.body
    });
    const saved = await newApplication.save();
    
    // Sync to excel in the background
    updateExcelSheet();

    // Send WhatsApp message in the background (Disabled for now)
    // const whatsappMessage = `your application has been submited successfully, please join the below whatsapp group for the further information, [Insert WhatsApp Group Link Here]`;
    // sendWhatsAppMessage(req.body.mobile, whatsappMessage);

    // Send Email message in the background
    if (req.body.email) {
      const emailSubject = "Application Received - GDG Vimeet";
      const emailHtml = `
        <div style="font-family: 'Google Sans', Roboto, 'Helvetica Neue', sans-serif; background-color: #eef2f6; padding: 40px 15px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
            
            <!-- Hero Header -->
            <div style="background-color: #4285F4; padding: 50px 20px; text-align: center; position: relative;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" alt="Google Logo" style="height: 55px; background-color: white; border-radius: 50%; padding: 12px; margin-bottom: 25px; box-shadow: 0 6px 15px rgba(0,0,0,0.2);">
              <h1 style="margin: 0; color: #ffffff; font-size: 34px; font-weight: 800; letter-spacing: -0.5px;">Welcome to GDG!</h1>
              <p style="margin: 12px 0 0 0; color: #e8f0fe; font-size: 18px; font-weight: 500; opacity: 0.9;">ViMEET Campus Chapter</p>
            </div>
            
            <!-- Google Color Line -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height: 6px; line-height: 6px; font-size: 6px;">
              <tr>
                <td width="25%" style="background-color: #4285F4;">&nbsp;</td>
                <td width="25%" style="background-color: #EA4335;">&nbsp;</td>
                <td width="25%" style="background-color: #FBBC05;">&nbsp;</td>
                <td width="25%" style="background-color: #34A853;">&nbsp;</td>
              </tr>
            </table>
            
            <!-- Body Content -->
            <div style="padding: 40px 35px;">
              <h3 style="color: #202124; margin-top: 0; font-size: 22px; font-weight: 700;">Hi ${req.body.fullName || 'Applicant'}, 👋</h3>
              <p style="color: #4d5156; line-height: 1.8; font-size: 16px;">Your application has been received successfully! We are beyond excited that you're taking the first step to join our vibrant community of student developers.</p>
              
              <!-- Styled Applicant Details Card -->
              <div style="background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 12px; padding: 25px; margin: 35px 0;">
                <h4 style="margin: 0 0 20px 0; color: #1a73e8; font-size: 13px; text-transform: uppercase; letter-spacing: 1.2px; border-bottom: 2px solid #e8eaed; padding-bottom: 12px;">Your Application Profile</h4>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                  <tr>
                    <td style="padding: 12px 0; color: #70757a; width: 40%; border-bottom: 1px dashed #dadce0;">Application ID</td>
                    <td style="padding: 12px 0; color: #1a73e8; font-weight: 700; text-align: right; border-bottom: 1px dashed #dadce0; font-family: monospace; font-size: 16px;">${saved.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #70757a; border-bottom: 1px dashed #dadce0;">Full Name</td>
                    <td style="padding: 12px 0; color: #202124; font-weight: 600; text-align: right; border-bottom: 1px dashed #dadce0;">${req.body.fullName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #70757a; border-bottom: 1px dashed #dadce0;">Roll No</td>
                    <td style="padding: 12px 0; color: #202124; font-weight: 600; text-align: right; border-bottom: 1px dashed #dadce0;">${req.body.rollNo || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #70757a; border-bottom: 1px dashed #dadce0;">Department</td>
                    <td style="padding: 12px 0; color: #202124; font-weight: 600; text-align: right; border-bottom: 1px dashed #dadce0;">${req.body.department || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #70757a; border-bottom: 1px dashed #dadce0;">Year</td>
                    <td style="padding: 12px 0; color: #202124; font-weight: 600; text-align: right; border-bottom: 1px dashed #dadce0;">${req.body.year || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #70757a; border-bottom: 1px dashed #dadce0;">Mobile</td>
                    <td style="padding: 12px 0; color: #202124; font-weight: 600; text-align: right; border-bottom: 1px dashed #dadce0;">${req.body.mobile || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #70757a;">Selected Teams</td>
                    <td style="padding: 12px 0; color: #34A853; font-weight: 700; text-align: right;">${(req.body.teams || []).join(', ') || 'N/A'}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Info Alert Box -->
              <div style="background-color: #e8f0fe; border-left: 4px solid #1a73e8; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                <h4 style="margin: 0 0 8px 0; color: #174ea6; font-size: 16px;">📢 Action Required</h4>
                <p style="margin: 0; color: #1967d2; font-size: 15px; line-height: 1.6;">Don't miss out on important announcements! Join our WhatsApp community right now to stay in the loop for the next steps.</p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 45px 0 20px 0;">
                <a href="https://chat.whatsapp.com/LsZwCbBMq93BpPwJzndNqy?s=cl&p=a&mlu=4&ilr=4" style="background-color: #1a73e8; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; display: inline-block; box-shadow: 0 6px 20px rgba(26, 115, 232, 0.4); text-transform: uppercase; letter-spacing: 1px;">Join WhatsApp Group</a>
              </div>
            </div>
            
            <!-- Dark Footer -->
            <div style="background-color: #202124; padding: 35px 30px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">Google Developer Groups on Campus</p>
              <p style="margin: 10px 0 0 0; color: #9aa0a6; font-size: 13px; line-height: 1.6;">Vishwaniketan's Institute of Management Entrepreneurship and Engineering Technology</p>
              <hr style="border: 0; border-top: 1px solid #3c4043; margin: 25px 0;">
              <p style="margin: 0; color: #5f6368; font-size: 12px;">This is an automated message. Please do not reply directly to this email.</p>
            </div>
            
          </div>
        </div>
      `;
      sendEmailMessage(req.body.email, emailSubject, emailHtml);
    }

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(400).json({ error: 'Failed to save application' });
  }
});

// PUT (update) application status — admin only
app.put('/api/applications/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await Application.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Sync to excel in the background
    updateExcelSheet();

    // Return the updated applications list (to match frontend expected return value for db.updateApplicationStatus)
    const allApps = await Application.find().sort({ submittedAt: -1 });
    res.json(allApps);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update status' });
  }
});

// DELETE all applications — admin only. Requires an explicit confirmation
// phrase in the body so a stray/scripted call can't wipe every record.
app.delete('/api/applications', requireAdmin, async (req, res) => {
  try {
    // Accept the confirmation from the query string as well as the body —
    // some proxies drop the body of a DELETE request.
    const confirm = req.query?.confirm ?? req.body?.confirm;
    if (confirm !== 'DELETE ALL') {
      return res.status(400).json({ error: 'Missing confirmation' });
    }

    const result = await Application.deleteMany({});

    // Sync to excel in the background (now empty)
    updateExcelSheet();

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete applications' });
  }
});

// DELETE a single application — admin only
app.delete('/api/applications/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Application.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Sync to excel in the background
    updateExcelSheet();

    const allApps = await Application.find().sort({ submittedAt: -1 });
    res.json(allApps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
