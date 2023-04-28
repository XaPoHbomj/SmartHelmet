# SmartHelmet
Проект автоматизированного контроля за соблюдением мер техники безопасности на территории промышленного предприятия

[Видеопрезентация](https://github.com/XaPoHbomj/SmartHelmet/raw/master/SmartHelmet.mp4 "Описание проекта")

[Выступление на защите и демонстрация проекта](https://disk.yandex.com/i/0TxKyO8ykgEsxA "Live-презентация проекта")

## Скриншоты
![image](https://user-images.githubusercontent.com/55300023/235252974-9380d691-94aa-4b8a-881a-76c01e9d4c9b.png)
![image](https://user-images.githubusercontent.com/55300023/235253047-39815219-9b55-4046-8e98-e39f597b54b4.png)

## Сборка и запуск
### Микроконтроллер
Необходимо скачать и установить бесплатное расширение [PlatformIO](https://github.com/platformio "PlatformIO") для Visual Studio Code. Конфигурация уже находится в репозитории

### Веб-сервер (.NET 6.0)
Можно собрать и запустить без дополнительных усилий

### Веб-приложение
Для сборки и запуска необходимо скачать и установить NodeJS.

Установка зависимостей производится в папке Dashboard, где находится файл package.json:
```shell
cd .../Dashboard
npm install
```

Запуск приложения осуществляется следующими командами:
```shell
cd .../Dashboard
npm start
```

## Архитектура
![Архитектура](https://i.imgur.com/Zyma83u.png "Архитектура")
