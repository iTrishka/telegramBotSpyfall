# telegramBotSpyfall
Шаблон распределителя ролей для игры "Находка для шпиона"

Самоизоляция оставила свой следы в нашей жизни. 
Игры по Zoom как один из них.

Создан чат-бот в Telegram. Здесь представлен его шаблон. 

Задумка игры предельна проста: среди игроков шпион, но он не знает, где мы находимся. 
Цель шпиона — узнать в какой локации он находится, наша цель — найти его.

Задача бота: 
распределить карты между N игроками(1 карта шпиона и N-1 карт локаций)

Использовала инструмент: node-telegram-bot-api

Для запуска нужно: 
1) добавить токен бота в configTelegram.json 
2) добавить карточки локаций и шпиона (png) в папку img
3) опционально: добавить игроков заранее в players.json

Описание работы:
1) /start 
Бот приветсвует и предлагает выбрать один из вариантов: 
- Начать игру *изначально можно задать базовый состав команды
- Посмотреть текущий состав
- Изменить состав команды

2) При создании новой команды, выдается инструкция, но общий вид команды следующий: 
"/players idИгрока1_имя1 idИгрока2_имя2"

*реализована возможность добавить игрока просто через имя, если ранее его вносили в списки(players.json). Создание команды может тогда выглядить так: 
"/players idИгрока1_имя1 idИгрока2_имя2 имя3" 

3) Старт игры. Каждому игроку приходит  рандомная карта. Состав команды сохраняется до тех пор, пока не будет выбрано "Изменить состав" или "Новая игра"


Возможные доработки: 
Реализовать возможность нескольких игр одновременно. 
