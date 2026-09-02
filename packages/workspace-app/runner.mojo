from std.testing import assert_equal
from mojo_proof_workspace import workspaceProof


def main() raises:
    assert_equal(workspaceProof(), 42)
