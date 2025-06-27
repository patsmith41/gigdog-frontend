#!/bin/bash

# Automatically set the project name from the current folder
PROJECT_NAME=$(basename "$(pwd)")
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
OUTPUT_FILE="$HOME/Desktop/${PROJECT_NAME}-code-dump_$TIMESTAMP.md"

# File extensions to include
INCLUDE_EXTENSIONS=("js" "ts" "tsx" "html" "css" "json" "md")

# Folders to exclude
EXCLUDE_DIRS=("node_modules" ".git" "dist" "build" ".next" ".env" "out" ".vercel" ".DS_Store")

echo "# ${PROJECT_NAME} Code Dump" > "$OUTPUT_FILE"
echo "_Generated on $TIMESTAMP_" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Find and process all matching files
find . -type f | while read -r FILE; do
  # Skip excluded folders/files
  for EXCLUDED in "${EXCLUDE_DIRS[@]}"; do
    if [[ "$FILE" == *"/$EXCLUDED/"* ]] || [[ "$FILE" == *"/$EXCLUDED" ]]; then
      continue 2
    fi
  done

  # Only include files with certain extensions
  EXT="${FILE##*.}"
  if [[ " ${INCLUDE_EXTENSIONS[*]} " == *" $EXT "* ]]; then
    echo "### $FILE" >> "$OUTPUT_FILE"
    echo '```'"$EXT" >> "$OUTPUT_FILE"
    nl -ba "$FILE" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
  fi
done

echo "✅ Dump complete: $OUTPUT_FILE"

