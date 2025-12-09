import { Resend } from 'resend';
import { getBaseUrl } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const domain = getBaseUrl();
  const confirmLink = `${domain}/auth/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'Next Store <onboarding@resend.dev>',
    to: email,
    subject: 'Next Store - Confirmation Email',
    html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }

  return data;
};
