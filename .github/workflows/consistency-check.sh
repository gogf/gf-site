#!/usr/bin/env bash

IGNORE_FILES="来杯咖啡.md"

# Convert IGNORE_FILES to array
IFS=' ' read -r -a ignore_array <<< "$IGNORE_FILES"

# Find all markdown files in docs directory
missing_files=0
while IFS= read -r file; do
# Get relative path from docs directory
rel_path="${file#docs/}"

# Check if file should be ignored
should_ignore=0
for ignore_file in "${ignore_array[@]}"; do
    if [[ "$rel_path" == *"$ignore_file" ]]; then
    should_ignore=1
    break
    fi
done

# Skip check if file should be ignored
if [ $should_ignore -eq 1 ]; then
    echo "Ignoring file: ${rel_path}"
    continue
fi

# Check if corresponding English translation exists
if [ ! -f "i18n/en/docusaurus-plugin-content-docs/current/${rel_path}" ]; then
    echo "Missing English translation for: ${rel_path}"
    missing_files=$((missing_files + 1))
fi
done < <(find docs -name "*.md" -type f)

# Exit with error if any files are missing
if [ $missing_files -gt 0 ]; then
echo "Error: Found ${missing_files} files without English translations"
exit 1
fi