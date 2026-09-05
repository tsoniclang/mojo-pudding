from std.testing import assert_equal
import mojo_proof_project_dispatch
from mojo_proof_project_dispatch import (
    bound_method_proof,
    error_union_proof,
    inheritance_and_interface_proof,
    overload_proof,
    recursive_construction_proof,
    retained_callable_proof,
)


def main() raises:
    mojo_proof_project_dispatch._initialize_tsonic_package()
    assert_equal(inheritance_and_interface_proof(), 22)
    assert_equal(overload_proof(), "abc")
    assert_equal(bound_method_proof(), 2)
    assert_equal(recursive_construction_proof(), 9)
    assert_equal(retained_callable_proof(), 8)
    assert_equal(error_union_proof(), "Error: source|other")
