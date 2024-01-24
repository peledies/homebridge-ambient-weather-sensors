import { PlatformAccessory, Service } from 'homebridge';
import { AmbientWeatherSensorsPlatform } from './platform';
import { DEVICE } from './types';


export class SolarRadiationAccessory {
  private service: Service;

  constructor(
    private readonly platform: AmbientWeatherSensorsPlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Ambient Weather')
      .setCharacteristic(this.platform.Characteristic.Model, 'Solar Radiation Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.displayName)
      .setCharacteristic(this.platform.Characteristic.ProductData, 'Conversion to lux with (W/m2 / 0.0079)');

    // get the LightSensor service if it exists, otherwise create a new LightSensor service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.LightSensor)
                || this.accessory.addService(this.platform.Service.LightSensor);

    // set the service name, this is what is displayed as the default name on the Home app
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    const char = this.service.getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel);

    // allow setting lux to zero, because you know... it's dark at night
    char.setProps({
      minValue: 0,
    });

    this.updateData();
    setInterval(this.updateData.bind(this), 2 * 60 * 1000);
  }

  /**
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  handleCurrentSolarRadiationGet() {
    this.platform.log.debug('Triggered GET CurrentSolarRadiation');

    // set this to a valid value for CurrentSolarRadiation
    const currentValue = this.accessory.context.device.value;
    this.platform.log.debug(`CurrentSolarRadiation: ${currentValue}`);
    return currentValue;
  }

  private async updateData(): Promise<void> {
    this.platform.log.debug('Updating Solar Radiation Data');

    const sensors = await this.platform.fetchDevices();

    const sensor = sensors.filter( (o: DEVICE) => {
      return o.uniqueId === this.accessory.context.device.uniqueId;
    });

    // to convert W/m2 to Lux we must devide by 0.0079
    const value = Math.round(sensor[0].value / 0.0079);

    this.platform.log.debug(`SET CurrentSolarRadiation: ${value}`);
    this.service.setCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, value)
      .setCharacteristic(this.platform.Characteristic.ProductData, `${sensor[0].value} W/m2`);
  }
}