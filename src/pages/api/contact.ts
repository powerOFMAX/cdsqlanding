import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const subject = String(body.subject || '').trim();
    const summary = String(body.summary || '').trim();

    if (!name || !email || !subject || !summary) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Please complete all required fields.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailLooksValid) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Please enter a valid email address.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const toEmail = import.meta.env.CONTACT_TO_EMAIL;
    const fromEmail = import.meta.env.CONTACT_FROM_EMAIL;

    if (!resendApiKey || !toEmail || !fromEmail) {
      console.info('[contact-request:missing-env]', { name, email, subject, summary });
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Contact service is not configured yet. Please try again shortly.',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const sendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `Code Square LLC <${fromEmail}>`,
        to: [toEmail],
        reply_to: email,
        subject: `[Code Square] ${subject}`,
        text: [
          `New inquiry from Code Square landing form`,
          ``,
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          ``,
          `Project Summary:`,
          summary,
        ].join('\n'),
      }),
    });

    if (!sendResponse.ok) {
      const details = await sendResponse.text();
      console.error('[contact-request:resend-error]', sendResponse.status, details);
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Could not send inquiry right now. Please try again in a moment.',
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'Inquiry sent. We will contact you soon.' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({
        ok: false,
        message: 'Unexpected error. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
