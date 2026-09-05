from std.testing import assert_equal
from std.memory import Pointer
from tsonic_runtime import RawPointer
from mojo_proof_language import (
    _initialize_tsonic_package,
    language_proof,
    nested_finally_proof,
    nested_invocation_error_proof,
    numeric_operators_proof,
    numeric_mutation_proof,
    numeric_region_proof,
    raw_pointer_same,
    raw_pointer_hash,
    native_byte_copy,
    native_byte_offset,
)


def main() raises:
    _initialize_tsonic_package()
    assert_equal(language_proof(), 17)
    assert_equal(nested_finally_proof(False), 4)
    assert_equal(nested_finally_proof(True), 5)
    assert_equal(numeric_mutation_proof(), True)
    assert_equal(numeric_region_proof(), True)
    var first_byte = UInt8(41)
    var second_byte = UInt8(0)
    var first_pointer = Pointer(to=first_byte).unsafe_origin_cast[MutUnsafeAnyOrigin]()
    var second_pointer = Pointer(to=second_byte).unsafe_origin_cast[MutUnsafeAnyOrigin]()
    assert_equal(native_byte_copy(first_pointer, second_pointer), UInt8(41))
    assert_equal(second_byte, UInt8(41))
    assert_equal(native_byte_offset(first_pointer, 0), first_pointer)
    var first_address = Optional(RawPointer(UInt(Int(first_pointer))))
    var same_address = Optional(RawPointer(UInt(Int(first_pointer))))
    var other_address = Optional(RawPointer(UInt(Int(second_pointer))))
    var absent_address = Optional[RawPointer]()
    assert_equal(raw_pointer_same(first_address, same_address), True)
    assert_equal(raw_pointer_same(first_address, other_address), False)
    assert_equal(raw_pointer_same(first_address, absent_address), False)
    assert_equal(raw_pointer_same(absent_address, first_address), False)
    assert_equal(raw_pointer_same(absent_address, absent_address), True)
    assert_equal(raw_pointer_hash(first_address), raw_pointer_hash(same_address))
    assert_equal(raw_pointer_hash(absent_address), Float64(0))
    var bitwise = numeric_operators_proof(-1.0, 1.0)
    var expected: List[Float64] = [0.0, 1.0, -1.0, -2.0, -2.0, -1.0, 2147483647.0]
    for index in range(len(expected)):
        assert_equal(bitwise[index], expected[index])
    for shape in range(5):
        assert_equal(nested_invocation_error_proof(0.0, Float64(shape)), 1200.0)
        assert_equal(nested_invocation_error_proof(1.0, Float64(shape)), 1201.0)
        assert_equal(nested_invocation_error_proof(2.0, Float64(shape)), 1202.0)
        assert_equal(nested_invocation_error_proof(3.0, Float64(shape)), 103.0)
        assert_equal(nested_invocation_error_proof(-1.0, Float64(shape)), 1201.0)
        assert_equal(nested_invocation_error_proof(-2.0, Float64(shape)), 1202.0)
