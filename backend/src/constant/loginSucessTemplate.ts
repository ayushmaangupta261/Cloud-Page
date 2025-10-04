
export const loginSuccessTemplate = (name: string) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; background-color: #f9f9f9; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">🎉 Login Successful!</h2>
    
    <p style="font-size: 16px; color: #333; margin-bottom: 10px;">
      Hello ${name},
    </p>
    
    <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
      You have successfully authenticated into your HD App account. If this wasn't you, please secure your account immediately.
    </p>
    
    <p style="font-size: 14px; color: #666;">
      Thank you for using HD App!<br/>
      <strong>HD App Team</strong>
    </p>
  </div>
`;
