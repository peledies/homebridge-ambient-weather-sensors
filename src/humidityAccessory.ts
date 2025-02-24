import { PlatformAccessory, Service } from 'homebridge';
import { AmbientWeatherSensorsPlatform } from './platform';
import { DEVICE } from './types';


export class HumidityAccessory {
  private service: Service;

  constructor(
    private readonly platform: AmbientWeatherSensorsPlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Ambient Weather')
      .setCharacteristic(this.platform.Characteristic.Model, 'Humidity Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.displayName);

    // get the HumiditySensor service if it exists, otherwise create a new HumiditySensor service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.HumiditySensor)
                || this.accessory.addService(this.platform.Service.HumiditySensor);

    // set the service name, this is what is displayed as the default name on the Home app
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.updateData();
    setInterval(this.updateData.bind(this), 2 * 60 * 1000);
  }

  /**
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  handleCurrentRelativeHumidityGet() {
    this.platform.log.debug('Triggered GET CurrentRelativeHumidity');

    // set this to a valid value for CurrentRelativeHumidity
    const currentValue = this.accessory.context.device.value;
    this.platform.log.debug(`CurrentHumidity: ${currentValue}`);
    return currentValue;
  }

  private async updateData(): Promise<void> {
    this.platform.log.debug('Updating CurrentHumidity Data');

    try {
      const Devices = await this.platform.fetchDevices();

      const sensor = Devices.filter( (o: DEVICE) => {
        return o.uniqueId === this.accessory.context.device.uniqueId;
      });

      const value = sensor[0].value;
      this.platform.log.debug(`SET CurrentHumidity: ${value}`);
      this.service.setCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, value);
    } catch (error) {
      // throw new Error('Error updating Current Humidity Data. This likely means the AWN API is down or didn\'t return valid JSON.');
      this.platform.log.warn('Updating Current Humidity Data Failed. This likely means the AWN API is down or didnt return valid JSON.');
    }
  }
}