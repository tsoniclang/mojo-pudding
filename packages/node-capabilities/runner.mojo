from std.testing import assert_equal
from std.tempfile import mkdtemp
from tsonic_node import RmOptions, read_text_file, remove_path
from mojo_proof_node_capabilities import compression_proof, event_proof, event_ordering_proof, file_contents_proof, modern_url_proof, stream_proof
from mojo_proof_node_capabilities import buffer_allocation_proof
from mojo_proof_node_capabilities import stream_state_proof
from mojo_proof_node_capabilities import begin_stream_completion
from mojo_proof_node_capabilities import stream_read_sizes_proof
from mojo_proof_node_capabilities import path_glob_proof
from mojo_proof_node_capabilities import buffer_value_proof
from mojo_proof_node_capabilities import stream_decoding_proof
from mojo_proof_node_capabilities import begin_readline
from tsonic_node.event_loop import run_event_loop


def main() raises:
    assert_equal(path_glob_proof(), True)
    assert_equal(buffer_value_proof(), '{"type":"Buffer","data":[1,9,3]}|{"0":1,"1":9,"2":3}')
    assert_equal(buffer_allocation_proof(), "caabbbdd|0000")
    assert_equal(compression_proof(), "payload")
    assert_equal(event_proof(), 11.0)
    assert_equal(event_ordering_proof(), 211.0)
    assert_equal(modern_url_proof(), "hello world|https://example.org/result")
    var root = mkdtemp(prefix="mojo-pudding-stream-")
    try:
        assert_equal(stream_read_sizes_proof(root), "abc|def|gh")
        assert_equal(stream_decoding_proof(root), "😀|é|Z")
        var answers = begin_readline(root)
        assert_equal(answers.call(()), "")
        run_event_loop()
        assert_equal(answers.call(()), "[😀][][last]")
        assert_equal(read_text_file(root + "/questions"), "first? second? third? ")
        var completion = begin_stream_completion(root)
        assert_equal(completion.call(()), "")
        run_event_loop()
        assert_equal(completion.call(()), "abz")
        assert_equal(read_text_file(root + "/completion"), "éAB")
        assert_equal(stream_state_proof(root), "éa")
        assert_equal(file_contents_proof(root), "4100ff42|e9e900")
        var transfer = stream_proof(root)
        assert_equal(transfer.call(()), 0.0)
        run_event_loop()
        assert_equal(transfer.call(()), 33.0)
        assert_equal(read_text_file(root + "/output"), "yte")
    finally:
        remove_path(root, RmOptions(recursive=True))
