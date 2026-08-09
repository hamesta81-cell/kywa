import json

log_path = r"C:\Users\pheon\.gemini\antigravity-ide\brain\36d3f4a8-8d6b-45e7-b607-e94aaf92097c\.system_generated\logs\transcript.jsonl"
target_file_path = r"c:\Users\pheon\청소년활동진흥원\2026_안전문화확산사업_제안서_recovered2.md"

with open(log_path, 'rb') as f:
    for i, line_bytes in enumerate(f):
        if i == 506:
            # Parse step 506 raw JSON
            step = json.loads(line_bytes.decode('utf-8', errors='ignore'))
            content = step.get("content", "")
            # Write raw content to a file to check if it's broken
            with open(target_file_path, 'w', encoding='utf-8') as out_f:
                out_f.write(content)
            print("Wrote step 506 content. size:", len(content))
            # Print a few lines safely
            lines = content.split('\n')
            for l in lines[:10]:
                print(l.encode('utf-8', errors='ignore').decode('utf-8', errors='ignore'))
            break
