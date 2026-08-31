from std.testing import assert_equal
from mojo_proof_js import message


def main() raises:
    assert_equal(message().to_native_strict(), "hello from Mojo")
