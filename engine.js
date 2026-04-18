class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output1 = document.body.appendChild(document.createElement("div"));
        this.output1.id = "contents1";
        this.output2 = document.body.appendChild(document.createElement("div"));
        this.output2.id = "contents2";
        this.output2.hidden = true;
        this.output = this.output1;
        this.actionsContainer = document.body.appendChild(document.createElement("div"));
        this.actionsContainer.id = "buttons";
        this.time = 0;
        this.form = 0; // 0 for mortal form, 8 for spirit form
        this.sleepState = -1; // -1 for game start, 0 for awake, 1 for post prayer
        this.gameState = 0; // 0 = game start, 
                            // 1 = prayed at altar,
                            // 2 = idol recipe known,
                            // 3 = idol carved,
                            // 4 = key recipe known,
                            // 5 = key forged,
                            // 6 = game won
        this.mortalDoorUnlocked = 0;
        this.spiritDoorUnlocked = 0;
        this.knife = "Table1"; // name of item's location; "inventory" for held by player
        this.idol = ""; // name of item's location; "" for nonexistent, "inventory" for held by player
        this.roomKey = ""; // name of item's location; "" for nonexistent, "inventory" for held by player

        this.currLocation = ""; // store name of current location

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        this.scene.create(data);
    }

    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            if (data && data.Call) {
                this.scene[data.Call](data);
            }
            else {
                this.scene.handleChoice(data);
            }
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }
    
    showEmphasized(msg) {
        let div = document.createElement("div");
        div.innerHTML = "<i><b>" + msg + "</b></i>"
        this.output.appendChild(div);
    }

    updateTime() {
        this.time++;
        if (this.time > 7) {
            this.time = 0;
        }
    }

    getTime() {
        let times = ["It's midnight.", // mortal world times
                    "The moon is setting.",
                    "It's sunrise.",
                    "The sun has risen.",
                    "It's noon.",
                    "It's after noon.",
                    "It's sunset.",
                    "The moon is rising.",

                    "It's noon.", // spirit world times
                    "It's sunset.",
                    "The moon is rising.",
                    "The moon has risen.",
                    "It's midnight.",
                    "It's after midnight.",
                    "The moon is setting.",
                    "It's sunrise."];
        return times[this.time + this.form];
    }

    getAltarState() {
        let states = ["The altar is practically brimming with power. If you're ever to truly make a connection with something beyond the veil, it's probably going to be now.",
                      "The altar feels like it's exhaling. Letting out a long, steady breath of pure, divine energy.",
                      "The altar feels like it's exhaling. Letting out a long, steady breath of pure, divine energy.",
                      "The altar feels like it's exhaling. Letting out a long, steady breath of pure, divine energy.",
                      "The altar feels utterly dull. Devoid of life, devoid of power, devoid of connection.",
                      "The altar feels ilke it's inhaling. Slowly, steadily gathering flecks and droplets of energy into itself.",
                      "The altar feels ilke it's inhaling. Slowly, steadily gathering flecks and droplets of energy into itself.",
                      "The altar feels ilke it's inhaling. Slowly, steadily gathering flecks and droplets of energy into itself."
        ]
        return states[this.time];
    }

    clearBody() {
        let con1 = document.getElementById("contents1");
        let con2 = document.getElementById("contents2");
        if (con1.hidden) {
            con1.hidden = false;
            con2.hidden = true;
            this.output = this.output1;
        }
        else {
            con2.hidden = false;
            con1.hidden = true;
            this.output = this.output2;
        }
        return ("cleared body");
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}