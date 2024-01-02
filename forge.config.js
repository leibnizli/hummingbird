module.exports = {
  packagerConfig: {
    icon: "./src/images/icon",
  },
  rebuildConfig: {},

  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './src/images/icon.icns',
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "leibnizli",
          name: "hummingbird"
        },
        draft: true
      }
    }
  ],
  plugins: [],
};
