from std.testing import assert_equal
from mojo_proof_node_capabilities import compression_proof, event_proof


def main() raises:
    assert_equal(compression_proof(), "payload")
    assert_equal(event_proof(), 11.0)
