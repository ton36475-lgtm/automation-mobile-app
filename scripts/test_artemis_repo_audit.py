"""Synthetic repositories only: no user secrets, Android, installs or network."""
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from artemis_repo_audit import audit


class RepoAuditTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.scripts = {"build": "esbuild server/index.ts --outdir=dist", "test": "vitest run"}
        self.paths = ["package.json", "pnpm-lock.yaml"]
        self.dirty = ""

    def tearDown(self):
        self.tmp.cleanup()

    def run_audit(self):
        (self.root / "package.json").write_text(json.dumps({"scripts": self.scripts, "packageManager": "pnpm@9.12.0"}))
        def fake_git(root, *args):
            if args == ("rev-parse", "HEAD"):
                return "a" * 40
            if args == ("ls-files",):
                return "\n".join(self.paths)
            return self.dirty
        with patch("artemis_repo_audit.git", side_effect=fake_git):
            return audit(self.root)

    def test_server_build_not_apk_proof(self):
        result = self.run_audit()
        self.assertTrue(result["server_or_web_build_hint"])
        self.assertFalse(result["apk_build_verified"])

    def test_key_filename_without_opening_key(self):
        self.paths.append("android-release.keystore")
        result = self.run_audit()
        self.assertIn("SIGNING_FILE_REQUIRES_CLASSIFICATION", result["findings"])
        self.assertFalse(result["signing_material_contents_read"])
        self.assertFalse((self.root / "android-release.keystore").exists())

    def test_build_migration_flag(self):
        self.scripts["build"] = "vite build && npm run db:migrate"
        self.assertIn("BUILD_MAY_MUTATE_DATABASE", self.run_audit()["findings"])

    def test_dirty_worktree_flag(self):
        self.dirty = " M package.json"
        self.assertIn("DIRTY_WORKTREE", self.run_audit()["findings"])

    def test_missing_lockfile_flag(self):
        self.paths = ["package.json"]
        self.assertIn("NO_RECOGNIZED_LOCKFILE", self.run_audit()["findings"])

    def test_clean_metadata_is_not_device_pass(self):
        result = self.run_audit()
        self.assertEqual(result["status"], "METADATA_CHECKS_PASSED")
        self.assertFalse(result["device_test_verified"])

    def test_invalid_manifest(self):
        self.scripts["build"] = {"invalid": "object"}
        with self.assertRaises(ValueError):
            self.run_audit()


if __name__ == "__main__":
    unittest.main(verbosity=2)
