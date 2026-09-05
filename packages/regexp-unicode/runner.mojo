from std.testing import assert_equal, assert_true
from mojo_proof_regexp_unicode import (
    dynamic_reg_exp_proof,
    literal_reg_exp_proof,
    unicode_normalization_proof,
)


def main() raises:
    assert_equal(dynamic_reg_exp_proof(), "b<aa>c<aa>")
    assert_true(literal_reg_exp_proof())
    assert_equal(unicode_normalization_proof(), 2.0)
