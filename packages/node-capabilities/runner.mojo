from std.testing import assert_equal
from std.tempfile import mkdtemp
from tsonic_node import RmOptions, read_text_file, remove_path
from mojo_proof_node_capabilities import compression_proof, event_proof, modern_url_proof, stream_proof


def main() raises:
    assert_equal(compression_proof(), "payload")
    assert_equal(event_proof(), 11.0)
    assert_equal(modern_url_proof(), "hello world|https://example.org/result")
    var root = mkdtemp(prefix="mojo-pudding-stream-")
    try:
        assert_equal(stream_proof(root), 33.0)
        assert_equal(read_text_file(root + "/output"), "yte")
    finally:
        remove_path(root, RmOptions(recursive=True))
