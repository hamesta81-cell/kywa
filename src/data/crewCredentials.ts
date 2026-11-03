// 관리자·16개 홍보단 로그인 비밀번호의 scrypt 해시(2026-11-03 새로 발급). 원문은 저장소에 두지 않는다.
// 팀이 직접 바꾼 비밀번호는 영구 디스크 private/crew_password_hashes.json 에 해시로 저장되어 이 값보다 우선한다.
export const ADMIN_PASSWORD_HASH = "scrypt$pXTAClGgzcucZnvqYU4XRA==$wFk9SsuDeOAY8QO7BaaskG8Phltcr1F9S54XTWpksCU=";

export const CREW_PASSWORD_HASHES: Record<number, string> = {
  1: "scrypt$5e7pFR2VHXtNOISHOZCwSw==$Q25YdWsgVseN2W/gFPnL1kyYQu0B7Z19Am+bSFq+zcQ=", // SAFE CREW
  2: "scrypt$cadYod4oqEeO5YRrp9mngA==$c265YMujJaq2OViePHKZOSQXxfu0CoNKXSjO14qFF7A=", // safe frame
  3: "scrypt$YfNIBJfTF5JfRJuapoWYJg==$MOzC2hQmEr7Byk90gzi+FiEeRbA44oISgd4iLbzkN3M=", // 청유
  4: "scrypt$wAVkT3nLSxl52NQytm00Kg==$jg3i18xLI0/lwv+nE8jSaQwsyBk6v3SWIZ3jqC4yJdM=", // 디지털 쉼표
  5: "scrypt$zNgqcaKFKnHDUDexbH8wdQ==$uM10d79ZTVDkTkadZw4UAmsRx/RuMOe30cuRBJAV3Po=", // 라이트(light)
  6: "scrypt$74c5GOr4mErRe3bMdOqw+w==$0BA9MwshVfUw5L39DW40WMHmQMVkWplcJ39XQZq8/mQ=", // 세이프 리더스
  7: "scrypt$TZ05LTEauUcOGU2xyHoS8A==$V1lBTzHbcqkRADyl/Kr8agvp2KsFABLrg+UIbtZIeqM=", // 심리지원단 파인 (PINE)
  8: "scrypt$moekcLr+bj9HHF5H4AEwKA==$TmGfe5i9GUgFN7tEHMGZJCYpZlrASuQGzIOXMtapHaQ=", // 안심ON ('안전'과 '마음(心)'을 켜다.)
  9: "scrypt$3cwTy4uP5RxvigIt8RNDcg==$pw7kxPftLbQpFOGnHvK/m04/r1F/2RDOF62UadHEkAw=", // 안전 탭앤톡 (Tap and Talk)
  10: "scrypt$9UnUy66SyosE7im9w0HUPg==$8c+Tt7EVY/VSh1X2Ydk3B/LG4pls8siwgT2JMOP56nQ=", // 안전.zip
  11: "scrypt$IJVOVakgSbBxNsTbx896Hw==$b/uLKxmkNcj577Z8qrRFjyjMIheHCef/WAR19F6LCLw=", // 안전지킴이 「청소년서포터즈 Y.E.S 6기」
  12: "scrypt$ePOphB7/rYGWi/3FEI8XlA==$x/QaK4T6Gl/v58nqggpL0PawP6adn5c+r7rmqb+pgXQ=", // 우송대학교 아고라
  13: "scrypt$yZj6ElXmQDFXmbZpz7NZMQ==$QYBw8jQ9QeUpEqQuM5+k4iEY5gGpnsuwzpimbZXtTKk=", // 웰빙 크루
  14: "scrypt$wgjA4Zt8TIImiErmvgM2mw==$Q/xCqFf5c5APfSpoTZK0cSx7TgYyIxNqG9hA4SRP0S8=", // 이투스
  15: "scrypt$oPQBTGsDcNYeJxrByHpHWA==$q5gTDMcKkU2yNvKCTPLDSNtZsrb8Mp/U68FZYL1iHI8=", // 청디가드
  16: "scrypt$L8550cHcUcoYuS1n/2CoIg==$BfSkVOpl0oxrn6jBFQdeswJhJWdpuUCNegOhf7u6Mj4=", // 한라우 안전활동가
};
