import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation, useVerifyOTPMutation, useResetPasswordMutation } from "@/app/api";
import DynamicForm from "@/components/forms/DynamicForm";
import type { FormFieldConfig } from "@/components/forms/DynamicForm";
import { forgotPasswordSchema, resetPasswordSchema, type ForgotPasswordFormData, type ResetPasswordFormData } from "@/schemas/auth.schema";
import { ROUTES } from "@/utils/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error: apiError }] = useForgotPasswordMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fields: FormFieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Sagar@example.com",
    },
  ];

  const handleEmailSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data).unwrap();
      setEmail(data.email);
      
      // Show OTP in development mode if email not configured
      if (response.development && response.otp) {
        setMessage(`OTP sent! (Development mode) Your OTP is: ${response.otp}`);
        console.log("Development OTP:", response.otp);
      } else {
        setMessage(response.message || "OTP has been sent to your email address. Please check your inbox.");
      }
      
      setStep("otp");
    } catch (err: any) {
      throw err;
    }
  };

  const handleOTPVerify = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await verifyOTP({ email, otp }).unwrap();
      if (response.verified) {
        setVerifiedOtp(otp);
        setMessage("OTP verified successfully! Please set your new password.");
        setStep("reset");
        setOtpError("");
      }
    } catch (err: any) {
      setOtpError(err?.data?.message || "Invalid or expired OTP");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setMessage("");

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword({
        email,
        otp: verifiedOtp,
        newPassword,
        confirmPassword,
      }).unwrap();

      if (response.message) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000);
      }
    } catch (err: any) {
      setPasswordError(err?.data?.message || "Failed to reset password");
    }
  };

  const errorMessage = apiError
    ? ("data" in apiError && apiError.data
        ? (apiError.data as any)?.message
        : "Failed to send OTP")
    : undefined;

  const footerContent = (
    <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
      Back to login
    </Link>
  );

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enter OTP</CardTitle>
            <CardDescription>
              We've sent a 6-digit OTP to {email}. Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
                {message}
              </div>
            )}
            {otpError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {otpError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                  setOtpError("");
                }}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleOTPVerify}
                disabled={isVerifying || otp.length !== 6}
                className="flex-1"
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setOtpError("");
                  setMessage("");
                }}
              >
                Back
              </Button>
            </div>
            <div className="text-center">
              <Link to={ROUTES.LOGIN} className="text-sm text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Please enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              {message && (
                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
                  {message}
                </div>
              )}
              {passwordError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                  {passwordError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isResetting || !newPassword || !confirmPassword}
                  className="flex-1"
                >
                  {isResetting ? "Resetting..." : "Reset Password"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep("otp");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                    setMessage("");
                  }}
                >
                  Back
                </Button>
              </div>
              <div className="text-center">
                <Link to={ROUTES.LOGIN} className="text-sm text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <DynamicForm
        title="Forgot Password"
        description="Enter your email address and we'll send you an OTP"
        fields={fields}
        schema={forgotPasswordSchema}
        onSubmit={handleEmailSubmit}
        submitLabel="Send OTP"
        isLoading={isLoading}
        footerContent={footerContent}
        error={errorMessage}
      />
    </>
  );
}
