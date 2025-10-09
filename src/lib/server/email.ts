// src/lib/server/email.ts
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export async function sendMagicLink(email: string, token: string, baseUrl: string) {
    const magicLink = `${baseUrl}/cms/auth/verify?token=${token}`;

    try {
        await resend.emails.send({
            from: 'Topverhalen CMS <noreply@topverhaal.nl>',
            to: email,
            subject: 'Login naar Topverhalen CMS',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .button { 
                            display: inline-block; 
                            padding: 12px 24px; 
                            background: #667eea; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 6px;
                            margin: 20px 0;
                        }
                        .footer { margin-top: 30px; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Login naar Topverhalen CMS</h1>
                        <p>Klik op de knop hieronder om in te loggen:</p>
                        <a href="${magicLink}" class="button">Inloggen</a>
                        <p>Of kopieer deze link in je browser:</p>
                        <p style="word-break: break-all; color: #667eea;">${magicLink}</p>
                        <div class="footer">
                            <p>Deze link is 15 minuten geldig.</p>
                            <p>Als je deze email niet hebt aangevraagd, kun je deze negeren.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });
    } catch (error) {
        console.error('Email send error:', error);
        throw new Error('Kon email niet versturen');
    }
}