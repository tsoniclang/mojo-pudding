from std.testing import assert_equal
from mojo_proof_native import add


def main() raises:
    assert_equal(add(20, 22), 42)
