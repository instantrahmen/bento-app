#!/bin/sh
set -e

on_exit () {
	[ $? -eq 0 ] && exit
	echo 'ERROR: Feature "bun" (ghcr.io/shyim/devcontainers-features/bun) failed to install! Look at the documentation at ${documentation} for help troubleshooting this error.'
}

trap on_exit EXIT

set -a
. ../devcontainer-features.builtin.env
. ./devcontainer-features.env
set +a

echo ===========================================================================

echo 'Feature       : bun'
echo 'Description   : Bun is an all-in-one toolkit for JavaScript and TypeScript apps.'
echo 'Id            : ghcr.io/shyim/devcontainers-features/bun'
echo 'Version       : 0.0.1'
echo 'Documentation : https://github.com/shyim/devcontainers-features/tree/main/src/bun'
echo 'Options       :'
echo '    '
echo 'Environment   :'
printenv
echo ===========================================================================

chmod +x ./install.sh
./install.sh
