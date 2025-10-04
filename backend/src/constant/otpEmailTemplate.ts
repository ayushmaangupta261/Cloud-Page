
export const otpEmailTemplate = (otp: string) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; background-color: #f9f9f9; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h2 style="color: #367AFF; text-align: center; margin-bottom: 20px;">HD App OTP Verification</h2>
    <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
      Use the following OTP to complete your authentication process:
    </p>
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #ffffff; background-color: #367AFF; padding: 12px 25px; border-radius: 8px; letter-spacing: 4px;">
        ${otp}
      </span>
    </div>
    <p style="font-size: 14px; color: #666;">Please do not share it with anyone.</p>
    <p style="font-size: 14px; color: #666;">Thank you,<br/><strong>HD App Team</strong></p>
  </div>
`;
