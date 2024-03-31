migrate:; @truffle migrate --reset
add:
	git add -A
	git commit -s -m "$(m)"
	git push