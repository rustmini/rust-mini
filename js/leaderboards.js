let allPlayers = [];
let currentStat = "PlayersKilled";

fetch("data/PlayerRanks.json")
.then(response => response.json())
.then(data => {

    // Convert the JSON into an array of players
    allPlayers = Object.values(data.Stats);

    // Build the dropdown automatically
    const stats = Object.keys(allPlayers[0].Stats);

    const select = document.getElementById("statSelect");

    stats.forEach(stat => {

        const option = document.createElement("option");
        option.value = stat;
        option.textContent = prettify(stat);

        if(stat === currentStat)
            option.selected = true;

        select.appendChild(option);

    });

    // Build the champion list
    buildTitles(data.Titles);

    // Show first leaderboard
    buildLeaderboard();

    // Events
    select.addEventListener("change", () => {

        currentStat = select.value;
        buildLeaderboard();

    });

    document.getElementById("search").addEventListener("input", buildLeaderboard);

});

function buildLeaderboard(){

    const search = document.getElementById("search").value.toLowerCase();

    let players = [...allPlayers];

    players.sort((a,b)=>{

        return b.Stats[currentStat]-a.Stats[currentStat];

    });

    players = players.filter(p=>{

        return p.DisplayName.toLowerCase().includes(search);

    });

    const tbody = document.getElementById("leaderboard");

    tbody.innerHTML="";

    players.forEach((player,index)=>{

        const tr = document.createElement("tr");

        let medal = index+1;

        if(index===0)
            medal="🥇";

        else if(index===1)
            medal="🥈";

        else if(index===2)
            medal="🥉";

        tr.innerHTML=`

        <td>${medal}</td>
        <td>${player.DisplayName}</td>
        <td>${player.Stats[currentStat].toLocaleString()}</td>

        `;

        tbody.appendChild(tr);

    });

}

function buildTitles(titles){

    const div=document.getElementById("titles");

    div.innerHTML="";

    for(const stat in titles){

        const t=titles[stat];

        if(t.Count===0)
            continue;

        div.innerHTML+=`

        <p>
        🏆 <b>${prettify(stat)}</b><br>
        ${t.DisplayName} (${t.Count.toLocaleString()})
        </p>

        <hr style="border:0;height:1px;background:#333;">

        `;

    }

}

function prettify(text){

    return text.replace(/([A-Z])/g," $1").trim();

}
