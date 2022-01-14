const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: Object.keys(Intents.FLAGS) })
const version = {text : 'Version 2.3'};

const send_vc_notify = (voicestate, is_exit) => {
    const displayColor = voicestate.member.displayColor;
    const displayName = voicestate.member.displayName;
    const ChannelName = voicestate.channel.name;
    const displayAvatarURL = voicestate.member.displayAvatarURL();
    const ChannelMemberSize = voicestate.channel.members.size;
    const Embed = new MessageEmbed()
    Embed.setColor(displayColor);
        if (is_exit == false){
            let author= {
                name: "VC入室",
                iconURL: displayAvatarURL
            }
            Embed.setTitle(displayName + "が" + ChannelName + "に入室しました！");
            Embed.setAuthor(author);
        }
        else if (is_exit == true){
            let author= {
                name: "VC退室",
                iconURL: displayAvatarURL
            }
            Embed.setTitle(displayName + "が" + ChannelName + "から退室しました！");
            Embed.setAuthor(author);
        }
        Embed.setDescription("現在の参加者数は" + String(ChannelMemberSize) + "人です。")
        Embed.setFooter(version)
    voicestate.guild.systemChannel.send({ embeds: [Embed] }).catch(console.error);
}

client.once('ready', () => {
    console.log('ログインしました。');
})

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState && oldState) {
        if (oldState.channelId === null && newState.channelId != null) {
            const roles = newState.member.roles.cache;
            const is_bot = newState.member.user.bot;
            if (!is_bot) {
                roles.map((role) => {
                    if (role.name == "VC Entry") {
                        send_vc_notify(newState, false);
                    }
                });
            }
        }
        else if (oldState.channelId != null && newState.channelId === null) {
            const roles = oldState.member.roles.cache;
            const is_bot = oldState.member.user.bot;
            if (!is_bot) {
                roles.map((role) => {
                    if (role.name == "VC Exit") {
                        send_vc_notify(oldState, true);
                    }
                });
            }
        }
    }
})

client.login(process.env.DISCORD_TOKEN);