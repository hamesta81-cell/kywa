import sys
import os

try:
    import pandas as pd
    df = pd.read_excel(r"c:\Users\pheon\청소년활동진흥원\20260713_안전홍보단 지원신청서 명단 요약본(내부용) (1).xlsx")
    print("=== PANDAS OUTPUT ===")
    print(df.to_string())
except Exception as e:
    print("Pandas failed:", e)
    try:
        import openpyxl
        wb = openpyxl.load_workbook(r"c:\Users\pheon\청소년활동진흥원\20260713_안전홍보단 지원신청서 명단 요약본(내부용) (1).xlsx")
        sheet = wb.active
        print("=== OPENPYXL OUTPUT ===")
        for r in sheet.iter_rows(values_only=True):
            if any(r):
                print(r)
    except Exception as e2:
        print("Openpyxl failed:", e2)
        # raw zipfile fallback
        import zipfile
        import xml.etree.ElementTree as ET
        print("=== ZIPFILE FALLBACK ===")
        with zipfile.ZipFile(r"c:\Users\pheon\청소년활동진흥원\20260713_안전홍보단 지원신청서 명단 요약본(내부용) (1).xlsx") as z:
            # Read shared strings
            shared_strings = []
            if "xl/sharedStrings.xml" in z.namelist():
                strings_xml = z.read("xl/sharedStrings.xml")
                root = ET.fromstring(strings_xml)
                for t in root.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"):
                    shared_strings.append(t.text)
            
            # Read sheet1
            sheet_xml = z.read("xl/worksheets/sheet1.xml")
            root = ET.fromstring(sheet_xml)
            for row in root.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row"):
                row_data = []
                for cell in row.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"):
                    val_el = cell.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
                    if val_el is not None:
                        val = val_el.text
                        t = cell.get("t")
                        if t == "s":
                            val = shared_strings[int(val)]
                        row_data.append(val)
                    else:
                        row_data.append("")
                if any(row_data):
                    print(row_data)
