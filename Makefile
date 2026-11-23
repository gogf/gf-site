.PHONY: build llms
build:
	cp versions.json versions.json.bak
	cp versions.build.json versions.json
	yarn run build
	mv versions.json.bak versions.json
	node scripts/generate-llms.mjs --out build

# llms.txt index plus per-page Markdown for AI agents (issue #330).
# `make build` already runs this after the site build. Use this target to
# regenerate the files into an existing ./build directory.
llms:
	node scripts/generate-llms.mjs --out build

.PHONY: examples
examples:
	./make-examples.sh

.PHONY: check
check:
	bash .github/workflows/consistency-check.sh
