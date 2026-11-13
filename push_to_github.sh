#!/usr/bin/env bash
# Tushar LifeOS - Quick GitHub Push Script
# Usage: ./push_to_github.sh <YOUR_GITHUB_REPO_URL>
# Example: ./push_to_github.sh https://github.com/tusharraut/tushar-lifeos.git

set -e

REPO_URL=$1

if [ -z "$REPO_URL" ]; then
  # Check if origin already exists
  EXISTING_ORIGIN=$(git remote get-url origin 2>/dev/null || true)
  if [ -n "$EXISTING_ORIGIN" ]; then
    echo "Pushing current work to existing origin ($EXISTING_ORIGIN)..."
    git push -u origin tushar_lifeos_gamified_mission_system:main
    echo "Push completed successfully!"
    exit 0
  else
    echo "Error: No remote repository URL provided."
    echo "Usage: ./push_to_github.sh https://github.com/<your-username>/<your-repo-name>.git"
    exit 1
  fi
fi

echo "Configuring remote origin to: $REPO_URL"
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "Pushing branch tushar_lifeos_gamified_mission_system to remote main branch..."
git push -u origin tushar_lifeos_gamified_mission_system:main

echo "Success! Your LifeOS codebase is pushed and accessible from anywhere for any AI or device."
