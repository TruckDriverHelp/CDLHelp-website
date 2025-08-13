import json
import csv
import os

# Directory containing JSON files
root_dir = './'  # Change this to your actual root directory if needed

# Process each JSON file in the root directory
for filename in os.listdir(root_dir):
    if filename.endswith('.json'):
        json_path = os.path.join(root_dir, filename)
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Prepare output CSV filename
        csv_filename = os.path.splitext(filename)[0] + '.csv'
        csv_path = os.path.join(root_dir, csv_filename)

        # Flatten the data
        rows = []
        for section in data.get('section', []):
            title_en = section['title'].get('en', '')
            title_ru = section['title'].get('ru', '')
            title_cir = section['title'].get('cir', '')
            notes_en = section['notes'].get('en', '')
            notes_ru = section['notes'].get('ru', '')
            notes_cir = section['notes'].get('cir', '')

            for item in section.get('text', []):
                row = {
                    'Section Title (EN)': title_en,
                    'Section Title (RU)': title_ru,
                    'Section Title (CIR)': title_cir,
                    'Notes (EN)': notes_en,
                    'Notes (RU)': notes_ru,
                    'Notes (CIR)': notes_cir,
                    'Text (EN)': item.get('en', ''),
                    'Text (RU)': item.get('ru', ''),
                    'Text (CIR)': item.get('cir', ''),
                    'Text (UK)': item.get('uk', ''),
                    'Text (UZB)': item.get('uzb', '')
                }
                rows.append(row)

        # Write to CSV
        with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = rows[0].keys() if rows else []
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

        print(f"CSV file '{csv_filename}' generated successfully.")
