from std.testing import assert_equal
import tsonic_runtime
import mojo_proof_resources.App
from mojo_proof_resources import asynchronousResourceProof, synchronousResourceProof


def main() raises:
    mojo_proof_resources.App.initializeTsonicModule()
    assert_equal(synchronousResourceProof(), 21)
    assert_equal(tsonic_runtime.create_task(asynchronousResourceProof()).wait(), 43)
