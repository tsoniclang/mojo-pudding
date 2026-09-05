from std.testing import assert_equal
from mojo_proof_language import language_proof, nested_finally_proof


def main() raises:
    assert_equal(language_proof(), 17)
    assert_equal(nested_finally_proof(False), 4)
    assert_equal(nested_finally_proof(True), 5)
