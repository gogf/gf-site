.PHONY: build
build:
	cp versions.json versions.json.bak
	cp versions.build.json versions.json
	yarn run build
	mv versions.json.bak versions.json

.PHONY: examples
examples:
	./make-examples.sh

.PHONY: check
check:
	bash .github/workflows/consistency-check.sh
