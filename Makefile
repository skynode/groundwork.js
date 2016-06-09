.PHONY: publish update

VERSION := $(shell node -pe "require('./package.json').version")

CDNJS := //cdn.thegroundwork.com/groundworkjs/$(VERSION)/groundwork.min.js

DEVJS := http://localhost:8080/groundwork.js

update:
	./replace.sh $(VERSION)
	node ./transformer.js $(CDNJS)

devlocal:
	node ./transformer.js $(DEVJS)

publish:
	aws s3 sync dist s3://cdn.thegroundwork.com/groundworkjs/$(VERSION) --region=us-east-1
	aws s3 sync doc s3://cdn.thegroundwork.com/groundworkjs/doc --region=us-east-1
	aws s3 sync examples s3://cdn.thegroundwork.com/groundworkjs/examples --region=us-east-1
	aws s3 cp index.html s3://cdn.thegroundwork.com/groundworkjs/index.html --region=us-east-1

develop: devlocal
	NODE_ENV=dev ./node_modules/.bin/webpack-dev-server --devtool eval-source-map --progress --colors --content-base src/

example:
	open http://localhost:3030 && node ./example-server.js
