from std.testing import assert_equal
from mojo_proof_language import languageProof


def main() raises:
    assert_equal(languageProof(), 17)
