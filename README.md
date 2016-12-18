# secretin-windows
Pre-login integration of secretin to protect your domaine password

Waiting for official secretin-lib, you have to git clone https://github.com/secretin/secretin-lib (follow the building process) then link it `npm link` inside the secretin-lib directory.

You'll need global packages react-scripts, eslint, electron, electron-packager

Inside secretin-windows :

```
npm install
npm link secretin
npm start
```

You may need to npm rebuild for the good electron and node version with `npm rebuild --target=1.4.12 --dist-url=https://atom.io/download/electron --arch=x64 --abi=50`