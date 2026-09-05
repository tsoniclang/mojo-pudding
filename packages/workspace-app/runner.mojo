from std.testing import assert_equal
from mojo_proof_workspace import workspace_proof


def main() raises:
    assert_equal(workspace_proof(), 42)
