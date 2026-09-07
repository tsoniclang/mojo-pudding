from std.testing import assert_equal
import mojo_proof_js_values
from mojo_proof_js_values import (
    argument_assignment_proof,
    argument_value_proof,
    erased_callback_bridge_proof,
    immediate_callback_proof,
    json_projection_proof,
    native_callable_prelude_proof,
    numeric_mutation_proof,
    numeric_region_proof,
    optional_array_proof,
    optional_union_map_proof,
    template_primitive_proof,
    structural_value_proof,
    template_boundary_order_proof,
    template_value_proof,
)


def main() raises:
    mojo_proof_js_values._initialize_tsonic_package()
    assert_equal(json_projection_proof(), '{"nested":"nested:value"}')
    assert_equal(structural_value_proof(), "after")
    assert_equal(immediate_callback_proof(), 18.0)
    assert_equal(erased_callback_bridge_proof(), 2.0)
    assert_equal(argument_value_proof(), "before|tail")
    assert_equal(argument_assignment_proof(), "before|after")
    assert_equal(template_value_proof(), "before|tail")
    assert_equal(template_boundary_order_proof(), 0.0)
    assert_equal(native_callable_prelude_proof(False), "A")
    assert_equal(numeric_mutation_proof(), True)
    assert_equal(numeric_region_proof(), True)
    assert_equal(optional_array_proof(), True)
    assert_equal(optional_union_map_proof(), True)
    assert_equal(template_primitive_proof(), True)
