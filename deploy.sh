#!/bin/bash

set -e

TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo "Building project..."
npm run build

echo "Copying dist to temporary directory..."
cp -r dist/* "$TEMP_DIR/"

echo "Adding CNAME file..."
echo "mai.shizufur.art" > "$TEMP_DIR/CNAME"

echo "Deploying to GitHub Pages..."
cd "$TEMP_DIR"

git init
git add .
git commit -m "Deploy: $(date)"
git branch -M gh-pages
git remote add origin $(cd - > /dev/null && git config --get remote.origin.url)
git push -u origin gh-pages --force

echo "Deployment complete!"
echo "Cleaning up temporary directory..."
