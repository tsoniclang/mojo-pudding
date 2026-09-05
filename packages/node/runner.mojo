from std.testing import assert_equal
from mojo_proof_node import read_fixture


def main() raises:
    assert_equal(
        read_fixture("packages/node/fixture.txt"),
        "Mojo Pudding fixture\n",
    )
