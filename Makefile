INTE  = test/integration/*.js

inte:
	@NODE_ENV=test ./node_modules/.bin/mocha \
			--require should \
			--reporter list \
			--slow 20 \
			--growl \
			$(INTE)

.PHONY: inte