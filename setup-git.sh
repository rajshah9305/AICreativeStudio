#!/bin/bash
set -e

# Navigate to project directory
cd "$(dirname "$0")"

# Initialize git repository if not already done
if [ ! -d .git ]; then
  git init
  echo "Initialized git repository"
fi

# Configure git if needed
if [ -z "$(git config user.email)" ]; then
  read -p "Enter your git email: " email
  git config user.email "$email"
fi

if [ -z "$(git config user.name)" ]; then
  read -p "Enter your git name: " name
  git config user.name "$name"
fi

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI Creative Studio"

# Add GitHub repository as remote
if ! git remote | grep -q origin; then
  echo "Adding remote repository..."
  git remote add origin https://github.com/rajshah9305/AICreativeStudio.git
fi

# Ensure we're on main branch
git checkout -B main

# Force push to GitHub
echo "Pushing to GitHub..."
git push -u origin main --force

echo "Successfully uploaded to GitHub!"


