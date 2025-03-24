#!/bin/bash

# Exit on error
set -e

# Define directories
DOCS_EXAMPLES="docs/examples"
I18N_EXAMPLES="i18n/en/docusaurus-plugin-content-docs/current/examples"

echo "Cleaning examples directories..."
rm -rf "$DOCS_EXAMPLES"/*
rm -rf "$I18N_EXAMPLES"

echo "Downloading gogf/examples repository..."
git clone --depth=1 https://github.com/gogf/examples /tmp/gf-examples

echo "Processing README files..."
find /tmp/gf-examples -mindepth 2 -type f -iname "readme*.md" | while read file; do
    # Check if file has slug tag
    if ! grep -q "^slug:" "$file"; then
        echo "Skipping $file (no slug tag found)"
        continue
    fi
    
    # Get relative directory path and name
    rel_dir=$(dirname "$file" | sed 's|/tmp/gf-examples/||')
    dir_name=$(basename "$rel_dir")
    base_name=$(basename "$file" | tr '[:upper:]' '[:lower:]')
    
    # Create target directories
    mkdir -p "$DOCS_EXAMPLES/$rel_dir"
    mkdir -p "$I18N_EXAMPLES/$rel_dir"
    
    # Function to process and write content
    process_content() {
        local input_file=$1
        local output_file=$2
        awk -v dir="$rel_dir" 'BEGIN {front=0; first_heading=0}
            /^---$/ { if (front==0) {front=1; print; next} }
            /^#[^#]/ { if (first_heading==0) {
                print;
                printf "\nGithub Source: https://github.com/gogf/examples/tree/main/%s\n\n", dir;
                first_heading=1;
                next
            } }
            {print}' "$input_file" > "$output_file"
    }
    
    # For docs/examples: prefer README.ZH.MD if it exists
    if [[ "$base_name" == "readme.zh.md" ]]; then
        process_content "$file" "$DOCS_EXAMPLES/$rel_dir/$dir_name.md"
    elif [[ "$base_name" == "readme.md" ]]; then
        # Only process README.MD for docs if README.ZH.MD doesn't exist
        if [[ ! -f "$(dirname "$file")/README.ZH.MD" ]]; then
            process_content "$file" "$DOCS_EXAMPLES/$rel_dir/$dir_name.md"
        fi
        # Always process README.MD for i18n
        process_content "$file" "$I18N_EXAMPLES/$rel_dir/$dir_name.md"
    fi
done

echo "Cleaning up..."
rm -rf /tmp/gf-examples
echo "Done!"
