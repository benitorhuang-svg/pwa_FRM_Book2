import json
import os

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
# Navigate to the data directory relative to the script
data_dir = os.path.abspath(os.path.join(script_dir, "..", "public", "data"))
output_file = os.path.join(data_dir, "chapters.json")

chapters = []
for i in range(1, 13):
    filename = f"chapters_b2_ch{i}.json"
    filepath = os.path.join(data_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            chapters.append(json.load(f))
    else:
        print(f"Warning: {filename} not found.")

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(chapters, f, ensure_ascii=False, indent=2)

print(f"Successfully merged {len(chapters)} chapters into {output_file}")
