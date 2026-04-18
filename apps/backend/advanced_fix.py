#!/usr/bin/env python3
"""
Advanced fix for remaining corruption patterns
"""

import os
import re
from pathlib import Path

def fix_file_advanced(filepath):
    """Fix advanced corruption patterns"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        original = content
        
        # Fix model names
        content = re.sub(r'claude-3-haiku-20240307', 'claude-3-haiku-20240307', content)
        content = re.sub(r'max_tokens=8([,\s])', r'max_tokens=800\1', content)
        content = re.sub(r'temperature=\.([,\s])', r'temperature=0.7\1', content)
        
        # Fix slicing with missing numbers
        content = re.sub(r'\[:\]', '[:]', content)
        content = re.sub(r'\[:(\d+)\]', r'[:\1]', content)
        
        # Fix comparison operators with missing numbers
        content = re.sub(r'>\s+else', r'> 50 else', content)
        content = re.sub(r'<\s+else', r'< 50 else', content)
        content = re.sub(r'>=\s+else', r'>= 50 else', content)
        
        # Fix empty increments
        content = re.sub(r'\{"active_tasks":\s*-\}', r'{"active_tasks": -1}', content)
        content = re.sub(r'\{"active_tasks":\s*\}', r'{"active_tasks": 1}', content)
        
        if content != original:
            with open(filepath, 'w') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    backend_dir = Path('/app/backend')
    python_files = list(backend_dir.rglob('*.py'))
    
    fixed = 0
    for filepath in python_files:
        if '__pycache__' in str(filepath):
            continue
        if fix_file_advanced(filepath):
            fixed += 1
            print(f"Fixed: {filepath}")
    
    print(f"\nFixed {fixed} files")

if __name__ == '__main__':
    main()
