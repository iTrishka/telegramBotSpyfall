
const TelegramBot = require('node-telegram-bot-api');
const configTelegram = require('./config/configTelegram.json');
const players = require('./config/players.json');
const fs = require("fs");
const token = configTelegram.token; 
const bot = new TelegramBot(token, {polling: true});

let playersIdToSend = []; 

const textForStart = `Привет, Друг! Это распределитель ролей для игры "Находка для шпиона". Начнем?`;
const textForChange = `Команды формируются по ID участников.\n\n@getmyid_bot — чтобы узнать свой ID . \n\n/players — ключ для создания новой команды \n\n"ID игрока_имя" — формат для добавления игроков. Если ты - утка, напиши просто свое имя (kris alex oleg lena artem shake)\n\nПример создания команды:\n/players kris alex 75387637826_boris`;


function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

const getNameIdPlayers = (arr) => {
    return arr.map( item => {
        const playersfromJson = fs.readFileSync("./config/players.json");
        const playersParseJson = JSON.parse(playersfromJson);
        let name = getKeyByValue(playersParseJson, item);
        return (`${item}(${name})`);
    })
}

//меню для выбора действий
const keyboard1 = [ 
    [{
      text: 'Начать игру', // текст на кнопке
      callback_data: 'newGames' // данные для обработчика событий
    }],
    [{
          text: `Посмотреть текущий состав`,
          callback_data: 'currentTeam'
        }], 
    [{
          text: `Изменить состав команды`,
          callback_data: 'change'
        }]    
];

const keyboard2 = [ 
    [{
      text: 'Начать игру', // текст на кнопке
      callback_data: 'newGames' // данные для обработчика событий
    }],
    [{
          text: `Изменить состав`,
          callback_data: 'change'
        }]    
];

const errorMes = () => {
    bot.sendMessage(chatId, 'Что-то пошло не так, давай попробуем ещё раз?', { // прикрутим клаву
        reply_markup: {
            inline_keyboard: keyboard1 
        }
    });
}


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
    // отправляем сообщение
    bot.sendMessage(chatId, textForStart, { // прикрутим клаву
          reply_markup: {
              inline_keyboard: keyboard1
          }
      });
});

bot.onText(/\/players (.+)/, (msg, match) => {
    const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
    
    const newplayers =  match[1].split(" ");
    playersIdToSend = [];
    newplayers.forEach( item => {
        if(item =='kris' || item =='alex' || item=='shake' || item == 'lena' || item == 'artem' || item == 'oleg' ){    
            playersIdToSend.push(players[item]);

        } else if (item.search([/\d*_\w*/])){
            const idNewPlayers = item.split('_');
            playersIdToSend.push(idNewPlayers[0]);

            const playersfromJson = fs.readFileSync("./config/players.json");
            const playersParseJson = JSON.parse(playersfromJson);

            const name = idNewPlayers[1];
            playersParseJson[name] = idNewPlayers[0];
            const newPlayerJSON = JSON.stringify(playersParseJson);
            fs.writeFileSync("./config/players.json", newPlayerJSON);

        } else {errorMes()}
    })

    let  arrplayersId = [];
    playersIdToSend.forEach( id => {
        arrplayersId.push([{
            'text': `${id}`,
            callback_data: `pleer${id}`
        }])
    })

    const nameAndId = getNameIdPlayers(playersIdToSend);
    // отправляем сообщение
    bot.sendMessage(chatId, `Текущий состав команды: ${nameAndId}`,  { // прикрутим клаву
        reply_markup: {
            inline_keyboard: keyboard1
        }
      });
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'newGames') {     
        
        if(!playersIdToSend.length){
            bot.sendMessage(chatId, "Упс, команда еще не собрана. " + textForChange, { // прикрутим клаву
                reply_markup: {
                    inline_keyboard:[
                        [
                            {
                                text: 'В главное меню',
                                callback_data: 'main' 
                            }
                        ]
                    ]
                }
            });                    
        }else {

            const randomNumForSpy = Math.floor(Math.random()*(playersIdToSend.length));
            const spy = playersIdToSend[randomNumForSpy];
            const randomForLocation = Math.floor(Math.random()*(30));
            const randomLocation = `./img/локация (${randomForLocation}).png`; 
            
            
            playersIdToSend.forEach(item => {
                if(item == spy){// шпиону отправляет карут шпиона
                    bot.sendPhoto(item, './img/шпион.png', { // прикрутим клаву
                        reply_markup: {
                            inline_keyboard: keyboard1
                        }
                    });
                } else { //остальным кчастникам карточку локации
                    bot.sendPhoto(item, randomLocation, { // прикрутим клаву
                        reply_markup: {
                            inline_keyboard: keyboard1
                        }
                    
                    });
                }
            })
        }
    } else if (query.data === 'change') {        
        playersIdToSend = [];       
        bot.sendMessage(chatId, textForChange, { // прикрутим клаву
            reply_markup: {
                inline_keyboard:[
                    [
                        {
                            text: 'В главное меню',
                            callback_data: 'main' 
                        }
                    ]
                ]
            }
        });        

    
    }else if(query.data === 'main'){
        bot.sendMessage(chatId, 'Привет, Друг! чего хочешь?', { // прикрутим клаву
            reply_markup: {
                inline_keyboard: keyboard1
            }
        }); 
    
    }else if(query.data === 'currentTeam'){

        const namePlusId = getNameIdPlayers(playersIdToSend);

        bot.sendMessage(chatId, `Текущий состав: ${namePlusId}`, { // прикрутим клаву
            reply_markup: {
                inline_keyboard: keyboard2
            }
        });  
    }else {
        bot.sendMessage(chatId, 'Непонятно, давай попробуем ещё раз?', { // прикрутим клаву
            reply_markup: {
                inline_keyboard: keyboard1
            }
        });
    }


});
