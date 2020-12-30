if (!(window.innerWidth/window.innerHeight === 1440/732)) {
    var wc = document.getElementById("EverythingFitter")
    if (window.innerWidth < 1440) {
        wc.style.width = window.innerWidth
        wc.style.height = (window.innerWidth/(1440/732)).toString()+"px"
    }
}
function randomint(start, end) {
    end = end + 0.5
    start = start - 0.5
    var randomnum = (Math.random() * end);
    while (randomnum < start) {
        var randomnum = (Math.random() * end);  
    }
    return Math.round(randomnum);
}
function CreateModal(modalID,modalheader,modaltext,modalimage,modalbuttons) { //first one is necessary, other 3 are optional to not have them use ""
        MessageContainer = document.createElement("div");
        wc.appendChild(MessageContainer);
        MessageContainer.className = "MessageContainer";
        MessageContainer.style.display = "block";
        MessageContainer.id = "atakmodal";
        Message = document.createElement("div");
        Message.className = "Message";
        Message.style.width = "30%";
        MessageContainer.appendChild(Message);
        CloseButton = document.createElement("span");
        CloseButton.className= "close";
        CloseButton.innerHTML = "&times;"
        if (CanMove) {
            CloseButton.onclick = function() {
                CanMove = true;
                updategrid();
                UpdateTurnCount();
                document.getElementById("atakmodal").remove();
            }
        }
        else {
            CloseButton.onclick = function() {
                updategrid();
                document.getElementById("atakmodal").remove();
            }
        }
        CanMove = false;
        Message.appendChild(CloseButton);
        MessageImage = document.createElement("img");
        MessageImage.src = modalimage;
        Message.appendChild(MessageImage);
        MessageImage.style.width = "25%";
        MessageImage.style.float = "right"; 
        MessageHeader = document.createElement("p");
        MessageHeader.className = "MessageHeader";
        MessageHeader.innerHTML = modalheader;
        Message.appendChild(MessageHeader);
        MessageText = document.createElement("p");
        MessageText.className = "MessageText";
        MessageText.innerHTML = modaltext;
        Message.appendChild(MessageText);
        for (b in modalbuttons) {
            MessageButton = document.createElement("button");
            MessageButton.innerHTML = modalbuttons[b][0];
            MessageButton.onclick = modalbuttons[b][1];
            Message.appendChild(MessageButton);
        }
}
function FireProjectile() {
    if (!(CanAbility)) {
        CreateConsoleText("You have already used an ability this turn.");
    }
    else if (currentProjectile.TimeUntilReady > 0) {
        CreateConsoleText("This ability will be ready in "+currentProjectile.TimeUntilReady+" turn(s)."); 
    }
    else {
        willhit = false;
        for (g in griditemarray) {
            gi = griditemarray[g];
            if (gi.sprite == "RedTile.PNG") {
                if (willhit && !(currentProjectile.pierces)) {
                    break;
                }
                CreateConsoleText("Armor Chomper has used "+currentProjectile.name+".");
                willhit = true;
                for (shot = 0; shot < currentProjectile.shots; shot++) {
                    if (randomint(0, 100) < currentProjectile.accuracy) {
                        damagedone = (currentProjectile.damage*((100-gi.character.defense)/100))
                        CreateConsoleText("Armor Chomper has hit "+gi.character.name+" for "+damagedone+" damage.");
                        zhealthbararray[ZombieArray.indexOf(gi.character)].style.width = (((gi.character.health - damagedone)/gi.character.health)*parseInt(zhealthbararray[ZombieArray.indexOf(gi.character)].style.width)).toString()+"%";
                        gi.character.health -= damagedone;
                        updategrid();
                        if (gi.character.health <= 0) {
                            CanAbility = false;
                            CreateConsoleText("Armor chomper has vanquished "+gi.character.name+".")
                            wc.removeChild((fighterPhysArray[fighterArray.indexOf(gi.character)]));
                            fighterPhysArray.splice(fighterArray.indexOf(gi.character), 1);
                            fighterArray.splice(fighterArray.indexOf(gi.character), 1);
                            zhealtharray[ZombieArray.indexOf(gi.character)].remove();
                            zhealtharray.splice(ZombieArray.indexOf(gi.character), 1);
                            zhealthbararray[ZombieArray.indexOf(gi.character)].remove();
                            zhealthbararray.splice(ZombieArray.indexOf(gi.character), 1);
                            ZombieArray.splice(ZombieArray.indexOf(gi.character), 1);
                            gi.character = "";
                            CheckForWin();
                            break;
                        }
                        if (randomint(0, 100) < currentProjectile.stunChance) {
                            CreateConsoleText("Armor Chomper has stunned "+gi.character.name+" for one turn.")
                            gi.character.stunned = true;
                        }
                    }
                    else {
                        CreateConsoleText("Armor Chomper has missed his attack.")
                    }
                }
                currentProjectile.TimeUntilReady = currentProjectile.reloadTime+1;
            }
        }
        CanAbility = false;
        if (!(willhit)) {
            CreateConsoleText("Chomper did not use this ability, because there are no zombies in range.");
            CanAbility = true;
        }
        UpdateTurnCount();
    }     
    CloseButton.click();       
}
function ResetGame() {
    ZTS = [];
    CPL = 0;
    difficultylevel += 1;
    document.getElementById("LevelCount").innerHTML = "Level "+difficultylevel
    Browncoat.health = 50;
    Conehead.health = 125;
    Imp.health = 40;
    Buckethead.health = 200;
    Yeti.health = 150;
    GunZomb.health = 100;
    Browncoat.stunned = false;
    Conehead.stunned = false;
    Imp.stunned = false;
    Buckethead.stunned = false;
    Yeti.stunned = false;
    GunZomb.stunned = false;
    ZombieArray = [Browncoat, Conehead, Imp, Buckethead, Yeti, GunZomb];
    AC.coords = [2,2]; 
    availablecoords = [];
    for (x=4; x<9; x++) {
        for (y=0; y<4; y++) {
            availablecoords.push([x,y]);
        }
    }
    while (CPL != difficultylevel) {
        NZ = clone(ZombieArray[randomint(0,ZombieArray.length-1)])
        if (!(NZ.powerLevel + CPL > difficultylevel)) {
            coordchosen = availablecoords[randomint(0, availablecoords.length-1)];
            NZ.coords = coordchosen;
            availablecoords.splice(availablecoords.indexOf(coordchosen), 1);
            ZTS.push(NZ);
            CPL += NZ.powerLevel;
        }
    }
    ZombieArray = ZTS;
    prevzposes = [];
    zhealtharray = [];
    zhealthbararray = [];
    fighterPhysArray = [acs];
    ctc.innerHTML = "";
    chomperhealth.innerHTML = 225;
    CanZAbility = [];
    for (z in ZombieArray) {
        for (attack in ZombieArray[z].attacks) {
            ZombieArray[z].attacks[attack].TimeUntilReady = 0;
        }
        prevzposes.push(ZombieArray[z].coords)
        CanZAbility.push(true);
        var zombi = document.createElement("img");
        zombi.className = "Fighter";
        zombi.style.height = ZombieArray[z].height;
        zombi.src = ZombieArray[z].aliveSprite;
        wc.appendChild(zombi);
        fighterPhysArray.push(zombi);
        var zhealth = document.createElement("p")
        var zhealthbar = document.createElement("img")
        zhealthbar.src = "HealthBar.PNG";
        zhealthbar.style.position = "absolute";
        zhealthbar.style.width = "15%";
        zhealthbar.style.minHeight = "4%";
        zhealthbar.style.maxHeight = "4%";
        zhealthbar.style.zIndex = 8000;
        zhealthbar.style.border = "2px solid #021a40";
        wc.appendChild(zhealthbar);
        zhealth.style.position = "absolute";
        zhealth.style.fontFamily =  'Marker Felt';
        zhealth.style.fontSize = "2vw";
        zhealth.style.zIndex = 8008;
        wc.appendChild(zhealth)
        zhealtharray.push(zhealth);
        zhealthbararray.push(zhealthbar);
    }
    fighterArray = [AC].concat(ZombieArray);
    for (attack in AC.attacks) {
        AC.attacks[attack].TimeUntilReady = 0;
    }
    IsPlayerTurn = true;
    CanMove = true;
    CanAbility = true;
    directionright = true;
    prevppos = AC.coords.slice(0);
    currentProjectile = "";
    consolemessages = [];
    abilitybuttons.style.display = "block";
    UpdateTurnCount();
    updategrid();
    CheckZindexes();
}
function CheckForWin() {
    if (ZombieArray.length == 0) {
        abilitybuttons.style.display = "none";
        IsPlayerTurn = false;
        CanMove = false;
        CreateConsoleText("Armor Chomper has beat level "+difficultylevel+"!")
        endtext = document.createElement("p");
        endtext.id = "EndText";
        endtext.innerHTML = "Level Complete!";
        wc.appendChild(endtext);
        retrybutton = document.createElement("button");
        retrybutton.id = "RetryButton";
        retrybutton.innerHTML = "Next Level";
        retrybutton.onclick = function() {
            wc.removeChild(endtext);
            wc.removeChild(retrybutton);
            ResetGame();
        }
        wc.appendChild(retrybutton);
        
    }
}
function CheckForLoss() {
    if (chomperhealth.innerHTML <= 0) {
        chomperhealth.innerHTML = 0;
        wc.removeChild(fighterPhysArray[fighterArray.indexOf(AC)]);
        abilitybuttons.style.display = "none";
        IsPlayerTurn = false;
        CanMove = false;
        CreateConsoleText("Armor Chomper has died on level "+difficultylevel+".")
        endtext = document.createElement("p");
        endtext.id = "EndText";
        endtext.innerHTML = "You Lose";
        wc.appendChild(endtext);
        return true;
    }
    return false;
}
function CreateConsoleText(text) {
    ctc = document.getElementById("ConsoleTextContainer");
    if (consolemessages.length > 3) {
        ctc.removeChild(consolemessages[0]);
        consolemessages.shift();
    }
    Message = document.createElement("div");
    Message.className = "consoletext";
    Message.innerHTML = text;
    consolemessages.push(Message);
    ctc.appendChild(Message)
}
function UpdateTurnCount() {
    if (IsPlayerTurn) {
        al = 0;
        ml = 0;
        if (CanAbility) {
            al = 1;
        }
        if (CanMove) {
            ml = 1;
        }
        turncounter.innerHTML = "Chomper's Turn: "+ml+" move left and "+al+" ability left";
    }
}
class griditem {
    constructor() {
        this.codx = 0; //x pos in terms of the grid
        this.cody = 0;//y pos in terms of the grid
        this.sprite = "";
        this.character = ""; //the character on the grid spot
    }
}
class AttackType {
    constructor() {
        this.damage = 0;
        this.name = "";
        this.desc = ""; //only for chomper's abilities
        this.range = 0; //how many squares it travels
        this.shots = 1; //how many times the attack triggers
        this.pierces = false; // whether the attack goes through zombs or not
        this.accuracy = 101; //percentage
        this.reloadTime = 0; //how many turns it takes until it's ready again
        this.TimeUntilReady = 0;
        this.stunChance = 0; //percent chance to stun
        this.displaySprite = ""; //sprite displaying ability
    }
}
class Fighter {
    constructor() {
        this.name = "";
        this.plant = false; //determine if it's a plant or zombie, boolean because idk :/
        this.health = 0;
        this.height = 0; //how tall it is
        this.powerLevel = 0; //To compare strengths between fighters
        this.movement = 1; //how many squares it can move
        this.stunned = false; //if the fighter is stunned or not
        this.coords = []; //x and y positions on the grid
        this.defense = 0; //how much incoming damage is reduced by (percentage)
        this.attacks = []; //what attacks this character has
        this.movesLeft = 1;
        this.aliveSprite = ""; //hmm why is this specified to be alive? unless..
        this.deadSprite = ""; //NOOOOO I don't wanna see the poor plants dead :(

    }
}
fighterArray = [];
Goop = new AttackType();
Goop.name = "Goop";
Goop.desc = "Spit your slobber at a zombie to cover them in sticky goop that stops them from moving, making them vunerable. <br>Dmg: 25 ∫ Range: 4 spaces ∫ Cooldown: 1 turn ∫ Stuns for 1 turn ∫ 95% chance to hit";
Goop.damage = 25;
Goop.range = 4;
Goop.accuracy = 95;
Goop.reloadTime = 1;
Goop.stunChance = 100;
Goop.displaySprite = "GoopIcon.PNG";
Chomp = new AttackType();
Chomp.name = "Chomp";
Chomp.desc = "Bite a zombie with your sharp metal teeth. <br>Dmg: 75 ∫ range: Melee (1 space) ∫ No cooldown";
Chomp.damage = 75;
Chomp.range = 1;
Chomp.reloadTime = 0;
Chomp.pierces = false;
Chomp.displaySprite = "ChompIcon.PNG";
Seed = new AttackType();
Seed.name = "Seed Spit";
Seed.desc = "Armor Chomper chews up some seeds and spits them out at the zombies. <br>Dmg: 25 per seed ∫ range: 6 spaces ∫ fires 3 seeds ∫ Cooldown: 2 turns ∫ 85% chance to hit";
Seed.damage = 25;
Seed.range = 6;
Seed.accuracy = 85;
Seed.reloadTime = 2;
Seed.shots = 3;
Seed.displaySprite = "SeedSpitIcon.PNG";
AC = new Fighter();
AC.plant = true;
AC.name = "Armor Chomper";
AC.health = 225;
AC.powerLevel = 9001;
AC.coords = [2,2];
AC.attacks.push(Goop,Chomp,Seed);
AC.aliveSprite = "ArmorChomperRight.PNG";
Bite = new AttackType();
Bite.name = "Bite";
Bite.damage = 25;
Bite.range = 1;
AnkBite = new AttackType();
AnkBite.name = "Ankle Bite";
AnkBite.damage = 30;
AnkBite.range = 1;
Rock = new AttackType();
Rock.name = "Rock";
Rock.damage = 10;
Rock.range = 3;
Rock.accuracy = 75;
Rock.reloadTime = 1;
Snowball = new AttackType();
Snowball.name = "Snowball";
Snowball.damage = 20;
Snowball.range = 4;
Snowball.stunChance = 25;
Gun= new AttackType();
Gun.name = "Bullet Fire";
Gun.damage = 25;
Gun.range = 5;
Gun.shots = 2;
Gun.accuracy = 50;
IceDagger = new AttackType();
IceDagger.name = "Ice Dagger";
IceDagger.damage = 40;
IceDagger.range = 1;
IceDagger.reloadTime = 1;
function clone(obj) {
    return Object.create(
      Object.getPrototypeOf(obj), 
      Object.getOwnPropertyDescriptors(obj) 
    );
}
Browncoat = new Fighter();
Browncoat.name = "Browncoat Zombie";
Browncoat.health = 50;
Browncoat.powerLevel = 1;
Browncoat.coords = [7,2];
Browncoat.height = "25%";
Browncoat.attacks.push(Bite, Rock);
Browncoat.aliveSprite = "RegZomb.png";
Conehead = new Fighter();
Conehead.name = "Conehead Zombie";
Conehead.health = 125;
Conehead.height = "30%";
Conehead.powerLevel = 2;
Conehead.attacks.push(Bite, clone(Rock));
Conehead.aliveSprite = "Conehead.png";
Buckethead = new Fighter();
Buckethead.name = "Buckethead Zombie";
Buckethead.health = 200;
Buckethead.height = "30%";
Buckethead.powerLevel = 3;
Buckethead.attacks.push(Bite, clone(Rock));
Buckethead.aliveSprite = "Buckethead.png";
Yeti = new Fighter();
Yeti.name = "Yeti Zombie";
Yeti.health = 150;
Yeti.height = "32%";
Yeti.powerLevel = 5;
Yeti.attacks.push(IceDagger,Snowball);
Yeti.aliveSprite = "YetiZombie.png";
GunZomb = new Fighter();
GunZomb.name = "Swag Zombie";
GunZomb.health = 100;
GunZomb.height = "28%";
GunZomb.powerLevel = 5;
GunZomb.attacks.push(Gun);
GunZomb.aliveSprite = "GunZombie.PNG";
Imp = new Fighter();
Imp.name = "Imp";
Imp.health = 40;
Imp.powerLevel = 1;
Imp.movement = 2;
Imp.height = "15%";
Imp.attacks.push(AnkBite)
Imp.aliveSprite = "Imp.png";
fighterArray.push(AC, Browncoat) //,Conehead)
griditemarray = [];
phygriditems = [];
ZombieArray = [];
ZombieArray.push(Browncoat)// ,Conehead);
gridx = 9
gridy = 5
gridsize = 1.45
currentx = 0
currenty = 0
prevzposes = [];
difficultylevel = 1;
turntime = 1500;
var wc = document.getElementById("EverythingFitter");
var acs = document.getElementById("ArmorChomper");
var zhealtharray = [];
var zhealthbararray = [];
fighterPhysArray = [acs];
CanZAbility = [];
for (z in ZombieArray) {
    prevzposes.push(ZombieArray[z].coords)
    CanZAbility.push(true);
    var zombi = document.createElement("img");
    zombi.className = "Fighter";
    zombi.style.height = ZombieArray[z].height;
    zombi.src = ZombieArray[z].aliveSprite;
    wc.appendChild(zombi);
    fighterPhysArray.push(zombi);
    var zhealth = document.createElement("p")
    var zhealthbar = document.createElement("img")
    zhealthbar.src = "HealthBar.PNG";
    zhealthbar.style.position = "absolute";
    zhealthbar.style.width = "15%";
    zhealthbar.style.minHeight = "4%";
    zhealthbar.style.maxHeight = "4%";
    zhealthbar.style.zIndex = 8000;
    zhealthbar.style.border = "2px solid #021a40";
    wc.appendChild(zhealthbar);
    zhealth.style.position = "absolute";
    zhealth.style.fontFamily =  'Marker Felt';
    zhealth.style.fontSize = "2vw";
    zhealth.style.zIndex = 8008;
    wc.appendChild(zhealth)
    zhealtharray.push(zhealth);
    zhealthbararray.push(zhealthbar);
}
IsPlayerTurn = true;
CanMove = true;
CanAbility = true;
StopTurn = false;
directionright = true;
prevppos = AC.coords.slice(0);
var currentProjectile = "";
var consolemessages = [];
function updategrid() {
    for (is in phygriditems) {
        phygriditems[is].remove();
    }
    phygriditems = [];
    griditemarray = [];
    currentx = 0
    currenty = 0
    for (i = 0; i < gridx*gridy; i++) {
        currentx += 1;
        ItemSprite = document.createElement("img");
        newgi = new griditem();
        newgi.codx = currentx;
        newgi.cody = currenty;
        newgi.sprite = "BlankTile.PNG"
        griditemarray.push(newgi);
        ItemSprite.src = "BlankTile.PNG";
        wc.appendChild(ItemSprite);
        ItemSprite.className = "gridTile";
        ItemSprite.onclick = tryToMove;
        ItemSprite.style.height = (8*gridsize).toString()+"%";
        ItemSprite.style.top = (gridsize*(20+(currenty)*8)).toString()+"%";
        ItemSprite.style.left = (window.innerWidth*((gridsize*currentx)+gridy/(gridsize*2)-currenty*gridsize*0.7)*(1/18)).toString()+"px"
        for (f in fighterArray) {
            fighter = fighterArray[f];
            if (currentx === fighter.coords[0] && currenty === fighter.coords[1] && fighter.plant) {
                newgi.sprite = "GreenTile.PNG"
                newgi.character = fighter;
                fighterPhysArray[f].style.top = (parseInt(ItemSprite.style.top)-0.088*fighterPhysArray[f].height).toString()+"%";
                fighterPhysArray[f].style.left = (parseInt(ItemSprite.style.left)+0.4*fighterPhysArray[f].width).toString()+"px";
                ItemSprite.src = "GreenTile.PNG";
            }
            if (currentx === fighter.coords[0] && currenty === fighter.coords[1] && !(fighter.plant)) {
                newgi.sprite = "PurpleTile.PNG"
                newgi.character = fighter;
                fighterPhysArray[f].style.top = (((30-parseInt(fighter.height))/10)+parseInt(ItemSprite.style.top)-0.088*fighterPhysArray[f].height).toString()+"%";
                //fighterPhysArray[f].style.top = ((fighterPhysArray[f].getBoundingClientRect().top/36.396)*(((30-parseInt(fighter.height))/10)+parseInt(ItemSprite.style.top)-0.088*fighterPhysArray[f].height)).toString()+"px";
                fighterPhysArray[f].style.left = ((3*(30-parseInt(fighter.height)))+parseInt(ItemSprite.style.left)+0.1*fighterPhysArray[f].width).toString()+"px";
                zhealtharray[f-1].style.top = (0.8*(parseInt(ItemSprite.style.top)-0.088*fighterPhysArray[f].height)).toString()+"%";
                zhealtharray[f-1].style.left = (parseInt(ItemSprite.style.left)+0.1*fighterPhysArray[f].width).toString()+"px";
                zhealtharray[f-1].innerHTML = fighter.health;
                zhealthbararray[f-1].style.top = (0.9*(parseInt(ItemSprite.style.top)-0.088*fighterPhysArray[f].height)).toString()+"%";
                zhealthbararray[f-1].style.left = (parseInt(ItemSprite.style.left)+0.1*fighterPhysArray[f].width).toString()+"px";
                ItemSprite.src = "PurpleTile.PNG";
            }
        }
        phygriditems.push(ItemSprite);
        if (currentx%gridx == 0) {
            currenty += 1;
            currentx = 0;
        }
    }
}
function CheckIfCollision(p,zombi) {
    for (z in ZombieArray) {
        if ((ZombieArray[z].coords[0] == AC.coords[0]) && (ZombieArray[z].coords[1] == AC.coords[1])) {
            if (p == "plant") {
                CreateConsoleText("You cannot move on top of a zombie.")
                CanMove = true;
                AC.coords = prevppos.slice(0);
                updategrid();
            }
            else {
                ZombieArray[z].coords = prevzposes[z].slice(0);
                updategrid();
                return true;
            }
        }
        if (p == "Zombie") {
            for (zom in ZombieArray) {
                if (zom == z) {
                    continue;
                }
                if (ZombieArray[z].coords[0] == ZombieArray[zom].coords[0] && ZombieArray[z].coords[1] == ZombieArray[zom].coords[1]) {
                    zombi.coords = prevzposes[ZombieArray.indexOf(zombi)].slice(0);
                    updategrid();
                    return true;
                }
            }
        }
    }
    return false;
}
wc.style.width = window.innerWidth.toString()+"px";
wc.style.height = (window.innerWidth/(1440/732)).toString()+"px";
var turnbutton = document.getElementById("EndTurn");
var turncounter = document.getElementById("TurnCounter");
var abilitybuttons = document.getElementById("AbilityButtons");
var chomperhealth = document.getElementById("HealthAmount");
for (a in AC.attacks) {
    atak = AC.attacks[a];
    attackbutton = document.createElement("button");
    attackbutton.className = "AbilityButton";
    attackbutton.innerHTML = atak.name;
    attackbutton.id = atak.name;
    abilitybuttons.appendChild(attackbutton);
    attackbutton.onclick = function(event) {
        for (a in AC.attacks) {
            if (event.target.id == AC.attacks[a].name) {
                attack = AC.attacks[a];
            }
        }
        currentProjectile = attack;
        CreateModal((attack.name+"Info"),attack.name,attack.desc,attack.displaySprite,[["Use",FireProjectile]]);//,["Switch Directions",SwitchAD]]);
        for (is in phygriditems) {
            phygriditems[is].remove();
        }
        phygriditems = [];
        griditemarray = [];
        currentx = 0
        currenty = 0
        for (i = 0; i < gridx*gridy; i++) {
            currentx += 1;
            ItemSprite = document.createElement("img");
            newgi = new griditem();
            newgi.codx = currentx;
            newgi.cody = currenty;
            newgi.sprite = "BlankTile.PNG"
            griditemarray.push(newgi);
            ItemSprite.src = "BlankTile.PNG";
            wc.appendChild(ItemSprite);
            ItemSprite.style.position = "absolute";
            ItemSprite.className = "gridTile";
            ItemSprite.onclick = tryToMove;
            ItemSprite.style.height = (8*gridsize).toString()+"%";
            ItemSprite.style.top = (gridsize*(20+(currenty)*8)).toString()+"%";
            ItemSprite.style.left = (window.innerWidth*((gridsize*currentx)+gridy/(gridsize*2)-currenty*gridsize*0.7)*(1/18)).toString()+"px"
            for (f in fighterArray) {
                fighter = fighterArray[f];
                if (currentx === fighter.coords[0] && currenty === fighter.coords[1] && fighter.plant) {
                    newgi.sprite = "GreenTile.PNG"
                    newgi.character = fighter;
                    ItemSprite.src = "GreenTile.PNG";
                }
                if (currentx === fighter.coords[0] && currenty === fighter.coords[1] && !(fighter.plant)) {
                    newgi.sprite = "PurpleTile.PNG"
                    newgi.character = fighter;
                    ItemSprite.src = "PurpleTile.PNG";
                }
            }
            if((AC.coords[0]+1 <= currentx && currentx <= AC.coords[0]+attack.range) && currenty === AC.coords[1]) {
                if (newgi.sprite == "PurpleTile.PNG") {
                    newgi.sprite = "RedTile.PNG";
                    ItemSprite.src = "RedTile.PNG";
                }
                else {
                    newgi.sprite = "BlueTile.PNG";
                    ItemSprite.src = "BlueTile.PNG";
                }
            }
            phygriditems.push(ItemSprite);
            if (currentx%gridx == 0) {
                currenty += 1;
                currentx = 0;
            }
        }
    }
}
function TestAttack(zombie, attack) { 
    willhit = false;
    currenty = 0;
    currentx = 0;
    for (i = 0; i < gridx*gridy; i++) {
        currentx += 1;
        if ((zombie.coords[0]-1 >= currentx && currentx >= zombie.coords[0]-attack.range) && currenty === zombie.coords[1]) {
            if (griditemarray[i].sprite == "GreenTile.PNG" && attack.TimeUntilReady == 0) {
                willhit = true;
                griditemarray[i].sprite = "RedTile.PNG";
                phygriditems[i].src = "RedTile.PNG";
                CreateConsoleText(zombie.name+" has used "+attack.name+".")
                for (shot = 0; shot < attack.shots; shot++) {
                    if (randomint(0, 100) < attack.accuracy) {
                        griditemarray[i].character.health -= attack.damage;
                        chomperhealth.innerHTML = (parseInt(chomperhealth.innerHTML) - attack.damage).toString();
                        CreateConsoleText(zombie.name+" has hit Armor Chomper for "+attack.damage.toString()+" damage.");
                        if (!(CheckForLoss())) {
                            if (randomint(0, 100) < attack.stunChance) {
                                CreateConsoleText(zombie.name+" has stunned Armor Chomper for one turn.")
                                AC.stunned = true;
                            }
                        }
                        else {
                            StopTurn = true;
                        }
                    }
                    else {
                        CreateConsoleText(zombie.name+" has missed.");
                    }
                }
                attack.TimeUntilReady = attack.reloadTime+1;
                CanZAbility[ZombieArray.indexOf(zombie)] = false;

            }
            else {
                griditemarray[i].sprite = "BlueTile.PNG";
                phygriditems[i].src = "BlueTile.PNG";
            }
        }
        if (currentx%gridx == 0) {
            currenty += 1;
            currentx = 0;
        }
    }
    if (!(willhit)) {
        console.log("clearing")
        for (i = 0; i < gridx*gridy; i++) {
            currentx += 1;
            if ((zombie.coords[0]-1 >= currentx && currentx >= zombie.coords[0]-attack.range) && currenty === zombie.coords[1]) {
                griditemarray[i].sprite = "BlankTile.PNG";
                phygriditems[i].src = "BlankTile.PNG";
            }
            if (currentx%gridx == 0) {
                currenty += 1;
                currentx = 0;
            }
        }
        updategrid();
    }
}
function CheckZindexes() {
    fc = [];
    zindex = 666;
    tempvar = 0;
    issorted = false;
    for (f in fighterArray) {
        fighter = fighterArray[f];
        fc.push(fighter);
    }
    while (issorted == false) {
        issorted = true;
        for (c in fc) {
            if (!(c >= fc.length-1)) {
                if (fc[c].coords[1] > fc[(parseInt(c)+1)].coords[1]) {
                    tempvar = fc[c];
                    fc[c] = fc[(parseInt(c)+1)];
                    fc[(parseInt(c)+1)] = tempvar;
                    issorted = false;
                }
            }
        }
    }
    for (yc in fc) { 
      fyc = fc[yc];
      fighterPhysArray[fighterArray.indexOf(fyc)].style.zIndex = (parseInt(zindex) + parseInt(yc));
    }
}
function CalculateMoves(zombie) {
    zombie.movesLeft -= 1;
    if (zombie.coords[0] <= AC.coords[0]) {
        MoveZombie(zombie, [1,0])
        return;
    }
    if (zombie.coords[1] != AC.coords[1]) {
        if (Math.random() > ((zombie.coords[0]-AC.coords[0])/10)/(AC.coords[1]-zombie.coords[1])) {
            if (!(MoveZombie(zombie,[0, RoundToOne(AC.coords[1]-zombie.coords[1])]))) {
                if (zombie.coords[0] > AC.coords[0]) {
                    MoveZombie(zombie, [-1,0])
                }
                else {
                    MoveZombie(zombie, [1,0]) 
                }
            } 
        }
        else {
            if (zombie.coords[0] > AC.coords[0]) {
                if (!(MoveZombie(zombie, [-1,0]))) {
                    MoveZombie(zombie,[0, RoundToOne(AC.coords[1]-zombie.coords[1])])
                }
            }
            else {
                if (!(MoveZombie(zombie, [1,0]))) {
                    MoveZombie(zombie,[0, RoundToOne(AC.coords[1]-zombie.coords[1])])
                }
            }
        }
    }
    else {
        if (zombie.coords[0] > AC.coords[0]) {
            MoveZombie(zombie, [-1,0])
        }
        else {
            MoveZombie(zombie, [1,0])
        }
    }
    CheckZindexes();
}
function MoveZombie(zombie, direction) { //direction is array [x,y]
    createtext = true;
    prevzposes[ZombieArray.indexOf(zombie)] = zombie.coords.slice(0);
    zombie.coords[0] += direction[0];
    zombie.coords[1] += direction[1];
    if (CheckIfCollision("Zombie",zombie)) {
        updategrid();
        return false;
    }
    if (createtext) {
        if (direction[1] > 0) {
            CreateConsoleText(zombie.name+" has moved 1 unit down.")
        }
        else if (direction[1] < 0) {
            CreateConsoleText(zombie.name+" has moved 1 unit up.")
        }
        if (direction[0] > 0) {
            CreateConsoleText(zombie.name+" has moved 1 unit right.")
        }
        else if (direction[0] < 0) {
            CreateConsoleText(zombie.name+" has moved 1 unit left.")
        }
    }
    if (zombie.movesLeft > 1) {
        CalculateMoves(zombie);
        createtext = false;
    }
    updategrid();
    return true;
}
function RoundToOne(num) {
    if (num > 0) {
        return 1;
    }
    else {
        return -1;
    }
}
function ZombieTurn(z) {
    zombie = ZombieArray[z];
    CanZAbility[z] = true;
    zombie.movesLeft = zombie.movement+1;
    if (zombie.stunned) {
        setTimeout(function() {
            CreateConsoleText(zombie.name+" did not do anything as they are stunned.")
            zombie.stunned = false;
            for (a in zombie.attacks) {
                if (zombie.attacks[a].TimeUntilReady > 0) {
                    zombie.attacks[a].TimeUntilReady -= 1;
                }
            }
            setTimeout(function() {
                CreateConsoleText(zombie.name+" has ended their turn.")
                if (z == ZombieArray.length-1) {
                    if (AC.stunned == true) {
                        setTimeout(function() {
                            CreateConsoleText("Armor Chomper did not do anything as they are stunned.")
                            for (attack in AC.attacks) {
                                attack = AC.attacks[attack];
                                if (attack.TimeUntilReady > 0) {
                                    attack.TimeUntilReady -= 1;
                                }
                            }
                            AC.stunned = false;
                            ZombieTurn(0);
                        }, turntime);
                    }
                    else {
                        IsPlayerTurn = true;
                        CanMove = true;
                        CanAbility = true;
                        abilitybuttons.style.display = "block";
                        UpdateTurnCount();
                    }
                    updategrid();
                }
                else {
                    ZombieTurn(z+1);
                }
            }, turntime);
        }, turntime);
    }
    else {
        setTimeout(function() {
            for (a in zombie.attacks) {
                if (zombie.attacks[a].TimeUntilReady > 0) {
                    zombie.attacks[a].TimeUntilReady -= 1;
                }
                if (CanZAbility[z]) {
                    TestAttack(zombie,zombie.attacks[a]);
                    if (StopTurn) {
                        break;
                    }
                }
            }
            if (!(StopTurn)) {
                setTimeout(function() {
                    CalculateMoves(zombie)
                    setTimeout(function() {
                        if (CanZAbility[z]) {
                            for (a in zombie.attacks) {
                                TestAttack(zombie,zombie.attacks[a]);
                                if (StopTurn) {
                                    break;
                                }
                            }
                        }
                        if (!(StopTurn)) {
                            setTimeout(function() {
                                CreateConsoleText(zombie.name+" has ended their turn.")
                                if (z == ZombieArray.length-1) {
                                    if (AC.stunned == true) {
                                        setTimeout(function() {
                                            CreateConsoleText("Armor Chomper did not do anything as they are stunned.")
                                            for (attack in AC.attacks) {
                                                attack = AC.attacks[attack];
                                                if (attack.TimeUntilReady > 0) {
                                                    attack.TimeUntilReady -= 1;
                                                }
                                            }
                                            AC.stunned = false;
                                            ZombieTurn(0);
                                        }, turntime);
                                    }
                                    else {
                                        IsPlayerTurn = true;
                                        CanMove = true;
                                        CanAbility = true;
                                        abilitybuttons.style.display = "block";
                                        UpdateTurnCount();
                                    }
                                    updategrid();
                                }
                                else {
                                    ZombieTurn(z+1);
                                }
                            }, turntime);
                        }
                    }, turntime);
                }, turntime);
            } 
        }, turntime);
    }
}
turnbutton.onclick = function() {
    turncounter.innerHTML = "Zombie's Turn";
    abilitybuttons.style.display = "none";
    IsPlayerTurn = false;
    CanMove = false;
    CreateConsoleText("Armor Chomper has ended their turn.")
    for (attack in AC.attacks) {
        attack = AC.attacks[attack];
        if (attack.TimeUntilReady > 0) {
            attack.TimeUntilReady -= 1;
        }
    }
    ZombieTurn(0);
}

function tryToMove() {
    if (CanMove) {
        prevppos = AC.coords.slice(0);
        newspot = [griditemarray[phygriditems.indexOf(event.target)].codx,griditemarray[phygriditems.indexOf(event.target)].cody];
        gs = false;
        if (newspot[0] == AC.coords[0]) {
            if (newspot[1]-1 == AC.coords[1]) {
                CreateConsoleText("Armor Chomper has moved 1 unit down.");
                gs = true;
            }
            if (newspot[1]+1 == AC.coords[1]) {
                CreateConsoleText("Armor Chomper has moved 1 unit up.");
                gs = true;
            }
        }
        else if (newspot[1] == AC.coords[1]) {
            if (newspot[0]-1 == AC.coords[0]) {
                CreateConsoleText("Armor Chomper has moved 1 unit to the right.");
                gs = true;
            }
            if (newspot[0]+1 == AC.coords[0]) {
                CreateConsoleText("Armor Chomper has moved 1 unit to the left.");
                gs = true;
            }
        }
        if (!(gs)) {
            CreateConsoleText("You cannot move there.");
        }
        else {
            AC.coords[0] = newspot[0];
            AC.coords[1] = newspot[1];
            CanMove = false;
            CheckIfCollision("plant","");
            updategrid();
            UpdateTurnCount();
            CheckZindexes();
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (CanMove) {
        prevppos = AC.coords.slice(0);
        if(event.keyCode == 37) {
            if (AC.coords[0] > 1) {
                AC.coords[0] = AC.coords[0]-1;
            }        
            CreateConsoleText("Armor Chomper has moved 1 unit to the left.");
        }
        else if(event.keyCode == 38) {
            if (AC.coords[1] > 0) {
                AC.coords[1] = AC.coords[1]-1;
            }
            CreateConsoleText("Armor Chomper has moved 1 unit up.");
        }
        else if(event.keyCode == 39) {
            if (AC.coords[0] < gridx) {
                AC.coords[0] = AC.coords[0]+1;
            }
            CreateConsoleText("Armor Chomper has moved 1 unit to the right.");
        }
        else if(event.keyCode == 40) {
            if (AC.coords[1] < gridy-1) {
                AC.coords[1] = AC.coords[1]+1;
            }
            CreateConsoleText("Armor Chomper has moved 1 unit down.");
        }
        if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
            CanMove = false;
            CheckIfCollision("plant","");
            updategrid();
            UpdateTurnCount();
            CheckZindexes();
        }
    }
});
updategrid();
