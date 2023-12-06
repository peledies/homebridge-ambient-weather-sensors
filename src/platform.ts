import { API, Characteristic, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service } from 'homebridge';

import { HumidityAccessory } from './humidityAccessory';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { TemperatureAccessory } from './temperatureAccessory';
import { DEVICE } from './types';


import fetch from 'node-fetch';

export class AmbientWeatherSensorsPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', this.config.platform);

    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your devices as accessories
      this.discoverDevices();
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    this.accessories.push(accessory);
  }

  parseDevices(json) {
    const humiditySensors:DEVICE[] = [];
    const temperatureSensors:DEVICE[] = [];

    let temperatureDevices;
    let humidityDevices;

    if (Array.isArray(json)) {
      json.forEach( (obj) => {
        temperatureDevices = Object.fromEntries(Object.entries(obj.lastData).filter(([key]) => key.includes('temp')));

        Object.entries(temperatureDevices).forEach( (device) => {
          temperatureSensors.push({
            macAddress: obj.macAddress,
            uniqueId: `${obj.macAddress}-${device[0]}`,
            displayName: `${obj.macAddress}-${device[0]}`,
            value: device[1] as number,
          });
        });


        humidityDevices = Object.fromEntries(Object.entries(obj.lastData).filter(([key]) => key.includes('humid')));
        Object.entries(humidityDevices).forEach( (device) => {
          humiditySensors.push({
            macAddress: obj.macAddress,
            uniqueId: `${obj.macAddress}-${device[0]}`,
            displayName: `${obj.macAddress}-${device[0]}`,
            value: device[1] as number,
          });
        });
      });
    }
    return [temperatureSensors, humiditySensors];
  }

  sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  async fetchDevices() {
    this.log.info('Fetching sensors from Ambient Weather API');

    try {
      const url = `https://rt.ambientweather.net/v1/devices?applicationKey=${this.config.applicationKey}&apiKey=${this.config.apiKey}`;
      const response = await fetch(url);

      // request is being throttled
      if (response.status === 429) {
        this.log.debug('429 throttle waiting 1000ms to retry');
        await this.sleep(1000);
        return this.fetchDevices();
      }

      const [temperatureSensors, humiditySensors] = this.parseDevices(await response.json());
      return [temperatureSensors, humiditySensors];
    } catch(error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      throw new Error(message);
    }
  }

  async discoverDevices() {
    const [temperatureSensors, humiditySensors] = await this.fetchDevices();

    this.log.debug(`TEMPERATURE SENSORS: ${this.config.temperatureSensors}`);
    this.log.debug(`HUMIDITY SENSORS: ${this.config.humiditySensors}`);

    if (this.config.temperatureSensors) {
      // loop over the discovered devices and register each one if it has not already been registered
      for (const device of temperatureSensors) {

        const uuid = this.api.hap.uuid.generate(device.uniqueId);
        const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

        if (existingAccessory) {
          // the accessory already exists
          this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

          new TemperatureAccessory(this, existingAccessory);
        } else {
          // the accessory does not yet exist, so we need to create it
          this.log.info('Adding new accessory:', device.displayName);

          // create a new accessory
          const accessory = new this.api.platformAccessory(device.displayName, uuid);

          // store a copy of the device object in the `accessory.context`
          // the `context` property can be used to store any data about the accessory you may need
          accessory.context.device = device;

          new TemperatureAccessory(this, accessory);

          // link the accessory to your platform
          this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        }
      }
    }

    if (this.config.humiditySensors) {
      for (const device of humiditySensors) {

        const uuid = this.api.hap.uuid.generate(device.uniqueId);
        const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

        if (existingAccessory) {
          // the accessory already exists
          this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

          new HumidityAccessory(this, existingAccessory);

          // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
          // remove platform accessories when no longer present
          // this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
          // this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
        } else {
          // the accessory does not yet exist, so we need to create it
          this.log.info('Adding new accessory:', device.displayName);

          // create a new accessory
          const accessory = new this.api.platformAccessory(device.displayName, uuid);

          // store a copy of the device object in the `accessory.context`
          // the `context` property can be used to store any data about the accessory you may need
          accessory.context.device = device;

          new HumidityAccessory(this, accessory);

          // link the accessory to your platform
          this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        }
      }
    }
  }
}
