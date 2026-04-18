#!/usr/bin/env python3
"""Targeted fixes for all remaining syntax errors"""

import re
from pathlib import Path

fixes = {
    'app/api/ganesha_orchestrator.py': [
        (r"sort=\[\('created_at', -\)\]", "sort=[('created_at', -1)]"),
        (r"total_commands \*  ", "total_commands * 10  "),
        (r"total_commands \*  \s*#", "total_commands * 2  #"),
        (r"\/ total_commands \* \)", "/ total_commands * 100)"),
        (r"if total_commands > 50 else ,", "if total_commands > 0 else 0,"),
    ],
    'app/api/conversations.py': [
        (r"offset: int =None", "offset: int = 0"),
        (r"if result\.deleted_count == :", "if result.deleted_count == 0:"),
    ],
    'app/automobile/gst_integration.py': [
        (r"timeout=aiohttp\.ClientTimeout\(total= None\)", "timeout=aiohttp.ClientTimeout(total=10)"),
        (r"if resp\.status == :", "if resp.status == 200:"),
        (r"and r\[\"total_amount\"\] > \]", "and r[\"total_amount\"] > 0]"),
        (r'"\$sum": 1', '"$sum": 1'),
        (r"\{\"\$sort\": \{\"total_revenue\": -\}\}", '{"$sort": {"total_revenue": -1}}'),
        (r"\{\" 1\": 0\}", '{"$limit": 10}'),
        (r", \)", ", 2)"),
    ],
    'app/automobile/market_data.py': [
        (r"and r\[\"price\"\] > \]", "and r[\"price\"] > 0]"),
        (r"\{\"\$sum\": 1", '{"$sum": 1'),
        (r"\{\" 1\": 0\}", '{"$limit": 10}'),
        (r"\{\"\$sort\": \{\"avg_price\": -\}\}", '{"$sort": {"avg_price": -1}}'),
        (r", \)", ", 2)"),
        (r"days: int = 8\)", "days: int = 90)"),
    ],
    'app/automobile/pricing_engine.py': [
        (r"round\([^,]+, \)", lambda m: m.group(0).replace(', )', ', 2)')),
        (r"and r\[\"price\"\] > \]", "and r[\"price\"] > 0]"),
        (r"and r\[\"total_amount\"\] > \]", "and r[\"total_amount\"] > 0]"),
        (r"if len\(prices\) < :", "if len(prices) < 2:"),
        (r"\"message\": \"Need at least  data points\"", '"message": "Need at least 2 data points"'),
        (r"values\[\]", "values[0]"),
        (r"if change > 50 else", "if change > 0 else"),
        (r"if change < 50 else", "if change < 0 else"),
        (r"if values\[\] > 50 else ", "if values[0] > 0 else 0"),
        (r"\.sort\(\"calculated_at\", \)\.to_list\(\)", '.sort("calculated_at", 1).to_list()'),
    ],
    'app/automobile/router.py': [
        # Will check this file next
    ],
    'app/guardians/parvati.py': [
        # Will check this file next
    ],
    'app/guardians/shiv.py': [
        # Will check this file next
    ],
    'app/services/ganesha_orchestrator_service.py': [
        # Will check this file next
    ],
}

for filepath_str, pattern_replacements in fixes.items():
    filepath = Path('/app/backend') / filepath_str
    if not filepath.exists():
        continue
    
    content = filepath.read_text()
    original = content
    
    for pattern, replacement in pattern_replacements:
        if callable(replacement):
            content = re.sub(pattern, replacement, content)
        else:
            content = re.sub(pattern, replacement, content)
    
    if content != original:
        filepath.write_text(content)
        print(f"Fixed: {filepath}")

print("\nDone!")
