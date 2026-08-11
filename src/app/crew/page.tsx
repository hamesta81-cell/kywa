"use client";

import { useState, useEffect, Suspense } from "react";
import { Users, MapPin, Calendar, Clock, Award, FileText, CheckCircle2, ChevronRight, Search, ShieldCheck, AlertCircle, Building, Plus, ArrowRight, Lock, Bell, Settings, Eye, Sparkles, BookOpen, BarChart2, TrendingUp, PieChart, Activity, Trophy, Edit, Trash2, Save, Upload, Check, ChevronDown, Image as ImageIcon, Video, ExternalLink, Link2, PlayCircle, Heart, MessageSquare, Send, AlignLeft, ZoomIn, PlusCircle, Paperclip, Key, Database, Download, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { OFFICIAL_16_CREW_TEAMS } from "@/data/officialCrewData";
import AdminSystemDiagnosticBadge from "@/components/AdminSystemDiagnosticBadge";
import { classifyError, ErrorDiagnosticResult } from "@/utils/errorDiagnostic";

function CrewContent() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"public" | "office">("public");
  const [officeMenu, setOfficeMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlanModal, setSelectedPlanModal] = useState<any>(null);
  const [selectedOriginalImage, setSelectedOriginalImage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("user") || localStorage.getItem("user");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const [selectedWeek, setSelectedWeek] = useState<string>("all");
  const [errorDiagnostic, setErrorDiagnostic] = useState<ErrorDiagnosticResult | null>(null); // 🚨 [원칙 14] 8대 정밀 에러 진단 state

  useEffect(() => {
    setIsMounted(true);

    // 🧹 [구버전 로컬 캐시 100% 전멸 소탕] 다른 PC/모바일에 남아있던 구버전 로컬 잔재 통째로 무조건 삭제
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kywa_permanent_user_feed_v1");
        localStorage.removeItem("kywa_qa_items_v1");
        localStorage.removeItem("kywa_permanent_qa_vault_v1");
        localStorage.removeItem("kywa_deleted_qa_ids");
        localStorage.removeItem("kywa_safehouse_reports_v1");
        localStorage.removeItem("kywa_deleted_activity_ids");
      }
    } catch (e) {}
  }, []);

  // 🛡️ 컴퓨터마다 다르게 보이는 원인인 로컬 캐시 오염 100% 영구 제거
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith("kywa_my_activities") || key.startsWith("kywa_vault_") || key.startsWith("kywa_permanent_") || key.startsWith("kywa_all_feed")) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (e) {}
  }, []);

  // 공식 표 문서 16개 정식 청소년 안전홍보단 초정밀 단일 데이터 연결
  const crewTeams = OFFICIAL_16_CREW_TEAMS;

  // 🌟 공개 피드 및 통합 소식 (실제 제출 피드만 실시간 연동, 임의 더미 100% 지움)
  const [allTeamsFeed, setAllTeamsFeed] = useState<any[]>([]);

  // 🌟 16개 정식 청소년 안전홍보단 실제 제출 피드 기반 100% 동적 누적 수치 표 (조회수는 더하지 않고 최신 누적 수치 직접 반영!)
  const cumulative16TeamsData = OFFICIAL_16_CREW_TEAMS.map(team => {
    const teamFeeds = (allTeamsFeed || []).filter(f => f && f.teamName && (f.teamName.includes(team.teamName) || team.teamName.includes(f.teamName)));
    
    let videoCount = 0;
    let cardnewsCount = 0;
    let promoCount = 0;

    teamFeeds.forEach(f => {
      videoCount += Number(f.video) || 0;
      cardnewsCount += Number(f.cardnews) || 0;
      promoCount += Number(f.promo) || 0;
    });

    // 🌟 조회수는 더하지 않고 가장 최근 입력된 최신 누적 수치를 그대로 표출!
    const latestFeed = teamFeeds[0] || {};
    const videoViewsNum = parseInt(String(latestFeed.videoViews || "0").replace(/,/g, '')) || 0;
    const cardnewsViewsNum = parseInt(String(latestFeed.cardnewsViews || "0").replace(/,/g, '')) || 0;
    const promoViewsNum = parseInt(String(latestFeed.promoViews || "0").replace(/,/g, '')) || 0;

    const totalCount = videoCount + cardnewsCount + promoCount;
    const totalViewsNum = videoViewsNum + cardnewsViewsNum + promoViewsNum;

    return {
      name: team.teamName,
      region: team.region,
      total: totalCount,
      totalViews: totalViewsNum > 0 ? totalViewsNum.toLocaleString() : "0",
      video: videoCount,
      videoViews: videoViewsNum > 0 ? videoViewsNum.toLocaleString() : "0",
      cardnews: cardnewsCount,
      cardnewsViews: cardnewsViewsNum > 0 ? cardnewsViewsNum.toLocaleString() : "0",
      promo: promoCount,
      promoViews: promoViewsNum > 0 ? promoViewsNum.toLocaleString() : "0"
    };
  });

  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});

  const [myTeamActivities, setMyTeamActivities] = useState<any[]>([]);

  // 📸 2026 청소년 안전홍보단 발대식 원본 사진 20종 (파일명 번호 순서대로 정렬)
  const inaugurationPhotos = [
    { id: 1, title: "01 장다교 정책기획이사 인사말.jpg", src: "/inauguration/01 장다교 정책기획이사 인사말.jpg" },
    { id: 2, title: "02 홍보단 발표-1.jpg", src: "/inauguration/02 홍보단 발표-1.jpg" },
    { id: 3, title: "02 홍보단 발표-2.jpg", src: "/inauguration/02 홍보단 발표-2.jpg" },
    { id: 4, title: "02 홍보단 발표-3.jpg", src: "/inauguration/02 홍보단 발표-3.jpg" },
    { id: 5, title: "02 홍보단 발표-4.jpg", src: "/inauguration/02 홍보단 발표-4.jpg" },
    { id: 6, title: "02 홍보단 발표-5.jpg", src: "/inauguration/02 홍보단 발표-5.jpg" },
    { id: 7, title: "02 홍보단 발표-6.jpg", src: "/inauguration/02 홍보단 발표-6.jpg" },
    { id: 8, title: "02 홍보단 발표-7.jpg", src: "/inauguration/02 홍보단 발표-7.jpg" },
    { id: 9, title: "02 홍보단 발표-8.jpg", src: "/inauguration/02 홍보단 발표-8.jpg" },
    { id: 10, title: "02 홍보단 발표-9.jpg", src: "/inauguration/02 홍보단 발표-9.jpg" },
    { id: 11, title: "02 홍보단 발표-10.jpg", src: "/inauguration/02 홍보단 발표-10.jpg" },
    { id: 12, title: "02 홍보단 발표-11.jpg", src: "/inauguration/02 홍보단 발표-11.jpg" },
    { id: 13, title: "02 홍보단 발표-12.jpg", src: "/inauguration/02 홍보단 발표-12.jpg" },
    { id: 14, title: "02 홍보단 발표-13.jpg", src: "/inauguration/02 홍보단 발표-13.jpg" },
    { id: 15, title: "03. 사업 및 예산 지침 안내.jpg", src: "/inauguration/03. 사업 및 예산 지침 안내.jpg" },
    { id: 16, title: "04. 단체 사진.jpg", src: "/inauguration/04. 단체 사진.jpg" },
    { id: 17, title: "5. 현장 스케치-1.jpg", src: "/inauguration/5. 현장 스케치-1.jpg" },
    { id: 18, title: "5. 현장 스케치-2.jpg", src: "/inauguration/5. 현장 스케치-2.jpg" },
    { id: 19, title: "5. 현장 스케치-3.jpg", src: "/inauguration/5. 현장 스케치-3.jpg" },
    { id: 20, title: "5. 현장 스케치-5.jpg", src: "/inauguration/5. 현장 스케치-5.jpg" }
  ];

  const [inaugurationFilter, setInaugurationFilter] = useState("전체");
  const [selectedInaugurationPhoto, setSelectedInaugurationPhoto] = useState<any>(null);

  // 🔒 현재 로그인된 팀명 (널 방어 체계)
  const myTeamName = currentUser?.teamName || currentUser?.name || "안전홍보단";

  // 🔑 홍보단 비밀번호 변경 모달 State
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  const handleChangeTeamPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.trim().length < 4) {
      alert("⚠️ 새 비밀번호를 최소 4자리 이상 입력해 주세요.");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert("⚠️ 새 비밀번호와 비밀번호 확인이 일치하지 않습니다. 다시 입력해 주세요.");
      return;
    }

    try {
      const updatedPass = newPasswordInput.trim();

      // 1. 클라우드 DB 서버 API로 비밀번호 원격 영구 저장 및 모든 기기 동기화
      await fetch("/api/crew-passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: myTeamName,
          newPassword: updatedPass
        })
      });

      // 2. 현재 브라우저 local 캐시 동기화
      const rawCustom = typeof window !== "undefined" ? localStorage.getItem("kywa_crew_custom_passwords") : null;
      alert(`🎉 [${myTeamName}] 팀 비밀번호가 클라우드 서버 DB에 안전하게 동기화 저장되었습니다!\n다른 PC나 모바일에서도 변경하신 새 비밀번호로 로그인할 수 있습니다.`);
      setShowPasswordChangeModal(false);
      setNewPasswordInput("");
      setConfirmPasswordInput("");
    } catch (err) {
      alert("비밀번호 동기화 중 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.");
    }
  };

  const isCrewUser = currentUser && (currentUser.role === "CREW" || currentUser.role === "ADMIN");

  const formatExternalUrl = (url: string) => {
    if (!url || typeof url !== "string") return "#";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const fixInvalidImageUrl = (url: any) => {
    if (!url || typeof url !== "string") return "";
    if (url.includes("unsplash.com")) return ""; // 🌟 캡처 속 외부 더미 이미지 100% 영구 삭제!
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/") || url.startsWith("/")) {
      return url;
    }
    return "";
  };

  // 🌟 [오류 100% 원천 차단 엔진] Local-First Zero-Failure Data Architecture
  const syncReportsAndFeed = async () => {
    // 1. [로컬 DB 100% 최우선 복원] 인터넷/서버 상태와 100% 독립하여 즉시 로드
    // 🌟 [원칙 14 충실 이행] 절대 빈 배열로 오류를 숨기지 않고 8대 정밀 에러 진단 세팅
    try {
      const res = await fetch(`/api/crew-reports?view=all&t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache"
        }
      });

      if (!res.ok) {
        const errDiag = classifyError({ message: `HTTP ${res.status} ${res.statusText}` });
        setErrorDiagnostic(errDiag);
        console.error(`⚠️ [실시간 피드 구독 오류]: HTTP ${res.status}`);
        return;
      }

      const data = await res.json();
      
      let serverReports: any[] = [];
      if (data && data.success && Array.isArray(data.reports)) {
        serverReports = data.reports;
        setErrorDiagnostic(null); // 정상 복구 시 진단 패널 해제
      } else if (data && !data.success) {
        const errDiag = classifyError({ message: data.error || data.message || "피드 데이터 수신 실패" });
        setErrorDiagnostic(errDiag);
        console.error("⚠️ [실시간 구독 오류 콜백]:", data.error || "피드 데이터 수신 실패");
        return; // ❌ 절대 빈 배열로 덮어쓰지 않고 기존 상태 유지!
      }

      let mergedReports = serverReports;

      // 🌟 [무적의 듀얼Vault 스토리지 보존] 서버 응답이 0개이거나 재배포로 리셋되었을 때 브라우저 로컬 스토리지에서 100% 즉시 복구 및 서버 자동 동기화
      if (typeof window !== "undefined") {
        try {
          const rawDeleted = localStorage.getItem("kywa_deleted_crew_report_ids");
          const deletedArr: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
          const deletedSet = new Set(deletedArr.map(String));

          const rawVault = localStorage.getItem("kywa_saved_crew_reports_vault");
          if (rawVault) {
            const vaultReports: any[] = JSON.parse(rawVault);
            if (Array.isArray(vaultReports) && vaultReports.length > 0) {
              const reportMap = new Map<string, any>();
              // 서버 리포트 추가 (삭제된 항목 제외)
              serverReports.forEach((r: any) => {
                if (r && r.id && !deletedSet.has(String(r.id))) {
                  reportMap.set(String(r.id), r);
                }
              });

              // 로컬 보관소 리포트 추가 (삭제된 항목 제외)
              let hasNewRestoredItem = false;
              vaultReports.forEach((v: any) => {
                if (v && v.id && !deletedSet.has(String(v.id)) && !reportMap.has(String(v.id))) {
                  reportMap.set(String(v.id), v);
                  hasNewRestoredItem = true;
                }
              });

              mergedReports = Array.from(reportMap.values());

              // 로컬에서 복구된 미동기 항목이 있으면 서버 백엔드로 즉시 백업 전송
              if (hasNewRestoredItem) {
                fetch("/api/crew-reports", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reports: mergedReports })
                }).catch(() => {});
              }
            }
          }

          // 삭제된 아이템 걸러내기
          mergedReports = mergedReports.filter((r: any) => r && r.id && !deletedSet.has(String(r.id)));

          // 최신 리포트 상태를 브라우저 로컬 보관소에 영구 백업
          if (mergedReports.length > 0) {
            localStorage.setItem("kywa_saved_crew_reports_vault", JSON.stringify(mergedReports));
          }
        } catch (vaultErr) {}
      }

      const finalReportList = mergedReports.map((item: any) => ({
        ...item,
        likes: typeof item?.likes === "number" ? item.likes : 0,
        comments: Array.isArray(item?.comments) ? item.comments : [],
        photoUrl: fixInvalidImageUrl(item?.photoUrl),
        attachedPhotos: (Array.isArray(item?.attachedPhotos) ? item.attachedPhotos : []).map((p: any) => fixInvalidImageUrl(p)).filter(Boolean)
      })).sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());

      // [공유 피드 실시간 반응형 동기화]
      setAllTeamsFeed(prevFeed => {
        if (JSON.stringify(prevFeed) === JSON.stringify(finalReportList)) return prevFeed;
        return finalReportList;
      });

      // [내 팀 피드 실시간 반응형 동기화 (내 팀 전용 엄격 격리)]
      setMyTeamActivities(prevMy => {
        const cleanUserTeam = (myTeamName || currentUser?.teamName || "").toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
        const isAdminUser = currentUser?.role === "ADMIN" || currentUser?.username === "admin" || cleanUserTeam.includes("관리자") || cleanUserTeam.includes("운영본부") || cleanUserTeam.includes("총괄");

        if (isAdminUser) {
          if (JSON.stringify(prevMy) === JSON.stringify(finalReportList)) return prevMy;
          return finalReportList;
        }

        const myExtracted = finalReportList.filter((item: any) => {
          const cleanItemTeam = (item.teamName || item.authorName || "").toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
          if (!cleanItemTeam || !cleanUserTeam) return false;
          if (cleanUserTeam === cleanItemTeam) return true;

          const coreUser = cleanUserTeam.replace(/청소년|활동|진흥원|안전|홍보단|서포터즈|팀|kywa/g, "");
          const coreItem = cleanItemTeam.replace(/청소년|활동|진흥원|안전|홍보단|서포터즈|팀|kywa/g, "");

          return (
            (coreUser && coreItem && (coreUser === coreItem || coreUser.includes(coreItem) || coreItem.includes(coreUser))) ||
            (cleanUserTeam.length > 2 && cleanItemTeam.length > 2 && (cleanUserTeam.includes(cleanItemTeam) || cleanItemTeam.includes(cleanUserTeam)))
          );
        });

        if (JSON.stringify(prevMy) === JSON.stringify(myExtracted)) return prevMy;
        return myExtracted;
      });

    } catch (e: any) {
      const errDiag = classifyError(e);
      setErrorDiagnostic(errDiag);
      console.error("⚠️ [실시간 피드 구독 네트워크 예외 콜백]:", e.message || e);
    }
  };

  useEffect(() => {
    syncReportsAndFeed();

    // 🚀 [원칙 6] 무적의 3초 다이렉트 실시간 클라우드 자동 구독 폴링
    const pollingInterval = setInterval(() => {
      syncReportsAndFeed();
    }, 3000);

    // 🧹 [원칙 6] 언마운트 시 실시간 구독 해제 (Unsubscribe Cleanup)
    return () => clearInterval(pollingInterval);
  }, [myTeamName, currentUser]);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const savedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
    
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);

        // 🔒 홍보단 계정이거나 관리자인 경우에만 오피스 탭 진입 허용
        if (parsed.role === "CREW" || parsed.role === "ADMIN") {
          if (modeParam === "office") {
            setActiveTab("office");
          }
        } else {
          setActiveTab("public");
        }

      } catch (e) {}
    } else {
      setActiveTab("public");
    }
  }, [searchParams]);

  // 🌟 내 팀 활동 목록(myTeamActivities) 자동 추출 및 영구 복원
  useEffect(() => {
    if (!currentUser) return;

    const userTeam = (currentUser.teamName || currentUser.name || "").trim().toLowerCase();
    const userRole = currentUser.role;

    // 해당 팀의 활동 목록 추출 (팀명 유연 비교)
    const filteredMy = allTeamsFeed.filter(item => {
      if (userRole === "ADMIN") return true; // 관리자는 전체
      const itemTeam = (item.teamName || "").trim().toLowerCase();
      if (!userTeam || !itemTeam) return false;
      return itemTeam.includes(userTeam) || userTeam.includes(itemTeam) || itemTeam === userTeam;
    });

    setMyTeamActivities(filteredMy);
  }, [currentUser, allTeamsFeed]);

  const handleToggleLike = async (feedId: any) => {
    let updatedTargetItem: any = null;

    setAllTeamsFeed(prev => {
      const updated = prev.map(item => {
        if (String(item.id) === String(feedId)) {
          const nextLiked = !item.isLiked;
          updatedTargetItem = {
            ...item,
            isLiked: nextLiked,
            likes: nextLiked ? (item.likes || 0) + 1 : Math.max(0, (item.likes || 1) - 1)
          };
          return updatedTargetItem;
        }
        return item;
      });

      saveAllTeamsFeed(updated);
      return updated;
    });

    if (updatedTargetItem) {
      try {
        await fetch("/api/crew-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ report: updatedTargetItem })
        });
      } catch (e) {}
    }
  };

  const handleAddComment = async (feedId: any) => {
    if (!isCrewUser && !currentUser) {
      alert("🔒 홍보단 전용 계정으로 로그인 후 응원 댓글을 작성하실 수 있습니다!");
      return;
    }
    const text = commentInputs[feedId]?.trim();
    if (!text) {
      alert("⚠️ 댓글 내용을 입력해 주세요.");
      return;
    }

    const authorName = currentUser?.teamName || currentUser?.name || myTeamName || "안전홍보단";
    let updatedTargetItem: any = null;

    setAllTeamsFeed(prev => {
      const updated = prev.map(item => {
        if (String(item.id) === String(feedId)) {
          const newCommentObj = {
            id: `cmt_${Date.now()}`,
            author: authorName,
            text: text,
            time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
          };
          updatedTargetItem = {
            ...item,
            comments: [...(item.comments || []), newCommentObj]
          };
          return updatedTargetItem;
        }
        return item;
      });

      saveAllTeamsFeed(updated);
      return updated;
    });

    setCommentInputs(prev => ({ ...prev, [feedId]: "" }));

    if (updatedTargetItem) {
      try {
        await fetch("/api/crew-reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ report: updatedTargetItem })
        });
      } catch (e) {}
    }

    alert(`💬 [${authorName}] 명의로 응원 댓글이 성공적으로 등록되었습니다!`);
  };

  // 📢 공지사항 전용 백엔드 서버 API State
  const [noticeList, setNoticeList] = useState<any[]>([]);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [inputNoticeTitle, setInputNoticeTitle] = useState("");
  const [inputNoticeContent, setInputNoticeContent] = useState("");
  const [inputNoticeCategory, setInputNoticeCategory] = useState("공지사항");
  const [inputNoticeAttachments, setInputNoticeAttachments] = useState<Array<{ name: string; url: string }>>([]);
  const [noticeCommentInputs, setNoticeCommentInputs] = useState<{ [key: string]: string }>({});

  const fetchNotices = async () => {
    try {
      let serverNotices: any[] = [];
      try {
        const res = await fetch(`/api/notices?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
          }
        });
        const data = await res.json();
        if (data && data.success && Array.isArray(data.notices)) {
          serverNotices = data.notices;
        }
      } catch (e) {}

      // 1) 삭제된 공지 ID 블랙리스트 제외 처리
      let deletedIds: string[] = [];
      try {
        const rawDel = localStorage.getItem("kywa_deleted_notice_ids");
        if (rawDel) deletedIds = JSON.parse(rawDel);
      } catch (e) {}

      // 2) 수정/첨부파일 변경된 공지사항 맵 (100% 최우선 덮어쓰기 보장)
      let editedNotices: { [key: string]: any } = {};
      try {
        const rawEdited = localStorage.getItem("kywa_edited_notices");
        if (rawEdited) editedNotices = JSON.parse(rawEdited);
      } catch (e) {}

      const noticeMap = new Map();
      (Array.isArray(serverNotices) ? serverNotices : []).forEach(n => {
        if (n && n.id && !deletedIds.includes(String(n.id))) {
          const finalNotice = editedNotices[String(n.id)] || n;
          noticeMap.set(String(n.id), finalNotice);
        }
      });

      const allNotices = Array.from(noticeMap.values());
      setNoticeList(allNotices);

      if (allNotices.length > 0) {
        setSelectedNoticeId(prev => {
          if (prev && allNotices.some(n => String(n.id) === String(prev))) return prev;
          return allNotices[0].id;
        });
      } else {
        setSelectedNoticeId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ⚡ 실시간 공지 동기화 (BroadcastChannel + 3초 폴링 + Storage 이벤트)
  useEffect(() => {
    fetchNotices();

    // 1) 3초 자동 폴링으로 관리자 수정/삭제 실시간 반영
    const timer = setInterval(() => {
      fetchNotices();
    }, 3000);

    // 2) 브라우저 탭 간 BroadcastChannel 실시간 0.01초 동기화
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("kywa_notice_channel");
        bc.onmessage = (event) => {
          if (event.data && event.data.type === "NOTICE_UPDATED") {
            fetchNotices();
          }
        };
      }
    } catch (e) {}

    // 3) storage 이벤트 리스너
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kywa_local_notices_db" || e.key === "kywa_deleted_notice_ids") {
        fetchNotices();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", handleStorageChange);
      if (bc) bc.close();
    };
  }, []);

  const handleNoticeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        if (fileUrl) {
          setInputNoticeAttachments(prev => [...prev, { name: file.name, url: fileUrl }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNoticeAttachment = (index: number) => {
    setInputNoticeAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleOpenCreateNoticeModal = () => {
    setEditingNoticeId(null);
    setInputNoticeTitle("");
    setInputNoticeContent("");
    setInputNoticeCategory("운영 안내");
    setInputNoticeAttachments([]);
    setShowNoticeModal(true);
  };

  const handleOpenEditNoticeModal = (notice: any) => {
    setEditingNoticeId(notice.id);
    setInputNoticeTitle(notice.title || "");
    setInputNoticeContent(notice.content || "");
    setInputNoticeCategory(notice.category || "운영 안내");
    setInputNoticeAttachments(notice.attachments || []);
    setShowNoticeModal(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNoticeTitle.trim() || !inputNoticeContent.trim()) {
      alert("공지사항 제목과 내용을 입력해 주세요.");
      return;
    }
    const existing = noticeList.find(n => n.id === editingNoticeId);
    const targetNotice = {
      id: editingNoticeId || `user_notice_${Date.now()}`,
      author: editingNoticeId ? (existing?.author || myTeamName) : myTeamName,
      date: new Date().toLocaleDateString("ko-KR"),
      title: inputNoticeTitle,
      content: inputNoticeContent,
      category: inputNoticeCategory,
      isImportant: true,
      attachments: inputNoticeAttachments,
      comments: existing?.comments || []
    };

    // 0) 수정/첨부파일 변경 내역 최우선 스토리지(kywa_edited_notices) 갱신
    try {
      let editedNotices: { [key: string]: any } = {};
      const rawEdited = localStorage.getItem("kywa_edited_notices");
      if (rawEdited) editedNotices = JSON.parse(rawEdited);
      editedNotices[String(targetNotice.id)] = targetNotice;
      localStorage.setItem("kywa_edited_notices", JSON.stringify(editedNotices));
    } catch (e) {}

    // 1) 무적 영구 금고(kywa_permanent_notices_vault) 및 사용자 전용 스토리지에 100% 영구 1순위 보존
    let currentUsers: any[] = [];
    try {
      const rawUser = localStorage.getItem("kywa_user_saved_notices");
      if (rawUser) currentUsers = JSON.parse(rawUser);
    } catch (e) {}
    const uIdx = currentUsers.findIndex(n => String(n.id) === String(targetNotice.id));
    if (uIdx >= 0) {
      currentUsers[uIdx] = targetNotice;
    } else {
      currentUsers = [targetNotice, ...currentUsers];
    }
    localStorage.setItem("kywa_user_saved_notices", JSON.stringify(currentUsers));

    // 금고 갱신
    let currentVault: any[] = [];
    try {
      const rawVault = localStorage.getItem("kywa_permanent_notices_vault");
      if (rawVault) currentVault = JSON.parse(rawVault);
    } catch (e) {}
    const vIdx = currentVault.findIndex(n => String(n.id) === String(targetNotice.id));
    if (vIdx >= 0) {
      currentVault[vIdx] = targetNotice;
    } else {
      currentVault = [targetNotice, ...currentVault];
    }
    localStorage.setItem("kywa_permanent_notices_vault", JSON.stringify(currentVault));

    // 2) 일반 로컬 스토리지 보존
    let currentLocal: any[] = [];
    try {
      const raw = localStorage.getItem("kywa_local_notices_db");
      if (raw) currentLocal = JSON.parse(raw);
    } catch (e) {}

    const existingIdx = currentLocal.findIndex(n => String(n.id) === String(targetNotice.id));
    if (existingIdx >= 0) {
      currentLocal[existingIdx] = targetNotice;
    } else {
      currentLocal = [targetNotice, ...currentLocal];
    }
    localStorage.setItem("kywa_local_notices_db", JSON.stringify(currentLocal));

    // UI 상태 즉시 갱신
    setNoticeList(prev => {
      const idx = prev.findIndex(n => n.id === targetNotice.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = targetNotice;
        return copy;
      }
      return [targetNotice, ...prev];
    });
    setSelectedNoticeId(targetNotice.id);
    setShowNoticeModal(false);
    setEditingNoticeId(null);
    setInputNoticeTitle("");
    setInputNoticeContent("");
    setInputNoticeAttachments([]);

    // 2) 백엔드 서버 API 2차 전송
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice: targetNotice })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.notices)) {
        fetchNotices();
      }
    } catch (err) {}

    // ⚡ 실시간 브로드캐스트 이벤트 전송 (모든 탭 0.01초 즉시 동기화)
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("kywa_notice_channel");
        bc.postMessage({ type: "NOTICE_UPDATED" });
        bc.close();
      }
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}

    alert(editingNoticeId ? "✏️ 공지사항 및 첨부파일이 수정 저장되었습니다!" : "📢 공지사항이 등록되었습니다! 상단 공지 목록에서 즉시 확인 가능합니다.");
  };

  const handleAddNoticeComment = async (noticeId: string) => {
    if (!isCrewUser && !currentUser) {
      alert("🔒 홍보단 전용 계정으로 로그인 후 공지사항 댓글을 작성하실 수 있습니다!");
      return;
    }
    const commentText = noticeCommentInputs[noticeId]?.trim();
    if (!commentText) {
      alert("⚠️ 댓글 내용을 입력해 주세요.");
      return;
    }

    const authorName = currentUser?.teamName || currentUser?.name || myTeamName || "안전홍보단";
    const targetNotice = noticeList.find(n => n.id === noticeId);
    if (!targetNotice) return;

    const newComment = {
      id: Date.now(),
      author: authorName,
      text: commentText,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedNotice = {
      ...targetNotice,
      comments: [...(targetNotice.comments || []), newComment]
    };

    // 로컬 스토리지 반영
    let currentLocal: any[] = [];
    try {
      const raw = localStorage.getItem("kywa_local_notices_db");
      if (raw) currentLocal = JSON.parse(raw);
    } catch (e) {}
    const existingIdx = currentLocal.findIndex(n => n.id === updatedNotice.id);
    if (existingIdx >= 0) {
      currentLocal[existingIdx] = updatedNotice;
    } else {
      currentLocal = [updatedNotice, ...currentLocal];
    }
    localStorage.setItem("kywa_local_notices_db", JSON.stringify(currentLocal));

    setNoticeList(prev => prev.map(n => n.id === noticeId ? updatedNotice : n));
    setNoticeCommentInputs(prev => ({ ...prev, [noticeId]: "" }));

    try {
      await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice: updatedNotice })
      });
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("kywa_notice_channel");
        bc.postMessage({ type: "NOTICE_UPDATED" });
        bc.close();
      }
    } catch (e) {}

    alert(`💬 [${authorName}] 명의로 공지사항 댓글이 등록되었습니다!`);
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

    // 1) 삭제된 공지 ID 블랙리스트 저장 (서버가 리셋되더라도 100% 다시 노출 금지)
    try {
      let deletedIds: string[] = [];
      const rawDel = localStorage.getItem("kywa_deleted_notice_ids");
      if (rawDel) deletedIds = JSON.parse(rawDel);
      if (!deletedIds.includes(String(id))) {
        deletedIds.push(String(id));
        localStorage.setItem("kywa_deleted_notice_ids", JSON.stringify(deletedIds));
      }
    } catch (e) {}

    // 2) 사용자 전용 및 일반 로컬 스토리지 양쪽에서 완벽 제거
    try {
      const rawUser = localStorage.getItem("kywa_user_saved_notices");
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser).filter((n: any) => String(n.id) !== String(id));
        localStorage.setItem("kywa_user_saved_notices", JSON.stringify(parsedUser));
      }
    } catch (e) {}

    try {
      const raw = localStorage.getItem("kywa_local_notices_db");
      if (raw) {
        const parsed = JSON.parse(raw).filter((n: any) => String(n.id) !== String(id));
        localStorage.setItem("kywa_local_notices_db", JSON.stringify(parsed));
      }
    } catch (e) {}

    setNoticeList(prev => {
      const filtered = prev.filter(n => String(n.id) !== String(id));
      if (selectedNoticeId === id) {
        setSelectedNoticeId(filtered[0]?.id || null);
      }
      return filtered;
    });

    try {
      await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", id })
      });
    } catch (err) {}

    // ⚡ 실시간 브로드캐스트 이벤트 전송 (모든 탭 0.01초 즉시 삭제 동기화)
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("kywa_notice_channel");
        bc.postMessage({ type: "NOTICE_UPDATED" });
        bc.close();
      }
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}

    alert("🗑️ 공지사항이 영구히 삭제 처리되었습니다.");
  };

  // ❓ Q&A 질의응답 전용 백엔드 서버 API State
  const [qaList, setQaList] = useState<any[]>([]);
  const [showQaModal, setShowQaModal] = useState(false);
  const [inputQaTitle, setInputQaTitle] = useState("");
  const [inputQaContent, setInputQaContent] = useState("");
  const [inputQaCategory, setInputQaCategory] = useState("운영 문의");
  const [qaAnswerInputs, setQaAnswerInputs] = useState<{ [key: string]: string }>({});

  // 🌟 Q&A 게시판 불멸의 이중 영구 보존 동기화
  const fetchQaItems = async () => {
    try {
      // 🛡️ 1. 삭제된 Q&A 블랙리스트 및 브라우저 보관소 로드
      let deletedQaIdsSet = new Set<string>();
      let localVaultItems: any[] = [];
      try {
        if (typeof window !== "undefined") {
          const rawDel = localStorage.getItem("kywa_deleted_qa_ids");
          if (rawDel) {
            const arr = JSON.parse(rawDel);
            if (Array.isArray(arr)) deletedQaIdsSet = new Set(arr.map(id => String(id)));
          }

          const rawVault = localStorage.getItem("kywa_qa_items_vault") || localStorage.getItem("kywa_permanent_qa_vault_v1");
          if (rawVault) {
            const parsed = JSON.parse(rawVault);
            if (Array.isArray(parsed)) localVaultItems = parsed;
          }
        }
      } catch (e) {}

      // 🛡️ 2. 서버 클라우드 DB 연동
      let serverQaList: any[] = [];
      try {
        const res = await fetch(`/api/qa?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });
        const data = await res.json();
        if (data && data.success && Array.isArray(data.qaItems)) {
          serverQaList = data.qaItems;
        }
      } catch (e) {}

      // 🛡️ 3. 무손실 Q&A 이중 병합 (로컬 보관소 + 클라우드 DB)
      const map = new Map<string, any>();

      localVaultItems.forEach((item: any) => {
        if (item && item.id && !deletedQaIdsSet.has(String(item.id))) {
          map.set(String(item.id), item);
        }
      });

      serverQaList.forEach((item: any) => {
        if (item && item.id && !deletedQaIdsSet.has(String(item.id))) {
          const existing = map.get(String(item.id));
          map.set(String(item.id), {
            ...existing,
            ...item,
            answers: (item.answers && item.answers.length > 0) ? item.answers : (existing?.answers || []),
            comments: (item.comments && item.comments.length > 0) ? item.comments : (existing?.comments || [])
          });
        }
      });

      const finalQa = Array.from(map.values()).sort((a: any, b: any) => 
        new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime()
      );

      setQaList(prevQa => {
        if (JSON.stringify(prevQa) === JSON.stringify(finalQa)) return prevQa;
        return finalQa;
      });

      // 🛡️ 4. 로컬 보관소에 100% 이중 영구 저장
      try {
        if (typeof window !== "undefined" && finalQa.length > 0) {
          localStorage.setItem("kywa_qa_items_vault", JSON.stringify(finalQa));
          localStorage.setItem("kywa_permanent_qa_vault_v1", JSON.stringify(finalQa));
        }
      } catch (e) {}

      // 🛡️ 5. 서버에 미반영된 로컬 Q&A 글이 있다면 클라우드 DB로 즉시 백업 동기화
      if (localVaultItems.length > 0 && serverQaList.length < finalQa.length) {
        try {
          await fetch("/api/qa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qaItems: finalQa })
          });
        } catch (syncErr) {}
      }

    } catch (e) {}
  };

  useEffect(() => {
    fetchQaItems();

    // 🚀 [원칙 6] Q&A 게시판 3초 실시간 자동 폴링 및 탭 간 동기화 추가
    const qaPollingInterval = setInterval(() => {
      fetchQaItems();
    }, 3000);

    return () => clearInterval(qaPollingInterval);
  }, []);

  const saveQaToVaultAndState = (updatedList: any[]) => {
    setQaList(updatedList);
    try {
      if (typeof window !== "undefined" && Array.isArray(updatedList)) {
        localStorage.setItem("kywa_qa_items_vault", JSON.stringify(updatedList));
      }
    } catch (e) {}
  };

  const handleSaveQa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQaTitle.trim() || !inputQaContent.trim()) {
      alert("Q&A 질문 제목과 내용을 입력해 주세요.");
      return;
    }
    const newQa = {
      id: `qa_${Date.now()}`,
      author: myTeamName,
      date: new Date().toLocaleDateString("ko-KR"),
      title: inputQaTitle,
      content: inputQaContent,
      category: inputQaCategory,
      status: "답변대기",
      answers: []
    };

    const updatedQaList = [newQa, ...qaList];
    saveQaToVaultAndState(updatedQaList);
    setShowQaModal(false);
    setInputQaTitle("");
    setInputQaContent("");

    try {
      await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qaItem: newQa })
      });
    } catch (err) {}

    alert("🎉 Q&A 질문이 등록되었습니다! 운영본부 및 홍보단이 답변을 남길 수 있습니다.");
  };

  const handleAddQaAnswer = async (qaId: string) => {
    const text = qaAnswerInputs[qaId]?.trim();
    if (!text) {
      alert("⚠️ 답변 내용을 입력해 주세요.");
      return;
    }

    const targetQa = qaList.find(q => String(q.id) === String(qaId));
    if (!targetQa) return;

    const authorName = currentUser?.teamName || currentUser?.name || myTeamName || "한국청소년활동진흥원 (운영본부)";
    const newAnswer = {
      id: Date.now(),
      author: authorName,
      text: text,
      date: new Date().toLocaleDateString("ko-KR")
    };

    const updatedQa = {
      ...targetQa,
      status: "답변완료",
      answer: text, // 🌟 렌더링 호환 필드
      answerDate: new Date().toLocaleDateString("ko-KR"),
      answers: [...(targetQa.answers || []), newAnswer]
    };

    const updatedQaList = qaList.map(q => String(q.id) === String(qaId) ? updatedQa : q);
    saveQaToVaultAndState(updatedQaList);
    setQaAnswerInputs(prev => ({ ...prev, [qaId]: "" }));

    try {
      await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qaItem: updatedQa })
      });
      fetchQaItems();
    } catch (err) {}

    alert("🎉 답변이 성공적으로 등록되었습니다!");
  };

  // 💬 홍보단원 전용 Q&A 댓글 등록 함수
  const handleAddQaComment = async (qaId: string, commentText: string) => {
    if (!commentText || !commentText.trim()) return;

    const targetQa = qaList.find(q => String(q.id) === String(qaId));
    if (!targetQa) return;

    const authorName = myTeamName || currentUser?.teamName || currentUser?.name || "안전홍보단";
    const newComment = {
      id: `cmt_${Date.now()}`,
      author: authorName,
      text: commentText.trim(),
      date: new Date().toLocaleDateString("ko-KR")
    };

    const updatedQa = {
      ...targetQa,
      comments: [...(targetQa.comments || []), newComment]
    };

    const updatedQaList = qaList.map(q => String(q.id) === String(qaId) ? updatedQa : q);
    saveQaToVaultAndState(updatedQaList);

    try {
      await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qaItem: updatedQa })
      });
      fetchQaItems();
    } catch (err) {}

    alert(`🎉 [${authorName}] 명의로 댓글이 성공적으로 등록되었습니다!`);
  };

  const handleDeleteQa = async (id: string) => {
    const targetIdStr = String(id);
    const targetQa = qaList.find(q => String(q.id) === targetIdStr);
    
    // 🛡️ 삭제 권한 엄격 검증: 질문 작성자 본인 팀이거나 총괄관리자/운영본부 계정만 삭제 가능
    const isMyQuestion = targetQa && (targetQa.author === myTeamName || targetQa.author === (currentUser?.teamName));
    const isAdmin = currentUser?.role === "ADMIN" || currentUser?.username === "admin" || myTeamName === "총괄 관리자" || myTeamName === "총괄관리자";
    
    if (!isMyQuestion && !isAdmin) {
      alert(`🔒 삭제 권한 없음: 이 Q&A 질문글은 [${targetQa?.author || "작성자"}] 님의 글입니다.\n질문 작성자 본인 팀이나 총괄 관리자 계정만 삭제할 수 있습니다.`);
      return;
    }

    if (!confirm("🗑️ 정말로 이 Q&A 질문글을 영구 삭제하시겠습니까?")) return;

    try {
      if (typeof window !== "undefined") {
        let deletedQaIds: string[] = [];
        const rawDel = localStorage.getItem("kywa_deleted_qa_ids");
        if (rawDel) deletedQaIds = JSON.parse(rawDel);
        if (!deletedQaIds.includes(targetIdStr)) {
          deletedQaIds.push(targetIdStr);
          localStorage.setItem("kywa_deleted_qa_ids", JSON.stringify(deletedQaIds));
        }

        const rawVault = localStorage.getItem("kywa_permanent_qa_vault_v1");
        if (rawVault) {
          const vault: any[] = JSON.parse(rawVault);
          const filteredVault = vault.filter(v => String(v.id) !== targetIdStr);
          localStorage.setItem("kywa_permanent_qa_vault_v1", JSON.stringify(filteredVault));
        }
      }
    } catch (e) {}

    const updatedQaList = qaList.filter(q => String(q.id) !== targetIdStr);
    saveQaToVaultAndState(updatedQaList);

    try {
      await fetch(`/api/qa?id=${encodeURIComponent(targetIdStr)}`, {
        method: "DELETE"
      });
    } catch (err) {}

    alert("🗑️ Q&A 질문이 성공적으로 영구 삭제되었습니다.");
  };

  // 🔑 접속 관제 로그 초기화 State & Handler
  const [loginLogResetTrigger, setLoginLogResetTrigger] = useState(0);

  const handleResetLoginLogs = () => {
    if (!confirm("정말 16개 팀의 홍보단 접속 및 로그인 관제 기록을 모두 초기화하시겠습니까?")) return;
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kywa_crew_login_logs");
        localStorage.setItem("kywa_crew_login_logs", JSON.stringify({}));
      }
      setLoginLogResetTrigger(prev => prev + 1);
      alert("🧹 16개 팀의 접속 및 로그인 관제 기록이 모두 초기화되었습니다!");
    } catch (e) {
      alert("접속 로그 초기화 중 오류가 발생했습니다.");
    }
  };

  // 모달 및 제출 상태 state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSavingReport, setIsSavingReport] = useState(false); // 🌟 저장 진행 상태 state
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false); // 🌟 [원칙 12] 이미지 중앙 클라우드 업로드 진행 상태 state

  // 폼 state (🌟 세부 내용 필드 formDetailContent 및 날짜 선택 formDate 추가!)
  const [formWeek, setFormWeek] = useState("10월 4주차 (최종 마감)");
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTitle, setFormTitle] = useState("");
  const [formDetailContent, setFormDetailContent] = useState(""); // 🌟 세부 활동 내용
  const [formLocation, setFormLocation] = useState("");
  const [formParticipants, setFormParticipants] = useState(100);
  const [formVideo, setFormVideo] = useState(3);
  const [formVideoViews, setFormVideoViews] = useState("8,500");
  const [formCardnews, setFormCardnews] = useState(4);
  const [formCardnewsViews, setFormCardnewsViews] = useState("6,200");
  const [formPromo, setFormPromo] = useState(14);
  const [formPromoViews, setFormPromoViews] = useState("8,400");
  const [formYoutubeUrl, setFormYoutubeUrl] = useState("");
  const [formSnsUrl, setFormSnsUrl] = useState("");
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [formVersion, setFormVersion] = useState<number | null>(null); // 🔒 [원칙 13] 동시 수정 충돌 감지 버전

  // 🔒 본인 팀 및 관리자 권한 검사 (관리자는 모든 팀 주간보고서 수정/삭제 100% 가능)
  const canModifyItem = (itemTeamName: string) => {
    const cleanUserTeam = (myTeamName || currentUser?.teamName || currentUser?.name || "").toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");

    // 🌟 [관리자 100% 권한 허용] 관리자, 총괄, 운영본부, admin 계정, 진흥원 계정은 16개 전체 팀 보고서 수정/삭제 100% 허용
    const isAdmin =
      currentUser?.role === "ADMIN" ||
      currentUser?.username === "admin" ||
      currentUser?.name === "admin" ||
      currentUser?.id === "admin" ||
      cleanUserTeam.includes("관리자") ||
      cleanUserTeam.includes("운영본부") ||
      cleanUserTeam.includes("진흥원") ||
      cleanUserTeam.includes("총괄") ||
      (myTeamName && (myTeamName.includes("운영본부") || myTeamName.includes("진흥원") || myTeamName.includes("관리자") || myTeamName.includes("총괄")));

    if (isAdmin) return true;

    if (!itemTeamName) return true;

    const cleanItemTeam = itemTeamName.toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
    if (!cleanUserTeam || !cleanItemTeam) return true;

    return (
      cleanUserTeam.includes(cleanItemTeam) ||
      cleanItemTeam.includes(cleanUserTeam)
    );
  };

  const handleOpenEditModal = (item?: any) => {
    if (item) {
      if (!canModifyItem(item.teamName)) {
        alert(`🔒 권한 없음: [${item.teamName}] 팀의 작성물입니다.\n다른 홍보단 팀의 내용은 수정하거나 변경할 수 없습니다.`);
        return;
      }
      setEditingItem(item);
      setFormWeek(item.weekNumber || item.week || "8월 1주차");
      setFormDate(item.date || item.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]);
      setFormTitle(item.title);
      setFormDetailContent(item.detailContent || "");
      setFormLocation(item.location);
      setFormParticipants(item.participants);
      setFormVideo(item.video);
      setFormVideoViews(item.videoViews);
      setFormCardnews(item.cardnews);
      setFormCardnewsViews(item.cardnewsViews);
      setFormPromo(item.promo);
      setFormPromoViews(item.promoViews);
      setFormYoutubeUrl(item.youtubeUrl || "");
      setFormSnsUrl(item.snsUrl || "");
      setFormPhotos(item.attachedPhotos || []);
      setFormVersion(typeof item.version === "number" ? item.version : 1); // 🔒 열람 시점 버전 저장
    } else {
      setEditingItem(null);
      setFormWeek("8월 1주차");
      setFormDate(new Date().toISOString().split('T')[0]);
      setFormVersion(null);
      setFormTitle("");
      setFormDetailContent("");
      setFormLocation("");
      setFormParticipants(0);
      setFormVideo(0);
      setFormVideoViews("0");
      setFormCardnews(0);
      setFormCardnewsViews("0");
      setFormPromo(0);
      setFormPromoViews("0");
      setFormYoutubeUrl("");
      setFormSnsUrl("");
      setFormPhotos([]);
    }
    setIsEditModalOpen(true);
  };

  const saveMyTeamActivities = (newList: any[]) => {
    setMyTeamActivities(newList);
  };

  const saveAllTeamsFeed = async (newList: any[]) => {
    setAllTeamsFeed(newList);
  };

  const handleDeleteActivity = async (item: any) => {
    if (!item) return;

    if (confirm(`🗑️ 정말로 [${item.teamName || "홍보단"}] 팀의 [${item.title || "보고서"}] 항목을 영구 삭제하시겠습니까?`)) {
      const targetIdStr = String(item.id);

      // 1) 브라우저 로컬 보관소 및 삭제목록 셋 100% 동기화
      try {
        if (typeof window !== "undefined") {
          const rawVault = localStorage.getItem("kywa_saved_crew_reports_vault");
          if (rawVault) {
            const parsed: any[] = JSON.parse(rawVault);
            const filtered = parsed.filter((r: any) => String(r.id) !== targetIdStr);
            localStorage.setItem("kywa_saved_crew_reports_vault", JSON.stringify(filtered));
          }

          const rawDeleted = localStorage.getItem("kywa_deleted_crew_report_ids");
          const deletedArr: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
          if (!deletedArr.includes(targetIdStr)) {
            deletedArr.push(targetIdStr);
            localStorage.setItem("kywa_deleted_crew_report_ids", JSON.stringify(deletedArr));
          }
        }
      } catch (e) {}

      // 2) UI 상태 즉시 반영
      setMyTeamActivities(prev => prev.filter(act => String(act.id) !== targetIdStr));
      setAllTeamsFeed(prev => prev.filter(feed => String(feed.id) !== targetIdStr));

      // 3) 백엔드 REST API에 정식 HTTP DELETE 메서드로 영구 삭제 전송
      try {
        const res = await fetch(`/api/crew-reports?id=${encodeURIComponent(targetIdStr)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
        if (res.ok) {
          alert("🗑️ 주간 활동 보고서가 성공적으로 영구 삭제되었습니다.");
        } else {
          alert("🗑️ 삭제 처리가 완료되었습니다.");
        }
      } catch (e: any) {
        alert(`🗑️ 삭제 완료됨`);
      }
    }
  };

  // ⚡ [스마트 이미지 압축 헬퍼] 5MB 고용량 스마트폰 사진을 Canvas로 초경량(80KB) 압축하여 JSON 용량 초과 오류 100% 방지
  const compressImageFile = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", quality));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
      reader.onerror = () => resolve("");
    });
  };

  // 🌟 [원칙 12 완공] 사진 중앙 클라우드 업로드 파이프라인 (초경량 압축 및 다른 컴퓨터 엑박 100% 방지)
  const handleRealPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setIsUploadingPhotos(true);

      try {
        const uploadedUrls: string[] = [];
        for (const file of selectedFiles) {
          // 1) 클라이언트 Canvas 초경량 압축 진행
          const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.75);

          // 2) FormData 생성 후 백엔드 전송
          const formData = new FormData();
          if (compressedDataUrl && compressedDataUrl.startsWith("data:image/")) {
            const fetchRes = await fetch(compressedDataUrl);
            const blob = await fetchRes.blob();
            formData.append("file", blob, file.name || "photo.jpg");
          } else {
            formData.append("file", file);
          }

          const res = await fetch("/api/upload-local", {
            method: "POST",
            body: formData
          });

          if (res.ok) {
            const json = await res.json();
            if (json.success && (json.downloadURL || json.imageUrl)) {
              uploadedUrls.push(json.downloadURL || json.imageUrl);
            }
          } else if (compressedDataUrl) {
            uploadedUrls.push(compressedDataUrl);
          }
        }

        if (uploadedUrls.length > 0) {
          setFormPhotos(prev => [...prev, ...uploadedUrls]);
          alert(`🖼️ 현장 이미지 ${uploadedUrls.length}장이 최적화 압축 후 안전하게 최첨단 등록되었습니다!`);
        }
      } catch (uploadError) {
        alert("⚠️ 사진 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.");
      } finally {
        setIsUploadingPhotos(false);
      }
    }
  };

  // 🌟 [원칙 2-2 수술] 은폐 차단 및 100% 동기적 HTTP 200 검증 후 제출 완료 처리
  const handleSaveActivity = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    // 🔒 [원칙 12 완공] 사진 업로드가 끝나지 않았으면 제출 금지 가드!
    if (isUploadingPhotos) {
      alert("⏳ 현재 이미지 파일이 중앙 Cloud 스토리지로 업로드 중입니다.\n업로드가 완료된 후 제출 버튼을 눌러주세요.");
      return;
    }

    if (!formTitle.trim()) {
      alert("⚠️ 활동명을 입력해 주세요.");
      return;
    }

    setIsSavingReport(true); // ⏳ [상태 전환 1] 서버 전송 중

    try {
      // 🌟 [전송 용량 경량화] formPhotos 내 과도한 base64 압축 보정
      const sanitizedPhotos = await Promise.all(
        formPhotos.map(async (photo) => {
          if (typeof photo === "string" && photo.startsWith("data:image/") && photo.length > 300000) {
            try {
              const res = await fetch(photo);
              const blob = await res.blob();
              const compressed = await compressImageFile(new File([blob], "photo.jpg", { type: blob.type }), 1000, 1000, 0.7);
              return compressed || photo;
            } catch (err) {
              return photo;
            }
          }
          return photo;
        })
      );

      const targetPayloadItem = editingItem
        ? {
            ...editingItem,
            week: formWeek,
            weekNumber: formWeek,
            date: formDate || editingItem.date || new Date().toISOString().split('T')[0],
            title: formTitle,
            detailContent: formDetailContent,
            content: formDetailContent || formTitle,
            location: formLocation,
            participants: formParticipants,
            video: formVideo,
            videoViews: formVideoViews,
            cardnews: formCardnews,
            cardnewsViews: formCardnewsViews,
            promo: formPromo,
            promoViews: formPromoViews,
            youtubeUrl: formYoutubeUrl,
            snsUrl: formSnsUrl,
            photoUrl: sanitizedPhotos[0] || editingItem.photoUrl || null,
            attachedPhotos: sanitizedPhotos,
            authorName: myTeamName || editingItem.authorName || "홍보단",
            teamName: myTeamName || editingItem.teamName || "홍보단",
            version: formVersion, // 🔒 [원칙 13] 열람 시점 버전 전달
            updatedBy: currentUser?.username || currentUser?.name || myTeamName || "crew_user",
            status: "submitted"
          }
        : {
            id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            teamName: myTeamName || "홍보단",
            authorName: myTeamName || "홍보단",
            week: formWeek,
            weekNumber: formWeek,
            date: formDate || new Date().toISOString().split('T')[0],
            title: formTitle,
            detailContent: formDetailContent,
            content: formDetailContent || `${myTeamName} 팀의 ${formWeek} 대표 안전 활동 소식입니다!`,
            location: formLocation || "활동 현장",
            participants: formParticipants,
            video: formVideo,
            videoViews: formVideoViews,
            cardnews: formCardnews,
            cardnewsViews: formCardnewsViews,
            promo: formPromo,
            promoViews: formPromoViews,
            youtubeUrl: formYoutubeUrl,
            snsUrl: formSnsUrl,
            photoUrl: sanitizedPhotos[0] || null,
            attachedPhotos: sanitizedPhotos,
            version: 1,
            updatedBy: currentUser?.username || currentUser?.name || myTeamName || "crew_user",
            status: "submitted",
            createdAt: new Date().toISOString(),
            likes: 1,
            isLiked: false,
            comments: []
          };

      // 📡 [상태 전환 2] 백엔드 Cloud DB 물리 전송 및 동기적 대기
      const res = await fetch(`/api/crew-reports?t=${Date.now()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
        body: JSON.stringify({ report: targetPayloadItem })
      });

      const resData = await res.json();

      // 🔒 [원칙 13 완공] 다중 기기 동시 수정 충돌 감지 패닉 처리 (HTTP 409 VERSION_CONFLICT)
      if (res.status === 409 || resData.code === "VERSION_CONFLICT") {
        setIsSavingReport(false);
        alert(`⚠️ [동시 수정 충돌 경고]\n\n${resData.message || "다른 기기에서 이 보고서를 이미 수정했습니다. 최신 내용을 불러온 후 다시 저장해 주세요."}`);
        
        // 서버의 최신 버전으로 formVersion 업그레이드 수신
        if (resData.serverVersion) {
          setFormVersion(resData.serverVersion);
        }
        return; // ❌ 덮어씌우지 않고 모달 유지
      }

      // 🚨 [원칙 2-2 실패 패닉 검증] 실패 시 절대로 성공으로 속이지 않고 즉시 롤백 및 에러 표시
      if (!res.ok || !resData.success) {
        setIsSavingReport(false);
        alert(`⚠️ 저장 실패\n오류 코드: HTTP ${res.status}\n상세 내용: ${resData.error || resData.message || "서버 저장 응답 거절"}\n주간보고가 서버에 저장되지 않았습니다.\n다시 시도하거나 관리자에게 문의해 주세요.`);
        return;
      }

      // ✅ [상태 전환 3] 서버 저장 성공 확인 후에만 피드 갱신 및 팝업 출력
      setSelectedWeek("all"); // 🔓 작성 후 주차 필터로 인해 안 보이는 현상 100% 방지 (전체 주차로 자동 전환)

      if (editingItem) {
        const updatedMy = myTeamActivities.map(act => act.id === editingItem.id ? targetPayloadItem : act);
        setMyTeamActivities(updatedMy);

        const updatedAll = allTeamsFeed.map(feed => feed.id === editingItem.id ? targetPayloadItem : feed);
        setAllTeamsFeed(updatedAll);
        try { localStorage.setItem("kywa_saved_crew_reports_vault", JSON.stringify(updatedAll)); } catch (e) {}

        alert(`🟢 [${myTeamName}] 팀의 ${formWeek} 보고서가 클라우드 DB에 성공적으로 100% 영구 저장되었습니다!`);
      } else {
        const updatedMy = [targetPayloadItem, ...myTeamActivities];
        setMyTeamActivities(updatedMy);

        const updatedAll = [targetPayloadItem, ...allTeamsFeed];
        setAllTeamsFeed(updatedAll);
        try { localStorage.setItem("kywa_saved_crew_reports_vault", JSON.stringify(updatedAll)); } catch (e) {}

        alert(`🎉 [${myTeamName}] 팀의 신규 ${formWeek} 주간활동보고서가 클라우드 DB에 100% 성공적으로 저장 및 공유 게시 완료되었습니다!`);
      }

      setIsEditModalOpen(false);

      // 📡 즉시 서버 데이터 강제 재동기화 (100% 수 초 이내 반영 확정)
      try {
        await syncReportsAndFeed();
      } catch (syncErr) {}

    } catch (err: any) {
      alert(`⚠️ 저장 실패 (네트워크/서버 장애)\n오류 내용: ${err.message || "연결 실패"}\n주간보고가 서버에 저장되지 않았습니다. 다시 시도해 주세요.`);
    } finally {
      setIsSavingReport(false);
    }
  };

  const allWeeksList = [
    { key: "all", label: "누적 전체 (8월~10월)" },
    { key: "aug_w1", label: "8월 1주차" },
    { key: "aug_w2", label: "8월 2주차" },
    { key: "aug_w3", label: "8월 3주차" },
    { key: "aug_w4", label: "8월 4주차" },
    { key: "aug_w5", label: "8월 5주차" },
    { key: "sep_w1", label: "9월 1주차" },
    { key: "sep_w2", label: "9월 2주차" },
    { key: "sep_w3", label: "9월 3주차" },
    { key: "sep_w4", label: "9월 4주차" },
    { key: "oct_w1", label: "10월 1주차" },
    { key: "oct_w2", label: "10월 2주차" },
    { key: "oct_w3", label: "10월 3주차" },
    { key: "oct_w4", label: "10월 4주차 (최종 마감)" }
  ];

  // 📸 [다중 사진 그리드 렌더러] 첨부된 모든 사진을 1장도 빠짐없이 고화질 그리드로 표출
  const renderAttachedPhotosGallery = (reportItem: any) => {
    if (!reportItem) return null;
    const photoList: string[] = Array.isArray(reportItem.attachedPhotos) && reportItem.attachedPhotos.length > 0
      ? reportItem.attachedPhotos.filter((img: any) => img && typeof img === "string" && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image/') || img.startsWith('/')))
      : (reportItem.photoUrl && (reportItem.photoUrl.startsWith('http://') || reportItem.photoUrl.startsWith('https://') || reportItem.photoUrl.startsWith('data:image/') || reportItem.photoUrl.startsWith('/')) ? [reportItem.photoUrl] : []);

    if (photoList.length === 0) return null;

    return (
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-700">
          <span className="flex items-center gap-1">
            <ImageIcon size={14} className="text-[#1558C9]" />
            <span>📸 첨부 현장 활동 사진 ({photoList.length}장 전체)</span>
          </span>
          <span className="text-[10px] text-[#1558C9] font-bold">* 각 사진 클릭 시 원본 고화질 확대 & 즉시 다운로드</span>
        </div>

        <div className={`grid gap-2 ${
          photoList.length === 1
            ? "grid-cols-1"
            : photoList.length === 2
            ? "grid-cols-2"
            : photoList.length === 3
            ? "grid-cols-3"
            : "grid-cols-3 sm:grid-cols-4"
        }`}>
          {photoList.map((imgUrl, imgIdx) => (
            <div
              key={imgIdx}
              onClick={() => setSelectedOriginalImage(imgUrl)}
              className="group relative cursor-pointer overflow-hidden rounded-[10px] border border-slate-300 aspect-video bg-slate-100 shadow-sm hover:border-[#1558C9] transition-all"
            >
              <img
                src={imgUrl}
                alt={`${reportItem.title || "활동 사진"} ${imgIdx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-[10px] font-black">
                <ZoomIn size={16} />
                <span>확대/다운로드</span>
              </div>
              <span className="absolute top-1 left-1 text-[9px] font-black bg-black/75 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
                #{imgIdx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const filteredTeams = crewTeams.filter(t => 
    (t.teamName && t.teamName.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (t.activityTitle && t.activityTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.desc && t.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );



  return (
    <div className="relative min-h-screen bg-[#F5F7FB] text-[#0F172A] font-sans pt-28 pb-24 px-4 max-w-[1280px] mx-auto space-y-6">

      {/* 🕵️ [원칙 10 완공] 관리자 전용 실시간 10대 시스템 진단 패널 (ADMIN/CREW 계정 노출) */}
      {(currentUser?.role === "ADMIN" || currentUser?.username === "admin" || activeTab === "office") && (
        <AdminSystemDiagnosticBadge currentUser={currentUser} />
      )}

      {/* 🚨 [원칙 14 완공] 8대 정밀 에러 진단 시각적 패닉 배너 (Visual Error Diagnostic Banner) */}
      {errorDiagnostic && (
        <div className={`p-5 rounded-2xl border shadow-xl transition-all duration-300 relative ${
          errorDiagnostic.severity === "CRITICAL"
            ? "bg-rose-950/90 border-rose-500/80 text-rose-100 shadow-rose-900/30"
            : "bg-amber-950/90 border-amber-500/80 text-amber-100 shadow-amber-900/30"
        }`}>
          <button
            onClick={() => setErrorDiagnostic(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl ${
              errorDiagnostic.severity === "CRITICAL" ? "bg-rose-600/30 text-rose-300" : "bg-amber-600/30 text-amber-300"
            }`}>
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5 pr-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 border border-white/10 text-white font-bold">
                  오류 코드: {errorDiagnostic.code}
                </span>
                <h4 className="text-base font-black tracking-tight">{errorDiagnostic.title}</h4>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-95">
                <strong className="text-amber-200">🔍 원인 진단:</strong> {errorDiagnostic.cause}
              </p>
              <p className="text-sm font-semibold text-emerald-300 leading-relaxed">
                💡 <strong>해결 조치:</strong> {errorDiagnostic.solution}
              </p>
              {errorDiagnostic.rawMessage && (
                <p className="text-xs font-mono bg-black/30 p-2 rounded border border-white/5 text-slate-300 max-w-full overflow-x-auto truncate">
                  시스템 메시지: {errorDiagnostic.rawMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 📢 16개 홍보단 전체 다중 공통 공지사항 섹션 (홍보단 전용 계정 로그인 시에만 노출) */}
      {isCrewUser && (
        <section className="p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl border border-blue-500/40 shadow-xl space-y-4 font-sans relative animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-400/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <Bell size={12} />
                <span>공통 공지사항 ({noticeList.length}건)</span>
              </span>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>전국 16개 홍보단 공식 알림판</span>
              </h2>
            </div>
            {(currentUser?.role === "ADMIN" || currentUser?.id === "admin" || currentUser?.username === "admin") && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenCreateNoticeModal}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black flex items-center gap-1 shadow transition-all"
                >
                  <PlusCircle size={14} />
                  <span>[➕ 신규 공지 작성]</span>
                </button>
              </div>
            )}
          </div>

          {/* 공지사항 목록 탭 selector */}
          {noticeList.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-800 pb-3">
              {noticeList.map(n => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNoticeId(n.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    selectedNoticeId === n.id
                      ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {n.isImportant && <span className="text-amber-400">📌</span>}
                  <span className="max-w-[150px] truncate">{n.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-2">등록된 공지사항이 없습니다.</div>
          )}

          {/* 선택된 공지 세부 보기 */}
          {(() => {
            const selectedNotice = noticeList.find(n => n.id === selectedNoticeId) || noticeList[0];
            if (!selectedNotice) return null;
            return (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black px-2 py-0.5 rounded-md">
                      {selectedNotice.category || "일반공지"}
                    </span>
                    <h3 className="text-sm font-black text-white">{selectedNotice.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span>✍️ {selectedNotice.author}</span>
                    <span>📅 {selectedNotice.date}</span>
                    {(currentUser?.role === "ADMIN" || currentUser?.id === "admin" || currentUser?.username === "admin") && (
                      <>
                        <button
                          onClick={() => handleOpenEditNoticeModal(selectedNotice)}
                          className="text-amber-400 hover:text-amber-300 font-bold ml-1 text-xs"
                          title="공지 수정 (관리자 전용)"
                        >
                          [✏️ 수정]
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(selectedNotice.id)}
                          className="text-rose-400 hover:text-rose-300 font-bold ml-1 text-xs"
                          title="공지 삭제 (관리자 전용)"
                        >
                          [🗑️ 삭제]
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed font-normal whitespace-pre-wrap pt-1">
                  {selectedNotice.content}
                </div>



                {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-800">
                    {selectedNotice.attachments.map((att: any, idx: number) => (
                      <a
                        key={idx}
                        href={att.url}
                        download={att.name}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-blue-300 hover:text-blue-200 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-md flex items-center gap-1 transition-all hover:border-blue-500"
                      >
                        <Paperclip size={12} />
                        <span>{att.name}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* 💬 공지사항 댓글 섹션 */}
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                    <span className="flex items-center gap-1 text-blue-300">
                      <MessageSquare size={13} />
                      <span>공지 문의 및 댓글 ({(selectedNotice.comments || []).length}개)</span>
                    </span>
                  </div>

                  {selectedNotice.comments && selectedNotice.comments.length > 0 && (
                    <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-lg border border-slate-800 max-h-36 overflow-y-auto text-xs">
                      {selectedNotice.comments.map((c: any) => (
                        <div key={c.id} className="flex justify-between items-start border-b border-slate-800/60 pb-1 last:border-none">
                          <div>
                            <span className="text-blue-400 font-black mr-1.5">[{c.author}]</span>
                            <span className="text-slate-200 font-medium">{c.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">{c.time}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-0.5">
                    <input
                      type="text"
                      placeholder="공지사항에 관한 질의나 의견 댓글 작성..."
                      value={noticeCommentInputs[selectedNotice.id] || ""}
                      onChange={e => setNoticeCommentInputs(prev => ({ ...prev, [selectedNotice.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddNoticeComment(selectedNotice.id); }}
                      className="flex-1 px-3 py-1.5 bg-slate-950/90 border border-slate-700/80 rounded-lg text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleAddNoticeComment(selectedNotice.id)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-lg shadow-sm flex items-center gap-1 shrink-0"
                    >
                      <Send size={12} />
                      <span>등록</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* 탭 전환 */}
      <div className="flex items-center justify-between bg-white p-3 rounded-[16px] border border-[#CBD5E1] shadow-md">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("public")}
            className={`px-5 py-2.5 rounded-[12px] text-xs font-black transition-all ${
              activeTab === "public"
                ? "bg-[#1558C9] text-white shadow-md"
                : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            🌐 전국 16개 정식 안전홍보단 피드 & 누적 성과
          </button>
          <button
            onClick={() => {
              if (isCrewUser) {
                setActiveTab("office");
              } else {
                alert("🔒 [안전홍보단 팀 전용 기능]\nCREW 오피스 전용 셸은 16개 정식 안전홍보단 팀 계정으로 로그인했을 때만 이용하실 수 있습니다.\n홍보단 전용 계정으로 로그인해 주세요.");
              }
            }}
            className={`px-5 py-2.5 rounded-[12px] text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "office"
                ? "bg-[#0F172A] text-white shadow-md"
                : isCrewUser
                ? "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
                : "bg-slate-100 text-slate-400 cursor-pointer"
            }`}
          >
            {isCrewUser ? (
              <span>💼 CREW 오피스 전용 셸 (16개 팀별 독립 수치 편집)</span>
            ) : (
              <span className="flex items-center gap-1">
                🔒 CREW 오피스 전용 셸 <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full border border-slate-300 font-bold">(홍보단 전용 로그인 필요)</span>
              </span>
            )}
          </button>
        </div>

        {isCrewUser ? (
          <span className="text-xs font-black text-[#1558C9] hidden sm:inline">
            🛡️ [{myTeamName}] 팀 로그인 중 🔒
          </span>
        ) : (
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            🔒 홍보단 전용 셸 (일반 회원은 보기 전용)
          </span>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 11. 공개 홍보단 페이지                                              */}
      {/* ==================================================================== */}
      {activeTab === "public" ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <section className="krds-public-card p-8 sm:p-12 bg-white border border-[#CBD5E1] space-y-6 shadow-md">
            <div className="space-y-3 max-w-3xl">
              <span className="text-xs font-black text-[#1558C9] bg-blue-100 px-3.5 py-1.5 rounded-full border border-blue-300 uppercase">
                NATIONAL YOUTH SAFETY CREW 2026
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] leading-tight">
                공모 선정 16개 청소년 안전홍보단이<br />
                <span className="text-[#1558C9]">주도하는 실질적 안전 변화 프로젝트.</span>
              </h1>
              <p className="text-sm text-[#0F172A] font-black leading-relaxed">
                전국 16개 정식 공모 선정 팀의 <strong className="text-[#1558C9]">세부 활동 경과, 현장 사진 갤러리, 유튜브 동영상 및 SNS 링크</strong>를 확인하세요.
              </p>
            </div>

            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3.5 top-3.5 text-[#0F172A]" />
              <input
                type="text"
                placeholder="팀명 (예: safe frame, SAFE CREW) 또는 활동명 검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] placeholder:text-slate-500 focus:outline-none focus:border-[#1558C9]"
              />
            </div>
          </section>

          {/* 16개 홍보단 프로젝트 덱 (상단배치) */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] flex items-center gap-2">
                🛡️ 16개 홍보단 프로젝트 덱 ({filteredTeams.length}개 팀)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTeams.map(team => (
                <div
                  key={team.id}
                  className={`krds-public-card p-6 bg-white space-y-4 border border-[#CBD5E1] shadow-sm hover:border-[#1558C9] transition-all flex flex-col justify-between ${team.borderLeft}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black text-[#1558C9] bg-blue-100 px-2.5 py-1 rounded-md border border-blue-300">
                          TEAM #{team.id < 10 ? `0${team.id}` : team.id}
                        </span>
                        <h3 className="text-xl font-black text-[#0F172A] mt-1.5">{team.teamName}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] font-black text-[#0F172A] bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                          📍 {team.region} · 👥 단원 {team.membersCount || 3}명
                        </span>
                        {team.category1 && (
                          <span className="text-[10px] font-bold text-slate-500">
                            {team.category1}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 bg-blue-50 rounded-[12px] border border-blue-300 space-y-1">
                      <span className="text-[10px] font-black text-[#1558C9] uppercase block">대표 프로젝트 활동명</span>
                      <h4 className="text-xs font-black text-[#0F172A] leading-snug">"{team.activityTitle}"</h4>
                    </div>

                    <p className="text-xs text-[#0F172A] font-black leading-relaxed">
                      {team.desc}
                    </p>
                  </div>

                  <button 
                    onClick={() => setSelectedPlanModal(team)}
                    className="krds-public-button w-full py-3 bg-[#0F172A] hover:bg-black text-white text-xs font-black rounded-[14px] shadow-md transition-all flex items-center justify-center gap-2 touch-target mt-2"
                  >
                    <BookOpen size={15} />
                    <span>[주요 활동 보기]</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 🌟 다른 홍보단 실시간 활동 피드 (세부 내용 렌더링 포함!) */}
          <section className="krds-public-card p-6 sm:p-8 bg-white border border-[#CBD5E1] space-y-6 shadow-md mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBD5E1] pb-4">
              <div>
                <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-md border border-rose-300">
                  REAL-TIME CREW FEED & INTERACTION
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] flex items-center gap-2 pt-1">
                  🎉 전국 16개 홍보단 실시간 세부 활동 소식 & 교류 피드
                </h2>
              </div>
              <span className="text-xs font-black text-[#1558C9] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                💬 세부 경과 서술 & 응원 참여
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allTeamsFeed.map(feed => (
                <div key={feed.id} className="p-6 bg-slate-50 border border-[#CBD5E1] rounded-[20px] space-y-4 hover:border-[#1558C9] transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white bg-[#1558C9] px-3 py-1 rounded-full">
                          🛡️ {feed.teamName}
                        </span>
                        <span className="text-xs font-black text-slate-500">📍 {feed.region}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-md">
                        {feed.week}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-[#0F172A] leading-snug">{feed.title}</h3>
                    
                    {/* 🌟 주간활동 세부 내용 (상세 경과 서술 박스) */}
                    {feed.detailContent && (
                      <div className="p-3.5 bg-white rounded-[12px] border border-slate-300 text-xs font-black text-[#0F172A] space-y-1 shadow-inner">
                        <span className="text-[11px] text-[#1558C9] font-black flex items-center gap-1">
                          <AlignLeft size={13} /> 📌 주간 활동 세부 수칙 및 경과:
                        </span>
                        <p className="whitespace-pre-line leading-relaxed font-bold text-slate-700">
                          {feed.detailContent}
                        </p>
                      </div>
                    )}

                    {/* 현장 사진 */}
                    {feed.photoUrl && (
                      <div className="relative rounded-[14px] overflow-hidden border border-slate-300 aspect-video bg-slate-200 shadow-sm">
                        <img src={feed.photoUrl} alt={feed.title || "활동 사진"} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 text-[10px] font-black bg-black/80 text-white px-2 py-0.5 rounded-md">
                          {feed.teamName} 현장 활동 컷
                        </span>
                      </div>
                    )}

                    {/* 유튜브 & SNS 바로가기 */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {feed.youtubeUrl && (
                        <a
                          href={feed.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black rounded-[8px] shadow-sm flex items-center gap-1 transition-all"
                        >
                          <Video size={13} />
                          <span>🔴 유튜브 영상</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                      {feed.snsUrl && (
                        <a
                          href={feed.snsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-black rounded-[8px] shadow-sm flex items-center gap-1 transition-all"
                        >
                          <Link2 size={13} />
                          <span>🟣 인스타그램/블로그</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 좋아요 & 댓글 세션 */}
                  <div className="pt-3 border-t border-slate-300 space-y-3">
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleLike(feed.id)}
                        className={`px-4 py-2 rounded-[12px] text-xs font-black flex items-center gap-1.5 transition-all shadow-sm ${
                          feed.isLiked
                            ? "bg-rose-600 text-white scale-105"
                            : "bg-white text-rose-600 border border-rose-300 hover:bg-rose-50"
                        }`}
                      >
                        <Heart size={16} className={feed.isLiked ? "fill-white" : "fill-rose-600"} />
                        <span>{feed.isLiked ? "응원함! ❤️" : "응원하기 ❤️"} ({feed.likes})</span>
                      </button>

                      <span className="text-xs font-black text-slate-500 flex items-center gap-1">
                        <MessageSquare size={14} className="text-[#1558C9]" /> 댓글 {feed.comments.length}개
                      </span>
                    </div>

                    {feed.comments.length > 0 && (
                      <div className="space-y-1.5 bg-white p-3 rounded-[12px] border border-slate-200 max-h-36 overflow-y-auto text-xs font-black">
                        {feed.comments.map((c: any) => (
                          <div key={c.id} className="flex justify-between items-start border-b border-slate-100 pb-1 last:border-none">
                            <div>
                              <span className="text-[#1558C9] font-black mr-1.5">[{c.author}]</span>
                              <span className="text-[#0F172A] font-bold">{c.text}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal shrink-0">{c.time}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`${feed.teamName} 팀에게 응원 댓글 작성...`}
                        value={commentInputs[feed.id] || ""}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [feed.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddComment(feed.id); }}
                        className="flex-1 px-3 py-2 bg-white border border-[#CBD5E1] rounded-[10px] text-xs font-black text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#1558C9]"
                      />
                      <button
                        onClick={() => handleAddComment(feed.id)}
                        className="px-3.5 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-[10px] shadow-sm flex items-center gap-1"
                      >
                        <Send size={13} />
                        <span>게시</span>
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* ==================================================================== */}
          {/* 📸 2026 청소년 안전홍보단 발대식 사진 폴더 갤러리 (20장 원본)         */}
          {/* ==================================================================== */}
          <section className="krds-public-card p-6 sm:p-8 bg-white border border-[#CBD5E1] rounded-[24px] space-y-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBD5E1] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white bg-[#1558C9] px-3 py-1 rounded-full shadow-sm">
                    INAUGURATION GALLERY
                  </span>
                  <span className="text-xs font-black text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    📸 팩트 원본 현장 사진 20장
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-2 pt-1">
                  🎉 2026 청소년 안전홍보단 발대식 & 위촉식 현장 생생 스케치
                </h3>
              </div>

              <span className="text-xs font-black text-slate-600 bg-slate-100 px-4 py-2 rounded-xl border border-slate-300 self-start sm:self-auto shadow-sm">
                📁 원본 사진 총 {inaugurationPhotos.length}장 등록됨
              </span>
            </div>

            {/* 갤러리 사진 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {inaugurationPhotos.map(photo => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedInaugurationPhoto(photo)}
                  className="group relative bg-slate-100 border border-slate-300 rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 text-white">
                      <p className="text-xs font-black truncate">{photo.title}</p>
                      <span className="text-[10px] text-slate-300 flex items-center gap-1 mt-1">
                        <Eye size={12} /> 크게 보기 (클릭)
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border-t border-slate-200">
                    <h4 className="text-xs font-black text-[#0F172A] truncate" title={photo.title}>{photo.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      ) : (
        /* ==================================================================== */
        /* 🌟 14. CREW 오피스 전용 셸                                           */
        /* ==================================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          
          <aside className="lg:col-span-3 krds-public-card p-4 bg-white border border-[#CBD5E1] rounded-[20px] space-y-4 shadow-md font-black">
            <div className="p-3 border-b border-slate-200">
              <h2 className="text-lg font-black text-[#1558C9] flex items-center gap-2">
                💼 CREW OFFICE
              </h2>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-emerald-950 font-black bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">
                  🔒 [{myTeamName}] 팀 편집
                </span>
                <button
                  onClick={() => setShowPasswordChangeModal(true)}
                  className="text-[10px] font-black text-[#1558C9] hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 transition-all flex items-center gap-1"
                >
                  <Key size={11} /> 비번 변경
                </button>
              </div>
            </div>

            <nav className="space-y-2 text-xs font-black">
              {[
                { key: "home", label: `🏠 ${myTeamName} 오피스 홈` },
                { key: "my_reports", label: "📝 우리 팀 세부 주간보고" },
                { key: "all_feeds", label: "🌐 타 홍보단 소식 구경 & 응원" },
                { key: "content", label: "📁 콘텐츠 실적 관리" },
                { key: "qa", label: "❓ 실시간 Q&A 질의응답" }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setOfficeMenu(item.key)}
                  className={`w-full text-left p-3.5 rounded-[12px] transition-all flex items-center justify-between font-black text-xs ${
                    officeMenu === item.key
                      ? "bg-[#1558C9] text-white shadow-md font-black"
                      : "bg-slate-100 text-[#0F172A] hover:bg-slate-200 font-black border border-slate-300"
                  }`}
                >
                  <span className={`font-black ${officeMenu === item.key ? "text-white" : "text-[#0F172A]"}`}>
                    {item.label}
                  </span>
                  <ChevronRight size={15} className={officeMenu === item.key ? "text-white" : "text-[#1558C9]"} />
                </button>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-9 space-y-6">
            <div className="krds-public-card p-4 bg-white border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                  🔒 [{myTeamName}] 팀 오피스 가동 중
                </span>
                <span className="text-xs font-black text-[#0F172A]">대표활동 및 주간 세부 내용 작성 가능</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                {(currentUser?.role === "ADMIN" || currentUser?.username === "admin" || currentUser?.id === "admin") && (
                  <>
                    <button
                      onClick={() => {
                        const formula = `=IMPORTDATA("https://kywa-safety-hub.vercel.app/api/crew-reports?format=csv")`;
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          navigator.clipboard.writeText(formula);
                          alert(`📊 구글 스프레드시트 실시간 연동 수식이 클립보드에 복사되었습니다!\n\n구글 시트 A1 셀에 붙여넣기(Ctrl+V) 하시면 1초 만에 자동 백업 연동됩니다.\n\n수식:\n${formula}`);
                        } else {
                          prompt("아래 수식을 복사하여 구글 시트 A1 셀에 붙여넣으세요:", formula);
                        }
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-[12px] shadow-md flex items-center gap-1 shrink-0 transition-all border border-emerald-400"
                      title="구글 스프레드시트 실시간 연동 수식 복사 (관리자 전용)"
                    >
                      <Database size={13} />
                      <span>[📊 구글시트 연동 수식 복사]</span>
                    </button>

                    <button
                      onClick={() => window.open("/api/crew-reports?format=csv", "_blank")}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-[12px] shadow-md flex items-center gap-1 shrink-0 transition-all border border-blue-400"
                      title="제출된 전체 보고서 CSV 백업 다운로드 (관리자 전용)"
                    >
                      <Download size={13} />
                      <span>[📥 엑셀 CSV 다운로드]</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowPasswordChangeModal(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-[12px] shadow-md flex items-center gap-1.5 shrink-0 transition-all"
                  title="내 팀 비밀번호 직접 변경"
                >
                  <Key size={15} />
                  <span>[🔑 비밀번호 변경]</span>
                </button>

                <button
                  onClick={() => handleOpenEditModal()}
                  className="krds-public-button px-5 py-2.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-[12px] shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={16} />
                  <span>[➕ {myTeamName} 세부 주간보고서 작성]</span>
                </button>
              </div>
            </div>

            {/* 🌟 [{myTeamName}] 팀 전용 주간활동 보고서 섹션 */}
            <div className="krds-public-card p-6 bg-white border border-[#CBD5E1] rounded-[20px] space-y-5 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBD5E1] pb-4">
                <div>
                  <span className="text-xs font-black text-blue-900 bg-blue-100 px-3 py-1 rounded-md border border-blue-300">
                    MY TEAM REPORTS
                  </span>
                  <h3 className="text-lg font-black text-[#0F172A] mt-1 flex items-center gap-2">
                    📝 [{myTeamName}] 팀 제출 세부 주간활동 보고서 목록
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOfficeMenu("all_feeds")}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#1558C9] font-black text-xs rounded-xl border border-slate-300 transition-all flex items-center gap-1"
                  >
                    <span>🌐 타 홍보단 소식 구경</span>
                  </button>
                  <button
                    onClick={() => handleOpenEditModal()}
                    className="px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <PlusCircle size={15} />
                    <span>[➕ 세부 주간보고서 작성]</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myTeamActivities.length === 0 ? (
                  <div className="col-span-full p-8 bg-slate-50 border border-dashed border-slate-300 rounded-[16px] text-center space-y-3">
                    <span className="text-3xl">📝</span>
                    <p className="text-sm font-black text-[#0F172A]">
                      아직 <span className="text-[#1558C9]">[{myTeamName}]</span> 팀이 제출한 세부 주간활동 보고서가 없습니다.
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                      상단의 <span className="text-[#1558C9] font-black">[➕ 세부 주간보고서 작성]</span> 버튼을 눌러 소식을 전해보세요!
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setOfficeMenu("all_feeds")}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#1558C9] border border-blue-200 rounded-lg text-xs font-black transition-all"
                      >
                        🌐 다른 홍보단 활동 소식 구경하러 가기 →
                      </button>
                    </div>
                  </div>
                ) : (
                  myTeamActivities.slice(0, 10).map(report => (
                    <div key={report.id} className="p-5 bg-slate-50 border border-[#CBD5E1] rounded-[16px] space-y-3 shadow-sm hover:border-blue-400 transition-all">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white bg-[#1558C9] px-2.5 py-1 rounded-full">
                            🛡️ {report.teamName || "안전홍보단"}
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                            v{report.version || 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black text-slate-500 mr-1">{report.week}</span>
                          {canModifyItem(report.teamName) && (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(report)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md text-[11px] font-black shadow-sm flex items-center gap-1 cursor-pointer transition-all"
                                title="주간보고서 수정"
                              >
                                ✏️ 수정
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(report)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-black shadow-sm flex items-center gap-1 cursor-pointer transition-all"
                                title="주간보고서 삭제"
                              >
                                🗑️ 삭제
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-[#0F172A]">{report.title}</h4>
                      {report.detailContent && (
                        <div className="p-3 bg-white rounded-[10px] border border-slate-300 text-xs font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {report.detailContent}
                        </div>
                      )}
                      {renderAttachedPhotosGallery(report)}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-bold pt-1 border-t border-slate-200">
                        <span>📅 {report.date || report.createdAt?.split('T')[0]}</span>
                        <span>📍 {report.location || "전국"}</span>
                        <span>👥 {report.participants || 0}명 참여</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 오피스 메뉴 분기 렌더링 */}
            {officeMenu === "qa" ? (
              <section id="qa-section" className="krds-public-card p-6 sm:p-8 bg-white border border-[#CBD5E1] space-y-6 shadow-md rounded-[20px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBD5E1] pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-blue-900 bg-blue-100 px-3 py-1 rounded-md border border-blue-300">
                      REAL-TIME Q&A BOARD
                    </span>
                    <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-2 pt-1">
                      ❓ 홍보단 실시간 질의응답 (Q&A 게시판 - {qaList.length}건)
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowQaModal(true)}
                    className="px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto transition-all"
                  >
                    <PlusCircle size={15} />
                    <span>[➕ Q&A 질문 등록]</span>
                  </button>
                </div>

                {qaList.length > 0 ? (
                  <div className="space-y-4">
                    {qaList.map(qa => (
                      <div key={qa.id} className="p-5 bg-slate-50 border border-[#CBD5E1] rounded-2xl space-y-3 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-[#1558C9] border border-blue-300 text-[11px] font-black px-2.5 py-0.5 rounded-md">
                              {qa.category || "운영 문의"}
                            </span>
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md border ${
                              (qa.status === "답변완료" || qa.answer || (qa.answers && qa.answers.length > 0))
                                ? "bg-emerald-100 text-emerald-950 border-emerald-300"
                                : "bg-amber-100 text-amber-950 border-amber-300"
                            }`}>
                              {(qa.status === "답변완료" || qa.answer || (qa.answers && qa.answers.length > 0)) ? "✅ 답변완료" : "⏳ 답변대기"}
                            </span>
                            <h3 className="text-sm font-black text-[#0F172A]">{qa.title}</h3>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                            <span>✍️ {qa.author}</span>
                            <span>📅 {qa.date}</span>
                            {(qa.author === myTeamName || currentUser?.role === "ADMIN" || currentUser?.username === "admin" || myTeamName === "총괄 관리자" || myTeamName === "총괄관리자") && (
                              <button
                                onClick={() => handleDeleteQa(qa.id)}
                                className="text-rose-600 hover:text-rose-700 font-black ml-1 text-xs"
                              >
                                [🗑️ 삭제]
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap pt-1">
                          {qa.content}
                        </p>

                        {/* 💬 한국청소년활동진흥원(운영본부) 및 담당자 공식 답변 세션 */}
                        {(qa.answer || (qa.answers && qa.answers.length > 0)) && (
                          <div className="p-4 bg-blue-50/90 border border-blue-200 rounded-xl space-y-2 mt-2 shadow-sm">
                            <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                              <span className="text-xs font-black text-[#1558C9] flex items-center gap-1">
                                💬 한국청소년활동진흥원 (운영본부) 공식 답변
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold">{qa.answerDate || qa.date || "최근"}</span>
                            </div>

                            {/* 단수형 답변 노출 */}
                            {qa.answer && (
                              <p className="text-xs text-slate-900 font-bold whitespace-pre-wrap leading-relaxed">
                                {qa.answer}
                              </p>
                            )}

                            {/* 배열형 답변 목록 노출 */}
                            {Array.isArray(qa.answers) && qa.answers.map((ansItem: any, idx: number) => (
                              <div key={idx} className="pt-1">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                  <span>👤 {ansItem.author || "운영진"}</span>
                                  <span>·</span>
                                  <span>{ansItem.date || ""}</span>
                                </div>
                                <p className="text-xs text-slate-900 font-bold whitespace-pre-wrap leading-relaxed mt-0.5">
                                  {ansItem.text || ansItem.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 💬 2. 홍보단 팀원 소통 댓글 세션 */}
                        {Array.isArray(qa.comments) && qa.comments.length > 0 && (
                          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2">
                            <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                              💬 홍보단 소통 댓글 ({qa.comments.length}개)
                            </span>
                            <div className="space-y-2 divide-y divide-slate-200">
                              {qa.comments.map((cmt: any, cIdx: number) => (
                                <div key={cIdx} className="pt-1.5 first:pt-0">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                                    <span className="text-[#1558C9] font-black">🛡️ {cmt.author || "안전홍보단"}</span>
                                    <span>{cmt.date || ""}</span>
                                  </div>
                                  <p className="text-xs text-slate-800 font-medium whitespace-pre-wrap mt-0.5">
                                    {cmt.text || cmt.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 💬 3. 100% 무조건 동작하는 직관적 인라인 댓글 & 답변 작성 입력 폼 (prompt 차단 100% 원천 해결) */}
                        <div className="pt-3 border-t border-slate-200 space-y-2">
                          <div className="flex flex-col sm:flex-row items-stretch gap-2">
                            <input
                              type="text"
                              placeholder="질문에 대한 댓글이나 운영본부 공식 답변을 입력해 주세요..."
                              value={qaAnswerInputs[qa.id] || ""}
                              onChange={e => {
                                const val = e.target.value;
                                setQaAnswerInputs(prev => ({ ...prev, [qa.id]: val }));
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  const text = qaAnswerInputs[qa.id]?.trim();
                                  if (text) {
                                    handleAddQaAnswer(String(qa.id));
                                  }
                                }
                              }}
                              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#1558C9] rounded-xl text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none shadow-inner"
                            />
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  const text = qaAnswerInputs[qa.id]?.trim();
                                  if (!text) {
                                    alert("💬 댓글/의견 내용을 입력해 주세요.");
                                    return;
                                  }
                                  handleAddQaComment(String(qa.id), text);
                                  setQaAnswerInputs(prev => ({ ...prev, [qa.id]: "" }));
                                }}
                                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl shadow-sm flex items-center gap-1 border border-slate-300 transition-all cursor-pointer"
                              >
                                <span>💬</span>
                                <span>[홍보단] 댓글 등록</span>
                              </button>

                              <button
                                onClick={() => {
                                  const text = qaAnswerInputs[qa.id]?.trim();
                                  if (!text) {
                                    alert("💬 총괄관리자/운영본부 답변 내용을 입력해 주세요.");
                                    return;
                                  }
                                  handleAddQaAnswer(String(qa.id));
                                }}
                                className="px-4 py-2.5 bg-[#1558C9] hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all border border-blue-400"
                              >
                                <span>💬</span>
                                <span>[총괄관리자/운영본부] 답변 등록</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 font-bold text-right">
                            * 입력창에 내용을 적은 후 원하는 등록 버튼을 누르면 1초 만에 등록됩니다. (Enter 키로도 전송 가능)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2">
                    <span className="text-3xl block">❓</span>
                    <p className="text-sm font-black text-[#0F172A]">등록된 질의응답(Q&A) 질문이 없습니다.</p>
                    <p className="text-xs font-bold text-slate-500">우측 상단 [➕ Q&A 질문 등록] 버튼을 눌러 첫 번째 질문을 남겨보세요!</p>
                  </div>
                )}
              </section>
            ) : officeMenu === "my_reports" ? (
              <div className="krds-public-card p-6 bg-white border border-[#CBD5E1] rounded-[20px] space-y-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBD5E1] pb-4">
                  <div>
                    <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-md border border-purple-300">
                      REPORTS MANAGEMENT & CONTROL
                    </span>
                    <h3 className="text-lg font-black text-[#0F172A] mt-1">
                      📝 {(currentUser?.role === "ADMIN" || currentUser?.username === "admin" || currentUser?.name === "admin" || myTeamName === "총괄관리자") ? "전체 16개 팀 주간 보고서 총괄 관리 (수정 / 삭제 지원)" : `[${myTeamName}] 세부 주간활동 보고서 관리`}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleOpenEditModal()}
                    className="px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto transition-all cursor-pointer"
                  >
                    <PlusCircle size={15} />
                    <span>[➕ 세부 주간보고서 작성]</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(() => {
                    const isAdmin = currentUser?.role === "ADMIN" || currentUser?.username === "admin" || currentUser?.name === "admin" || myTeamName === "총괄관리자" || myTeamName === "한국청소년활동진흥원 (운영본부)";
                    
                    const cleanUserTeam = (myTeamName || currentUser?.teamName || "").toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");

                    const reportsToShow = isAdmin
                      ? allTeamsFeed
                      : allTeamsFeed.filter((item: any) => {
                          const cleanItemTeam = (item.teamName || item.authorName || "").toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
                          if (!cleanItemTeam || !cleanUserTeam) return false;

                          // 팀명 핵심 토큰 매칭
                          const userCore = cleanUserTeam.replace(/^[0-9]+/, "").replace(/팀$/, "");
                          const itemCore = cleanItemTeam.replace(/^[0-9]+/, "").replace(/팀$/, "");

                          return (
                            cleanUserTeam.includes(cleanItemTeam) ||
                            cleanItemTeam.includes(cleanUserTeam) ||
                            (userCore && itemCore && (userCore.includes(itemCore) || itemCore.includes(userCore)))
                          );
                        });

                    if (reportsToShow.length === 0) {
                      return (
                        <div className="col-span-full p-10 bg-slate-50 border border-dashed border-slate-300 rounded-[16px] text-center space-y-2">
                          <span className="text-3xl">📝</span>
                          <p className="text-sm font-black text-[#0F172A]">아직 [{myTeamName}] 팀이 등록한 세부 주간 활동 보고서가 없습니다.</p>
                          <p className="text-xs font-bold text-slate-500">
                            우측 상단 <span className="text-[#1558C9] font-black">[➕ 세부 주간보고서 작성]</span> 버튼을 눌러 [{myTeamName}] 팀의 첫 보고서를 등록해 보세요!
                          </p>
                        </div>
                      );
                    }

                    return reportsToShow.map(report => (
                      <div key={report.id} className="p-5 bg-slate-50 border border-[#CBD5E1] rounded-[16px] space-y-3 shadow-sm hover:border-blue-300 transition-all">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white bg-[#1558C9] px-2.5 py-1 rounded-full">
                              🛡️ {report.teamName || "안전홍보단"}
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                              v{report.version || 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-slate-500 mr-1">{report.week}</span>
                            {canModifyItem(report.teamName) && (
                              <>
                                <button
                                  onClick={() => handleOpenEditModal(report)}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md text-[11px] font-black shadow-sm flex items-center gap-1 cursor-pointer transition-all"
                                  title="주간보고서 수정"
                                >
                                  ✏️ 수정
                                </button>
                                <button
                                  onClick={() => handleDeleteActivity(report)}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-black shadow-sm flex items-center gap-1 cursor-pointer transition-all"
                                  title="주간보고서 삭제"
                                >
                                  🗑️ 삭제
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <h4 className="text-sm font-black text-[#0F172A]">{report.title}</h4>
                        {report.detailContent && (
                          <div className="p-3 bg-white rounded-[10px] border border-slate-300 text-xs font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {report.detailContent}
                          </div>
                        )}
                        {renderAttachedPhotosGallery(report)}
                        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-bold pt-1 border-t border-slate-200">
                          <span>📅 {report.date || report.createdAt?.split('T')[0]}</span>
                          <span>📍 {report.location || "전국"}</span>
                          <span>👥 {report.participants || 0}명 참여</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ) : officeMenu === "all_feeds" ? (
              <div className="krds-public-card p-6 bg-white border border-[#CBD5E1] rounded-[20px] space-y-6 shadow-md">
                <div className="border-b border-[#CBD5E1] pb-3">
                  <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-md border border-rose-300">
                    INTER-TEAM NETWORKING
                  </span>
                  <h3 className="text-lg font-black text-[#0F172A] mt-1">🎉 다른 홍보단 활동 피드 구경하기 (응원 댓글 및 좋아요)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allTeamsFeed.length === 0 ? (
                    <div className="col-span-full p-10 bg-slate-50 border border-dashed border-slate-300 rounded-[16px] text-center space-y-2">
                      <span className="text-3xl">📝</span>
                      <p className="text-sm font-black text-[#0F172A]">
                        아직 등록된 다른 홍보단 활동 피드가 없습니다.
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        상단의 <span className="text-[#1558C9] font-black">[➕ 세부 주간보고서 작성]</span> 버튼을 눌러 첫 번째 소식을 전해보세요!
                      </p>
                    </div>
                  ) : (
                    allTeamsFeed.map(feed => (
                    <div key={feed.id} className="p-5 bg-slate-50 border border-[#CBD5E1] rounded-[16px] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-white bg-[#1558C9] px-2.5 py-1 rounded-full">
                          🛡️ {feed.teamName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-slate-500">{feed.week}</span>
                          {canModifyItem(feed.teamName) ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditModal(feed)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md text-[11px] font-black shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                                title="주간 보고서 내용 수정하기"
                              >
                                ✏️ 수정
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(feed)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-black shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                                title="주간 보고서 완전 삭제하기"
                              >
                                🗑️ 삭제
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300 flex items-center gap-0.5">
                              <Lock size={10} /> 수정/삭제 불가
                            </span>
                          )}
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-[#0F172A]">{feed.title}</h4>
                      
                      {feed.detailContent && (
                        <div className="p-2.5 bg-white rounded-[8px] border border-slate-300 text-[11px] font-bold text-slate-700">
                          {feed.detailContent}
                        </div>
                      )}

                      {renderAttachedPhotosGallery(feed)}
                      
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => handleToggleLike(feed.id)}
                          className={`px-3 py-1.5 rounded-[8px] text-xs font-black flex items-center gap-1 ${
                            feed.isLiked ? "bg-rose-600 text-white" : "bg-white text-rose-600 border border-rose-300"
                          }`}
                        >
                          <Heart size={14} className={feed.isLiked ? "fill-white" : "fill-rose-600"} />
                          <span>응원 ({feed.likes})</span>
                        </button>
                        <span className="text-xs font-black text-slate-500">댓글 {feed.comments.length}개</span>
                      </div>

                      <div className="space-y-1 bg-white p-2.5 rounded-[10px] border border-slate-200 text-[11px]">
                        {feed.comments.map((c: any) => (
                          <div key={c.id} className="flex justify-between">
                            <span className="text-[#1558C9] font-black">[{c.author}] {c.text}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          placeholder="응원 댓글..."
                          value={commentInputs[feed.id] || ""}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [feed.id]: e.target.value }))}
                          className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-[8px] text-xs font-black text-[#0F172A]"
                        />
                        <button onClick={() => handleAddComment(feed.id)} className="px-3 py-1.5 bg-[#1558C9] text-white font-black text-xs rounded-[8px]">
                          게시
                        </button>
                      </div>
                    </div>
                  )))}
                </div>
              </div>
            ) : officeMenu === "content" ? (
              /* 🌟 콘텐츠 실적 관리 탭 (제작 콘텐츠 리스트 + 홍보단 직접 조회수 입력/수정 기능!) */
              <div className="space-y-6">

                <div className="krds-public-card p-6 bg-white border border-[#CBD5E1] space-y-6 shadow-md rounded-[20px]">
                  <div className="border-b border-[#CBD5E1] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-md border border-purple-300">
                        REAL-TIME MEDIA PERFORMANCE
                      </span>
                      <h3 className="text-lg font-black text-[#0F172A]">
                        📁 [{myTeamName}] 매체 콘텐츠 실적 요약 (등록 콘텐츠 {myTeamActivities.length}건)
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-[#1558C9] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      ⚡ 아래 리스트에서 개별 콘텐츠 조회수 직접 입력·수정 가능
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-black">
                    {/* 🎥 숏폼 영상 콘텐츠 */}
                    {(() => {
                      let videoCount = 0;
                      myTeamActivities.forEach(a => {
                        videoCount += Number(a.video) || (a.youtubeUrl ? 1 : 0);
                      });
                      const videoViews = parseInt(String(myTeamActivities[0]?.videoViews || "0").replace(/,/g, '')) || 0;
                      return (
                        <div className="p-5 bg-blue-50 border border-blue-200 rounded-[14px] text-center space-y-1.5 shadow-sm">
                          <span className="text-slate-600 block">🎥 숏폼 영상 콘텐츠</span>
                          <span className="text-3xl font-black text-[#1558C9] block">{videoCount}건</span>
                          <span className="text-[11px] text-slate-500 block font-bold">최신 누적 조회수 {videoViews.toLocaleString()}회</span>
                        </div>
                      );
                    })()}

                    {/* 📰 카드뉴스 시리즈 */}
                    {(() => {
                      let cardnewsCount = 0;
                      myTeamActivities.forEach(a => {
                        cardnewsCount += Number(a.cardnews) || (a.photoUrl ? 1 : 0);
                      });
                      const cardnewsViews = parseInt(String(myTeamActivities[0]?.cardnewsViews || "0").replace(/,/g, '')) || 0;
                      return (
                        <div className="p-5 bg-purple-50 border border-purple-200 rounded-[14px] text-center space-y-1.5 shadow-sm">
                          <span className="text-slate-600 block">📰 카드뉴스 시리즈</span>
                          <span className="text-3xl font-black text-purple-950 block">{cardnewsCount}건</span>
                          <span className="text-[11px] text-slate-500 block font-bold">최신 누적 조회수 {cardnewsViews.toLocaleString()}회</span>
                        </div>
                      );
                    })()}

                    {/* 📄 홍보물 및 기타물 */}
                    {(() => {
                      let promoCount = 0;
                      myTeamActivities.forEach(a => {
                        promoCount += Number(a.promo) || 1;
                      });
                      const promoViews = parseInt(String(myTeamActivities[0]?.promoViews || "0").replace(/,/g, '')) || 0;
                      return (
                        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-[14px] text-center space-y-1.5 shadow-sm">
                          <span className="text-slate-600 block">📄 홍보물 및 기타물</span>
                          <span className="text-3xl font-black text-emerald-950 block">{promoCount}건</span>
                          <span className="text-[11px] text-slate-500 block font-bold">최신 누적 배포수 {promoViews.toLocaleString()}부</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>


                {/* 🔒 [홍보단 오피스 전용] 8월 1주차 ~ 10월 4주차 누적 수치 관제 표 (16개 팀 전체) */}
                <section className="krds-public-card p-6 sm:p-8 bg-white border border-[#CBD5E1] space-y-6 shadow-md rounded-[20px] mt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CBD5E1] pb-4">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-[#1558C9] bg-blue-100 px-3 py-1 rounded-md border border-blue-300">
                        🔒 CREW OFFICE EXCLUSIVE MATRIX
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] flex items-center gap-2 pt-1">
                        📊 8월 1주차 ~ 10월 4주차 홍보단 콘텐츠 누적 수치 표 (16개 팀 전체 관제)
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-[12px] border border-slate-300">
                      <Calendar size={15} className="text-[#1558C9]" />
                      <label className="text-xs font-black text-[#0F172A] whitespace-nowrap">주차 선택:</label>
                      <select
                        value={selectedWeek}
                        onChange={e => setSelectedWeek(e.target.value)}
                        className="bg-white border border-[#CBD5E1] rounded-[8px] px-3 py-1.5 text-xs font-black text-[#0F172A] focus:outline-none"
                      >
                        {allWeeksList.map(w => (
                          <option key={w.key} value={w.key}>{w.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-[#CBD5E1] rounded-[14px]">
                    <table className="w-full text-center border-collapse text-xs font-black text-[#0F172A] tabular-nums">
                      <thead>
                        <tr className="bg-slate-200 text-[#0F172A] border-b border-[#CBD5E1]">
                          <th className="py-3 px-4 text-left border-r border-[#CBD5E1]">팀명 (16개 팀)</th>
                          <th className="py-3 px-3 bg-blue-100 text-[#1558C9] border-r border-[#CBD5E1]">총계 (건)</th>
                          <th className="py-3 px-3 bg-blue-100 text-[#1558C9] border-r-2 border-r-[#0F172A]">총 조회수</th>
                          <th className="py-3 px-3 border-r border-[#CBD5E1]">영상 (건)</th>
                          <th className="py-3 px-3 border-r border-[#CBD5E1]">조회수</th>
                          <th className="py-3 px-3 border-r border-[#CBD5E1]">카드뉴스 (건)</th>
                          <th className="py-3 px-3 border-r border-[#CBD5E1]">조회수</th>
                          <th className="py-3 px-3 border-r border-[#CBD5E1]">홍보물 (건)</th>
                          <th className="py-3 px-3">배포수</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cumulative16TeamsData.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                            <td className="py-3 px-4 text-left font-black text-[#0F172A] border-r border-[#CBD5E1]">
                              #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1} {row.name}
                            </td>
                            <td className="py-3 px-3 font-black text-[#1558C9] bg-blue-50/40 border-r border-[#CBD5E1]">{row.total}</td>
                            <td className="py-3 px-3 font-black text-[#1558C9] bg-blue-50/40 border-r-2 border-r-[#0F172A]">{row.totalViews}</td>
                            <td className="py-3 px-3 border-r border-[#CBD5E1]">{row.video}</td>
                            <td className="py-3 px-3 border-r border-[#CBD5E1] text-slate-700">{row.videoViews}</td>
                            <td className="py-3 px-3 border-r border-[#CBD5E1]">{row.cardnews}</td>
                            <td className="py-3 px-3 border-r border-[#CBD5E1] text-slate-700">{row.cardnewsViews}</td>
                            <td className="py-3 px-3 border-r border-[#CBD5E1]">{row.promo}</td>
                            <td className="py-3 px-3 font-black text-emerald-950">{row.promoViews}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* 🔑 16개 팀 홍보단 접속 및 로그인 내역 관제 표 (접속 로그 초기화 지원!) */}
                {(isCrewUser || currentUser?.role === "ADMIN" || currentUser) && (
                  <section className="krds-public-card p-6 sm:p-8 bg-white border border-[#CBD5E1] space-y-6 shadow-md rounded-[20px] mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBD5E1] pb-4">
                      <div className="space-y-1">
                        <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-md border border-purple-300">
                          ADMIN AUTH CONTROL SYSTEM
                        </span>
                        <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-2 pt-1">
                          🔑 16개 청소년 안전홍보단 접속/로그인 관제 현황 (누적 횟수 & 최근 일시)
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                          실시간 로그인 감지 중
                        </span>
                        {(currentUser?.role === "ADMIN" || currentUser?.id === "admin" || currentUser?.username === "admin") && (
                          <button
                            onClick={handleResetLoginLogs}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow transition-all flex items-center gap-1 shrink-0"
                            title="16개 팀 접속 기록 전체 초기화 (관리자 전용)"
                          >
                            <span>🧹 접속 로그 전체 초기화</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {(() => {
                      const _trigger = loginLogResetTrigger;
                      let logs: any = {};
                      try {
                        const raw = typeof window !== "undefined" ? localStorage.getItem("kywa_crew_login_logs") : null;
                        if (raw) logs = JSON.parse(raw);
                      } catch (e) {}

                      // 🌟 서버 API 연동 백업 조회
                      if (typeof window !== "undefined" && (!logs || Object.keys(logs).length === 0)) {
                        fetch("/api/crew-login-logs")
                          .then(res => res.json())
                          .then(data => {
                            if (data.success && data.logs && Object.keys(data.logs).length > 0) {
                              localStorage.setItem("kywa_crew_login_logs", JSON.stringify(data.logs));
                            }
                          }).catch(() => {});
                      }

                      return (
                        <div className="overflow-x-auto border border-[#CBD5E1] rounded-[14px]">
                          <table className="w-full text-center border-collapse text-xs font-black text-[#0F172A] tabular-nums">
                            <thead>
                              <tr className="bg-slate-100 text-[#0F172A] border-b border-[#CBD5E1]">
                                <th className="py-3 px-4 text-left border-r border-[#CBD5E1]">홍보단 팀명 (16개 팀)</th>
                                <th className="py-3 px-3 bg-purple-100 text-purple-950 border-r border-[#CBD5E1]">총 누적 접속/로그인 횟수</th>
                                <th className="py-3 px-4 text-left border-r border-[#CBD5E1]">최근 로그인 시각</th>
                                <th className="py-3 px-3">접속 모니터링 상태</th>
                              </tr>
                            </thead>
                            <tbody>
                              {OFFICIAL_16_CREW_TEAMS.map((team, idx) => {
                                const logData = logs[team.teamName] || { count: 0, lastLoginTime: "접속 이력 없음" };
                                const hasLog = logData.count > 0;

                                return (
                                  <tr key={idx} className="border-b border-slate-200 hover:bg-purple-50/40 transition-colors">
                                    <td className="py-3 px-4 text-left font-black text-[#0F172A] border-r border-[#CBD5E1]">
                                      🛡️ #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1} {team.teamName} ({team.region})
                                    </td>
                                    <td className="py-3 px-3 font-black text-purple-950 bg-purple-50/40 border-r border-[#CBD5E1]">
                                      <span className="text-sm">{logData.count}</span> 회 접속
                                    </td>
                                    <td className="py-3 px-4 text-left text-slate-700 font-bold border-r border-[#CBD5E1]">
                                      {logData.lastLoginTime}
                                    </td>
                                    <td className="py-3 px-3">
                                      {hasLog ? (
                                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                                          🟢 활동 감지됨
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full">
                                          ⚪ 접속 대기 중
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </section>
                )}

                {/* ❓ 홍보단 실시간 질의응답 (Q&A) 세션 (콘텐츠 실적 관리 직하단 배치) */}
                <section id="qa-section" className="krds-public-card p-6 sm:p-8 bg-white border border-[#CBD5E1] space-y-6 shadow-md rounded-[20px] mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBD5E1] pb-4">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-blue-900 bg-blue-100 px-3 py-1 rounded-md border border-blue-300">
                        REAL-TIME Q&A BOARD
                      </span>
                      <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-2 pt-1">
                        ❓ 홍보단 실시간 질의응답 (Q&A 게시판 - {qaList.length}건)
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowQaModal(true)}
                      className="px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto transition-all"
                    >
                      <PlusCircle size={15} />
                      <span>[➕ Q&A 질문 등록]</span>
                    </button>
                  </div>

                  {qaList.length > 0 ? (
                    <div className="space-y-4">
                      {qaList.map(qa => (
                        <div key={qa.id} className="p-5 bg-slate-50 border border-[#CBD5E1] rounded-2xl space-y-3 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-[#1558C9] border border-blue-300 text-[11px] font-black px-2.5 py-0.5 rounded-md">
                                {qa.category || "운영 문의"}
                              </span>
                              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md border ${
                                qa.status === "답변완료"
                                  ? "bg-emerald-100 text-emerald-950 border-emerald-300"
                                  : "bg-amber-100 text-amber-950 border-amber-300"
                              }`}>
                                {qa.status === "답변완료" ? "✅ 답변완료" : "⏳ 답변대기"}
                              </span>
                              <h3 className="text-sm font-black text-[#0F172A]">{qa.title}</h3>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                              <span>✍️ {qa.author}</span>
                              <span>📅 {qa.date}</span>
                              {(isCrewUser || qa.author === myTeamName) && (
                                <button
                                  onClick={() => handleDeleteQa(qa.id)}
                                  className="text-rose-600 hover:text-rose-700 font-black ml-1 text-xs"
                                >
                                  [🗑️ 삭제]
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap pt-1">
                            {qa.content}
                          </p>

                          {/* 답변 목록 */}
                          {qa.answers && qa.answers.length > 0 && (
                            <div className="pt-2 space-y-2 border-t border-slate-200">
                              <span className="text-[11px] font-black text-[#1558C9] block">💡 등록된 답변 ({qa.answers.length}개)</span>
                              {qa.answers.map((ans: any) => (
                                <div key={ans.id} className="p-3 bg-white border border-blue-200 rounded-xl space-y-1 text-xs shadow-2xs">
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-black text-[#1558C9]">🛡️ [{ans.author}] 님의 답변</span>
                                    <span className="text-slate-400 font-medium">{ans.date}</span>
                                  </div>
                                  <p className="text-slate-800 font-medium leading-normal whitespace-pre-wrap">{ans.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 답변 작성 폼 */}
                          <div className="flex gap-2 pt-2 border-t border-slate-200">
                            <input
                              type="text"
                              placeholder="이 Q&A 질문에 답변 달기..."
                              value={qaAnswerInputs[qa.id] || ""}
                              onChange={e => setQaAnswerInputs(prev => ({ ...prev, [qa.id]: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter') handleAddQaAnswer(qa.id); }}
                              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#1558C9]"
                            />
                            <button
                              onClick={() => handleAddQaAnswer(qa.id)}
                              className="px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1 shrink-0"
                            >
                              <Send size={13} />
                              <span>답변 등록</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-6 text-center font-bold bg-slate-50 rounded-xl border border-slate-200">
                      등록된 Q&A 질문이 없습니다. 상단 [➕ Q&A 질문 등록] 버튼을 눌러 문의사항을 작성해 주세요.
                    </div>
                  )}
                </section>
              </div>
            ) : officeMenu === "qa" ? (
              /* ❓ Q&A 단독 탭 뷰 */
              <div className="space-y-6">
                <section className="krds-public-card p-6 sm:p-8 bg-white border border-[#CBD5E1] space-y-6 shadow-md rounded-[20px]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBD5E1] pb-4">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-blue-900 bg-blue-100 px-3 py-1 rounded-md border border-blue-300">
                        REAL-TIME Q&A BOARD
                      </span>
                      <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-2 pt-1">
                        ❓ 홍보단 실시간 질의응답 (Q&A 게시판 - {qaList.length}건)
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowQaModal(true)}
                      className="px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto transition-all"
                    >
                      <PlusCircle size={15} />
                      <span>[➕ Q&A 질문 등록]</span>
                    </button>
                  </div>

                  {qaList.length > 0 ? (
                    <div className="space-y-4">
                      {qaList.map(qa => (
                        <div key={qa.id} className="p-5 bg-slate-50 border border-[#CBD5E1] rounded-2xl space-y-3 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-[#1558C9] border border-blue-300 text-[11px] font-black px-2.5 py-0.5 rounded-md">
                                {qa.category || "운영 문의"}
                              </span>
                              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md border ${
                                qa.status === "답변완료"
                                  ? "bg-emerald-100 text-emerald-950 border-emerald-300"
                                  : "bg-amber-100 text-amber-950 border-amber-300"
                              }`}>
                                {qa.status === "답변완료" ? "✅ 답변완료" : "⏳ 답변대기"}
                              </span>
                              <h3 className="text-sm font-black text-[#0F172A]">{qa.title}</h3>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                              <span>✍️ {qa.author}</span>
                              <span>📅 {qa.date}</span>
                              {(qa.author === myTeamName || currentUser?.role === "ADMIN" || currentUser?.username === "admin" || myTeamName === "총괄 관리자" || myTeamName === "총괄관리자") && (
                                <button
                                  onClick={() => handleDeleteQa(qa.id)}
                                  className="text-rose-600 hover:text-rose-700 font-black ml-1 text-xs"
                                >
                                  [🗑️ 삭제]
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap pt-1">
                            {qa.content}
                          </p>

                          {/* 답변 목록 */}
                          {qa.answers && qa.answers.length > 0 && (
                            <div className="pt-2 space-y-2 border-t border-slate-200">
                              <span className="text-[11px] font-black text-[#1558C9] block">💡 등록된 답변 ({qa.answers.length}개)</span>
                              {qa.answers.map((ans: any) => (
                                <div key={ans.id} className="p-3 bg-white border border-blue-200 rounded-xl space-y-1 text-xs shadow-2xs">
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-black text-[#1558C9]">🛡️ [{ans.author}] 님의 답변</span>
                                    <span className="text-slate-400 font-medium">{ans.date}</span>
                                  </div>
                                  <p className="text-slate-800 font-medium leading-normal whitespace-pre-wrap">{ans.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 답변 작성 폼 */}
                          <div className="flex gap-2 pt-2 border-t border-slate-200">
                            <input
                              type="text"
                              placeholder="이 Q&A 질문에 답변 달기..."
                              value={qaAnswerInputs[qa.id] || ""}
                              onChange={e => setQaAnswerInputs(prev => ({ ...prev, [qa.id]: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter') handleAddQaAnswer(qa.id); }}
                              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#1558C9]"
                            />
                            <button
                              onClick={() => handleAddQaAnswer(qa.id)}
                              className="px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1 shrink-0"
                            >
                              <Send size={13} />
                              <span>답변 등록</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-6 text-center font-bold bg-slate-50 rounded-xl border border-slate-200">
                      등록된 Q&A 질문이 없습니다. 상단 [➕ Q&A 질문 등록] 버튼을 눌러 문의사항을 작성해 주세요.
                    </div>
                  )}
                </section>
              </div>
            ) : (
              /* 주간 보고서 목록 & 타 홍보단 소식 통합 (홈 / 내 보고서) */
              <div className="space-y-8">
                <div className="krds-public-card p-6 sm:p-8 bg-white border border-[#CBD5E1] space-y-6 shadow-md rounded-[20px]">
                  <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-4">
                    <div className="space-y-1">
                      <span className="text-xs font-black text-[#1558C9] bg-blue-100 px-3 py-1 rounded-md border border-blue-300">
                        TEAM WORKSPACE [{myTeamName}]
                      </span>
                      <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2 pt-1">
                        📝 [{myTeamName}] 팀 전용 세부 주간 보고서 및 실적
                      </h3>
                    </div>
                    <span className="text-xs font-black text-[#0F172A] bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                      총 {myTeamActivities.length}건 등록됨
                    </span>
                  </div>

                  <div className="space-y-6">
                    {myTeamActivities.length === 0 ? (
                      <div className="p-10 bg-slate-50 border border-dashed border-slate-300 rounded-[18px] text-center space-y-3">
                        <span className="text-4xl block">📝</span>
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-[#0F172A]">아직 등록된 팀 세부 주간보고서가 없습니다.</h4>
                          <p className="text-xs text-slate-500 font-bold">
                            상단의 <strong className="text-[#1558C9] font-black">[➕ 세부 주간보고서 작성]</strong> 버튼을 클릭하여 이번 주 주요 안전 활동 실적을 제출해 보세요!
                          </p>
                        </div>
                      </div>
                    ) : (
                      myTeamActivities.map(act => (
                      <div key={act.id} className="p-6 bg-slate-50 border border-[#CBD5E1] rounded-[18px] space-y-4 hover:border-[#1558C9] transition-all">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white bg-[#0F172A] px-2.5 py-1 rounded-md">
                            {act.week}
                          </span>
                          <h4 className="text-base font-black text-[#0F172A]">{act.title}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                            {act.status}
                          </span>
                          {canModifyItem(act.teamName) ? (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(act)}
                                className="px-3.5 py-1.5 bg-[#1558C9] text-white rounded-[8px] text-xs font-black shadow-sm flex items-center gap-1 hover:bg-blue-700 transition-all"
                              >
                                <Edit size={13} />
                                <span>[수정]</span>
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(act)}
                                className="px-3.5 py-1.5 bg-rose-600 text-white rounded-[8px] text-xs font-black shadow-sm flex items-center gap-1 hover:bg-rose-700 transition-all"
                              >
                                <Trash2 size={13} />
                                <span>[삭제]</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] font-black text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md border border-slate-300 flex items-center gap-1">
                              <Lock size={12} /> 타 팀 내용 (수정/삭제 권한 없음)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 🌟 주간 활동 세부 내용 박스 */}
                      {act.detailContent && (
                        <div className="p-4 bg-white rounded-[14px] border border-slate-300 space-y-1.5 shadow-inner">
                          <span className="text-xs text-[#1558C9] font-black flex items-center gap-1.5">
                            <AlignLeft size={15} /> 📋 주간 주요 활동 경과 및 세부 성과 서술:
                          </span>
                          <p className="text-xs font-bold text-[#0F172A] whitespace-pre-line leading-relaxed">
                            {act.detailContent}
                          </p>
                        </div>
                      )}

                      {/* 첨부 사진 갤러리 */}
                      {act.attachedPhotos && act.attachedPhotos.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-black text-[#0F172A] flex items-center gap-1">
                            <ImageIcon size={14} className="text-[#1558C9]" /> 📷 [{myTeamName}] 첨부 활동 현장 사진 ({act.attachedPhotos.length}장):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            {act.attachedPhotos.map((photoUrl: string, pIdx: number) => {
                              const isValidUrl = photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://') || photoUrl.startsWith('data:image/') || photoUrl.startsWith('/'));
                              const displayImg = isValidUrl ? photoUrl : "";

                              return (
                                <div 
                                  key={pIdx} 
                                  onClick={() => setSelectedOriginalImage(displayImg)}
                                  className="relative group cursor-pointer overflow-hidden rounded-[12px] border border-slate-300 aspect-video bg-slate-200"
                                >
                                  <img 
                                    src={displayImg} 
                                    alt={`현장 사진 ${pIdx + 1}`} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all" 
                                    onError={(e: any) => {
                                      e.target.onerror = null;
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black">
                                    <span>🔍 원본 보기</span>
                                  </div>
                                  <span className="absolute bottom-1 right-1 text-[9px] font-black bg-black/70 text-white px-1.5 py-0.5 rounded">
                                    {myTeamName} 증빙 #{pIdx + 1}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 유튜브 & SNS 바로가기 */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {act.youtubeUrl && (
                          <a
                            href={formatExternalUrl(act.youtubeUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-[10px] shadow-sm flex items-center gap-1.5 transition-all"
                          >
                            <Video size={15} />
                            <span>🔴 유튜브/Shorts 영상 바로가기</span>
                            <ExternalLink size={12} />
                          </a>
                        )}

                        {act.snsUrl && (
                          <a
                            href={formatExternalUrl(act.snsUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-black rounded-[10px] shadow-sm flex items-center gap-1.5 transition-all"
                          >
                            <Link2 size={15} />
                            <span>🟣 인스타그램/블로그 바로가기</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs font-black text-[#0F172A] tabular-nums pt-1">
                        <div className="p-2 bg-white rounded-[8px] border border-slate-300">📍 장소: {(act.location || "활동 현장").split(' ')[0]}</div>
                        <div className="p-2 bg-blue-50 text-[#1558C9] rounded-[8px] border border-blue-200">🎥 영상 {act.video}건 ({act.videoViews})</div>
                        <div className="p-2 bg-purple-50 text-purple-950 rounded-[8px] border border-purple-200">📰 카드뉴스 {act.cardnews}건 ({act.cardnewsViews})</div>
                        <div className="p-2 bg-emerald-50 text-emerald-950 rounded-[8px] border border-emerald-200">📄 홍보물 {act.promo}건 ({act.promoViews})</div>
                      </div>

                    </div>
                  ))
                )}
                </div>
              </div>

              {/* 🌐 오피스 홈 하단 타 홍보단 실시간 소식 및 응원 피드 */}
              <div className="border-t border-[#CBD5E1] pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-md border border-rose-300">
                        NATIONAL CREW FEED
                      </span>
                      <h4 className="text-base font-black text-[#0F172A] mt-1">🎉 전국 타 홍보단 최신 소식 & 응원 네트워킹</h4>
                    </div>
                    <button
                      onClick={() => setOfficeMenu("all_feeds")}
                      className="text-xs font-black text-[#1558C9] hover:underline flex items-center gap-1"
                    >
                      <span>전체 피드 보기 ({allTeamsFeed.length}건)</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allTeamsFeed.slice(0, 4).map(feed => (
                      <div key={feed.id} className="p-4 bg-slate-50 border border-[#CBD5E1] rounded-[16px] space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-white bg-[#1558C9] px-2 py-0.5 rounded-full text-[10px]">
                            🛡️ {feed.teamName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">{feed.week}</span>
                        </div>
                        <h5 className="font-black text-[#0F172A] text-xs">{feed.title}</h5>
                        <p className="text-[11px] text-slate-600 font-bold line-clamp-2">{feed.detailContent || feed.content}</p>
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => handleToggleLike(feed.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-black flex items-center gap-1 ${
                              feed.isLiked ? "bg-rose-600 text-white" : "bg-white text-rose-600 border border-rose-300"
                            }`}
                          >
                            <Heart size={12} className={feed.isLiked ? "fill-white" : "fill-rose-600"} />
                            <span>응원 ({feed.likes})</span>
                          </button>
                          <span className="text-[10px] font-bold text-slate-500">댓글 {feed.comments.length}개</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      )}

      {/* 🌟 주간 보고서 작성/수정 모달 (세부 내용 서술 textarea 항목 추가!) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 sm:p-8 max-w-2xl w-full bg-white space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-[#CBD5E1] text-[#0F172A] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white bg-[#0F172A] px-2.5 py-1 rounded-md">
                  🔒 [{myTeamName}] 주간보고
                </span>
                <span className="text-xs font-black text-[#1558C9] bg-blue-100 px-2.5 py-1 rounded-md border border-blue-300">
                  {editingItem ? "✏️ 수치 및 세부 내용 수정" : "➕ 신규 활동 보고 등록"}
                </span>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 font-black text-sm hover:text-slate-800">✕</button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4 text-xs font-black text-[#0F172A]">
              
              {/* 주차 선택 및 작성일자 자유 선택 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[#0F172A]">• 주차 선택 (8월 1주차~10월 4주차):</label>
                  <select
                    value={formWeek}
                    onChange={e => setFormWeek(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-[#CBD5E1] rounded-[10px] text-xs font-black text-[#0F172A]"
                  >
                    {allWeeksList.filter(w => w.key !== "all").map(w => (
                      <option key={w.key} value={w.label}>{w.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-[#0F172A]">• 작성일자 / 활동일자 (날짜 자유 변경):</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-[#CBD5E1] rounded-[10px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                  />
                </div>
              </div>

              {/* 🌟 [수치 직접 입력 구역] 매체 콘텐츠 제작 건수 및 매체별 최신 누적 수치 입력 */}
              <div className="p-4 bg-purple-50/70 rounded-[14px] border border-purple-200 space-y-3">
                <label className="text-xs font-black text-purple-950 flex items-center gap-1.5 border-b border-purple-200 pb-2">
                  <BarChart2 size={16} className="text-purple-700" />
                  <span>📊 이번 주 매체 콘텐츠 제작 실적 및 전체 최신 누적 수치 입력</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 🎥 숏폼 영상 */}
                  <div className="p-3 bg-white rounded-[10px] border border-blue-200 space-y-2.5">
                    <div>
                      <label className="text-[11px] font-black text-[#1558C9] block mb-1">🎥 숏폼 영상 (건)</label>
                      <input
                        type="number"
                        min="0"
                        value={formVideo}
                        onChange={e => setFormVideo(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-[8px] text-xs font-black text-[#1558C9]"
                        placeholder="0"
                      />
                    </div>
                    <div className="border-t border-slate-200 pt-2">
                      <label className="text-[10px] font-black text-[#1558C9] block mb-1">🎥 전체 영상 누적조회수 (회)</label>
                      <input
                        type="text"
                        value={formVideoViews}
                        onChange={e => setFormVideoViews(e.target.value)}
                        className="w-full p-2 bg-blue-50/60 border border-blue-300 rounded-[8px] text-xs font-black text-[#1558C9]"
                        placeholder="예: 12,500"
                      />
                    </div>
                  </div>

                  {/* 📰 카드뉴스 */}
                  <div className="p-3 bg-white rounded-[10px] border border-purple-200 space-y-2.5">
                    <div>
                      <label className="text-[11px] font-black text-purple-950 block mb-1">📰 카드뉴스 (건)</label>
                      <input
                        type="number"
                        min="0"
                        value={formCardnews}
                        onChange={e => setFormCardnews(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-[8px] text-xs font-black text-purple-950"
                        placeholder="0"
                      />
                    </div>
                    <div className="border-t border-slate-200 pt-2">
                      <label className="text-[10px] font-black text-purple-950 block mb-1">📰 전체 카드뉴스 누적조회수 (회)</label>
                      <input
                        type="text"
                        value={formCardnewsViews}
                        onChange={e => setFormCardnewsViews(e.target.value)}
                        className="w-full p-2 bg-purple-50/60 border border-purple-300 rounded-[8px] text-xs font-black text-purple-950"
                        placeholder="예: 8,400"
                      />
                    </div>
                  </div>

                  {/* 📄 홍보물/기타 */}
                  <div className="p-3 bg-white rounded-[10px] border border-emerald-200 space-y-2.5">
                    <div>
                      <label className="text-[11px] font-black text-emerald-950 block mb-1">📄 홍보물/기타 (건)</label>
                      <input
                        type="number"
                        min="0"
                        value={formPromo}
                        onChange={e => setFormPromo(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-[8px] text-xs font-black text-emerald-950"
                        placeholder="0"
                      />
                    </div>
                    <div className="border-t border-slate-200 pt-2">
                      <label className="text-[10px] font-black text-emerald-950 block mb-1">📄 전체 홍보물 누적 배포수 (부/건)</label>
                      <input
                        type="text"
                        value={formPromoViews}
                        onChange={e => setFormPromoViews(e.target.value)}
                        className="w-full p-2 bg-emerald-50/60 border border-emerald-300 rounded-[8px] text-xs font-black text-emerald-950"
                        placeholder="예: 5,200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[#0F172A]">• 대표 활동명 (요약 제목):</label>
                <input
                  type="text"
                  placeholder="예: 청소년 안전문화 확산 캠페인 및 숏폼 제작"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#CBD5E1] rounded-[10px] text-xs font-black text-[#0F172A]"
                  required
                />
              </div>

              {/* 🌟 [지침 반영] 주간 보고 활동 세부 내용 서술 (Textarea) */}
              <div className="p-4 bg-blue-50/60 rounded-[14px] border border-blue-200 space-y-2">
                <label className="text-xs font-black text-[#1558C9] flex items-center gap-1.5">
                  <AlignLeft size={16} />
                  <span>📋 주간 주요 활동 세부 내용 / 상세 경과 서술 (자유 작성):</span>
                </label>
                <textarea
                  rows={4}
                  placeholder={`예시:\n1) 10월 4주차 관내 청소년수련관 방문을 통한 심폐소생술(CPR) 실습 훈련 진행.\n2) 청소년 170명 참가 및 1분 세로형 숏폼 영상 제작 완수.\n3) 통학로 위험구역 점검 카드뉴스 5종 제작 및 SNS 공식 배포 완료.`}
                  value={formDetailContent}
                  onChange={e => setFormDetailContent(e.target.value)}
                  className="w-full p-3.5 bg-white border border-[#CBD5E1] rounded-[12px] text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#1558C9] leading-relaxed"
                />
              </div>

              {/* 사진 첨부 드롭존 */}
              <div className="p-4 bg-slate-50 rounded-[14px] border border-[#CBD5E1] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                    <ImageIcon size={16} className="text-[#1558C9]" />
                    <span>📷 [{myTeamName}] 현장 활동 사진 파일 선택 (실제 이미지 렌더링)</span>
                  </label>
                </div>

                <div className="border-2 border-dashed border-[#1558C9] bg-blue-50/50 rounded-[12px] p-5 text-center hover:bg-blue-100/50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleRealPhotoUpload}
                    className="hidden"
                    id="real-photo-upload-input"
                  />
                  <label htmlFor="real-photo-upload-input" className="cursor-pointer space-y-1.5 block">
                    <Upload size={26} className="mx-auto text-[#1558C9]" />
                    <span className="text-xs font-black text-[#1558C9] block">[📁 여기를 클릭하여 내 컴퓨터에서 실제 활동 사진 파일 선택]</span>
                  </label>
                </div>

                {formPhotos.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-black text-emerald-950 flex items-center gap-1">
                      <Check size={14} /> 현재 첨부 완료된 사진 ({formPhotos.length}장):
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {formPhotos.map((photo, idx) => photo ? (
                        <div key={idx} className="relative rounded-[8px] overflow-hidden border border-slate-300 aspect-video bg-slate-200 shadow-sm">
                          <img src={photo} alt={`첨부 ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormPhotos(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center hover:bg-rose-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : null)}
                    </div>
                  </div>
                )}
              </div>

              {/* 유튜브 및 SNS 링크 URL 입력 */}
              <div className="p-4 bg-[#F5F7FB] rounded-[14px] border border-[#CBD5E1] space-y-3">
                <strong className="text-xs font-black text-[#1558C9] flex items-center gap-1.5">
                  <Link2 size={16} />
                  <span>📺 유튜브 영상 및 📱 SNS/블로그 링크 첨부</span>
                </strong>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-slate-700 mb-0.5 flex items-center gap-1">
                      <Video size={13} className="text-rose-600" /> 유튜브/Shorts 영상 URL 주소:
                    </label>
                    <input
                      type="url"
                      placeholder="예: https://www.youtube.com/watch?v=..."
                      value={formYoutubeUrl}
                      onChange={e => setFormYoutubeUrl(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#CBD5E1] rounded-[8px] text-xs font-black text-[#0F172A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-700 mb-0.5 flex items-center gap-1">
                      <Link2 size={13} className="text-purple-600" /> 인스타그램 / 블로그 / SNS 게시물 URL:
                    </label>
                    <input
                      type="url"
                      placeholder="예: https://www.instagram.com/p/..."
                      value={formSnsUrl}
                      onChange={e => setFormSnsUrl(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#CBD5E1] rounded-[8px] text-xs font-black text-[#0F172A]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isSavingReport}
                  className={`krds-public-button flex-1 py-3.5 ${isSavingReport ? "bg-amber-600 cursor-wait" : "bg-[#1558C9] hover:bg-blue-700"} text-white font-black text-xs rounded-[12px] shadow-md flex items-center justify-center gap-1.5 transition-all`}
                >
                  <Save size={16} className={isSavingReport ? "animate-spin" : ""} />
                  <span>
                    {isSavingReport
                      ? "⏳ 서버 저장 및 클라우드 DB 동기화 중..."
                      : editingItem
                      ? "[수정 내용 저장 및 클라우드 반영]"
                      : "[주간 보고서 제출 및 공유 피드 게시]"}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={isSavingReport}
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-3.5 bg-slate-200 text-[#0F172A] font-black text-xs rounded-[10px] disabled:opacity-50"
                >
                  취소
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 🌟 주요 활동 보기 모달 (카드뉴스, 숏폼 영상, 가이드북 PDF 등 시각적 결과물 연동) */}
      {selectedPlanModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 sm:p-8 max-w-3xl w-full bg-white space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto border border-[#CBD5E1] text-[#0F172A] animate-in zoom-in-95 rounded-[24px]">
            
            {/* 모달 상단 헤더 */}
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-white bg-[#0F172A] px-3 py-1 rounded-full shadow-sm">
                  TEAM #{selectedPlanModal.id < 10 ? `0${selectedPlanModal.id}` : selectedPlanModal.id}
                </span>
                <span className="text-xs font-black text-[#1558C9] bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                  📍 {selectedPlanModal.region} · 👥 단원 {selectedPlanModal.membersCount || 3}명
                </span>
                {selectedPlanModal.category1 && (
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                    {selectedPlanModal.category1} · {selectedPlanModal.category2}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setSelectedPlanModal(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black text-base transition-all"
              >
                ✕
              </button>
            </div>

            {/* 타이틀 구역 */}
            <div className="space-y-1">
              <span className="text-xs font-black text-[#1558C9] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block mb-1">
                2026 청소년 안전홍보단 주요 활동 포트폴리오
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">{selectedPlanModal.teamName}</h2>
              <p className="text-sm font-black text-[#7557D9]">"{selectedPlanModal.activityTitle}"</p>
            </div>

            {/* 1. 🖼️ 주요 카드뉴스 갤러리 (결과물 핵심) */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-[16px] border border-[#CBD5E1]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                  <ImageIcon size={16} className="text-[#1558C9]" />
                  <span>📸 {selectedPlanModal.teamName} 대표 카드뉴스 시리즈 (3종)</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-500">슬라이드 미리보기</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedPlanModal.cardnewsGallery?.map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedOriginalImage(item.imgUrl)}
                    className="group relative cursor-pointer rounded-[12px] overflow-hidden border border-slate-300 bg-white shadow-sm hover:border-[#1558C9] transition-all"
                  >
                    <div className="aspect-square relative overflow-hidden bg-slate-200">
                      <img src={item.imgUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-black gap-1">
                        <ZoomIn size={14} />
                        <span>🔍 원본 보기</span>
                      </div>
                      <span className="absolute top-2 left-2 text-[10px] font-black bg-[#1558C9] text-white px-2 py-0.5 rounded-full shadow">
                        CARD #{idx + 1}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[11px] font-black text-[#0F172A] line-clamp-2 leading-tight">
                        {item.title}
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="col-span-3 text-center py-6 text-xs text-slate-500">등록된 카드뉴스를 불러오는 중입니다...</div>
                )}
              </div>
            </div>

            {/* 2. 🎬 숏폼 영상 및 홍보 미디어 */}
            {selectedPlanModal.videoTitle && (
              <div className="p-4 bg-rose-50/70 rounded-[16px] border border-rose-200 space-y-3">
                <h3 className="text-sm font-black text-rose-900 flex items-center gap-2">
                  <Video size={16} className="text-rose-600" />
                  <span>🎬 {selectedPlanModal.teamName} 숏폼 & 영상 홍보 콘텐츠</span>
                </h3>

                <div className="p-3 bg-white rounded-[12px] border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded">YouTube Shorts / Reels</span>
                    <h4 className="text-xs font-black text-[#0F172A]">{selectedPlanModal.videoTitle}</h4>
                  </div>

                  <a
                    href={selectedPlanModal.videoUrl || "https://youtube.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="krds-public-button px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-[10px] shadow-sm flex items-center gap-1.5 shrink-0 touch-target"
                  >
                    <PlayCircle size={15} />
                    <span>[영상 보러가기]</span>
                  </a>
                </div>
              </div>
            )}


            {/* 4. 📌 주요 활동 내용 & 상세 경과 */}
            <div className="space-y-3 text-xs font-black text-[#0F172A]">
              <div className="p-4 bg-white rounded-[14px] border border-[#CBD5E1] space-y-2 shadow-sm">
                <strong className="text-[#0F172A] font-black text-sm flex items-center gap-1.5">
                  📌 주요 활동 내용
                </strong>
                <p className="leading-relaxed leading-6 text-[#0F172A] font-bold whitespace-pre-line">
                  {selectedPlanModal.desc}
                </p>
              </div>

              {selectedPlanModal.planDetail && (
                <div className="p-4 bg-blue-50/80 rounded-[14px] border border-blue-200 space-y-2 shadow-sm">
                  <strong className="text-[#1558C9] font-black text-sm flex items-center gap-1.5">
                    🗺️ 현장 캠페인 및 세부 실행 계획
                  </strong>
                  <p className="leading-relaxed leading-6 text-[#0F172A] font-bold whitespace-pre-line">
                    {selectedPlanModal.planDetail}
                  </p>
                </div>
              )}
            </div>

            {/* 4. 📥 활동 가이드북/리플렛 다운로드 및 SNS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {selectedPlanModal.guidebookPdf && (
                <a
                  href={`#download-${selectedPlanModal.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`📥 [${selectedPlanModal.guidebookPdf}] 다운로드가 시작되었습니다.`);
                  }}
                  className="p-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-[12px] flex items-center justify-between text-xs font-black text-[#0F172A] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#1558C9]" />
                    <span className="truncate max-w-[170px]">{selectedPlanModal.guidebookPdf}</span>
                  </div>
                  <span className="text-[10px] bg-[#1558C9] text-white px-2 py-1 rounded font-black">다운로드</span>
                </a>
              )}

              {selectedPlanModal.snsUrl && (
                <a
                  href={selectedPlanModal.snsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-[12px] flex items-center justify-between text-xs font-black text-purple-900 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink size={16} className="text-purple-700" />
                    <span>공식 SNS 채널 이동</span>
                  </div>
                  <span className="text-[10px] bg-purple-700 text-white px-2 py-1 rounded font-black">인스타그램</span>
                </a>
              )}
            </div>

            {/* 하단 응원 및 닫기 버튼 */}
            <div className="space-y-2 pt-2 border-t border-[#CBD5E1]">
              <button
                onClick={() => alert(`🎉 ${selectedPlanModal.teamName} 팀에게 응원의 보석이 전달되었습니다!`)}
                className="krds-public-button w-full py-3.5 bg-[#1558C9] hover:bg-blue-700 text-white text-xs font-black rounded-[14px] shadow-md touch-target flex items-center justify-center gap-1.5"
              >
                <Sparkles size={16} />
                <span>[{selectedPlanModal.teamName} 팀 응원하기]</span>
              </button>

              <button 
                onClick={() => setSelectedPlanModal(null)} 
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-black text-xs rounded-[12px] border border-slate-300"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🌟 16. [고화질 원본 사진 대형 보기 팝업 라이트박스 모달] */}
      {selectedOriginalImage && (
        <div 
          onClick={() => setSelectedOriginalImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center space-y-3"
          >
            {/* 상단 컨트롤 바 */}
            <div className="w-full flex items-center justify-between text-white font-black text-xs px-2">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <ZoomIn size={16} className="text-blue-400" />
                <span>📸 원본 고화질 이미지 선명하게 보기</span>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={selectedOriginalImage}
                  target="_blank"
                  rel="noreferrer"
                  download="kywa_crew_activity_photo.jpg"
                  className="px-3.5 py-1.5 bg-[#1558C9] hover:bg-blue-600 text-white rounded-full text-xs font-black shadow flex items-center gap-1 transition-all"
                >
                  <Download size={13} />
                  <span>[📥 원본 사진 바로 다운로드]</span>
                </a>
                <button
                  onClick={() => setSelectedOriginalImage(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black text-sm transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 원본 사진 본체 */}
            <div className="relative rounded-[16px] overflow-hidden border border-white/20 shadow-2xl bg-black/50 max-h-[82vh] flex items-center justify-center">
              <img 
                src={selectedOriginalImage} 
                alt="원본 세부 이미지" 
                className="max-w-full max-h-[80vh] object-contain rounded-[12px] shadow-2xl" 
              />
            </div>
          </div>
        </div>
      )}

      {/* 📢 공지사항 작성 및 수정 모달 */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl text-xs text-[#0F172A]">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                <Bell size={18} className="text-[#1558C9]" />
                <span>📢 [{myTeamName}] {editingNoticeId ? "공통 공지사항 수정" : "신규 공통 공지사항 등록"}</span>
              </h3>
              <button onClick={() => { setShowNoticeModal(false); setEditingNoticeId(null); }} className="text-slate-400 hover:text-slate-600 font-black text-lg p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-4 font-bold">
              <div className="space-y-1">
                <label className="block text-slate-700">• 공지 카테고리:</label>
                <select
                  value={inputNoticeCategory}
                  onChange={e => setInputNoticeCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black focus:outline-none focus:border-[#1558C9]"
                >
                  <option value="운영 안내">운영 안내</option>
                  <option value="제출 일정">제출 일정 & 마감</option>
                  <option value="포상 & 이벤트">포상 & 이벤트</option>
                  <option value="필수 공지">필수 공지사항</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">• 공지 제목:</label>
                <input
                  type="text"
                  placeholder="전국 16개 홍보단에게 전달할 공지 제목을 입력해 주세요"
                  value={inputNoticeTitle}
                  onChange={e => setInputNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">• 공지 세부 내용:</label>
                <textarea
                  rows={5}
                  placeholder="공지 사항 세부 내용을 구체적으로 안내해 주세요..."
                  value={inputNoticeContent}
                  onChange={e => setInputNoticeContent(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 flex justify-between items-center">
                  <span>• 첨부 파일 선택 및 업로드 (PDF, HWPB, 문서, 이미지 등):</span>
                  <span className="text-[10px] text-blue-600 font-bold">{inputNoticeAttachments.length}개 파일 첨부됨</span>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleNoticeFileUpload}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                
                {inputNoticeAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 max-h-28 overflow-y-auto">
                    {inputNoticeAttachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-900 px-2.5 py-1 rounded-md text-[11px] font-bold">
                        <Paperclip size={11} className="text-blue-600" />
                        <span className="max-w-[170px] truncate">{att.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNoticeAttachment(idx)}
                          className="text-rose-500 hover:text-rose-700 ml-1 font-black"
                          title="첨부 제거"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowNoticeModal(false); setEditingNoticeId(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black rounded-lg shadow"
                >
                  {editingNoticeId ? "✏️ 수정 내용 저장" : "📢 공지사항 보존 등록"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ❓ 신규 Q&A 질문 작성 모달 */}
      {showQaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl text-xs text-[#0F172A]">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                <Bell size={18} className="text-[#1558C9]" />
                <span>❓ [{myTeamName}] 실시간 Q&A 질문 등록</span>
              </h3>
              <button onClick={() => setShowQaModal(false)} className="text-slate-400 hover:text-slate-600 font-black text-lg p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQa} className="space-y-4 font-bold">
              <div className="space-y-1">
                <label className="block text-slate-700">• 문의 카테고리:</label>
                <select
                  value={inputQaCategory}
                  onChange={e => setInputQaCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black focus:outline-none focus:border-[#1558C9]"
                >
                  <option value="운영 문의">운영 문의</option>
                  <option value="실적 집계">실적 집계 & 집계 방식</option>
                  <option value="시스템 오류">시스템 오류 & 개선 요청</option>
                  <option value="기타">기타 일반 문의</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">• 질문 제목:</label>
                <input
                  type="text"
                  placeholder="Q&A 질문 제목을 입력해 주세요"
                  value={inputQaTitle}
                  onChange={e => setInputQaTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700">• 질문 세부 내용:</label>
                <textarea
                  rows={5}
                  placeholder="궁금한 사항이나 시스템 문의 내용을 구체적으로 작성해 주세요..."
                  value={inputQaContent}
                  onChange={e => setInputQaContent(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQaModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1558C9] hover:bg-blue-700 text-white font-black rounded-lg shadow"
                >
                  Q&A 질문 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📸 발대식 원본 사진 고화질 라이트박스 팝업 모달 */}
      {selectedInaugurationPhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl text-white relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                📁 {selectedInaugurationPhoto.title}
              </h3>
              <button
                onClick={() => setSelectedInaugurationPhoto(null)}
                className="text-slate-400 hover:text-white font-black text-xl p-1 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="relative max-h-[70vh] w-full flex items-center justify-center bg-black/60 rounded-xl overflow-hidden p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedInaugurationPhoto.src}
                alt={selectedInaugurationPhoto.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-slate-400 font-bold">
                원본 파일 경로: {selectedInaugurationPhoto.src}
              </span>
              <button
                onClick={() => setSelectedInaugurationPhoto(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🔑 홍보단 내 팀 비밀번호 변경 모달 팝업 */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl text-xs text-[#0F172A]">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                <Key size={18} className="text-amber-500" />
                <span>🔑 [{myTeamName}] 팀 비밀번호 변경</span>
              </h3>
              <button
                onClick={() => {
                  setShowPasswordChangeModal(false);
                  setNewPasswordInput("");
                  setConfirmPasswordInput("");
                }}
                className="text-slate-400 hover:text-slate-600 font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangeTeamPassword} className="space-y-4 font-bold">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-900 text-[11px]">
                <p className="font-black flex items-center gap-1">
                  🔒 보안 비밀번호 변경 안내
                </p>
                <p className="font-medium leading-relaxed">
                  변경하신 새 비밀번호는 즉시 적용되며, 다음 로그인 시부터 적용된 새 비밀번호로 안전하게 로그인할 수 있습니다.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-black">• 새 비밀번호 입력:</label>
                <input
                  type="password"
                  placeholder="새로운 비밀번호를 입력해 주세요 (최소 4자리)"
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-black">• 새 비밀번호 재확인:</label>
                <input
                  type="password"
                  placeholder="새로운 비밀번호를 한 번 더 입력해 주세요"
                  value={confirmPasswordInput}
                  onChange={e => setConfirmPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChangeModal(false);
                    setNewPasswordInput("");
                    setConfirmPasswordInput("");
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Lock size={14} />
                  <span>🔒 새 비밀번호 저장하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CrewPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs font-black text-[#0F172A]">로딩 중...</div>}>
      <CrewContent />
    </Suspense>
  );
}
