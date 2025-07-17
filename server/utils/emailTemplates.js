export function generateVerificationOtpEmailTemplate(otpCode) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Verify Your Email</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap');
      body {
        margin: 0;
        padding: 0;
        background: #E0F7FA; /* soft pastel blue */
        font-family: 'Comic Neue', cursive, Arial, sans-serif;
        color: #4B3B2B; /* warm brown */
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #FFFBF2; /* creamy off-white */
        border-radius: 20px;
        padding: 30px 40px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        text-align: center;
        border: 3px solid #A7C7E7; /* pastel blue border */
      }
      h2 {
        font-size: 28px;
        margin-bottom: 10px;
        color: #FF6F61; /* warm coral */
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin: 12px 0;
      }
      .code-box {
        margin: 25px auto;
        display: inline-block;
        font-size: 36px;
        font-weight: 700;
        padding: 15px 30px;
        background: #FFDEAD; /* light peach */
        border-radius: 15px;
        border: 3px dashed #FF6F61; /* coral dashed border */
        letter-spacing: 6px;
        color: #4B3B2B;
        user-select: all;
      }
      footer {
        margin-top: 30px;
        font-size: 14px;
        color: #8B7D6B;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>🌿 Verify Your Email Address 🌿</h2>
      <p>Hi there, friend! 👋</p>
      <p>To complete your registration or login, please use the magic code below:</p>
      <div class="code-box">${otpCode}</div>
      <p>This code will be valid for 15 minutes. Please keep it safe and don’t share it with anyone else!</p>
      <p>If you didn’t request this email, just ignore it — no worries at all!</p>
      <footer>
        Thank you for joining us! <br />
        — Your Friendly IT Team 🐰
      </footer>
    </div>
  </body>
  </html>
  `;
}
