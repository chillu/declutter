usage() {
	echo "usage: $0 icon_path splash_path colour [dest_dir]";
	exit 1;
}

[ "$1" ] && [ "$2" ] && [ "$3" ] || usage
[ "$4" ] || set "$1" "$2" "$3" "."

icon_path=$1
splash_path=$2
colour=$3
dest_dir=$4

devices=android,ios,windows-phone
eval mkdir -p "$dest_dir/res/{icon,screen}/{$devices}"

# Show the user some progress by outputing all commands being run.
set -x

cmd_convert="convert -background $colour -gravity center"
cmd_mogrify="mogrify -background $colour -gravity center"
cmd_rsvg="rsvg-convert --background-color=$colour"

# Favicon
$cmd_rsvg -w 16 -h 16 -f png $icon_path 1> "$dest_dir/favicon.png"
$cmd_convert "$dest_dir/favicon.png" "$dest_dir/favicon.ico"
rm "$dest_dir/favicon.png"

# Icons
$cmd_rsvg -w 128 -h 128 -f png $icon_path 1> "$dest_dir/res/icon/icon.png"
$cmd_rsvg -w 36 -h 36 -f png $icon_path 1> "$dest_dir/res/icon/android/icon-36-ldpi.png"
$cmd_rsvg -w 72 -h 72 -f png $icon_path 1> "$dest_dir/res/icon/android/icon-72-hdpi.png"
$cmd_rsvg -w 48 -h 48 -f png $icon_path 1> "$dest_dir/res/icon/android/icon-48-mdpi.png"
$cmd_rsvg -w 96 -h 96 -f png $icon_path 1> "$dest_dir/res/icon/android/icon-96-xhdpi.png"
$cmd_rsvg -w 57 -h 57 -f png $icon_path 1> "$dest_dir/res/icon/ios/icon-57.png"
$cmd_rsvg -w 114 -h 114 -f png $icon_path 1> "$dest_dir/res/icon/ios/icon-57-2x.png"
$cmd_rsvg -w 60 -h 60 -f png $icon_path 1> "$dest_dir/res/icon/ios/icon-60.png"
$cmd_rsvg -w 120 -h 120 -f png $icon_path 1> "$dest_dir/res/icon/ios/icon-60-2x.png"
$cmd_rsvg -w 72 -h 72 -f png $icon_path 1> "$dest_dir/res/icon/ios/icon-72.png"
$cmd_rsvg -w 144 -h 144 -f png $icon_path 1> "$dest_dir/res/icon/ios/icon-72-2x.png"
$cmd_rsvg -w 76 -h 76 -f png $icon_path 1> "$dest_dir/res/icon/ios/icon-76.png"
$cmd_rsvg -w 152 -h 152 -f png $icon_path 1> "$dest_dir/res/icon/ios/icon-76-2x.png"
$cmd_rsvg -w 48 -h 48 -f png $icon_path 1> "$dest_dir/res/icon/windows-phone/icon-48.png"
$cmd_rsvg -w 173 -h 173 -f png $icon_path 1> "$dest_dir/res/icon/windows-phone/icon-173-tile.png"
$cmd_rsvg -w 62 -h 62 -f png $icon_path 1> "$dest_dir/res/icon/windows-phone/icon-62-tile.png"

# Splash Screens
$cmd_rsvg -w 512 -h 512 -f png $splash_path 1> "$dest_dir/res/screen/android/screen-xhdpi-landscape.png"
$cmd_rsvg -w 256 -h 256 -f png $splash_path 1> "$dest_dir/res/screen/android/screen-hdpi-portrait.png"
$cmd_rsvg -w 128 -h 128 -f png $splash_path 1> "$dest_dir/res/screen/android/screen-ldpi-landscape.png"
$cmd_rsvg -w 512 -h 512 -f png $splash_path 1> "$dest_dir/res/screen/android/screen-xhdpi-portrait.png"
$cmd_rsvg -w 256 -h 256 -f png $splash_path 1> "$dest_dir/res/screen/android/screen-mdpi-portrait.png"
$cmd_rsvg -w 256 -h 256 -f png $splash_path 1> "$dest_dir/res/screen/android/screen-mdpi-landscape.png"
$cmd_rsvg -w 128 -h 128 -f png $splash_path 1> "$dest_dir/res/screen/android/screen-ldpi-portrait.png"
$cmd_rsvg -w 256 -h 256 -f png $splash_path 1> "$dest_dir/res/screen/android/screen-hdpi-landscape.png"
$cmd_rsvg -w 256 -h 256 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-iphone-portrait.png"
$cmd_rsvg -w 512 -h 512 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-iphone-landscape-2x.png"
$cmd_rsvg -w 512 -h 512 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-iphone-portrait-568h-2x.png"
$cmd_rsvg -w 256 -h 256 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-iphone-landscape.png"
$cmd_rsvg -w 512 -h 512 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-ipad-portrait.png"
$cmd_rsvg -w 1024 -h 1024 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-ipad-portrait-2x.png"
$cmd_rsvg -w 512 -h 512 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-ipad-landscape.png"
$cmd_rsvg -w 512 -h 512 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-iphone-portrait-2x.png"
$cmd_rsvg -w 1024 -h 1024 -f png $splash_path 1> "$dest_dir/res/screen/ios/screen-ipad-landscape-2x.png"
$cmd_rsvg -w 256 -h 256 -f png $splash_path 1> "$dest_dir/res/screen/windows-phone/screen-portrait.jpg"

$cmd_mogrify -extent 1280x720 "$dest_dir/res/screen/android/screen-xhdpi-landscape.png"
$cmd_mogrify -extent 480x800 "$dest_dir/res/screen/android/screen-hdpi-portrait.png"
$cmd_mogrify -extent 320x200 "$dest_dir/res/screen/android/screen-ldpi-landscape.png"
$cmd_mogrify -extent 720x1280 "$dest_dir/res/screen/android/screen-xhdpi-portrait.png"
$cmd_mogrify -extent 320x480 "$dest_dir/res/screen/android/screen-mdpi-portrait.png"
$cmd_mogrify -extent 480x320 "$dest_dir/res/screen/android/screen-mdpi-landscape.png"
$cmd_mogrify -extent 200x320 "$dest_dir/res/screen/android/screen-ldpi-portrait.png"
$cmd_mogrify -extent 800x480 "$dest_dir/res/screen/android/screen-hdpi-landscape.png"
$cmd_mogrify -extent 320x480 "$dest_dir/res/screen/ios/screen-iphone-portrait.png"
$cmd_mogrify -extent 960x640 "$dest_dir/res/screen/ios/screen-iphone-landscape-2x.png"
$cmd_mogrify -extent 640x1136 "$dest_dir/res/screen/ios/screen-iphone-portrait-568h-2x.png"
$cmd_mogrify -extent 480x320 "$dest_dir/res/screen/ios/screen-iphone-landscape.png"
$cmd_mogrify -extent 768x1004 "$dest_dir/res/screen/ios/screen-ipad-portrait.png"
$cmd_mogrify -extent 1536x2008 "$dest_dir/res/screen/ios/screen-ipad-portrait-2x.png"
$cmd_mogrify -extent 1024x783 "$dest_dir/res/screen/ios/screen-ipad-landscape.png"
$cmd_mogrify -extent 640x960 "$dest_dir/res/screen/ios/screen-iphone-portrait-2x.png"
$cmd_mogrify -extent 2008x1536 "$dest_dir/res/screen/ios/screen-ipad-landscape-2x.png"
$cmd_mogrify -extent 480x800 "$dest_dir/res/screen/windows-phone/screen-portrait.jpg"

# Copy to ios
cp "$dest_dir/res/icon/ios/icon-57.png" "platforms/ios/Declutter/Resources/icons/icon.png"
cp "$dest_dir/res/icon/ios/icon-57-2x.png" "platforms/ios/Declutter/Resources/icons/icon@2x.png"
cp "$dest_dir/res/icon/ios/icon-60.png" "platforms/ios/Declutter/Resources/icons/icon-60.png"
cp "$dest_dir/res/icon/ios/icon-60-2x.png" "platforms/ios/Declutter/Resources/icons/icon-60@2x.png"
cp "$dest_dir/res/icon/ios/icon-72.png" "platforms/ios/Declutter/Resources/icons/icon-72.png"
cp "$dest_dir/res/icon/ios/icon-72-2x.png" "platforms/ios/Declutter/Resources/icons/icon-72@2x.png"
cp "$dest_dir/res/icon/ios/icon-76.png" "platforms/ios/Declutter/Resources/icons/icon-76.png"
cp "$dest_dir/res/icon/ios/icon-76-2x.png" "platforms/ios/Declutter/Resources/icons/icon-76@2x.png"
cp "$dest_dir/res/screen/ios/screen-ipad-portrait.png" "platforms/ios/Declutter/Resources/splash/Default-Portrait~ipad.png"
cp "$dest_dir/res/screen/ios/screen-ipad-portrait-2x.png" "platforms/ios/Declutter/Resources/splash/Default-Portrait@2x~ipad.png"
cp "$dest_dir/res/screen/ios/screen-ipad-landscape-2x.png" "platforms/ios/Declutter/Resources/splash/Default-Landscape@2x~ipad.png"
cp "$dest_dir/res/screen/ios/screen-ipad-landscape.png" "platforms/ios/Declutter/Resources/splash/Default-Landscape~ipad.png"
cp "$dest_dir/res/screen/ios/screen-iphone-portrait.png" "platforms/ios/Declutter/Resources/splash/Default~iphone.png"
cp "$dest_dir/res/screen/ios/screen-iphone-portrait-2x.png" "platforms/ios/Declutter/Resources/splash/Default@2x~iphone.png"
cp "$dest_dir/res/screen/ios/screen-iphone-portrait-568h-2x.png" "platforms/ios/Declutter/Resources/splash/Default-568h@2x~iphone.png"