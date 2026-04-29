import os
import re

def resolve_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    if '<<<<<<<' not in content:
        return

    # To handle nested conflicts, we can repeatedly resolve the innermost conflicts first.
    # An innermost conflict does not contain '<<<<<<<' inside it.
    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> [^\n]+\n', re.DOTALL)
    
    changed = True
    while changed:
        changed = False
        new_content = ""
        last_end = 0
        for match in pattern.finditer(content):
            head_part = match.group(1)
            theirs_part = match.group(2)
            
            # If the head part or theirs part contains a conflict marker, it's not the innermost.
            if '<<<<<<<' in head_part or '<<<<<<<' in theirs_part:
                continue
                
            # Which part to keep? 
            # We will prefer the 'theirs' part since '0e578b39' and 'd198df8c' seem to contain the newer structure.
            # Except if 'theirs' is empty, then we keep 'head'.
            if theirs_part.strip():
                resolved = theirs_part
            else:
                resolved = head_part
                
            new_content += content[last_end:match.start()] + resolved + "\n"
            last_end = match.end()
            changed = True
            
        new_content += content[last_end:]
        if changed:
            content = new_content

    # If there are still conflict markers (maybe malformed), let's just wipe them out rudely
    content = re.sub(r'<<<<<<< HEAD\n', '', content)
    content = re.sub(r'=======\n', '', content)
    content = re.sub(r'>>>>>>> [^\n]+\n', '', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Resolved {filepath}")

def main():
    backend_dir = r"c:\Users\naika\OneDrive\Desktop\SmartPrep-Adaptive-Study-Planner-and-Exam-Analytics-Platform\backend"
    for root, dirs, files in os.walk(backend_dir):
        for file in files:
            if file.endswith(('.java', '.xml', '.properties')):
                filepath = os.path.join(root, file)
                resolve_file(filepath)

if __name__ == "__main__":
    main()
