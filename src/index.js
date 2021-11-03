import Phaser from 'phaser';

const diceStyle = { fontSize:30, backgroundColor:'white', color:'black', padding: 5 }

function calculateOnes (diceValues) {
    return getSameNumberPoints(diceValues, 1)
    }
function calculateTwos (diceValues) {
    return getSameNumberPoints(diceValues, 2)
    }
function calculateThrees (diceValues) {
    return getSameNumberPoints(diceValues, 3)
    }
function calculateFours (diceValues) {
    return getSameNumberPoints(diceValues, 4)
    }
function calculateFives (diceValues) {
    return getSameNumberPoints(diceValues, 5)
    }
function calculateSixes (diceValues) {
    return getSameNumberPoints(diceValues, 6)
    }
    
function calculateThreeKind (diceValues) { 
    const joined = diceValues.sort().join('')
    if ((joined.includes('111')) || (joined.includes('222')) || (joined.includes('333')) || (joined.includes('444')) || (joined.includes('555')) || (joined.includes('666'))) {
        return getAllPoints(diceValues)
    }
    else {
        return 0
    }
}


function calculateSmallStraight (diceValues) { 
    const sorted = diceValues.sort()
    const joined = sorted.join('')
    if ((joined.includes('1234')) || (joined.includes('2345')) || (joined.includes('3456'))) {
        return 30
    }
    else {
        return 0
    }
}

function calculateLargeStraight (diceValues) { 
    const sorted = diceValues.sort()
    const joined = sorted.join('')
    if ((joined.includes('12345')) || (joined.includes('23456'))) {
        return 40
    }
    else {
        return 0
    }
}

function yahtzee (diceValues) { 
    const sorted = diceValues.sort()
    const joined = sorted.join('')
    if ((joined.includes('11111')) || (joined.includes('22222')) || (joined.includes('33333')) || (joined.includes('44444')) || (joined.includes('55555')) || (joined.includes('66666'))) {
        return 50
    }
    else {
        return 0
    }
}

function chance (diceValues) { 
    return getAllPoints(diceValues)
}

function calculateFullHouse (diceValues) { 
    const sorted = diceValues.sort()
    const joined = sorted.join('')
    if (joined == '11222' || joined == '11333' || joined == '11444' || joined == '11555' || joined == '11666' || joined == '22333' || joined == '22444' || joined == '22555' || joined == '22666' || joined == '33444' || joined == '33555' || joined == '33666' || joined == '44555' || joined == '44666' || joined == '55666' || joined == '11122' || joined == '11133' || joined == '11144' || joined == '11155' || joined == '11155' || joined == '11166' || joined == '22233' || joined == '22244' || joined == '22255' || joined == '22266' || joined == '33344' || joined == '33355' || joined == '33366' || joined == '44455' || joined == '44466' || joined == '55566') {
        return 25
    }
    else {
        return 0
    }
}

function calculateFourKind (diceValues) { 
    const sorted = diceValues.sort()
    const joined = sorted.join('')
    if ((joined.includes('1111')) || (joined.includes('2222')) || (joined.includes('3333')) || (joined.includes('4444')) || (joined.includes('5555')) || (joined.includes('6666'))) {
        return getAllPoints(diceValues)
    }
    else {
        return 0
    }
}

function getSameNumberPoints (diceValues, numberTheyPicked) {
    let score = 0;
    diceValues.forEach((die) => {
      if (die === numberTheyPicked) {
        score += die
        }
    });
    return score
    }

function getAllPoints (diceValues) {
    return diceValues.reduce((a, b) => a + b, 0)
}


class MyGame extends Phaser.Scene {

    
    constructor () {
        super();
    }

    startAgain () {
        this.scene.restart();
    }
    
    preload () {
    }
      
    create () {

        this.maxRolls = this.add.text(250, 100, '')
        this.rollCounter = 0
        this.roundCounter = 1
        this.scoreViewer = this.add.text(200, 20, 0)
        

        const rollButton = this.add.text(40,20,'Roll Dice', { fontSize:20 })
        rollButton.setInteractive();
        rollButton.on('pointerup', (pointer) => {
            this.rollDice()
        })

        this.scorers = []
        this.scorers.push({
            label: 'Ones',
            used: false,
            calculator: calculateOnes,
            pos: 100,
        }, {
            label: 'Twos',
            used: false,
            calculator: calculateTwos,
            pos: 140,
        }, {
            label: 'Threes',
            used: false,
            calculator: calculateThrees,
            pos: 180,
        }, {
            label: 'Fours',
            used: false,
            calculator: calculateFours,
            pos: 220,
        }, {
            label: 'Fives',
            used: false,
            calculator: calculateFives,
            pos: 260,
        } , {
            label: 'Sixes',
            used: false,
            calculator: calculateSixes,
            pos: 300,            
        } , {
            label: 'Three of a Kind',
            used: false,
            calculator: calculateThreeKind,
            pos: 340,
        } , {
            label: 'Four of a Kind',
            used: false,
            calculator: calculateFourKind,
            pos: 380,              
        } , {
            label: 'Full House',
            used: false,
            calculator: calculateFullHouse,
            pos: 420,   
        } ,{
            label: 'Small Straight',
            used: false,
            calculator: calculateSmallStraight,
            pos: 460,            
        } , {
            label: 'Large Straight',
            used: false,
            calculator: calculateLargeStraight,
            pos: 500,
        } , {
            label: 'Yahtzee',
            used: false,
            calculator: yahtzee,
            pos: 540,
        } , {
            label: 'Chance',
            used: false,
            calculator: chance,
            pos: 580,
        }
        )

        this.globalPoints = 0

        this.scorers.forEach(item => {   
            const scored = this.add.text(40,(item.pos + 20), '')
            const rule = this.add.text(40,item.pos, item.label, { fontSize:20 })
            rule.setInteractive();
            rule.on('pointerup', (pointer) => {
                const points = item.calculator(this.getDiceValues())
                this.globalPoints = (this.globalPoints + points)
                rule.setText(item.label + ': ' + points)
                scored.setText(this.getDiceValues().toString())
                this.lockRoll()
                rule.removeInteractive()
            })
        })

        this.diceData = []

        this.diceTexts = []

        for (let i = 0; i < 5; i++) {
            const die = {
                value: Phaser.Math.Between(1, 6),
                locked: false
            }
            this.diceData.push(die) 

            const text = this.add.text(((i + 1)*40), 50, die.value, diceStyle)
            text.setInteractive();
            this.diceTexts.push(text)
            text.on('pointerup', (pointer) => {
                this.lockDie(i)
            }); 
        }
   }

   rollDie (i) {
       if (this.diceData[i].locked) {
           return
       }
       this.diceData[i].value = (Phaser.Math.Between(1, 6))
       this.renderDieByIdx(i)
    }


   rollDice () {
       if (this.rollCounter < 3) {
            this.diceData.forEach((die, idx) => this.rollDie(idx));
            this.rollCounter = (this.rollCounter + 1)
        }
        else {
            this.maxRolls.setText('Out of rerolls')
        }
    }

    unlockDice () {
        for (let i = 0; i < this.diceData.length; i++)
        this.diceData[i].locked = false
    }

    getDiceValues () {
        const values = this.diceData.map((rolled) => {
            return rolled.value
        })
        return values
    }

   lockRoll () {
    this.maxRolls.setText('')
    this.rollCounter = 0
    this.roundCounter = this.roundCounter + 1
    this.scoreViewer.setText('Points:' + this.globalPoints)
    this.unlockDice()
    this.rollDice()
    if (this.roundCounter == 14) {
        const gameOver = this.add.text(40,0, 'Game Over')
        const newGame = this.add.text(150,0, 'New Game?')
        newGame.setInteractive()
        newGame.on('pointerup', (pointer) => {
            this.startAgain()
        })
    }
    }


    renderDieByIdx (i) { 
        this.diceTexts[i].setText(this.diceData[i].value)
        if (this.diceData[i].locked == true ) {
            this.diceTexts[i].setColor('red');
        }
        else {
            this.diceTexts[i].setColor('black');
        }
    }

    lockDie (i) {
    this.diceData[i].locked = !this.diceData[i].locked
    this.renderDieByIdx(i)
}

    update () {   
        }
    }



const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 400,
    height: 650,
    scene: MyGame,
    input: true,
    autoCenter: true,
};

const game = new Phaser.Game(config);
