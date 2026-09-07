const nodemailer = require("nodemailer");

async function runTest() {
  console.log("🚀 hamesta@naver.com 대상 이메일 발송 테스트 시작...");
  
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: #0f172a; padding: 24px; text-align: center; color: white;">
        <span style="background: #f59e0b; color: black; padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: 11px;">공고 제2026-13-35호</span>
        <h1 style="margin: 12px 0 0 0; font-size: 20px;">「PLAY SAFE 숏폼 챌린지」 참가 접수 확인증</h1>
      </div>
      <div style="padding: 24px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 12px; color: #64748b;">공식 접수 번호</div>
          <div style="font-size: 22px; font-weight: 900; color: #d97706;">CHL-2026-0001</div>
        </div>
        <p><strong>수신자:</strong> hamesta@naver.com (신청자 & 운영사무국 동시 전달)</p>
        <p><strong>참가자 성명:</strong> 테스트 참가자 (홍길동)</p>
        <p><strong>공모 부문:</strong> 댄스 부문 - ① 공식안무 분야</p>
        <p><strong>영상 URL:</strong> https://www.instagram.com/reel/C123456789/</p>
        <p><strong>기획 의도:</strong> 공식 음원 'ㅋㅋㅋ'에 맞춘 안전 실천 숏폼 챌린지 테스트입니다.</p>
        <p><strong>접수 일시:</strong> 2026. 9. 7. 오후 2:04</p>
      </div>
    </div>
  `;

  // 1. hamesta@naver.com으로 발송
  const info = await transporter.sendMail({
    from: '"KYWA 안전캠페인 사무국" <no-reply@kywa.or.kr>',
    to: "hamesta@naver.com",
    subject: "[KYWA] 「PLAY SAFE 숏폼 챌린지」 참가 접수 확인증 (CHL-2026-0001)",
    html: emailHtml
  });

  console.log("✅ [발송 성공] Message ID:", info.messageId);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log("🌐 [발송된 이메일 브라우저 즉시 확인 URL]:", previewUrl);
  return previewUrl;
}

runTest().catch(console.error);
