# ARTEMIS readiness audit — staged, not deployed

Date: 2026-09-16
Audited base: cd2eecbc7e5879f24ed49bb3cdef8f5b4f5e15b0
Observed upstream ARTEMIS: 371aa6df56880643da57b30da936e9812fb0ec66

## Scope of this change

This draft adds a read-only Git/package metadata auditor and seven offline tests.
It does not install or execute ARTEMIS, build an APK, use a signing key, connect a
phone, call a model, modify package.json, run database migrations, or change CI.
It is not the full SIRINX ARTEMIS executor or a production permission grant.

```bash
python3 scripts/artemis_repo_audit.py --repo .
python3 scripts/artemis_repo_audit.py --repo . --gate
python3 -m unittest discover -s scripts -p 'test_artemis_repo_audit.py' -v
```

The ordinary audit exits zero when it can return a report, even if findings exist.
`--gate` exits 2 when findings exist. Neither mode proves an Android build or device
flow passed. Findings are metadata hints, not an exhaustive source/security audit.

## Findings to resolve before Android release

- The observed `build` script bundles `server/_core/index.ts` with esbuild. It is
  not evidence of an APK build. `android` starts Expo, not a completed release build.
- The repository listing includes `android-release.keystore`. Its bytes were not
  opened and its role is unknown. Classify it as test/upload/app-signing material
  and review release history before any release recipe consumes it. Do not rotate
  or delete a production signing identity blindly.
- Retain the existing pinned package manager/lockfile. Separate dependency setup,
  application build, APK signing, APK installation, device execution and independent
  backend assertions into distinct steps and receipts.
- Never put migrations into the ordinary prelaunch readiness path. Test scripts
  and dependency lifecycle scripts are executable code and need isolated fixtures.

## Integration boundary

Keep Hermes/GhostClaw/GraphFleet as the existing authority. ARTEMIS is an Android
execution/testing adapter, not a second Commander, model router or scheduler.
A future device task needs an exact device binding, reviewed source and APK hashes,
action-bound authority, an exclusive cross-tool lease, bounded model budget,
privacy-safe test accounts, cancellation reconciliation and independent assertions.
A timeout is an unknown result, not permission to submit the workflow again.
Screenshots and an agent's completed status alone do not prove a business transaction.

Start with a synthetic emulator and non-production backend. Do not root the S22
Ultra for ARTEMIS or use the phone that approves production tasks as its test target.
Do not run `start.sh` or `artemis mcp --install all` as an unreviewed global setup.

## Validation

Seven synthetic unit tests passed in the authoring environment (Python 3.13.5).
No repository-wide app suite, live ARTEMIS runtime, Android device, Mac mini,
provider route, signing build or deployment was tested by this change.

## Primary sources

- https://github.com/google/artemis/tree/371aa6df56880643da57b30da936e9812fb0ec66
- https://github.com/google/artemis/blob/371aa6df56880643da57b30da936e9812fb0ec66/mcp_server/tools/task_runner.py
- https://github.com/google/artemis/blob/371aa6df56880643da57b30da936e9812fb0ec66/.env.example
- https://github.com/ton36475-lgtm/automation-mobile-app/blob/cd2eecbc7e5879f24ed49bb3cdef8f5b4f5e15b0/package.json
