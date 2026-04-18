#!/usr/bin/env python3
"""
KAILASH V2 Corruption Remediation Script
Fixes emoji purge artifacts in Python backend
"""

import os
import re
from pathlib import Path
from typing import Dict, Tuple

class CorruptionFixer:
    def __init__(self, base_path: str = "/app/backend/app"):
        self.base_path = base_path
        self.stats = {
            "files_processed": 0,
            "files_fixed": 0,
            "replacements_made": 0,
        }
        
        # CRITICAL REPLACEMENT RULES
        self.patterns = [
            # Import fixes
            (r'\baseModel\b', 'BaseModel'),
            (r'\baseSettings\b', 'BaseSettings'),
            (r'\baseGuardian\b', 'BaseGuardian'),
            (r'\baseDepartment\b', 'BaseDepartment'),
            (r'\baseHTTPException\b', 'BaseHTTPException'),
            
            # Numeric fixes - Common patterns
            (r'timeout=\s*,', 'timeout=30,'),
            (r'timeout=\s*\n', 'timeout=30\n'),
            (r'maxPoolSize=\s*,', 'maxPoolSize=10,'),
            (r'max_connections=\s*,', 'max_connections=50,'),
            (r'pool_size=\s*,', 'pool_size=10,'),
            (r'max_overflow=\s*,', 'max_overflow=20,'),
            (r'workers=\s*,', 'workers=4,'),
            (r'port=\s*,', 'port=8001,'),
            
            # Orphaned assignments - General
            (r'=\s*,\s*\n', '=None,\n'),
            (r'=\s*,\s*#', '=None, #'),
            (r':\s*int\s*=\s*,', ': int = 0,'),
            (r':\s*str\s*=\s*,', ': str = "",'),
            (r':\s*bool\s*=\s*,', ': bool = False,'),
            (r':\s*float\s*=\s*,', ': float = 0.0,'),
            (r':\s*list\s*=\s*,', ': list = [],'),
            (r':\s*dict\s*=\s*,', ': dict = {},'),
            
            # Specific database values
            (r'serverSelectionTimeoutMS=\d+[^0-9,]', 'serverSelectionTimeoutMS=3000,'),
            (r'connectTimeoutMS=\d+[^0-9,]', 'connectTimeoutMS=3000,'),
            (r'socketTimeoutMS=\d+[^0-9,]', 'socketTimeoutMS=3000,'),
        ]

    def fix_file(self, filepath: str) -> Tuple[bool, int]:
        """Fix a single Python file. Return (was_fixed, replacement_count)"""
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                original_content = f.read()
        except Exception as e:
            print(f"  ⚠️ Cannot read {filepath}: {e}")
            return False, 0

        fixed_content = original_content
        replacement_count = 0

        # Apply all patterns
        for pattern, replacement in self.patterns:
            matches = len(re.findall(pattern, fixed_content))
            if matches > 0:
                fixed_content = re.sub(pattern, replacement, fixed_content)
                replacement_count += matches

        # Write back if changed
        if fixed_content != original_content:
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                return True, replacement_count
            except Exception as e:
                print(f"  ⚠️ Cannot write {filepath}: {e}")
                return False, 0

        return False, 0

    def run(self):
        """Scan and fix all Python files in base_path"""
        print(f"\n{'='*60}")
        print("KAILASH V2 CORRUPTION FIX EXECUTION")
        print(f"{'='*60}\n")

        for root, dirs, files in os.walk(self.base_path):
            for file in files:
                if file.endswith('.py'):
                    filepath = os.path.join(root, file)
                    self.stats["files_processed"] += 1

                    was_fixed, rep_count = self.fix_file(filepath)
                    if was_fixed:
                        self.stats["files_fixed"] += 1
                        self.stats["replacements_made"] += rep_count
                        rel_path = filepath.replace(self.base_path, '')
                        print(f"  ✅ Fixed {rel_path} ({rep_count} replacements)")

        self._print_summary()

    def _print_summary(self):
        """Print final statistics"""
        print(f"\n{'='*60}")
        print("REPAIR SUMMARY")
        print(f"{'='*60}")
        print(f"Files processed:     {self.stats['files_processed']}")
        print(f"Files fixed:         {self.stats['files_fixed']}")
        print(f"Total replacements:  {self.stats['replacements_made']}")
        print(f"{'='*60}\n")

if __name__ == "__main__":
    fixer = CorruptionFixer()
    fixer.run()
