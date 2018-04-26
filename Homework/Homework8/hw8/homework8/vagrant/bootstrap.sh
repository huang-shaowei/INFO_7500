#!/bin/bash

set -eu -o pipefail

DEBIAN_FRONTEND=noninteractive apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y git
curl -sL https://deb.nodesource.com/setup_9.x | bash -
DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs python2.7 make g++

npm config set python python2.7

npm -g install truffle ganache-cli

# done!
echo
echo 'The homework 8 vagrant instance has been provisioned.'
echo "Use 'vagrant ssh' to open a terminal, 'vagrant suspend' to stop the instance, and 'vagrant destroy' to remove it."