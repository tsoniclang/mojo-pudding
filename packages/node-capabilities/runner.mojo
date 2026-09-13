from std.testing import assert_equal
from std.tempfile import mkdtemp
from tsonic_node import RmOptions, read_text_file, remove_path
from mojo_proof_node_capabilities import (
    compression_proof,
    event_proof,
    event_ordering_proof,
    file_contents_proof,
    modern_url_proof,
    stream_proof,
)
from mojo_proof_node_capabilities import buffer_allocation_proof
from mojo_proof_node_capabilities import buffer_predicate_proof
from mojo_proof_node_capabilities import stream_state_proof
from mojo_proof_node_capabilities import (
    begin_stream_completion,
    begin_stream_failure,
)
from mojo_proof_node_capabilities import begin_readable_events
from mojo_proof_node_capabilities import stream_read_sizes_proof
from mojo_proof_node_capabilities import path_glob_proof
from mojo_proof_node_capabilities import stream_decoding_proof
from mojo_proof_node_capabilities import begin_readline, begin_line_events
from tsonic_node.event_loop import run_event_loop


def main() raises:
    assert_equal(path_glob_proof(), True)
    assert_equal(buffer_allocation_proof(), "caabbbdd|0000")
    assert_equal(buffer_predicate_proof(), 2)
    assert_equal(compression_proof(), "payload")
    assert_equal(event_proof(), 11.0)
    assert_equal(event_ordering_proof(), 211.0)
    assert_equal(modern_url_proof(), "hello world|https://example.org/result")
    var root = mkdtemp(prefix="mojo-pudding-stream-")
    try:
        var sizes = stream_read_sizes_proof(root)
        var decoded = stream_decoding_proof(root)
        run_event_loop()
        assert_equal(sizes.call(()), "abc|def|gh")
        assert_equal(decoded.call(()), "😀|é|Z")
        var readers = begin_readable_events(root)
        assert_equal(readers.call(()), "")
        run_event_loop()
        assert_equal(readers.call(()), "data:shared\nanswer:shared:end:close")
        assert_equal(read_text_file(root + "/shared-output"), "shared\n")
        var answers = begin_readline(root)
        assert_equal(answers.call(()), "")
        run_event_loop()
        assert_equal(answers.call(()), "[😀][][last]")
        assert_equal(
            read_text_file(root + "/questions"), "first? second? third? "
        )
        var lines = begin_line_events(root)
        assert_equal(lines.call(()), "PR")
        run_event_loop()
        assert_equal(lines.call(()), "PRA[answer]L[]O[]L[😀]L[tail]PC")
        var completion = begin_stream_completion(root)
        assert_equal(completion.call(()), "")
        run_event_loop()
        assert_equal(completion.call(()), "abz")
        assert_equal(read_text_file(root + "/completion"), "éAB")
        var failure = begin_stream_failure(root)
        assert_equal(failure.call(()), "")
        run_event_loop()
        assert_equal(failure.call(()), "abzec")
        assert_equal(read_text_file(root + "/failed-completion"), "unchanged")
        assert_equal(stream_state_proof(root), "éa")
        assert_equal(file_contents_proof(root), "4100ff42|e9e900")
        var transfer = stream_proof(root)
        assert_equal(transfer.call(()), 0.0)
        run_event_loop()
        assert_equal(transfer.call(()), 33.0)
        assert_equal(read_text_file(root + "/output"), "yte")
    finally:
        remove_path(root, RmOptions(recursive=True))
