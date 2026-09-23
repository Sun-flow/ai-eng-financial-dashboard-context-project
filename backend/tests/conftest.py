import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))


@pytest.fixture
def client() -> TestClient:
    """Isolated TestClient instance per test to prevent state leakage."""
    return TestClient(app)
