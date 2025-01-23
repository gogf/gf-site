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

echo "Processing README.MD files..."
find /tmp/gf-examples -mindepth 2 -type f -iname "readme.md" | while read file; do
    # Get relative directory path and name
    rel_dir=$(dirname "$file" | sed 's|/tmp/gf-examples/||')
    dir_name=$(basename "$rel_dir")
    
    # Create target directories
    mkdir -p "$DOCS_EXAMPLES/$rel_dir"
    mkdir -p "$I18N_EXAMPLES/$rel_dir"
    
    # Create the content with awk
    awk -v dir="$rel_dir" 'BEGIN {front=0; first_heading=0}
        /^---$/ { if (front==0) {front=1; print; next} }
        /^#[^#]/ { if (first_heading==0) {
            print;
            printf "\nCode Source: https://github.com/gogf/examples/tree/main/%s\n\n", dir;
            first_heading=1;
            next
        } }
        {print}' "$file" > "$DOCS_EXAMPLES/$rel_dir/$dir_name.md"
    
    # Copy to i18n directory
    cp "$DOCS_EXAMPLES/$rel_dir/$dir_name.md" "$I18N_EXAMPLES/$rel_dir/$dir_name.md"
done

echo "Cleaning up..."
rm -rf /tmp/gf-examples
echo "Done!"
