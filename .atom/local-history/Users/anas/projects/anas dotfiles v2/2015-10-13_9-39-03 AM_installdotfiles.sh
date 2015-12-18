echo ""
echo "------------------------------"
echo "creating aliases for all dot files in your home directory"
echo "------------------------------"
echo ""
backup_dir=".backup_old_dot_files"

for name in *; do
  if [[ $name = "coffeelint.json" ]]; then
    target="$HOME/$name"
  else
    target="$HOME/.$name"
  fi

  # ignore *.md and *.sh files
  if [[ ${name: -3} != ".sh" && ${name: -3} != ".md" ]]; then
    # check if file already exists
    if [ -e "$target" ]; then
      # check if file is a symlink.
      # if it is symlink we just delete it
      # if it's a real file we back it up
      if [ ! -L "$target" ]; then
        # create backup dir if it's not there
        if [ ! -d "$HOME/$backup_dir" ]; then
          mkdir -p "$HOME/$backup_dir"
        fi
        echo "Backing up .$name in $HOME/$backup_dir/ directory"
        cp "$target" "$HOME/$backup_dir/.$name"
      fi
      rm -rf "$target"
    fi

    echo "Creating $target"
    ln -s "$PWD/$name" "$target"
  fi

done