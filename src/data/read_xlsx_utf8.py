import sys
import os
import pandas as pd

try:
    # 엑셀 데이터 읽기
    df = pd.read_excel(r"c:\Users\pheon\청소년활동진흥원\20260713_안전홍보단 지원신청서 명단 요약본(내부용) (1).xlsx")
    # 파일로 쓰기 (UTF-8 인코딩)
    out_path = r"c:\Users\pheon\청소년활동진흥원\extracted_xlsx_utf8.txt"
    df.to_csv(out_path, index=False, encoding="utf-8")
    print(f"Success! CSV saved to {out_path}")
except Exception as e:
    print("Error:", e)
