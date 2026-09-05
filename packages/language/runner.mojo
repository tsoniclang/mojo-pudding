from std.testing import assert_equal
from mojo_proof_language import language_proof


def main() raises:
    assert_equal(language_proof(), 17)
