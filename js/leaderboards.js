let players = [];
let currentStat = "PVPKills";

fetch("data/PlayerRanks.json")
.then(r => r.json())
.then(data => {

    players = Object.values(data.PlayerRankData);

    // Stats to show
    const stats = [
        "PVPKills",
        "Deaths",
        "KDR",
        "HeadShots",
        "PVEKills",
        "NPCKills",
        "TimePlayed",
        "ResourcesGathered",
        "StructuresBuilt",
        "StructuresUpgraded",
        "ItemsCrafted",
        "ItemsDeployed",
        "ExplosivesThrown",
        "HeliKills",
        "APCKills",
        "FishCaught"
    ];

    const select = document.getElementById("statSelect");

    stats.forEach(stat => {

        const option = document.createElement("option");

        option.value = stat;
        option.textContent = prettify(stat);

        if(stat === currentStat)
            option.selected = true;

        select.appendChild(option);

    });

    buildLeaderboard();

    select.onchange = function(){

        currentStat = this.value;
        buildLeaderboard();

    };

    document.getElementById("search").oninput = buildLeaderboard;

});

function buildLeaderboard(){

    const search = document.getElementById("search").value.toLowerCase();

    let list = players.filter(player =>
        player.Name.toLowerCase().includes(search)
    );

    list.sort((a,b)=>
        Number(b[currentStat] || 0) - Number(a[currentStat] || 0)
    );

    const tbody = document.getElementById("leaderboard");

    tbody.innerHTML="";

    list.forEach((player,index)=>{

        let rank=index+1;

        if(index===0) rank="🥇";
        else if(index===1) rank="🥈";
        else if(index===2) rank="🥉";

        let value = player[currentStat];

        if(currentStat==="TimePlayed"){

            value = Math.floor(Number(value)/3600) + " hrs";

        }
        else{

            value = Number(value || 0).toLocaleString();

        }

        tbody.innerHTML += `
        <tr>
            <td>${rank}</td>
            <td>${player.Status==="online" ? "🟢" : "⚪"} ${player.Name}</td>
            <td>${value}</td>
        </tr>
        `;

    });

}

function prettify(text){

    return text
        .replace(/([A-Z])/g," $1")
        .replace("P V P","PVP")
        .replace("P V E","PVE")
        .replace("N P C","NPC")
        .trim();

}
