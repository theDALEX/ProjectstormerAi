import nodemailer from "nodemailer";

export async function POST(req: any) {
    const { email, subject, message } = await req.json(); // Extract data from the client request

    try {
        // Configure the mail transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // Replace with your email provider (e.g., Outlook, SMTP)
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_Id,
            subject: subject,             // Email subject
            text: message,                // Email body
            html: `<p><strong>Project: projectstormerAi</strong></p>
            <p><strong>Email From:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong><br>${message}</p>`,
        });

        // Respond with success
        return new Response(JSON.stringify({ success: true, message: "Email sent!" }), { status: 200 });
    } catch (error) {
        console.error("Failed to send email:", error);
        return new Response(JSON.stringify({ success: false, error: "Email sending failed." }), { status: 500 });
    }
}