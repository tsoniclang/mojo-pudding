from std.testing import assert_equal
import tsonic_runtime
import mojo_proof_resources
from mojo_proof_resources import asynchronous_resource_proof, synchronous_resource_proof


def main() raises:
    mojo_proof_resources._initialize_tsonic_package()
    assert_equal(synchronous_resource_proof(), 21)
    assert_equal(tsonic_runtime.create_task(asynchronous_resource_proof()).wait(), 43)
