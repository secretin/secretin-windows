# secretin-windows
Pre-login integration of secretin to protect your domaine password

You'll need global packages react-scripts, eslint, electron, electron-packager

Inside secretin-windows :

```
yarn install
REACT_APP_API_SECRETIN=https://api.your-secret-in.me yarn start
```

Pick the robotjs release corresponding to your electron version and os https://github.com/octalmage/robotjs/releases
Otherwise, you may need to npm rebuild for the good electron and node version with `npm rebuild --target=x.y.z --dist-url=https://atom.io/download/electron --arch=x64 --abi=w`
