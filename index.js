const covidApi = require('covid19-api')
const TelegramBot = require('node-telegram-bot-api')
var fetch = require('node-fetch');



process.env.BOT_TOKEN = '1845731221:AAEHMm69pVErKeHIpxXHTDDJeH4xSZ396Tk';
const TOKEN = '1845731221:AAEHMm69pVErKeHIpxXHTDDJeH4xSZ396Tk'

var chat='';

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval:300,
        autoStart:true,
        params:{
            timeout:10
        }
    }
}) 

const keyboard_countries = [
    [
        {text:'Ukraine', callback_data:'ukraine'},
        {text:'Turkey', callback_data:'turkey'},
    ],
    [
        {text:'Russia', callback_data:'russia'},
        {text:'Poland', callback_data:'poland'},
    ],
    [
        {text:'<---', callback_data:'backMenu'},
    ]
]

const keyboard_menu = [
    [
        {text:'COVID-19', callback_data:'covid'},
        {text:'Privat24', callback_data:'privat'},
    ]
]

bot.on('message', msg=>{

const chatId = msg.chat.id
chat = chatId;

bot.sendMessage(chatId,'Main menu',{
    reply_markup:{
        inline_keyboard:keyboard_menu
    }
})
})
bot.on ('callback_query', async (query)=>{
    
    console.log(query.data)
    if (query.data=='covid')
    {
        bot.sendMessage(chat,'Choose your country...',{
            reply_markup:{
                inline_keyboard:keyboard_countries
            }
        })
    }
    if (query.data=='ukraine' ||query.data=='turkey' || query.data=='russia'|| query.data=='poland')
    {
        //---------------------------
        try {
                   const covidData = await covidApi.getReportsByCountries(query.data)
                   console.log(covidData);
                   const countryData = covidData[0][0]
                   const formatData = `
                       Страна: ${countryData.country},
                       Случаи: ${countryData.cases},
                       Смерти: ${countryData.deaths},
                       Выздоровело: ${countryData.recovered}`
                  bot.sendMessage(chat,formatData)
               } catch(e) {
                bot.sendMessage('Sorry, some error(')
               }

               bot.sendMessage(chat,'Choose your country...',{
                reply_markup:{
                    inline_keyboard:keyboard_countries
                }
            })
        //---------------------------
    }
    if (query.data=='backMenu')
        bot.sendMessage(chat,'Main menu',{
        reply_markup:{
            inline_keyboard:keyboard_menu
        }
    })

    if (query.data=='privat')
    {
            fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                
                let s='';

                for (let i=0; i<data.length; i++)
                {
                    s+=`${data[i].ccy} / ${data[i].base_ccy} buy= ${data[i].buy}  sale= ${data[i].sale} \n`
                }
                bot.sendMessage(chat, s);

            });
    }

})








  

