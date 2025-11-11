# Quick Start Guide

## For Linux Users

### 1. Setup Environment
```bash
# Copy and configure environment variables
cp variables.env.example variables.env
# Edit variables.env with your credentials
nano variables.env
```

### 2. Build and Run Linux Runner
```bash
# Build the image
docker build -f Dockerfile.linux --build-arg RUNNER_VERSION=2.325.0 -t docker-github-runner-linux .

# Run a single runner
docker run -e GH_TOKEN='your-token' -e GH_OWNER='your-org' -e GH_REPOSITORY='your-repo' -d docker-github-runner-linux

# OR use docker-compose for easier scaling
docker-compose up --scale runner-linux=3 -d runner-linux
```

### 3. Cleanup
```bash
# Stop runners
docker-compose down

# Cleanup stale registrations
./scripts/cleanup-runners.sh your-org your-repo your-token
```

## For Windows Users

### 1. Setup Environment
```powershell
# Copy and configure environment variables
Copy-Item variables.env.example variables.env
# Edit variables.env with your credentials
notepad variables.env
```

### 2. Build and Run Windows Runner
```powershell
# Ensure Docker Desktop is set to Windows containers
# Build the image
docker build --build-arg RUNNER_VERSION=2.325.0 -t docker-github-runner-win .

# Run a single runner
docker run -e GH_TOKEN='your-token' -e GH_OWNER='your-org' -e GH_REPOSITORY='your-repo' -d docker-github-runner-win

# OR use docker-compose for easier scaling
docker-compose up --scale runner-windows=3 -d runner-windows
```

### 3. Cleanup
```powershell
# Stop runners
docker-compose down

# Cleanup stale registrations
.\scripts\Cleanup-Runners.ps1 -owner "your-org" -repo "your-repo" -pat "your-token"
```

## Running Both Platforms Simultaneously

If you have a hybrid environment or using Docker Desktop that supports both:

```bash
# Build both images
docker-compose build

# Run 2 Windows and 3 Linux runners
docker-compose up --scale runner-windows=2 --scale runner-linux=3 -d

# Check running containers
docker ps

# Stop all
docker-compose down
```

## Troubleshooting

### Linux Container Issues
- Ensure Docker daemon is running: `sudo systemctl status docker`
- Check logs: `docker logs <container-id>`
- Verify network connectivity to GitHub

### Windows Container Issues
- Ensure Docker Desktop is in Windows container mode
- Check Windows version compatibility
- Review PowerShell execution policies
- Check logs: `docker logs <container-id>`

### Runner Not Appearing in GitHub
1. Verify the PAT token has correct scopes: `repo`, `read:org`
2. Check that GH_OWNER and GH_REPOSITORY are correct
3. Review container logs for errors
4. Ensure the repository settings allow self-hosted runners

### GitHub Actions Not Picking Up Jobs
1. Make sure the workflow specifies `runs-on: self-hosted`
2. Add labels if using specific runners: `runs-on: [self-hosted, linux]` or `runs-on: [self-hosted, windows]`
3. Check runner status in repository Settings > Actions > Runners
