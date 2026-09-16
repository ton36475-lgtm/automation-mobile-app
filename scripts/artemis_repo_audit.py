#!/usr/bin/env python3
"""Read-only repository readiness audit; never installs, builds, reads keys or runs ADB."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import re
import subprocess
import sys


def git(root: Path, *args: str) -> str:
    result = subprocess.run(["git", "-C", str(root), *args], capture_output=True,
                            text=True, timeout=15, check=True)
    return result.stdout.strip()


def audit(root: Path) -> dict:
    root = root.resolve(strict=True)
    head = git(root, "rev-parse", "HEAD")
    tracked = git(root, "ls-files").splitlines()
    dirty = bool(git(root, "status", "--porcelain", "--untracked-files=normal"))
    package = json.loads((root / "package.json").read_text(encoding="utf-8"))
    scripts = package.get("scripts", {})
    if not isinstance(scripts, dict) or not all(isinstance(v, str) for v in scripts.values()):
        raise ValueError("Invalid package scripts")
    signing = [p for p in tracked if p.lower().endswith((".keystore", ".jks", ".p12", ".pfx"))]
    findings = []
    if signing:
        findings.append("SIGNING_FILE_REQUIRES_CLASSIFICATION")
    if dirty:
        findings.append("DIRTY_WORKTREE")
    if re.search(r"\bmigrat|db:push", scripts.get("build", ""), re.I):
        findings.append("BUILD_MAY_MUTATE_DATABASE")
    if not any(p in tracked for p in ("pnpm-lock.yaml", "package-lock.json", "yarn.lock", "bun.lock", "bun.lockb")):
        findings.append("NO_RECOGNIZED_LOCKFILE")
    build = scripts.get("build", "")
    return {
        "schema_version": "sirinx.artemis.repo-audit.v1",
        "status": "REVIEW_REQUIRED" if findings else "METADATA_CHECKS_PASSED",
        "source_commit": head, "tracked_file_count": len(tracked),
        "package_manager": package.get("packageManager"), "findings": findings,
        "signing_material_paths": signing, "signing_material_contents_read": False,
        "server_or_web_build_hint": bool(re.search(r"\besbuild\b|\bvite build\b", build)),
        "apk_build_verified": False, "device_test_verified": False,
        "test_script_present": bool(scripts.get("test")),
        "scope": "GIT_METADATA_AND_PACKAGE_SCRIPTS_ONLY_NOT_FULL_CODE_AUDIT",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--gate", action="store_true", help="Exit 2 on any metadata finding.")
    args = parser.parse_args()
    try:
        result = audit(args.repo)
    except (OSError, ValueError, subprocess.SubprocessError) as exc:
        print(json.dumps({"status": "BLOCKED", "code": type(exc).__name__}), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return 2 if args.gate and result["findings"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
