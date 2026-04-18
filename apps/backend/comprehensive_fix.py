#!/usr/bin/env python3
"""
Comprehensive fix for ALL corruption patterns
"""

import re
from pathlib import Path

def comprehensive_fix(content):
    """Apply all known fixes"""
    
    # Fix min/max with missing first argument
    content = re.sub(r'min\(,\s*', 'min(100, ', content)
    content = re.sub(r'max\(,\s*', 'max(0, ', content)
    
    # Fix ranges and limits
    content = re.sub(r'limit:\s*int\s*=\s*None', 'limit: int = 10', content)
    content = re.sub(r'range\(\s*None\s*\)', 'range(10)', content)
    
    # Fix percentages
    content = re.sub(r'"value":\s*9([,\}])', r'"value": 92\1', content)
    
    # Fix power operators
    content = re.sub(r'\*\*\s+for', r'** 2 for', content)
    
    # Fix division
    content = re.sub(r'/\s+\)', r'/ 10)', content)
    content = re.sub(r'/\s+\}\s*#', r'/ 10}  #', content)
    
    # Fix timedelta
    content = re.sub(r'timedelta\(hours=\s*None\)', 'timedelta(hours=1)', content)
    
    # Fix model names and parameters
    content = re.sub(r'claude-3-haiku-43', 'claude-3-haiku-20240307', content)
    content = re.sub(r'max_tokens=8([,\s])', r'max_tokens=800\1', content)
    content = re.sub(r'temperature=\.([,\s])', r'temperature=0.7\1', content)
    
    # Fix comparison operators
    content = re.sub(r'==\s+else', r'== 0 else', content)
    content = re.sub(r'>\s+else', r'> 50 else', content)
    
    # Fix string slicing
    content = re.sub(r'\[:\]', '[:]', content)
    
    # Fix increment/decrement
    content = re.sub(r'"active_tasks":\s*-\}', r'"active_tasks": -1}', content)
    content = re.sub(r'"active_tasks":\s*-,', r'"active_tasks": -1,', content)
    content = re.sub(r'"completed_today":\s*\n', r'"completed_today": 1\n', content)
    
    # Fix sleep with decimal
    content = re.sub(r'asyncio\.sleep\(\.\)', 'asyncio.sleep(0.05)', content)
    content = re.sub(r'sleep\(\.\)', 'sleep(0.05)', content)
    
    # Fix decimal temperatures and rates
    content = re.sub(r'temperature=\.$', 'temperature=0.7', content)
    content = re.sub(r'temperature=\.\s', 'temperature=0.7 ', content)
    
    return content

def main():
    backend = Path('/app/backend')
    
    fixed_count = 0
    for pyfile in backend.rglob('*.py'):
        if '__pycache__' in str(pyfile) or 'fix' in pyfile.name:
            continue
        
        try:
            original = pyfile.read_text()
            fixed = comprehensive_fix(original)
            
            if fixed != original:
                pyfile.write_text(fixed)
                print(f"Fixed: {pyfile}")
                fixed_count += 1
        except Exception as e:
            print(f"Error with {pyfile}: {e}")
    
    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
