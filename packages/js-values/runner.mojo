from std.testing import assert_equal
from mojo_proof_js_values import (
    erased_callback_bridge_proof,
    immediate_callback_proof,
    json_projection_proof,
    structural_value_proof,
)


def main() raises:
    assert_equal(json_projection_proof(), '{"nested":"nested:value"}')
    assert_equal(structural_value_proof(), "after")
    assert_equal(immediate_callback_proof(), 18.0)
    assert_equal(erased_callback_bridge_proof(), 2.0)
