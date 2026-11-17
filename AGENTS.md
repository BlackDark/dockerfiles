# dockerfiles

Collection of independently built Docker images for self-hosted utilities and game servers.

## Verify

CI detects changed image directories, builds affected images without pushing on PRs, and runs actionlint, zizmor, and strict Renovate validation. The required gate is `check`.

Keep the existing per-image tags, registries, and release matrix. Do not turn the collection into a single application stack.

## Map

- Top-level directories: utility images and their Dockerfiles/scripts.
- `games/`: game-server images.
- `.github/workflows/release.yml`: change detection, PR builds, and publishing.

## Git

- Conventional Commits, one topic per PR.
- Squash unless commits need separate review.
- Force-push only with `--force-with-lease` on own branches.

## Boundaries

- Do not push Docker Hub images or create release tags from a local session.
- Keep registry credentials in secrets; never echo them in logs.
