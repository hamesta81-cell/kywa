import nodemailer from "nodemailer";

export interface ChallengeSubmissionData {
  id: string;
  category: string;
  author: string;
  phone: string;
  email: string;
  videoUrl: string;
  description: string;
  submittedAt: string;
}

// 카테고리 레이블 변환기
function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    dance_official: "댄스 부문 - 공식 안무 따라하기",
    dance_creative: "댄스 부문 - 가사 창작 안무 퍼포먼스",
    creative_vlog: "크리에이티브 부문 - 안전 브이로그",
    creative_sketch: "크리에이티브 부문 - 상황극 / 패러디",
    creative_info: "크리에이티브 부문 - 안전 정보형 / 애니메이션"
  };
  return map[category] || category;
}

// SMTP 트랜스포터 생성
function getMailTransporter() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

/**
 * 숏폼 챌린지 접수 완료 시 참가자 및 관리자에게 이메일 발송
 */
export async function sendChallengeNotificationEmail(data: ChallengeSubmissionData): Promise<{
  success: boolean;
  applicantSent: boolean;
  adminSent: boolean;
  message?: string;
}> {
  const transporter = getMailTransporter();
  const categoryName = getCategoryLabel(data.category);
  const formattedDate = new Date(data.submittedAt).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul"
  });

  // 관리자 및 공고문 공식 운영사무국 이메일 (hamesta@naver.com 및 mkteam@testmotionofficial.com)
  const adminEmails: string[] = Array.from(
    new Set([
      "hamesta@naver.com",
      "mkteam@testmotionofficial.com",
      process.env.ADMIN_EMAIL
    ].filter(Boolean) as string[])
  );

  // 이메일 본문 HTML
  const emailHtml = `
    <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #0f172a;">
      <!-- 헤더 -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <span style="display: inline-block; padding: 4px 12px; background-color: #f59e0b; color: #000000; font-size: 11px; font-weight: 800; border-radius: 999px; margin-bottom: 12px;">
          2026 청소년활동 안전캠페인
        </span>
        <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
          「PLAY SAFE 숏폼 챌린지」 접수 확인증
        </h1>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #94a3b8;">
          한국청소년활동진흥원(KYWA) 안전캠페인에 참여해 주셔서 대단히 감사합니다.
        </p>
      </div>

      <!-- 접수 요약 카드 -->
      <div style="padding: 28px 24px;">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">공식 접수 번호</div>
          <div style="font-size: 20px; font-weight: 900; color: #d97706; font-family: monospace;">${data.id}</div>
        </div>

        <!-- 세부 내역 테이블 -->
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 8px; color: #64748b; width: 130px; font-weight: 700;">참가자 성명 / 팀명</td>
              <td style="padding: 12px 8px; font-weight: 800; color: #0f172a;">${data.author}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: 700;">공모 부문</td>
              <td style="padding: 12px 8px; font-weight: 800; color: #0f172a;">${categoryName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: 700;">연락처</td>
              <td style="padding: 12px 8px; color: #334155;">${data.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: 700;">이메일</td>
              <td style="padding: 12px 8px; color: #334155;">${data.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: 700;">SNS 영상 URL</td>
              <td style="padding: 12px 8px;">
                <a href="${data.videoUrl}" target="_blank" style="color: #2563eb; text-decoration: underline; word-break: break-all; font-weight: 700;">
                  ${data.videoUrl}
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: 700; vertical-align: top;">기획 의도 및 메시지</td>
              <td style="padding: 12px 8px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${data.description}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; color: #64748b; font-weight: 700;">접수 일시</td>
              <td style="padding: 12px 8px; color: #64748b;">${formattedDate}</td>
            </tr>
          </tbody>
        </table>

        <!-- 안내 사항 -->
        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 16px; font-size: 12px; color: #92400e; line-height: 1.6;">
          <strong>📌 안내 사항</strong><br/>
          • 접수 마감: 2026.10.05(월) 18:00<br/>
          • 공모 결과 발표: 2026년 11월 1주 예정 (개별 연락 및 공지)<br/>
          • 문의처: 02-2088-8456 | mkteam@testmotionofficial.com
        </div>
      </div>

      <!-- 푸터 -->
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
        한국청소년활동진흥원 (KYWA) · 2026 청소년활동 안전캠페인 운영사무국<br/>
        본 메일은 숏폼 챌린지 신청자 접수 완료에 따라 자동 발송되었습니다.
      </div>
    </div>
  `;

  let activeTransporter = transporter;
  let isTestAccount = false;
  let previewUrl = "";

  if (!activeTransporter) {
    try {
      console.log("🧪 [테스트 모드] SMTP_USER 미설정으로 인해 Ethereal 가상 SMTP 계정을 자동 생성합니다...");
      const testAccount = await nodemailer.createTestAccount();
      activeTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isTestAccount = true;
    } catch (e) {
      console.log("ℹ️ [이메일 발송 안내] SMTP 계정(SMTP_USER / SMTP_PASS)이 미설정되어 모의 발송되었습니다.");
      console.log(`- 수신자(신청자): ${data.email}`);
      console.log(`- 수신자(관리자): ${adminEmail}`);
      console.log(`- 접수번호: ${data.id}, 참가자: ${data.author}`);
      return {
        success: true,
        applicantSent: false,
        adminSent: false,
        message: "SMTP 환경변수(SMTP_USER, SMTP_PASS) 미설정으로 콘솔 로깅 처리되었습니다."
      };
    }
  }

  const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@kywa.or.kr";

  let applicantSent = false;
  let adminSent = false;

  // 1. 참가자 본인에게 접수 확인 메일 발송
  try {
    const info = await activeTransporter.sendMail({
      from: `"KYWA 안전캠페인 사무국" <${senderAddress}>`,
      to: data.email,
      subject: `[KYWA] 「PLAY SAFE 숏폼 챌린지」 참가 접수가 완료되었습니다 (${data.id})`,
      html: emailHtml
    });
    applicantSent = true;
    if (isTestAccount) {
      const url = nodemailer.getTestMessageUrl(info);
      if (url) {
        previewUrl = url;
        console.log(`📧 [테스트 메일 전송 성공] 신청자(${data.email}) 확인증 웹 미리보기: ${url}`);
      }
    }
  } catch (error) {
    console.error("Failed to send email to applicant:", error);
  }

  // 2. 관리자 및 공고문 공식 운영사무국(hamesta@naver.com, mkteam@testmotionofficial.com)에 자동 알림 메일 발송
  // (1) 무설정 FormSubmit 자동 포워딩 (양쪽 모두에 동시 발송)
  await Promise.allSettled(
    adminEmails.map(async (targetEmail) => {
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://kywasafe.kr",
            "Referer": "https://kywasafe.kr/"
          },
          body: JSON.stringify({
            _subject: `[KYWA 숏폼 접수] ${data.author} (${data.id})`,
            _template: "table",
            _captcha: "false",
            _replyto: data.email,
            _cc: adminEmails.filter(e => e !== targetEmail).join(","),
            접수번호: data.id,
            공모부문: categoryName,
            참가자_팀명: data.author,
            연락처: data.phone,
            이메일: data.email,
            영상URL: data.videoUrl,
            기획의도_메시지: data.description,
            접수일시: formattedDate
          })
        });
        const formSubmitData = await formSubmitRes.json();
        console.log(`📨 [FormSubmit 자동전송 결과 - ${targetEmail}]:`, formSubmitData);
        if (formSubmitData.success === "true" || formSubmitData.success === true) {
          adminSent = true;
        }
      } catch (fsErr) {
        console.error(`FormSubmit auto forward failed for ${targetEmail}:`, fsErr);
      }
    })
  );

  // (2) 표준 SMTP 발송 시도 (SMTP 설정 시 또는 테스트 계정 시)
  try {
    const adminInfo = await activeTransporter.sendMail({
      from: `"KYWA 숏폼 시스템" <${senderAddress}>`,
      to: adminEmails.join(", "),
      subject: `[신규 접수 알림] 숏폼 챌린지 - ${data.author} (${data.id})`,
      html: emailHtml
    });
    adminSent = true;
    if (isTestAccount) {
      const url = nodemailer.getTestMessageUrl(adminInfo);
      if (url) {
        console.log(`📧 [테스트 메일 전송 성공] 관리자(${adminEmails.join(", ")}) 알림 메일 웹 미리보기: ${url}`);
      }
    }
  } catch (error) {
    console.error("Failed to send email to admin:", error);
  }

  return {
    success: applicantSent || adminSent,
    applicantSent,
    adminSent,
    message: previewUrl ? `테스트 메일 발송 완료: ${previewUrl}` : undefined
  };
}
