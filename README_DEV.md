### Setup Development Environment

To develop Homebridge plugins you must have Node.js 18 or later installed, and a modern code editor such as [VS Code](https://code.visualstudio.com/). This plugin template uses [TypeScript](https://www.typescriptlang.org/) to make development easier and comes with pre-configured settings for [VS Code](https://code.visualstudio.com/) and ESLint. If you are using VS Code install these extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Install Development Dependencies

Using a terminal, navigate to the project folder and run this command to install the development dependencies:

```shell
$ npm install
```

### Build Plugin

TypeScript needs to be compiled into JavaScript before it can run. The following command will compile the contents of your [`src`](./src) directory and put the resulting code into the `dist` folder.

```shell
$ npm run build
```

### Link To Homebridge

> Linking does not work as the original documentation describes because you
> are likely running this dev envrionment on a real computer and not a
> raspberry pi with the HB image. The following is a workaround.

```
sudo npx hb-service install
npm run watch
# Ctrl + C to stop the homebridge instance after it finishes its boot
sudo npx hb-service uninstall
```

At this point the module has been linked and live refreshes should work with
the following command:
```
npm run watch
```

### Watch For Changes and Build Automatically

If you want to have your code compile automatically as you make changes, and restart Homebridge automatically between changes, you first need to add your plugin as a platform in `~/.homebridge/config.json`:
```
{
...
    "platforms": [
        {
            "name": "Config",
            "port": 8581,
            "platform": "config"
        },
    {
        "name": "AmbientWeatherSensors",
        "apiKey": "REDACTED",
        "applicationKey": "REDACTED",
        "temperatureSensors": true,
        "humiditySensors": false,
        "solarRadiationSensors": true,
        "platform": "AmbientWeatherSensors"
    }
    ]
}
```

and then you can run:

```shell
$ npm run watch
```

This will launch an instance of Homebridge in debug mode which will restart every time you make a change to the source code. It will load the config stored in the default location under `~/.homebridge`. You may need to stop other running instances of Homebridge while using this command to prevent conflicts. You can adjust the Homebridge startup command in the [`nodemon.json`](./nodemon.json) file.

### Customise Plugin

You can now start customising the plugin template to suit your requirements.

- [`src/platform.ts`](./src/platform.ts) - this is where your device setup and discovery should go.
- [`src/platformAccessory.ts`](./src/platformAccessory.ts) - this is where your accessory control logic should go, you can rename or create multiple instances of this file for each accessory type you need to implement as part of your platform plugin. You can refer to the [developer documentation](https://developers.homebridge.io/) to see what characteristics you need to implement for each service type.
- [`config.schema.json`](./config.schema.json) - update the config schema to match the config you expect from the user. See the [Plugin Config Schema Documentation](https://developers.homebridge.io/#/config-schema).

### Versioning Your Plugin

Given a version number `MAJOR`.`MINOR`.`PATCH`, such as `1.4.3`, increment the:

1. **MAJOR** version when you make breaking changes to your plugin,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

You can use the `npm version` command to help you with this:

```shell
# major update / breaking changes
$ npm version major

# minor update / new features
$ npm version minor

# patch / bugfixes
$ npm version patch
```

### Publish Package

When you are ready to publish your plugin to [npm](https://www.npmjs.com/), make sure you have removed the `private` attribute from the [`package.json`](./package.json) file then run:

```shell
$ npm publish
```

If you are publishing a scoped plugin, i.e. `@username/homebridge-xxx` you will need to add `--access=public` to command the first time you publish.

#### Publishing Beta Versions

You can publish *beta* versions of your plugin for other users to test before you release it to everyone.

```shell
# create a new pre-release version (eg. 2.1.0-beta.1)
$ npm version prepatch --preid beta

# publish to @beta
$ npm publish --tag=beta
```

Users can then install the  *beta* version by appending `@beta` to the install command, for example:

```shell
$ sudo npm install -g homebridge-example-plugin@beta
```

### Best Practices
Consider creating your plugin with the [Homebridge Verified](https://github.com/homebridge/verified) criteria in mind. This will help you to create a plugin that is easy to use and works well with Homebridge.
You can then submit your plugin to the Homebridge Verified list for review.
The most up-to-date criteria can be found [here](https://github.com/homebridge/verified#requirements).
For reference, the current criteria are:

- The plugin must successfully install.
- The plugin must implement the [Homebridge Plugin Settings GUI](https://github.com/oznu/homebridge-config-ui-x/wiki/Developers:-Plugin-Settings-GUI).
- The plugin must not start unless it is configured.
- The plugin must not execute post-install scripts that modify the users' system in any way.
- The plugin must not contain any analytics or calls that enable you to track the user.
- The plugin must not throw unhandled exceptions, the plugin must catch and log its own errors.
- The plugin must be published to npm and the source code available on GitHub.
  - A GitHub release - with patch notes - should be created for every new version of your plugin.
- The plugin must run on all [supported LTS versions of Node.js](https://github.com/homebridge/homebridge/wiki/How-To-Update-Node.js), at the time of writing this is Node.js v16 and v18.
- The plugin must not require the user to run Homebridge in a TTY or with non-standard startup parameters, even for initial configuration.
- If the plugin needs to write files to disk (cache, keys, etc.), it must store them inside the Homebridge storage directory.

### Useful Links
Note these links are here for help but are not supported/verified by the Homebridge team
- [Custom Characteristics](https://github.com/homebridge/homebridge-plugin-template/issues/20)
