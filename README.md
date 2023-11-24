# SmartHelmet
The project provides for the possibility of automated control over compliance with safety measures on the territory of an industrial enterprise

[Presentation](https://github.com/XaPoHbomj/SmartHelmet/raw/master/SmartHelmet.mp4 "Описание проекта")

[Demonstration](https://disk.yandex.com/i/0TxKyO8ykgEsxA "Live-презентация проекта")

## Screenshots
![image](https://user-images.githubusercontent.com/55300023/235252974-9380d691-94aa-4b8a-881a-76c01e9d4c9b.png)
![image](https://user-images.githubusercontent.com/55300023/235253047-39815219-9b55-4046-8e98-e39f597b54b4.png)

## Build and startup
### Microcontoller
You need to download and install the free [PlatformIO](https://github.com/platformio "PlatformIO") extension for Visual Studio Code. The configuration is already in the repository

### Backend (.NET 6.0)
Can be assembled and started without additional effort

### Frontend
To build and run, you need to download and install NodeJS.

Dependencies should be installed in the Dashboard folder where the package.json file is located:
```shell
cd .../Dashboard
npm install
```

You can start the application with the following commands:
```shell
cd .../Dashboard
npm start
```

## Project Architecture
![Архитектура](https://i.imgur.com/Zyma83u.png "Архитектура")
