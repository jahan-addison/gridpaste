#!/bin/bash

#
# Install common dependencies
#

apt-get update
apt-get install -y --no-install-recommends \
                        apt-transport-https \
                        ca-certificates \
                        curl \
                        gnupg2 \
                        dirmngr \
                        software-properties-common \
                        build-essential \
                        libffi-dev \
                        tk-dev \
                        uuid-dev \
                        libssl-dev \
                        libbz2-dev


#
# Install Python
#

PYTHON_GPG_KEY=0D96DF4D4110E5C43FBFB17F2D347EA6AA65421D
PYTHON_VERSION=3.7.3
PYTHON_PIP_VERSION=19.1

wget -O python.tar.xz "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz"
wget -O python.tar.xz.asc "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz.asc"
export GNUPGHOME="$(mktemp -d)"
gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$PYTHON_GPG_KEY"
gpg --batch --verify python.tar.xz.asc python.tar.xz
{ command -v gpgconf > /dev/null && gpgconf --kill all || :; }
mkdir -p /usr/src/python
tar -xJC /usr/src/python --strip-components=1 -f python.tar.xz
rm -f python.tar.xz
cd /usr/src/python
gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)"
./configure \
		--build="$gnuArch" \
		--enable-loadable-sqlite-extensions \
		--enable-shared \
		--with-system-expat \
		--with-system-ffi \
		--without-ensurepip
make -j "$(nproc)"
make altinstall
ldconfig
find /usr/local -depth \
		\( \
			\( -type d -a \( -name test -o -name tests \) \) \
			-o \
			\( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
		\) -exec rm -rf '{}' +
rm -rf /usr/src/python

cd /usr/local/bin
ln -s idle3.7 idle
ln -s pydoc3.7 pydoc
ln -s python3.7 python
ln -s python3.7 python3
ln -s python3.7m-config python-config

python3 --version

cd

wget -O get-pip.py https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py \
    --disable-pip-version-check \
    --no-cache-dir \
    "pip==$PYTHON_PIP_VERSION"
pip --version
find /usr/local -depth \
    \( \
        \( -type d -a \( -name test -o -name tests \) \) \
        -o \
        \( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
    \) -exec rm -rf '{}' +
rm -f get-pip.py

#
# Install Docker CE
#

echo "Installing Docker CE via pip..."

pip install docker docker-compose

#
# Clean up
#

rm -rf /var/lib/apt/lists/*
