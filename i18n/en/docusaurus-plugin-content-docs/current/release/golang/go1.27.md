---
title: Go 1.27 (2026-08-19)
sidebar_position: 173
---

Go 1.27 arrives six months after [Go 1.26](https://go.dev/doc/go1.26). Most changes are in the toolchain, the runtime, and the implementations of the libraries. Go 1.27 continues to honor the [Go 1 compatibility promise](https://go.dev/doc/go1compat). We expect almost all Go programs to continue to compile and run as before.

## Language Changes

### Generic Methods

A method declaration may now declare its own type parameters. This lets generic functions live in the namespace of a specific type instead of at package scope.

For example, `math/rand/v2` adds the method `(*Rand) N[Int intType](Int) Int` alongside the package-level function `N[Int intType](Int) Int`.

Restrictions:

- Interface methods may not declare type parameters.
- Interface methods may not be implemented by generic methods.

### Struct Literal Keys

A key in a struct literal may now be any valid field selector of the struct type, not just a top-level field name (that is, embedded/promoted field paths are supported).

### Function Type Inference

Type inference for generic functions has been generalized to all contexts where a generic function is assigned (or converted) to a matching function type.

## Toolchain

### Response Files for Tools

`compile`, `link`, `asm`, `cgo`, `cover`, and `pack` now support response file (`@file`) parsing. The file contains whitespace-separated arguments and supports single- and double-quoted strings, escape sequences, and backslash-newline continuation. The format is GCC-compatible so it interoperates with existing build systems.

### Go Command

- **`bzr` support removed**: Modules hosted on Bazaar (`bzr`) servers can no longer be fetched directly.

- **GODEBUG compatibility**: The `go` command now recognizes `GODEBUG` settings whose support was removed (such as `asynctimerchan`), whether they appear as `godebug` entries in `go.mod` or as `//go:debug` comments in `.go` source files. They are accepted only when set to the final default value established before removal; setting them to an old value makes the `go` command fail. This keeps existing programs building and running unchanged, as required by the Go 1 compatibility promise.

### go test

- **`stdversion` check enabled by default**: The `stdversion` vet check now runs by default and reports uses of standard library symbols that are too new for the Go version in force (as determined by the `go` directive in `go.mod` and build tags).

- **`go test -json`**: `"Action":"output"` lines now carry an optional `"OutputType"` field. Current values are `"error"`, `"error-continue"`, and `"frame"`.

### go doc

- Supports `package@version` syntax, for example `go doc example.com/pkg@v1.2.3`.
- New `-ex` flag lists the executable examples of a package or symbol.
- Passing an example name (such as `go doc bytes.ExampleBuffer`) now prints the example's source code and comments.

### go fix

- New modernizers: `atomictypes`, `embedlit`, `slicesbackward`, and `unsafefuncs`.
- The `fmtappendf` analyzer has been removed (a stylistic concern).
- The `waitgroup` analyzer has been renamed to `waitgroupgo`.

### go mod tidy

For modules declaring `go 1.27` or later, `go mod tidy` now merges duplicate `require` blocks, leaving at most two: one for direct dependencies and one for indirect dependencies. Comments attached to dependencies are preserved; mixed direct/indirect comment blocks are merged and attached to the new direct block.

### gofmt

The column-alignment decision logic in `gofmt` and `go/format` has been fixed. The previous logic caused output to vary slightly across CPU architectures. The new logic changes alignment for a small number of files, so reformatting previously formatted code may produce minor whitespace changes.

### vet

The `printf` analyzer now reports calls such as `fmt.Errorf("...: %w", p)` where the `%w` operand `p` has type `*E` and `E` itself implements `error`. This is usually a latent bug that causes spurious failures of type assertions or `errors.Is`.

### go tool trace

`-http` now restricts the listen address to localhost when given only a port (such as `-http=:6060`), consistent with `go tool pprof`. To listen on all addresses, be explicit: `-http=0.0.0.0:6060`.

## Runtime

### Faster Memory Allocation

The compiler now emits calls to size-specialized allocation routines:

- Small allocations (under 80 bytes) are up to 30% cheaper.
- Allocation-heavy real programs are expected to gain about 1% overall.
- Binary size grows by about 60 KB, independent of the workload.
- Can be disabled with `GOEXPERIMENT=nosizespecializedmalloc` at build time; this option is expected to be removed in Go 1.28.

### Goroutine Leak Profile (GA)

The new `goroutineleak` profile type, experimental in Go 1.26, is now generally available in `runtime/pprof` and at the `net/http/pprof` endpoint `/debug/pprof/goroutineleak`.

- **Definition**: a goroutine blocked on a concurrency primitive (channels, `sync.Mutex`, `sync.Cond`, etc.) that can never become unblocked.
- **Detection**: based on GC reachability — if goroutine G blocks on primitive P and P is unreachable from any runnable goroutine (or any goroutine those could unblock), G can never wake up.
- **Limitation**: not all permanent blocks can be detected; leaks via primitives reachable through global variables or locals of runnable goroutines may be missed.
- The `goroutineleakprofile` `GOEXPERIMENT` has been deleted.

### Other

- **Traceback goroutine labels**: For modules with a `go` directive of 1.27 or later, traceback headers now include `runtime/pprof` goroutine labels. Disable with the `GODEBUG=tracebacklabels=0` setting added in Go 1.26, which is expected to be kept indefinitely for sensitive-information reasons.
- **`asynctimerchan` removed permanently**: The `asynctimerchan` `GODEBUG` introduced in Go 1.23 has been removed permanently; channels created by package `time` are now always unbuffered (synchronous).

## Compiler

- **`//line` directives**: Relative filenames in `//line` and `/*line*/` directives are now resolved against the directory of the containing file, matching `go/scanner`; absolute names are unaffected.
- **Simpler closure names**: Function literal symbol names are now chosen regardless of inlining and may merge multiple instances of the same literal to share code. There is no functional change, but tests asserting symbol names may need updates; also, programs that incorrectly compare function code pointers for equality may break more often, since closures with different captured data can share a code pointer.

## Linker

New `-macos` and `-macsdk` flags for macOS targets set the OS and SDK versions in `LC_BUILD_VERSION`. Defaults are 13.0.0, the oldest supported macOS, and 26.2.0, a recent SDK.

## Standard Library

### New Packages

#### encoding/json/v2 and encoding/json/jsontext

`encoding/json/v2` is a major revision of `encoding/json`, providing `Marshal`, `MarshalWrite`, `MarshalEncode`, `Unmarshal`, `UnmarshalRead`, and `UnmarshalDecode`, all accepting variadic `Options`. `encoding/json/jsontext` provides lower-level syntactic JSON processing: its `Encoder`/`Decoder` operate on sequences of `Token` and `Value` through a state machine that guarantees valid JSON.

Defaults are stricter and more interoperable than v1: invalid UTF-8 in strings is rejected, and duplicate names in objects are rejected.

`encoding/json` (v1) is now backed by the v2 implementation:

- Marshal and unmarshal behavior is preserved, but exact error message text may differ.
- New `Options` enable v1 semantics, so no full migration is required, and the v1 API remains supported.
- Marshal is broadly at parity in performance; unmarshal is significantly faster.
- Can be disabled with `GOEXPERIMENT=nojsonv2`, expected to be removed in a future release.

Changes made during the experiment period include: removal of the `format` tag option, the `unknown` tag option, the `DiscardUnknownMembers` marshal option, and the `SkipFunc` sentinel error; renaming of the `inline` tag to `embed`; updated `string` tag behavior and `MatchCaseInsensitiveNames` behavior; and numeric `Token` accessors in `jsontext` now also return errors.

#### crypto/mldsa

Implements the post-quantum ML-DSA signature scheme defined by [FIPS 204](https://csrc.nist.gov/pubs/fips/204/final). `crypto/x509` now supports ML-DSA private keys, public keys, and signatures; `crypto/tls` supports ML-DSA signatures in TLS 1.3 via the new `MLDSA44`, `MLDSA65`, and `MLDSA87` `SignatureScheme` values.

#### uuid

The new `uuid` package generates and parses UUIDs.

#### Experimental simd

Enabled via `GOEXPERIMENT=simd`, the `simd` package provides portable, vector-size-agnostic SIMD, using hardware instructions when available. It is available on all architectures, offers vector types of unspecified size (such as `Int8s` and `Float32s`), and supports a scalable subset of `simd/archsimd` operations that are hardware-supported or easily emulated.

#### Experimental simd/archsimd

Introduced in Go 1.26, `simd/archsimd` continues to evolve: the `amd64` API has been revised, and `arm64` (Neon) 128-bit SIMD plus WebAssembly 128-bit SIMD are now supported. 128-bit vector types are available on `arm64`, `wasm`, and `amd64`, with 256-bit and 512-bit types on some `amd64` CPUs. The API is not yet stable and remains intentionally architecture-specific and non-portable.

### Other Standard Library Changes

**I/O and Strings**:

- **bytes / strings**: New `CutLast` slices a byte slice or string around the last occurrence of a separator, simplifying common `LastIndex` uses.
- **compress/flate**: Compression is faster, but encoded output may differ from Go 1.26, affecting `archive/zip`, `compress/gzip`, `compress/zlib`, and `image/png`.

**Cryptography and Security**:

- **crypto**: New `MLDSAMu` `Hash` value as a signaling mechanism for external μ ML-DSA signing.
- **crypto/ecdsa**: `PrivateKey.Sign` now validates the hash length when `SignerOpts` is non-nil.
- **crypto/tls**: New `QUICConfig.ClientHelloInfoConn`, which sets the `net.Conn` for `ClientHelloInfo.Conn` in QUIC server handshakes; supports `MLKEM1024` key exchange (add it to `Config.CurvePreferences`); `Config.Rand` is deprecated in favor of `testing/cryptotest.SetGlobalRandom`; post-quantum hybrid key exchanges can be explicitly enabled even when `tlsmlkem=0`/`tlssecpmlkem=0` are set (those only affect the default set when `CurvePreferences` is nil); new `ConnectionState.LocalCertificate`; the `tlsunsafeekm`, `tlsrsakex`, `tls3des`, `tls10server`, and `x509keypairleaf` `GODEBUG` settings have been removed permanently.
- **crypto/x509**: `pkix.Name` parsing supports a wider range of `pkix.AttributeTypeAndValue.Value` types, with unknown types going into `asn1.RawValue`; new `RawSignatureAlgorithm` fields on `Certificate`, `CertificateRequest`, and `RevocationList` (the DER `AlgorithmIdentifier`, even when the algorithm is unknown); `SystemCertPool` now respects `SSL_CERT_FILE`/`SSL_CERT_DIR` on Windows and Darwin, loading roots from disk and using the native Go verifier, which can be disabled with `GODEBUG=x509sslcertoverrideplatform=0`.
- **crypto/x509/pkix**: `RDNSequence.String` (and therefore `Name.String`) now renders string-typed values as strings even for unrecognized OIDs (previously hex/DER).

**Database**:

- **database/sql**: New `ConvertAssign` exposes `Rows.Scan` conversions to drivers.
- **database/sql/driver**: New `RowsColumnScanner` interface for scanning directly into user destinations.

**Go Tooling**:

- **go/constant**: New `StringLen` returns the length of a string `Value` without constructing it.
- **go/scanner**: New `Scanner.End` retrieves a token's end position.
- **go/token**: `File` now has a `String` method.
- **go/types**: New `Hasher` (implementing `maphash.Hasher` while respecting `Identical`) and `HasherIgnoreTags` (for `IdenticalIgnoreTags`); the `gotypesalias` `GODEBUG` has been removed, so alias declarations always produce `Alias` nodes.

**Hashing and Math**:

- **hash/maphash**: New `Hasher` interface and a `ComparableHasher` implementation for comparable types where `Equal` is `==`.
- **math/big**: New `Int.Divide` computes quotient and remainder with `Trunc`, `Floor`, `Round`, and `Ceil` rounding modes.
- **math/rand/v2**: `Rand` gains a generic method `N` matching the top-level `N`.

**Networking and HTTP**:

- **net**: `UnixConn` read methods now return `io.EOF` directly instead of wrapping it in `net.OpError`.
- **net/http**: `Transport` and `Server` support TLS ALPN on user-supplied `net.Conn` values implementing `ConnectionState() tls.ConnectionState`; the HTTP/2 server accepts RFC 9218 client priority signals (disable round-robin with `Server.DisableClientPriority = true`); the HTTP/1 `Response.Body` now auto-drains unread content on close (up to a conservative limit) for better connection reuse, which is usually a no-op or an improvement but may cause rare performance regressions with excessive idle connections (remedy: `Transport.DisableKeepAlives = true`); new `Server.MaxHeaderValueCount` (default `DefaultMaxHeaderValueCount`).
- **net/http/httptest**: New `NewTestServer` provides a `Server` on an in-memory fake network, for use with `testing/synctest`.
- **net/url**: New `URL.Clone` and `Values.Clone` for deep copies.

**Runtime and Testing**:

- **runtime/secret**: Goroutines created in secret mode now themselves run in secret mode.
- **testing/synctest**: New `Sleep` helper combining `time.Sleep` and `synctest.Wait`.

**Other**:

- **syscall**: On Plan 9, `Errno` is now defined and implements `error` (it is never actually returned), enabling portable code to build without build constraints.
- **unicode**: Upgraded from Unicode 15 to Unicode 17.

## Platform Support

### Darwin (macOS)

Go 1.27 requires macOS 13 Ventura or later; earlier versions are no longer supported (as announced in Go 1.26).

### PowerPC

The `linux/ppc64` (big-endian 64-bit) toolchain now generates binaries using the ELFv2 system ABI (requiring Linux kernel 3.13+, which RHEL 7 backported to 3.10). `cgo`, PIE, and external linking are now supported, but require an ELFv2-compatible runtime (libc and all linked or loaded libraries). Non-cgo programs still produce static binaries with internal linking by default; to produce a static pure-Go binary when cgo options are enabled, set `CGO_ENABLED=0` when running `go build`.

## References

For more details, see the official release notes: [Go 1.27 Release Notes](https://go.dev/doc/go1.27)
