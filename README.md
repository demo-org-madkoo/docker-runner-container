# docker-runner-container

Self-hosted GitHub Actions runners in Docker containers for both Windows and Linux.

## Overview

This repository provides Docker container configurations for running GitHub Actions self-hosted runners on both Windows and Linux platforms. This allows you to:
- Scale your CI/CD infrastructure with containerized runners
- Hook up self-hosted runners to your GitHub repositories
- Support both Windows and Linux workloads

## Reference Documentation

https://arc.net/l/quote/edhaglqe

Check for latest releases: https://github.com/actions/runner/releases

## Prerequisites

- Docker Desktop (for Windows containers on Windows)
- Docker Engine (for Linux containers)
- GitHub Personal Access Token (PAT) with `repo` and `read:org` scopes

## Setup

1. Copy the example environment file and configure it:
```bash
cp variables.env.example variables.env
```

2. Edit `variables.env` and set your values:
   - `GH_OWNER`: Your GitHub organization or username
   - `GH_REPOSITORY`: Your repository name
   - `GH_TOKEN`: Your GitHub Personal Access Token

---

## Windows Containers

### Build the Windows Image

```bash
docker build --build-arg RUNNER_VERSION=2.325.0 --tag docker-github-runner-win .
```

### Run the Windows Docker Image

Run container from image:
```bash
docker run -e GH_TOKEN='myPatToken' -e GH_OWNER='orgName' -e GH_REPOSITORY='repoName' -d docker-github-runner-win
```

### Stop Windows Runners

```bash
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
```

### Cleanup Windows Runners

```powershell
.\scripts\Cleanup-Runners.ps1 -owner "orgName" -repo "repoName" -pat "myPatToken"
```

### Use Docker Compose for Windows

Build the Windows image:
```bash
docker-compose build runner-windows
```

Run and scale the Windows runners:
```bash
docker-compose up --scale runner-windows=3 -d runner-windows
```

Scale down to one runner:
```bash
docker-compose up --scale runner-windows=1 -d runner-windows
```

---

## Linux Containers

### Build the Linux Image

```bash
docker build -f Dockerfile.linux --build-arg RUNNER_VERSION=2.325.0 --tag docker-github-runner-linux .
```

### Run the Linux Docker Image

Run container from image:
```bash
docker run -e GH_TOKEN='myPatToken' -e GH_OWNER='orgName' -e GH_REPOSITORY='repoName' -d docker-github-runner-linux
```

### Stop Linux Runners

```bash
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
```

### Cleanup Linux Runners

```bash
./scripts/cleanup-runners.sh orgName repoName myPatToken
```

Or using environment variables:
```bash
export GH_OWNER='orgName'
export GH_REPOSITORY='repoName'
export GH_TOKEN='myPatToken'
./scripts/cleanup-runners.sh
```

### Use Docker Compose for Linux

Build the Linux image:
```bash
docker-compose build runner-linux
```

Run and scale the Linux runners:
```bash
docker-compose up --scale runner-linux=3 -d runner-linux
```

Scale down to one runner:
```bash
docker-compose up --scale runner-linux=1 -d runner-linux
```

---

## Using Both Windows and Linux Runners

You can run both Windows and Linux runners simultaneously using Docker Compose:

```bash
# Build both images
docker-compose build

# Run 2 Windows runners and 3 Linux runners
docker-compose up --scale runner-windows=2 --scale runner-linux=3 -d

# Stop all runners
docker-compose stop

# Remove all containers
docker-compose down
```

## Notes

- **Windows Containers**: Due to [a known issue](https://github.com/moby/moby/issues/25982), Windows containers cannot gracefully remove runner registration on stop. Use the `Cleanup-Runners.ps1` script to manually cleanup stale offline runners.
- **Linux Containers**: The Linux containers handle cleanup gracefully on shutdown, but you can still use the `cleanup-runners.sh` script if needed.
- The runner names are generated with the pattern `dockerNode-{random}` to ensure uniqueness across multiple container instances.

## Security Best Practices

1. Never commit your `variables.env` file with actual credentials
2. Use GitHub Secrets for PAT tokens in GitHub Actions workflows
3. Rotate your PAT tokens regularly
4. Use the minimum required scopes for your PAT tokens
5. Consider using ephemeral runners that are destroyed after each job

## Troubleshooting

### Windows Containers
- Ensure Docker Desktop is configured to use Windows containers
- The host OS version should match the container OS version
- You can use Hyper-V isolation to run older containers on newer host builds

### Linux Containers
- Ensure your Docker installation supports Linux containers
- If using Docker Desktop on Windows/Mac, Linux containers are supported by default

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See the LICENSE file for details.