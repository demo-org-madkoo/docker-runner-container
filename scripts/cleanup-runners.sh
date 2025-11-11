#!/bin/bash
# This script invokes GitHub CLI to cleanup stale runner registrations
# Linux containers can gracefully remove registrations, but this script
# can be used to cleanup any offline runners that weren't properly removed

set -e

# Get environment variables or use parameters
OWNER="${1:-$GH_OWNER}"
REPO="${2:-$GH_REPOSITORY}"
PAT="${3:-$GH_TOKEN}"

# Validate required parameters
if [ -z "$OWNER" ] || [ -z "$REPO" ] || [ -z "$PAT" ]; then
    echo "Usage: $0 <owner> <repo> <pat>"
    echo "Or set environment variables: GH_OWNER, GH_REPOSITORY, GH_TOKEN"
    exit 1
fi

# Authenticate with GitHub CLI
echo "$PAT" | gh auth login --with-token

# Cleanup
# Look for any old/stale dockerNode- registrations to clean up
RUNNER_BASE_NAME="dockerNode-"
RUNNER_LIST=$(gh api -H "Accept: application/vnd.github.v3+json" "/repos/$OWNER/$REPO/actions/runners")

# Parse and cleanup offline runners
echo "$RUNNER_LIST" | jq -r ".runners[] | select(.name | startswith(\"$RUNNER_BASE_NAME\")) | select(.status == \"offline\") | .id" | while read -r RUNNER_ID; do
    if [ -n "$RUNNER_ID" ]; then
        RUNNER_NAME=$(echo "$RUNNER_LIST" | jq -r ".runners[] | select(.id == $RUNNER_ID) | .name")
        echo "Unregistering old stale runner: $RUNNER_NAME (ID: $RUNNER_ID)"
        gh api --method DELETE -H "Accept: application/vnd.github.v3+json" "/repos/$OWNER/$REPO/actions/runners/$RUNNER_ID"
    fi
done

# Remove PAT token after cleanup
unset PAT
unset GH_TOKEN

echo "Cleanup completed successfully"
