#!/bin/bash
# This script invokes GitHub CLI to register and start a self-hosted runner
# To use this entrypoint script run: docker run -e GH_TOKEN='myPatToken' -e GH_OWNER='orgName' -e GH_REPOSITORY='repoName' -d imageName

set -e

# Get environment variables or use parameters
OWNER="${GH_OWNER}"
REPO="${GH_REPOSITORY}"
PAT="${GH_TOKEN}"

# Validate required environment variables
if [ -z "$OWNER" ] || [ -z "$REPO" ] || [ -z "$PAT" ]; then
    echo "Error: GH_OWNER, GH_REPOSITORY, and GH_TOKEN environment variables are required"
    exit 1
fi

echo "Starting GitHub Runner setup..."
echo "Owner: $OWNER"
echo "Repository: $REPO"

# GH CLI will automatically use GH_TOKEN environment variable
# No need to pipe it to gh auth login
echo "Authenticating with GitHub..."

# Get Runner registration Token
echo "Requesting runner registration token..."
REG_TOKEN=$(gh api --method POST -H "Accept: application/vnd.github.v3+json" "/repos/$OWNER/$REPO/actions/runners/registration-token" | jq -r .token)

if [ -z "$REG_TOKEN" ] || [ "$REG_TOKEN" == "null" ]; then
    echo "Error: Failed to get registration token. Check your PAT permissions and repository access."
    exit 1
fi
echo "Registration token obtained successfully"

# Generate unique runner name
RUNNER_BASE_NAME="dockerNode-"
RUNNER_SUFFIX=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 5 | head -n 1)
RUNNER_NAME="${RUNNER_BASE_NAME}${RUNNER_SUFFIX}"

# Cleanup function to remove runner registration on exit
cleanup() {
    echo "Removing runner registration..."
    ./config.sh remove --token "$REG_TOKEN" || true
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Register new runner instance
echo "Registering GitHub Self Hosted Runner on: $OWNER/$REPO"
echo "Runner name: $RUNNER_NAME"

if ! ./config.sh --unattended --url "https://github.com/$OWNER/$REPO" --token "$REG_TOKEN" --name "$RUNNER_NAME"; then
    echo "Error: Failed to configure runner"
    exit 1
fi
echo "Runner configured successfully"

# Remove PAT token after registering new instance
unset PAT
unset GH_TOKEN

# Start runner listener for jobs
echo "Starting runner..."
./run.sh
