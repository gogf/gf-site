.PHONY: build
build:
	rm versions.json
	cp versions.build.json versions.json
	yarn run build

.PHONY: examples
examples:
	./make-examples.sh