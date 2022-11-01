class Wizard {
    constructor(id, x, y, vx, vy, state, name) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.state = state;
        this.name = name;
    }
}

class Snaffle {
    constructor(id, x, y, vx, vy) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.target = false;
    }
}

class Bludger {
    constructor(id, x, y, vx, vy) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
}

class Map {
    constructor(myMagic, opponentMagic, myScore, opponentScore) {
        this.myMagic = myMagic;
        this.opponentMagic = opponentMagic;
        this.myScore = myScore;
        this.opponentScore = opponentScore;
    }

    setEntities(wizards, opponents, snaffles, bludgers) {
        this.wizards = wizards;
        this.opponents = opponents;
        this.snaffles = snaffles;
        this.bludgers = bludgers;
    }
}

class MovementController {
    calculateMove(wizard) {
        this.wizard = wizard;

        let closestSnaffle = this.findClosestSnaffle();

        closestSnaffle.target = true;

        print("MOVE", closestSnaffle.x, closestSnaffle.y, 150, wizard.name);
    }

    findClosestSnaffle() {
        if (this.wizard.name === "offensive") {
            if (myGoal === "RIGHT") {
                return this.findClosestSnaffleLeft();
            } else if (myGoal === "LEFT") {
                return this.findClosestSnaffleRight()
            }
        } else if (this.wizard.name === "defensive") {
            if (myGoal === "LEFT") {
                return this.findClosestSnaffleLeft();
            } else if (myGoal === "RIGHT") {
                return this.findClosestSnaffleRight()
            }
        }
    }

    findClosestSnaffleLeft() {
        let closestSnaffleDistance = 999999;
        let closestSnaffle = null;

        map.snaffles.forEach(snaffle => {
            if (!snaffle.target || map.snaffles.length == 1) {
                if (snaffle.x <= this.wizard.x) {
                    let xDist = this.wizard.x - snaffle.x;
                    let yDist = this.wizard.y - snaffle.y;

                    if (yDist < 0) {
                        yDist = yDist * -1;
                    }

                    let dist = Math.floor(Math.hypot(xDist, yDist));

                    if (dist < closestSnaffleDistance) {
                        closestSnaffleDistance = dist;
                        closestSnaffle = snaffle;
                    }
                }
            }
        });

        closestSnaffle = closestSnaffle || this.findClosestSnaffleRight();
        return closestSnaffle;
    }

    findClosestSnaffleRight() {
        let closestSnaffleDistance = 999999;
        let closestSnaffle = null;

        map.snaffles.forEach(snaffle => {
            if (!snaffle.target || map.snaffles.length == 1) {
                if (snaffle.x >= this.wizard.x) {
                    let xDist = snaffle.x - this.wizard.x;
                    let yDist = this.wizard.y - snaffle.y;

                    if (yDist < 0) {
                        yDist = yDist * -1;
                    }

                    let dist = Math.floor(Math.hypot(xDist, yDist));

                    if (dist < closestSnaffleDistance) {
                        closestSnaffleDistance = dist;
                        closestSnaffle = snaffle;
                    }
                }
            }
        });

        closestSnaffle = closestSnaffle || this.findClosestSnaffleLeft();
        return closestSnaffle;
    }


    // MOVE x y thrust : the keyword MOVE followed by 3 integers: x y for the destination and the desired thrust power [0;150].
    // THROW x y power : the keyword THROW followed by 3 integers: x y for the destination and the desired power [0;500].
    // OBLIVIATE id : the keyword OBLIVIATE followed by one integer id, the entity id of a bludger.
    // PETRIFICUS id : the keyword PETRIFICUS followed by one integer id, the entity id of the target [Bludger, Snaffle, opponent wizard].
    // ACCIO id : the keyword ACCIO followed by one integer id, the entity id of the target [Bludger, Snaffle].
    // FLIPENDO id : the keyword FLIPENDO followed by one integer id, the entity id of the target [Bludger, Snaffle, opponent wizard].
}

class ThrowController {
    calculateThrow(wizard) {
        this.wizard = wizard;
        
        let danger = false;
        let throwY = 4000;

        map.opponents.forEach(oWizard => {
            if(oWizard.y < wizard.y + 200 && oWizard.y > wizard.y - 200){
                danger = true;
            }
        });
        
        if(danger){
            throwY = 0;
        }

        if (myGoal === "LEFT") {
            print("THROW", 16000, 4000, 500, wizard.name);
        } else {
            print("THROW", 0, 4000, 500, wizard.name);
        }
    }
}

class ShootController {
    hasClearShot(wizard) {
        let maxDistanceToShoot = 1500;

        map.snaffles.forEach(snaffle => {
            let wizX = wizard.x;
            let wizY = wizard.y;
            let snaX = snaffle.x;
            let snaY = snaffle.y;

            if (myGoal === "LEFT") {
                if (snaX > wizX + 10 && snaX < wizX + maxDistanceToShoot) {
                    let wizDistToGoal = 16000 - wizX;
                    let wizDistToSnaf = snaX - wizX;

                    let travelMultiplier = wizDistToGoal / wizDistToSnaf;

                    let yResult = snaY + ((snaY - wizY) * travelMultiplier);

                    if (yResult < 5000 && yResult > 2500) {
                        this.target = snaffle;
                    }
                }
            } else {
                if (snaX < wizX - 10 && snaX > wizX - maxDistanceToShoot) {
                    let wizDistToGoal = wizX;
                    let wizDistToSnaf = wizX - snaX;

                    let travelMultiplier = wizDistToGoal / wizDistToSnaf;

                    let yResult = snaY + ((snaY - wizY) * travelMultiplier);

                    if (yResult < 5000 && yResult > 2500) {
                        this.target = snaffle;
                    }
                }
            }
        });

        return this.target;
    }

    shoot(wizard) {
        print("FLIPENDO", this.target.id, wizard.name);
    }
}

class StopController {
    shouldStop(wizard) {
        map.snaffles.forEach(snaffle => {
            printErr(snaffle.vx);
            if(myGoal == 'LEFT' && snaffle.vx < -800 && snaffle.x > 1000 && snaffle.x < 5000){
                this.target = snaffle;
            } else if (myGoal == 'RIGHT' && snaffle.vx > 800 && snaffle.x < 15000 && snaffle.x > 11000){
                this.target = snaffle;
            }
        });

        if(wizard.name == "defensive")
            return this.target;
        else
            return false;
    }

    stop(wizard) {
        print("PETRIFICUS", this.target.id, wizard.name);
    }
}

class PullController {

    shouldPull(wizard){
        // printErr("trying to pull");
        if(myGoal == "LEFT"){
            let snaffleDist = 99999;
            map.snaffles.forEach(snaffle => {
                if(snaffle.x < snaffleDist){
                    this.target = snaffle;
                    snaffleDist = snaffle.x;
                }
            })
        } else {
            let snaffleDist = 0;
            map.snaffles.forEach(snaffle => {
                if(snaffle.x > snaffleDist){
                    this.target = snaffle;
                    snaffleDist = snaffle.x;
                }
            })
        }
        if(wizard.name == "offensive") {
            return this.target;
        } else {
            return false;
        }
    }

    pull(wizard){
        print("ACCIO", this.target.id, wizard.name);
    }
}

class WizardController {
    act(wizard) {

        this.movementController = new MovementController();
        this.throwController = new ThrowController();
        this.shootController = new ShootController();
        this.stopController = new StopController();
        this.pullController = new PullController();

        // printErr(map.myMagic >= 30, (map.myMagic >= 20 && map.snaffles.length == 1));
        if (wizard.state == 1) {
            this.throwController.calculateThrow(wizard);
        } else if (map.myMagic >= 20 && this.shootController.hasClearShot(wizard)) {
            this.shootController.shoot(wizard);
        } else if (map.myMagic > 10 && this.stopController.shouldStop(wizard)) {
            this.stopController.stop(wizard);
        } else if ((map.myMagic >= 30 || (map.myMagic >= 20 && map.snaffles.length == 1)) && this.pullController.shouldPull(wizard)){
            this.pullController.pull(wizard);
        } else {
            this.movementController.calculateMove(wizard)
        }
    }
}


// gameloop, creates a map and sets the properties. No logic is supposed to be here.
let map;
const myTeamId = parseInt(readline()); // if 0 you need to score on the right of the map, if 1 you need to score on the left
const myGoal = myTeamId === 0 ? "LEFT" : "RIGHT";
while (true) {
    let inputs = readline().split(' ');
    const myScore = parseInt(inputs[0]);
    const myMagic = parseInt(inputs[1]);
    inputs = readline().split(' ');
    const opponentScore = parseInt(inputs[0]);
    const opponentMagic = parseInt(inputs[1]);
    const entities = parseInt(readline()); // number of entities still in game

    let wizards = [];
    let opponents = [];
    let snaffles = [];
    let bludgers = [];

    for (let i = 0; i < entities; i++) {
        inputs = readline().split(' ');
        const entityId = parseInt(inputs[0]); // entity identifier
        const entityType = inputs[1]; // "WIZARD", "OPPONENT_WIZARD" or "SNAFFLE" (or "BLUDGER" after first league)
        const x = parseInt(inputs[2]); // position
        const y = parseInt(inputs[3]); // position
        const vx = parseInt(inputs[4]); // velocity
        const vy = parseInt(inputs[5]); // velocity
        const state = parseInt(inputs[6]); // 1 if the wizard is holding a Snaffle, 0 otherwise

        if (entityType === "WIZARD") {
            wizards.push(new Wizard(entityId, x, y, vx, vy, state, wizards.length === 0 ? "defensive" : "offensive"));
        } else if (entityType === "OPPONENT_WIZARD") {
            opponents.push(new Wizard(entityId, x, y, vx, vy));
        } else if (entityType === "SNAFFLE") {
            snaffles.push(new Snaffle(entityId, x, y, vx, vy));
        } else if (entityType === "BLUDGER") {
            bludgers.push(new Bludger(entityId, x, y, vx, vy));
        }
    }
    map = new Map(myMagic, opponentMagic, myScore, opponentScore);
    map.setEntities(wizards, opponents, snaffles, bludgers);

    let wc = new WizardController();
    map.wizards.forEach(wizard => {
        wc.act(wizard);
    });
}