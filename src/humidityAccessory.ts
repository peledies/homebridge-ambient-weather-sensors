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
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Ambient Weather');
    // .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
    // .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // get the HumiditySensor service if it exists, otherwise create a new HumiditySensor service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.HumiditySensor)
                || this.accessory.addService(this.platform.Service.HumiditySensor);

    // set the service name, this is what is displayed as the default name on the Home app
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.service.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .onGet(this.handleCurrentRelativeHumidityGet.bind(this));       // SET - bind to the 'setBrightness` method below

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

    const [temperatureSensors] = await this.platform.fetchDevices();

    const sensor = temperatureSensors.filter( (o: DEVICE) => {
      return o.uniqueId === this.accessory.context.device.uniqueId;
    });

    const value = sensor[0].value;
    this.platform.log.debug(`SET CurrentHumidity: ${value}`);
    this.service.setCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, value);
  }

}
