class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        this.engine.currLocation = key;
        let locationData = this.engine.storyData.Locations[key];
        if (this.engine.sleepState == -1) {
            this.engine.showEmphasized("You're awake.");
            this.engine.sleepState = 0;
        }
        else if (this.engine.sleepState == 1) {
            this.engine.showEmphasized("You're awake again.");
            this.engine.sleepState = 0;
        }
        this.engine.show(locationData['Body']);

        if ("ConditionalBody" in locationData) {
            for (let elem of locationData['ConditionalBody']) {
                if ("Conditions" in elem) {
                    let flag = true;
                    for (let cond of elem['Conditions']) {
                        if (flag && cond.Condition in this.engine && this.engine[cond.Condition] != cond.ConditionValue) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        this.engine.show(elem.Text);
                    }
                }
            }
        }

        if("ShowTime" in locationData) {
            this.engine.show(this.engine.getTime());
        }
        if("ShowAltarState" in locationData) {
            this.engine.show(this.engine.getAltarState());
        }
        
        this.loadChoices();
    }

    // used for navigation
    handleChoice(choice) {
        this.engine.updateTime();
        if(choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }

    // inventory management functions
    learnRoomKey() {
        this.engine.show("&gt; Invoke Wild Gods");
        this.engine.gameState++;
        this.engine.show("Gazing into the vision the Gods show you, you see something unsettling. A mortal trapped in a room, at once eerily similar to your own and utterly different. Dreaming every day of the object that can grant their freedom, as you once did.");
        this.engine.show("The form of that object solidifies in your mind. A simple metal cylinder, with a flat disc on one end and some small protrusions of varying sizes and shapes along its length.");
        this.engine.show("Made of iron. Made of the material they lack, but you have. You can help them. You can help them escape, and get your glimpse into their world as you free them to return to it.");
        this.loadChoices();
    }

    makeRoomKey() {
        this.engine.show("&gt; Forge");
        this.engine.roomKey = "Table2";
        this.loadChoices();
    }

    getRoomKey() {
        this.engine.show("&gt; Get Key");
        this.engine.roomKey = "inventory";
        this.loadChoices();
    }

    putRoomKey() {
        this.engine.show("&gt; Place Key");
        this.engine.roomKey = this.engine.currLocation;
        this.loadChoices();
    }

    makeIdol() {
        this.engine.show("&gt; Carve");
        this.engine.idol = "Table1";
        this.engine.gameState++;
        this.engine.gotoScene(Location, "Table1");
    }

    getIdol() {
        this.engine.show("&gt; Get Idol");
        this.engine.idol = "inventory";
        this.loadChoices();
    }

    putIdol() {
        this.engine.show("&gt; Place Idol");
        this.engine.idol = this.engine.currLocation;
        this.loadChoices();
    }

    getKnife() {
        if (this.engine.form == 0) {
            this.engine.show("&gt; Get Knife");
        }
        else {
            this.engine.show("&gt; Get Tooth");
        }
        this.engine.knife = "inventory";
        this.loadChoices();
    }

    putKnife() {
        if (this.engine.form == 0) {
            this.engine.show ("&gt; Place Knife.");
        }
        else {
            this.engine.show("&gt; Place Tooth.");
        }
        this.engine.knife = this.engine.currLocation;
        this.loadChoices();
    }
    // end of inventory management functions

    // game progress functions
    unlockDoor() {
        if (this.engine.form == 0) {
            this.engine.show("&gt; Unlock Door");
            this.engine.mortalDoorUnlocked = 1;
            this.engine.roomKey = "";
            this.engine.show("It takes a moment to find the keyhole, but once you do, the key slides in easily. You feel the latch sliding as you twist, and the door silently swings open in front of you.")
        }
        else {
            this.engine.show("&gt; Channel Idol");
            this.engine.spiritDoorUnlocked = 1;
            this.engine.show("Holding the idol close to the door's latch, you carry out the familiar ritual, allowing your energy, your desire for freedom to flow through the idol and into the thick obsidian before you. Sure enough, with less than a whisper, the door swings open under the power of your intention.")
        }
        this.loadChoices();
    }

    // time management (for window scenes)
    wait() {
        this.engine.updateTime();
        if (this.engine.currLocation == "Window2" && this.engine.time == 2 && this.engine.gameState < 2) {
            this.engine.gotoScene(Location, this.engine.currLocation);
            this.engine.gameState++;
        }
        else {
            this.engine.show(this.engine.getTime());
            this.loadChoices();
        }
    }

    // player transform
    changeForm() {
        this.engine.show("&gt; Pray");
        this.engine.clearBody();
        if (this.engine.currLocation == "Altar1") {
            if (this.engine.knife == "Altar1") {
                this.engine.knife = "Table2";
            }
            if (this.engine.idol == "Altar1") {
                this.engine.idol = "Table2";
            }
            if (this.engine.roomKey == "Altar1") {
                this.engine.roomKey = "Table2";
            }
            this.engine.form = 8;
            this.engine.sleepState = 1;
            if (this.engine.gameState < 1) {
                this.engine.gameState++;
                this.engine.sleepState = -1;
            }
            else {
            }
            this.engine.gotoScene(Location, "Table2");
        }
        else {
            if (this.engine.knife == "Altar2") {
                this.engine.knife = "Table1";
            }
            if (this.engine.idol == "Altar2") {
                this.engine.idol = "Table1";
            }
            if (this.engine.roomKey == "Altar2") {
                this.engine.roomKey = "Table1";
            }
            this.engine.form = 0;
            this.engine.sleepState = 1;
            this.engine.gotoScene(Location, "Table1");
        }
    }


    // load choice buttons for current location
    loadChoices() {
        if (this.engine.currLocation in this.engine.storyData.Locations) {
            let locationData = this.engine.storyData.Locations[this.engine.currLocation];
            if("Choices" in locationData) {
                for(let choice of locationData['Choices']) {
                    if ("Conditions" in choice) {
                        let flag = true;
                        for (let cond of choice['Conditions']) {
                            if (flag && cond.Condition in this.engine && this.engine[cond.Condition] != cond.ConditionValue) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            this.engine.addChoice(choice.Text, choice);
                        }
                    }
                    else {
                        this.engine.addChoice(choice.Text, choice);
                    }
                }
            } else {
            this.engine.addChoice("The end.")
            }
        } else {
            this.engine.addChoice("This should never exist.")
        } 
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');