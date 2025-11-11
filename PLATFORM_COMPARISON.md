# Platform Comparison

This document provides a side-by-side comparison of the Windows and Linux runner implementations.

## Architecture Overview

Both implementations follow the same general architecture:
1. Base image selection
2. Install GitHub runner binaries
3. Install GitHub CLI for API interactions
4. Configure runner registration script
5. Start the runner

## Implementation Details

### Base Images

| Platform | Base Image | Size Characteristics |
|----------|-----------|----------------------|
| Windows  | `mcr.microsoft.com/windows/servercore:10.0.20348.3807-amd64` | Larger (~5GB+) |
| Linux    | `ubuntu:22.04` | Smaller (~200MB base) |

### Package Managers

| Platform | Package Manager | Additional Tools |
|----------|----------------|------------------|
| Windows  | Chocolatey | Git, GitHub CLI, Azure CLI, PowerShell Core, SQL Server Express |
| Linux    | APT | Git, GitHub CLI, jq, curl, wget |

### Runner Binaries

| Platform | Download Location | Package Format |
|----------|------------------|----------------|
| Windows  | `actions-runner-win-x64-{VERSION}.zip` | ZIP archive |
| Linux    | `actions-runner-linux-x64-{VERSION}.tar.gz` | TAR.GZ archive |

### Startup Scripts

| Platform | Script | Language | Runner Cleanup |
|----------|--------|----------|----------------|
| Windows  | `scripts/Start.ps1` | PowerShell | Manual (known issue) |
| Linux    | `scripts/start.sh` | Bash | Automatic (trap EXIT) |

### Cleanup Scripts

| Platform | Script | Purpose |
|----------|--------|---------|
| Windows  | `scripts/Cleanup-Runners.ps1` | Required - removes stale offline runners |
| Linux    | `scripts/cleanup-runners.sh` | Optional - automatic cleanup on exit |

### Docker Compose Services

| Service Name | Platform | Image Name |
|--------------|----------|------------|
| `runner-windows` | windows/amd64 | `dockercomp-github-runner-win:latest` |
| `runner-linux` | linux/amd64 | `dockercomp-github-runner-linux:latest` |

## Key Differences

### Windows Specific
- Requires Windows containers mode in Docker Desktop
- Uses PowerShell for scripting
- Cannot gracefully remove runner registration due to [moby issue #25982](https://github.com/moby/moby/issues/25982)
- Includes additional tools (SQL Server Express, Azure CLI)
- Larger image size
- Host OS version must match container OS version (or use Hyper-V isolation)

### Linux Specific
- Can run on any Docker host (Linux, macOS, Windows with WSL2)
- Uses Bash for scripting
- Automatic cleanup on container stop via trap
- Smaller, more efficient images
- Better multi-architecture support (x64, ARM64)
- More portable and cloud-friendly

## Common Features

Both implementations share:
- GitHub CLI for API authentication and runner registration
- Environment variable configuration (GH_TOKEN, GH_OWNER, GH_REPOSITORY)
- Unique runner naming scheme (dockerNode-{random})
- Unattended runner registration
- Scalability via docker-compose
- Same runner version support

## Recommended Use Cases

### Use Windows Runners When:
- Building/testing Windows-specific applications (.NET Framework, Windows services)
- Requiring Windows-only tools or SDKs
- Needing SQL Server or other Windows services
- Testing Windows compatibility

### Use Linux Runners When:
- Building containerized applications
- Working with modern web applications (Node.js, Python, Go, etc.)
- Optimizing for cost/resource efficiency
- Deploying to Linux production environments
- Needing better cloud integration

### Use Both When:
- Supporting cross-platform applications
- Running a comprehensive CI/CD pipeline
- Testing applications on multiple platforms
- Migrating from one platform to another
