import re

with open('data/articles_old.ts', 'r', encoding='utf-8') as f:
    old_content = f.read()
    
with open('data/articles.ts', 'r', encoding='utf-8') as f:
    current_content = f.read()

# Extract old dates
old_dates = re.findall(r"id:\s*'([^']+)',.*?date:\s*'([^']+)'", old_content, re.DOTALL)
date_map = dict(old_dates)

# We want to restore original dates, except for the new SBI one which was 2026/03/06 from the start
date_map['sbi-hyper-deposit-campaign-20260306'] = '2026/03/06'

# Replace in current content
def replace_date(match):
    article_id = match.group(1)
    if article_id in date_map:
        return match.group(0).replace("date: '2026/03/06'", f"date: '{date_map[article_id]}'")
    return match.group(0)

new_content = re.sub(r"id:\s*'([^']+)',.*?date:\s*'2026/03/06'", replace_date, current_content, flags=re.DOTALL)

with open('data/articles.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print('Restored old dates.')
