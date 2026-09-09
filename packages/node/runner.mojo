from std.testing import assert_equal, assert_true
from mojo_proof_node import path_collection_proof, read_fixture


def main() raises:
    assert_true(path_collection_proof())
    assert_equal(
        read_fixture("packages/node/fixture.txt"),
        "Mojo Pudding fixture\n",
    )
