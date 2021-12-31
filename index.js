const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: Object.keys(Intents.FLAGS) })

const version = '2.1';

client.once('ready', () => {
    console.log('ログインしました。');
})

client.on('voiceStateUpdate', async (oldState, newState) => await onVoiceStateUpdate(oldState, newState))

async function send_vc_notify(voicestate, title) {
    const displayColor = voicestate.member.displayColor;
    const displayName = voicestate.member.displayName;
    const ChannelName = voicestate.channel.name;
    const displayAvatarURL = voicestate.member.displayAvatarURL();
    const ChannelMemberSize = voicestate.members.size;
    const Embed = new MessageEmbed()
        .setColor(displayColor)
        .setTitle(displayName + "が" + ChannelName + "に入室しました！")
        .setAuthor(title, displayAvatarURL)
        .setDescription("現在の参加者数は" + String(ChannelMemberSize) + "人です。")
        .setFooter('Version' + version)
    await voicestate.guild.systemChannel.send({ embeds: [Embed] }).catch(console.error);
}

async function onVoiceStateUpdate(oldState, newState) {
    if (newState && oldState) {
        if (oldState.channelId === null && newState.channelId != null) {
            const roles = newState.member.roles.cache;
            const is_bot = newState.member.user.bot;
            if (!is_bot) {
                roles.map((role) => {
                    if (role.name == "VC Entry") {
                        await send_vc_notify(newState, "VC入室");
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
                        await send_vc_notify(oldState, "VC退室");
                    }
                });
            }
        }
    }

};

client.login(process.env.DISCORD_TOKEN)