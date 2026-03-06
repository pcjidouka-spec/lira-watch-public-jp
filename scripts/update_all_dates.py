import re

with open('data/articles.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r"date:\s*'\d{4}/\d{2}/\d{2}',", "date: '2026/03/06',", c)

with open('data/articles.ts', 'w', encoding='utf-8') as f:
    f.write(c)
print("Updated all dates to 2026/03/06")
