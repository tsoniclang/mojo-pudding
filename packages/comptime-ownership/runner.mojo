from std.testing import assert_equal
from mojo_proof_comptime_ownership import compile_time_proof, explicit_copy_proof


def main() raises:
    assert_equal(compile_time_proof(), 6.0)
    assert_equal(explicit_copy_proof("value"), "value")
