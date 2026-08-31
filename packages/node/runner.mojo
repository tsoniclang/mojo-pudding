from std.testing import assert_equal
from mojo_proof_node import readFixture


def main() raises:
    assert_equal(
        readFixture("packages/node/fixture.txt"),
        "Mojo Pudding fixture\n",
    )
