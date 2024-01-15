module.exports = {
  packagerConfig: {
    // dir: "./app",
    //ignore: [".idea", ".gitignore", "^/src", "^/demo", "^/dist"],
    ignore: [".idea", ".gitignore", "^/.env$", "^/src", "^/demo", "^/dist"],
    icon: "./build/icon",
    // osxNotarize: {
    //   tool: 'notarytool',
    //   appleApiKey: process.env.APPLE_API_KEY,
    //   appleApiKeyId: process.env.APPLE_API_KEY_ID,
    //   appleApiIssuer: process.env.APPLE_API_ISSUER
    // }
  },
  rebuildConfig: {},

  makers: [
    {
      name: '@electron-forge/maker-squirrel'
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './build/icon.icns',
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
