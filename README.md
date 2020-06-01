# Endomondo GPX Exporter
This utility exports your [Endomondo](https://www.endomondo.com/) trainings to GPX files. This can be used to import them somewhere else (e.g. at [Strava](https://www.strava.com/), see [tutorial](https://support.strava.com/hc/en-us/articles/216917747-Moving-your-activity-history-from-Endomondo-to-Strava)).

## Requirements
* Node.js (tested with NodeJS v14.3)

## How to run
```
git clone https://github.com/virtualzone/endomondo-exporter.git
cd endomondo-exporter
npm install
./index.js
```

## Example
To export all trainings:
```
./index.js --username=... --password=...
```

To export all trainings from November 2019 to /home/john/trainings:
```
./index.js --username=... --password=... --year=2019 --month=11 --dir=/home/john/trainings
```

## Notice
This app is not affiliated with Endomondo, Strava or Under Armour. Use it at your own risk.