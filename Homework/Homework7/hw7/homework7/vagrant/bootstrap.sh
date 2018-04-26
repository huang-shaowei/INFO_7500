#!/bin/bash

set -eu -o pipefail

apt-get update
curl -sL https://deb.nodesource.com/setup_6.x | bash -
apt-get install -y nodejs python2.7 make g++

npm config set python python2.7

npm -g install truffle mocha web3 ethereumjs-testrpc ethereumjs-abi ethereumjs-util crypto

# done!
echo
echo 'The homework 7 vagrant instance has been provisioned.'
echo "Use 'vagrant ssh' to open a terminal, 'vagrant suspend' to stop the instance, and 'vagrant destroy' to remove it."
