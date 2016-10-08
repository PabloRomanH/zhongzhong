#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
cd ..
rm zhongzhong.zip
zip -r zhongzhong.zip zhongzhong --exclude \*/.\*
echo "File created: ../zhongzhong.zip"
