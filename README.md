# Homebridge Ambient Weather Sensor Plugin

<SPAN ALIGN="CENTER" STYLE="text-align:center">
<DIV ALIGN="CENTER" STYLE="text-align:center">

<img src="https://raw.githubusercontent.com/peledies/homebridge-ambient-weather-sensors/main/images/homebridge_ambient_weather.png" width='400px'>

## Complete HomeKit support for the Ambient Weather weather station ecosystem using [Homebridge](https://homebridge.io).

[![verified-by-homebridge](https://img.shields.io/badge/homebridge-verified-blueviolet?color=%23491F59&style=for-the-badge&logoColor=%23FFFFFF&logo=homebridge)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
![npm](https://img.shields.io/npm/dt/homebridge-ambient-weather-sensors?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/homebridge-ambient-weather-sensors?style=for-the-badge)
![GitHub release (with filter)](https://img.shields.io/github/v/release/peledies/homebridge-ambient-weather-sensors?style=for-the-badge&label=Latest)
![Discord](https://img.shields.io/discord/432663330281226270?style=for-the-badge&label=Discord)

</DIV>
</SPAN>


## Plugin Information
This plugin allows you to pull sensor data from your Ambient Weather weather station via its REST API and add those accessories to homebridge.

## Features
- Supports parsing sensors attached to multiple weather stations
- Polling is static at `2 minutes` to reduce strain on the Ambient Weather API

## Current Supported Sensor Types
- Temperature
- Humidity
- Solar Radiation (As Lux)

## Future Supported Sensor Types
- Air Pressure
- Wind Speed
- Wind Direction

## Setup
You will need two keys to configre this plugin and they can both be generate on the [Ambient Weather Account Page](https://ambientweather.net/account). This part has been a point of confusion for many users.

creating the API key is straight forward. click the `Create API Key` button and give it a name if you would like.

Creating the Application key involves clicking the following link at the bottom of the 'API Keys' section.

`Developers: An Application Key is also required for each application that you develop. Click here to create one.`

A textbox will come up and you can either leave that blank or put a note in there (It doesn't appear to matter or get displayed anywhere) if you like and click `Create Application Key`.

These keys will get used when you setup the plugin in Homebridge.
