// index.js
const { Client, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Nastavení
const MESSAGE_ID = "TVEJ_MESSAGE_ID"; // ID zprávy, na kterou se reaguje
const EMOJI = "👍"; // Emoji které sleduješ
const ROLE_ID = "TVEJ_ROLE_ID"; // Role, co se má přidat
const GUILD_ID = "TVUJ_SERVER_ID"; // ID serveru
const WEB_URL = "https://tvujweb.cz/kod"; // Odkaz na web

// 30 kódů
const validCodes = [
  "KOD123", "KOD456", "KOD789", "KOD111", "KOD222", "KOD333",
  "KOD444", "KOD555", "KOD666", "KOD777", "KOD888", "KOD999",
  "KOD000", "KODAAA", "KODBBB", "KODCCC", "KODDDD", "KODEEE",
  "KODFFF", "KODGGG", "KODHHH", "KODIII", "KODJJJ", "KODKKK",
  "KODLLL", "KODMMM", "KODNNN", "KODOOO", "KODPPP", "KODQQQ"
];

// Reakce na emoji
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;

  if (reaction.message.id === MESSAGE_ID && reaction.emoji.name === EMOJI) {
    try {
      await user.send(
        `👋 Ahoj! Pro získání role navštiv ${WEB_URL} a pak mi sem napiš svůj kód.`
      );
    } catch (err) {
      console.error("❌ Nepodařilo se poslat DM:", err);
    }
  }
});

// Zpracování kódu v DM
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.guild) return; // Jen DM

  const code = message.content.trim();

  if (validCodes.includes(code)) {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;

    const member = await guild.members.fetch(message.author.id).catch(() => null);
    if (!member) {
      await message.author.send("❌ Nejsem schopný tě najít na serveru.");
      return;
    }

    const role = guild.roles.cache.get(ROLE_ID);
    if (!role) return;

    await member.roles.add(role);
    await message.author.send(
      `✅ Správný kód! Byla ti přidána role **${role.name}**.`
    );
  } else {
    await message.author.send("❌ Špatný kód. Zkus to znovu.");
  }
});

client.login(process.env.TOKEN);
