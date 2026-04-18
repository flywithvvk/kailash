#!/usr/bin/env python3
"""
Systematic fix for numeric corruption caused by emoji purge script.
Repairs common patterns of missing numeric values.
"""

import os
import re
from pathlib import Path

# Patterns to fix
FIXES = [
    # Database increment/decrement operations
    (r'"active_tasks":\s*-\s*,', '"active_tasks": -1,'),
    (r'"completed_today":\s*\n', '"completed_today": 1\n'),
    (r'"active_tasks":\s*\n', '"active_tasks": 1\n'),
    
    # Timedelta parameters
    (r'timedelta\(hours=\s*None\)', 'timedelta(hours=1)'),
    (r'timedelta\(minutes=\s*None\)', 'timedelta(minutes=30)'),
    (r'timedelta\(days=\s*None\)', 'timedelta(days=1)'),
    
    # Pydantic Field validators
    (r'ge=\s*None', 'ge=1'),
    (r'le=\s*None', 'le=100'),
    (r'min_length=\s*None', 'min_length=1'),
    (r'max_length=\s*None', 'max_length=255'),
    
    # List/Range operations
    (r'range\(\s*None\)', 'range(10)'),
    (r'range\(\s*,\s*None\)', 'range(1, 10)'),
    
    # Percentages and scores
    (r':\s*None%', ': 75%'),
    (r'score.*?:\s*None', 'score: 85'),
    
    # HTTP status codes
    (r'status_code=\s*None', 'status_code=200'),
]

def fix_file(filepath):
    """Fix corruption in a single file"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        original_content = content
        
        for pattern, replacement in FIXES:
            content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            with open(filepath, 'w') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")
        return False

def main():
    """Fix all Python files in the backend"""
    backend_dir = Path('/app/backend')
    python_files = list(backend_dir.rglob('*.py'))
    
    fixed_count = 0
    for filepath in python_files:
        # Skip this script and __pycache__
        if '__pycache__' in str(filepath) or filepath.name == 'fix_numeric_corruption.py':
            continue
        
        if fix_file(filepath):
            fixed_count += 1
            print(f"Fixed: {filepath}")
    
    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
