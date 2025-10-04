
export const noteSharedTemplate = (senderName: string, noteTitle: string) => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; background-color: #f9f9f9; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

    <h2 style="color: #367AFF; text-align: center; margin-bottom: 20px;">📌 A Note Has Been Shared With You!</h2>

    <p style="font-size: 16px; color: #333; margin-bottom: 10px;">
      Hello,
    </p>

    <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
      <strong>${senderName}</strong> has shared a note titled "<strong>${noteTitle}</strong>" with you.
    </p>

    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
      Please check your HD App account to view the note.
    </p>

    <p style="font-size: 14px; color: #666;">
      Thank you,<br/>
      <strong>HD App Team</strong>
    </p>
  </div>
`;
