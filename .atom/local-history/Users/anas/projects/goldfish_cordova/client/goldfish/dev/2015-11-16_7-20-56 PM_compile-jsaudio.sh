
ERROR_MESSAGE=" \e[31mError! :(\e[0m\n"

on_error() {
  printf "$ERROR_MESSAGE"
  exit 1
}

trap 'on_error' err

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JSAUDIO_DIR=$SCRIPT_DIR/../../../jsaudio
TARGET_DIR=$SCRIPT_DIR/features/jsaudio

BLUE='\e[34m'
GREEN='\e[32m'
RESET='\e[0m'

DOT="${BLUE}•${RESET}"
OK_MESSAGE=" ${GREEN}OK${RESET}\n"

print_ok() {
  printf "$OK_MESSAGE"
}

printf " ${DOT} Looking for JSAudio..."

if [ ! -d "$JSAUDIO_DIR" ]; then
  printf "$ERROR_MESSAGE"
  echo "JSAudio wasn't found! Please add JSAudio to ../jsaudio"
  exit
fi

print_ok

##
##

printf " ${DOT} Initializing...\n"

cd $JSAUDIO_DIR
gulp clean > /dev/null
npm prune --loglevel error > /dev/null
npm install --loglevel error > /dev/null
print_ok

##
##

printf " ${DOT} Compiling..."

cd $JSAUDIO_DIR
gulp production > /dev/null
print_ok

##
##

printf " ${DOT} Removing previous jsaudio..."

if [ -d "$TARGET_DIR" ]; then
  rm -r $TARGET_DIR
fi

print_ok

printf " ${DOT} Copying to ./client/jsaudio..."

cd $SCRIPT_DIR
cp -r $JSAUDIO_DIR/public $TARGET_DIR
print_ok

##
##

echo -e "${GREEN} Success! :) ${RESET}"
