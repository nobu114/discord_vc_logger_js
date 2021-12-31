const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: Object.keys(Intents.FLAGS) })

client.once('ready', () => {
    console.log(`ログインしました。`)
})

client.on('voiceStateUpdate', async (oldState, newState) => await onVoiceStateUpdate(oldState, newState))

async function onVoiceStateUpdate(oldState, newState) {
    if (newState && oldState) {
        if (oldState.channelId === null && newState.channelId != null) {
            console.log(newState.membe)
            // .map((member) => {
            //     const role = member.roles.cache
            //     console.log(role.name)
            // });
            // .roles.cache.map(function (role) {
            //     if (role.name == "VC Entry") {
            //         const Embed = new MessageEmbed()
            //             .setColor(newState.member.displayColor)
            //             .setTitle(newState.member.displayName + "が" + newState.channel.name + "に入室しました！")
            //             .setAuthor("VC入室", newState.member.displayAvatarURL())
            //             .setDescription("現在の参加者数は" + String(newState.channel.members.size) + "人です。")
            //             .setFooter('Version2.0')
            //         newState.guild.systemChannel.send({ embeds: [Embed] }).catch(console.error);
            //     }
            // });
        }

        if (oldState.channelId != null && newState.channelId === null) {
            oldState.member.roles.cache.map(function (role) {
                if (role.name == "VC Exit") {
                    const Embed = new MessageEmbed()
                        .setColor(oldState.member.displayColor)
                        .setTitle(oldState.member.displayName + "が" + oldState.channel.name + "から退室しました！")
                        .setAuthor("VC退室", oldState.member.displayAvatarURL())
                        .setDescription("現在の参加者数は" + String(oldState.channel.members.size) + "人です。")
                        .setFooter('Version2.0')
                    oldState.guild.systemChannel.send({ embeds: [Embed] }).catch(console.error);
                }
            });
        }
    }
    
};

client.login(process.env.DISCORD_TOKEN)