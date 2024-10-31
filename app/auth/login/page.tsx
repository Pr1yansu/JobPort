import React from "react";
import AuthCardWrapper from "@/components/auth/auth-card-wrapper";
import LoginForm from "@/components/auth/login-form";

const LoginPage = () => {
  return (
    <div className="relative bg-gradient-to-r from-violet-400/80 via-indigo-200/80 to-indigo-400/80">
      <div className="flex items-center  mx-auto justify-center min-h-screen max-w-screen-2xl relative">
        <AuthCardWrapper
          title="Login"
          redirectLink="/auth/register"
          redirectText="Signup"
          socials={true}
        >
          <LoginForm />
        </AuthCardWrapper>
      </div>
      <div></div>
    </div>
  );
};

export default LoginPage;
