const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: Object.keys(Intents.FLAGS) })

const version = '2.1';

const send_vc_notify = (voicestate, title) => {
    const displayColor = voicestate.member.displayColor;
    const displayName = voicestate.member.displayName;
    const ChannelName = voicestate.channel.name;
    const displayAvatarURL = voicestate.member.displayAvatarURL();
    const ChannelMemberSize = voicestate.channel.members.size;
    const Embed = new MessageEmbed()
        .setColor(displayColor)
        .setTitle(displayName + "が" + ChannelName + "に" + title + "しました！")
        .setAuthor("VC" + title, displayAvatarURL)
        .setDescription("現在の参加者数は" + String(ChannelMemberSize) + "人です。")
        .setFooter('Version' + version)
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
                        send_vc_notify(newState, "入室");
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
                        send_vc_notify(oldState, "退室");
                    }
                });
            }
        }
    }
})

client.login(process.env.DISCORD_TOKEN);
