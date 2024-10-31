import React from "react";
import AuthCardWrapper from "@/components/auth/auth-card-wrapper";
import RegisterForm from "@/components/auth/register-form";

const Register = () => {
  return (
    <div className="relative bg-gradient-to-r from-violet-400/80 via-indigo-200/80 to-indigo-400/80">
      <div className="flex items-center  mx-auto justify-center min-h-screen max-w-screen-2xl relative">
        <AuthCardWrapper
          title="Signup"
          redirectLink="/auth/login"
          redirectText="login"
          socials={true}
        >
          <RegisterForm />
        </AuthCardWrapper>
      </div>
      <div></div>
    </div>
  );
};

export default Register;
