const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: Object.keys(Intents.FLAGS) })

const version = '2.1';

client.once('ready', () => {
    console.log('ログインしました。');
})

client.on('voiceStateUpdate', async (oldState, newState) => await onVoiceStateUpdate(oldState, newState))

async function onVoiceStateUpdate(oldState, newState) {
    if (newState && oldState) {
        if (oldState.channelId === null && newState.channelId != null) {
            const roles = newState.member.roles.cache;
            const is_bot = newState.member.user.bot;
            if (!is_bot) {
                roles.map((role) => {
                    if (role.name == "VC Entry") {
                        const Embed = new MessageEmbed()
                            .setColor(newState.member.displayColor)
                            .setTitle(newState.member.displayName + "が" + newState.channel.name + "に入室しました！")
                            .setAuthor("VC入室", newState.member.displayAvatarURL())
                            .setDescription("現在の参加者数は" + String(newState.channel.members.size) + "人です。")
                            .setFooter('Version' + version)
                        newState.guild.systemChannel.send({ embeds: [Embed] }).catch(console.error);
                    }
                });
            }
        }
        else if (oldState.channelId != null && newState.channelId === null) {
            const roles = oldState.member.roles.cache;
            const is_bot = oldState.member.user.bot;
            if (!is_bot) {
                roles.map((role) =>{
                    if (role.name == "VC Exit"){
                        const Embed = new MessageEmbed()
                        .setColor(oldState.member.displayColor)
                        .setTitle(oldState.member.displayName + "が" + oldState.channel.name + "から退室しました！")
                        .setAuthor("VC退室", oldState.member.displayAvatarURL())
                        .setDescription("現在の参加者数は" + String(oldState.channel.members.size) + "人です。")
                        .setFooter('Version' + version)
                        oldState.guild.systemChannel.send({ embeds: [Embed] }).catch(console.error);
                    }
                });
            }
        }
    }

};

client.login(process.env.DISCORD_TOKEN)