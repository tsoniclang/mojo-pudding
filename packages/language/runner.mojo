from std.testing import assert_equal
from mojo_proof_language import (
    _initialize_tsonic_package,
    language_proof,
    nested_finally_proof,
    nested_invocation_error_proof,
    numeric_operators_proof,
    numeric_mutation_proof,
)


def main() raises:
    _initialize_tsonic_package()
    assert_equal(language_proof(), 17)
    assert_equal(nested_finally_proof(False), 4)
    assert_equal(nested_finally_proof(True), 5)
    assert_equal(numeric_mutation_proof(), True)
    var bitwise = numeric_operators_proof(-1.0, 1.0)
    var expected = List[Float64](0.0, 1.0, -1.0, -2.0, -2.0, -1.0, 2147483647.0)
    for index in range(len(expected)):
        assert_equal(bitwise[index], expected[index])
    for shape in range(5):
        assert_equal(nested_invocation_error_proof(0.0, Float64(shape)), 1200.0)
        assert_equal(nested_invocation_error_proof(1.0, Float64(shape)), 1201.0)
        assert_equal(nested_invocation_error_proof(2.0, Float64(shape)), 1202.0)
        assert_equal(nested_invocation_error_proof(3.0, Float64(shape)), 103.0)
        assert_equal(nested_invocation_error_proof(-1.0, Float64(shape)), 1201.0)
        assert_equal(nested_invocation_error_proof(-2.0, Float64(shape)), 1202.0)
