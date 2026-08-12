import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Allow `import main` from the backend package directory.
BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from main import app, notes  # noqa: E402


@pytest.fixture()
def client():
    """Fresh in-memory store for every test."""
    notes.clear()
    with TestClient(app) as test_client:
        yield test_client
    notes.clear()
