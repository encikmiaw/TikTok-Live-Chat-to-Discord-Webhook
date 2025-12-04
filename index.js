/*  _                                _   _  _   _  
 /   _  ._     ._ o  _  |_ _|_      ) / \  ) |_  
 \_ (_) |_) \/ |  | (_| | | |_     /_ \_/ /_  _) 
        |   /        _|                          

$$$$$$$$\                     $$\ $$\       $$\      $$\ $$\                         
$$  _____|                    \__|$$ |      $$$\    $$$ |\__|                        
$$ |      $$$$$$$\   $$$$$$$\ $$\ $$ |  $$\ $$$$\  $$$$ |$$\  $$$$$$\  $$\  $$\  $$\ 
$$$$$\    $$  __$$\ $$  _____|$$ |$$ | $$  |$$\$$\$$ $$ |$$ | \____$$\ $$ | $$ | $$ |
$$  __|   $$ |  $$ |$$ /      $$ |$$$$$$  / $$ \$$$  $$ |$$ | $$$$$$$ |$$ | $$ | $$ |
$$ |      $$ |  $$ |$$ |      $$ |$$  _$$<  $$ |\$  /$$ |$$ |$$  __$$ |$$ | $$ | $$ |
$$$$$$$$\ $$ |  $$ |\$$$$$$$\ $$ |$$ | \$$\ $$ | \_/ $$ |$$ |\$$$$$$$ |\$$$$$\$$$$  |
\________|\__|  \__| \_______|\__|\__|  \__|\__|     \__|\__| \_______| \_____\____/ */
  

console.log(`
$$$$$$$$\\                     $$\\ $$\\       $$\\      $$\\ $$\\                         
$$  _____|                    \\__|$$ |      $$$\\    $$$ |\\__|                        
$$ |      $$$$$$$\\   $$$$$$$\\ $$\\ $$ |  $$\\ $$$$\\  $$$$ |$$\\  $$$$$$\\  $$\\  $$\\  $$\\ 
$$$$$\\    $$  __$$\\ $$  _____|$$ |$$ | $$  |$$\\$$\\$$ $$ |$$ | \\____$$\\ $$ | $$ | $$ |
$$  __|   $$ |  $$ |$$ /      $$ |$$$$$$  / $$ \\$$$  $$ |$$ | $$$$$$$ |$$ | $$ | $$ |
$$ |      $$ |  $$ |$$ |      $$ |$$  _$$<  $$ |\\$  /$$ |$$ |$$  __$$ |$$ | $$ | $$ |
$$$$$$$$\\ $$ |  $$ |\\$$$$$$$\\ $$ |$$ | \\$$\\ $$ | \\_/ $$ |$$ |\\$$$$$$$ |\\$$$$$\\$$$$  |
\\________|\\__|  \\__| \\_______|\\__|\\__|  \\__|\\__|     \\__|\\__| \\_______| \\_____\\____/ 

==========================================================
🎉 TikTok → Discord Live Chat Bot 🎉
Author: Encikmiaw
GitHub: https://github.com/encikmiaw
Version: 1.0.0
Powered by: TikTok Live Connector + Discord Webhooks
==========================================================
`);


const { WebcastPushConnection, SignConfig } = require("tiktok-live-connector");
require('dotenv').config();

// EulerStream API key
SignConfig.apiKey = process.env.EULER_API_KEY;

const tiktok = new WebcastPushConnection(process.env.TIKTOK_USERNAME);

tiktok.connect()
    .then(() => {
        console.log("✅ Connected to TikTok live");
        console.log("✅ Please check your discord channel!");
    })
    .catch(err => {
        // Check if the error is "user offline"
        if (err.name === "UserOfflineError") {
            console.log("⚠️ User is not currently live!");
        } else {
            // Other errors
            console.log("❌ Failed to connect:", err.message || err);
        }
    });

// Format username with mod emoji
function formatUsername(data) {
    return data.isModerator ? `🛡️ ${data.nickname}` : data.nickname;
}

// Chat
tiktok.on("chat", (data) => {
    const timestamp = new Date().toLocaleTimeString();
    sendToDiscordPlain(`[${timestamp}] [CHAT] ${formatUsername(data)}: ${data.comment}`);
});

// Map of gift name -> coin value
const giftCoins = {
  "Rose":1,"GG":1,"You're awesome":1,"Cake Slice":1,"Love you so much":1,"Ice Cream Cone":1,
  "Heart Me":1,"Pumpkin":1,"Miss You":1,"Nasi Lemak":1,"Thumbs Up":1,"Heart":1,"Glow Stick":1,
  "Love you":1,"LIVE STAR":1,"Music Album":1,"I’m Here":1,"Soccer":1,"Fire":1,"Scared":1,
  "Go Popular":1,"Club Cheers":1,"Wink Charm":1,"Team Bracelet":2,"Finger Heart":5,"Pumpkin Pie":5,
  "New LIVE Star":5,"Super Popular":9,"Cheer You Up":9,"Club Power":9,"Boo":10,"Rosa":10,
  "Friendship Necklace":10,"Journey Pass":10,"Celestial Badge":10,"Tiny Diny":10,"Pumpkin Latte":10,
  "Meowthumbs Up":10,"Heart Gaze":10,"Tiger Pride":15,"Tiny Diny in Love":15,"Perfume":20,
  "Tiny Diny Hotdog":20,"S Flowers":20,"Doughnut":30,"Elite Star":30,"Love Letter":88,
  "Boo the Ghost":88,"Paper Crane":99,"Little Crown":99,"Cap":99,"Hat and Mustache":99,
  "Like-Pop":99,"Love Painting":99,"Love Luck":99,"Bubble Gum":99,"Mark of Love":99,"Sundae Bowl":99,
  "Club Victory":99,"Level-up Sparks":99,"Greeting Heart":99,"Game Controller":100,"Super GG":100,
  "Confetti":100,"Hand Hearts":100,"Heart Signal":100,"Marvelous Confetti":100,"Singing Magic":100,
  "Heart Rain":149,"Bowknot":149,"Big Shout Out":149,"Chatting Popcorn":149,"Masquerade":149,
  "Balloon Crown":149,"Feather Tiara":149,"Caterpillar Chaos":149,"Catrina":149,"Sour Buddy":199,
  "Love Charger":199,"Pinch Cheek":199,"Sunglasses":199,"Hearts":199,"Garland Headpiece":199,
  "Love You":199,"Cheer For You":199,"Stinging Bee":199,"Massage for You":199,"Coffee Magic":199,
  "Coconut Tree":199,"Cheering Crab":199,"Wooly Hat":199,"Floating Octopus":199,"Flower Headband":199,
  "Star Glasses":199,"Coconut Juice":199,"Panda Climb":199,"Chirpy Kisses":199,"Rose Hand":199,
  "Balloons":200,"Magic Genie":200,"Rose Bear":214,"Pinch Face":249,"Candy Bouquet":249,
  "Star Goggles":249,"Cheer Mic":249,"Music Bubbles":249,"Palm Breeze":249,"Forest Elf":249,
  "Face-pulling":249,"Gamer 2025":299,"Pawfect":299,"TikTok Crown":299,"Boxing Gloves":299,
  "Corgi":299,"Fruit Friends":299,"Naughty Chicken":299,"Play for You":299,"Rock Star":299,
  "Butterfly for You":299,"Puppy Kisses":299,"United Heart":299,"LIVE Ranking Crown":299,
  "Kicker Challenge":299,"Hi! Rosie!":299,"Go Hamster":299,"Bat Headwear":299,"Budding Heart":299,
  "Feather Mask":300,"Air Dancer":300,"Backing Monkey":349,"Become Kitten":349,"Marked with Love":349,
  "Vinyl Flip":349,"Juicy Cap":349,"Batwing Hat":349,"Mystic Drink":349,"Forever Rosa":399,
  "Magic Rhythm":399,"Relaxed Goose":399,"Tom's Hug":399,"Rosie the Rose Bean":399,"Jollie the Joy Bean":399,
  "Rocky the Rock Bean":399,"Sage the Smart Bean":399,"Sage's Slash":399,"Let butterfly dances":399,
  "Kitten Kneading":399,"Shoot the Apple":399,"Alien Buddy":399,"Rosie's Concert":399,"Crystal Dreams":400,
  "Wishing Cake":400,"Mic Champ":400,"Bounce Speakers":400,"Beating Heart":449,"Encore Clap":449,
  "Pirate's Treasure":449,"Candy Loot":449,"Fairy Mask":450,"Powerful Mind":450,"Hat of Joy":450,
  "Halloween Fun Hat":450,"Im Just a Hamster":499,"Coral":499,"Panda Hug":499,"Hands Up":499,
  "Prince":500,"Fortune Cat":500,"Money Gun":500,"You’re Amazing":500,"VR Goggles":500,
  "DJ Glasses":500,"Oyen Kebaya":500,"Manifesting":500,"Dragon Crown":500,"Racing Helmet":500,
  "XXXL Flowers":500,"Bunny Crown":500,"Magic Prop":500,"Join Butterflies":600,"Swan":699,
  "Colorful Wings":700,"Desert Camp":899,"LOVE U":899,"Train":899,"Medium Fandom":900,"Superstar":900,
  "Travel with You":999,"Lucky Airdrop Box":999,"Grand show":999,"Uniform":999,"Trending Figure":999,
  "Lightning your world":1000,"Watermelon Love":1000,"Blooming Ribbons":1000,"Galaxy":1000,"Fairy Wings":1000,
  "Flamingo Groove":1000,"Super Star":1000,"Magic Cat":1000,"Shiny air balloon":1000,"Sparkle Dance":1000,
  "Fireworks":1088,"Diamond Tree":1088,"Magic Role":1088,"Umbrella of Love":1200,"Starlight Sceptre":1200,
  "Vibrant Stage":1400,"Level Ship":1500,"Chasing the Dream":1500,"Lover’s Lock":1500,"Greeting Card":1500,
  "Future Encounter":1500,"Under Control":1500,"Racing Debut":1500,"Merry Go Boo":1500,"Twirl & Treat":1500,
  "Shooting Stars":1580,"Blooming Heart":1599,"Here We Go":1799,"Love Drop":1800,"Cable Car":1999,
  "Star of Red Carpet":1999,"Gift Box":1999,"Cooper Flies Home":1999,"Mystery Firework":1999,
  "Spooktacular":1999,"Crystal Crown":2000,"Whale Diving":2150,"Blow Rosie Kisses":2199,"Jollie's Heartland":2199,
  "Rocky's Punch":2199,"Sage's Coinbot":2199,"Stargazing":2200,"Animal Band":2500,"Hiking Oyen":2800,
  "Motorcycle":2988,"Rhythmic Bear":2999,"Level-up Spotlight":2999,"Meteor Shower":3000,"Gift Box":3999,
  "City of Dreams":4000,"Magic World":4088,"Your Concert":4500,"Private Jet":4888,"Leon the Kitten":4888,
  "Fiery Dragon":4888,"Signature Jet":4888,"Tom's Love":4999,"Sage’s Venture":4999,"Unicorn Fantasy":5000,
  "Flying Jets":5000,"Devoted Heart":5999,"Future City":6000,"Sam in New City":6000,"Work Hard Play Harder":6000,
  "Strong Finish":6000,"Star Odyssey":6000,"Peek-a-Boo":6000,"Boo Crew":6000,"Lili the Leopard":6599,"Celebration Time":6999,
  "Happy Party":6999,"Illumination":7000,"Sports Car":7000,"Star Throne":7999,"Wealth Haven":9000,"Leon and Lili":9699,
  "Interstellar":10000,"Sunset Speedway":10000,"Luxury Yacht":10000,"Red Lightning":12000,"Level-up Spectacle":12999,
  "Scythe of Justice":14999,"Storm Blade":14999,"Crystal Heart":14999,"Rosa Nebula":15000,"Future Journey":15000,
  "Party On&On":15000,"Boo Town":15000,"Spookville":15000,"Malayan Tiger":15999,"Amusement Park":17000,
  "Fly Love":19999,"Mighty Starlight":20000,"TikTok Shuttle":20000,"Premium Shuttle":20000,"Dragon Gate Leap":20888,
  "Level Ship":21000,"Infinite Heart":23999,"Gate of Trial":25999,"Phoenix":25999,"Adam’s Dream":25999,"Greatsword Temple":25999,
  "Dragon Flame":26999,"Lion":29999,"Leon and Lion":34000,"TikTok Universe+":34999,"TikTok Stars":39999,
  "Thunder Falcon":39999,"Fire Phoenix":41999,"King of Legends":42999,"Valerian's Oath":42999,"Pegasus":42999,
  "TikTok Universe":44999
};

// Track total coins per user
const userTotals = {};

// Helper: determine embed color based on total coin for the gift
function getEmbedColorByTotal(totalCoin) {
    if (totalCoin < 199) return 0xADD8E6;   // Light Blue
    if (totalCoin < 500) return 0x0000FF;   // Blue
    if (totalCoin < 1000) return 0x800080;   // Purple
    if (totalCoin < 2000) return 0xFF0000;  // Red
    return 0xFFA500;                         // Orange
}

// Gift event
tiktok.on("gift", (data) => {
    const username = formatUsername(data);
    const giftName = data.giftName;
    const repeat = data.repeatCount || 1;

    const coin = giftCoins[giftName] || 0;
    const totalCoin = coin * repeat;

    if (!userTotals[username]) userTotals[username] = 0;
    userTotals[username] += totalCoin;

    const embed = {
        title: "🎁 TikTok Gift Alert!",
        color: getEmbedColorByTotal(totalCoin),
        timestamp: new Date(),
        footer: { text: `Total coins: ${userTotals[username]}` },
        fields: [
            { name: "Name", value: username, inline: true },
            { name: "Gift", value: `${giftName} **(x${repeat})**`, inline: true },
            { name: "Amount", value: `${totalCoin}`, inline: true }
        ]
    };

    sendToDiscordEmbed(embed);
});



// Follow event
tiktok.on("follow", (data) => {
    const username = formatUsername(data);
    const embed = {
        title: "❤️ New Follower!",
        description: `${username} just followed the host!`,
        color: 0x00FF00, // green
        timestamp: new Date(),
        footer: { text: "TikTok Live" }
    };
    sendToDiscordEmbed(embed);
});

// Share event
tiktok.on("share", (data) => {
    const username = formatUsername(data);
    const embed = {
        title: "🔗 Stream Shared!",
        description: `${username} shared the live stream!`,
        color: 0x1E90FF, // blue
        timestamp: new Date(),
        footer: { text: "TikTok Live" }
    };
    sendToDiscordEmbed(embed);
});


// Send plain text
async function sendToDiscordPlain(content) {
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
    }).catch(console.error);
}

// Send embed
async function sendToDiscordEmbed(embed) {
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(console.error);
}
