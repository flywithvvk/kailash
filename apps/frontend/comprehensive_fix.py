#!/usr/bin/env python3
"""
Comprehensive frontend corruption fix
Fixes all numeric corruption patterns across the frontend codebase
"""
import re
from pathlib import Path
import sys

def fix_content(content, filepath):
    """Apply all fixes to content"""
    original = content
    
    # Fix 1: Empty prop values for Lucide icons
    content = re.sub(r'size=\{\s*\}', 'size={24}', content)
    content = re.sub(r'strokeWidth=\{\s*\}', 'strokeWidth={2}', content)
    content = re.sub(r'width=\{\s*\}', 'width={24}', content)
    content = re.sub(r'height=\{\s*\}', 'height={24}', content)
    
    # Fix 2: Missing numbers in object/array contexts
    content = re.sub(r':\s+,', ': 0,', content)
    content = re.sub(r':\s+\}', ': 0}', content)
    content = re.sub(r':\s+\]', ': 0]', content)
    
    # Fix 3: Version numbers (..)
    content = re.sub(r'version:\s*"\.\.(\d+)?"', 'version: "1.0.0"', content)
    content = re.sub(r'\.\.(\d+)?["\']', '1.0.0"', content)
    
    # Fix 4: Ternary operators
    content = re.sub(r'\?\s+:', '? 1 :', content)
    content = re.sub(r':\s+([,\)\};])', r': 0\1', content)
    
    # Fix 5: CSS/style values
    content = re.sub(r'fontSize:\s*["\']\.\.', 'fontSize: "16px', content)
    content = re.sub(r'padding:\s*["\']\.\.', 'padding: "10px', content)
    content = re.sub(r'margin:\s*["\']\.\.', 'margin: "10px', content)
    
    # Fix 6: Timeout/delay values
    content = re.sub(r'setTimeout\([^,]+,\s*\)', 'setTimeout(() => {}, 1000)', content)
    content = re.sub(r'setInterval\([^,]+,\s*\)', 'setInterval(() => {}, 1000)', content)
    
    # Fix 7: Array indices and numeric literals
    content = re.sub(r'\[\s*\]\.', '[0].', content)
    content = re.sub(r'opacity:\s*\.(\d+)', r'opacity: 0.\1', content)
    
    # Fix 8: Common numeric constants
    content = re.sub(r'maxLength=\{\s*\}', 'maxLength={100}', content)
    content = re.sub(r'minLength=\{\s*\}', 'minLength={1}', content)
    content = re.sub(r'rows=\{\s*\}', 'rows={3}', content)
    content = re.sub(r'cols=\{\s*\}', 'cols={50}', content)
    
    return content, content != original

def main():
    src_path = Path('/app/frontend/src')
    fixed_count = 0
    error_count = 0
    
    print("Starting comprehensive fix...\n")
    
    for ext in ['*.js', '*.jsx']:
        for filepath in src_path.rglob(ext):
            try:
                content = filepath.read_text()
                fixed_content, was_fixed = fix_content(content, filepath)
                
                if was_fixed:
                    filepath.write_text(fixed_content)
                    fixed_count += 1
                    print(f"✓ Fixed: {filepath.relative_to(src_path)}")
                    
            except Exception as e:
                error_count += 1
                print(f"✗ Error in {filepath}: {e}")
    
    print(f"\n{'='*50}")
    print(f"Summary:")
    print(f"  Files fixed: {fixed_count}")
    print(f"  Errors: {error_count}")
    print(f"{'='*50}")
    
    return 0 if error_count == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
