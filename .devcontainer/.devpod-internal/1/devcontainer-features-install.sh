#!/bin/sh
set -e

on_exit () {
	[ $? -eq 0 ] && exit
	echo 'ERROR: Feature "Tailscale" (ghcr.io/tailscale/codespace/tailscale) failed to install! Look at the documentation at ${documentation} for help troubleshooting this error.'
}

trap on_exit EXIT

set -a
. ../devcontainer-features.builtin.env
. ./devcontainer-features.env
set +a

echo ===========================================================================

echo 'Feature       : Tailscale'
echo 'Description   : Connect to your tailnet in your development container'
echo 'Id            : ghcr.io/tailscale/codespace/tailscale'
echo 'Version       : 1.0.6'
echo 'Documentation : https://tailscale.com/kb/1160/github-codespaces/'
echo 'Options       :'
echo '    VERSION="latest"'
echo 'Environment   :'
printenv
echo ===========================================================================

chmod +x ./install.sh
./install.sh
