import { EmailVerificationForm } from "@/components/auth/email-verification-form";
import { Suspense } from "react";

const VerifyEmailPage = () => {
  return (
    <Suspense>
      <EmailVerificationForm />
    </Suspense>
  );
};

export default VerifyEmailPage;
