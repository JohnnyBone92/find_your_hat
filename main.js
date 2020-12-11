const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const initialGrid = field => {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] == pathCharacter) {
                return [i, j];
            }
        }
    }
}

const hatGrid= field => {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (field[i][j] == hat) {
                return [i, j];
            }
        }
    }
}

class Field {
    constructor(field) {
        this.field = field;
        this.actualGrid = initialGrid(field);
        this.hatGrid = hatGrid(field);
    }

    print() {
        this.field.forEach(element => {
            console.log(element.join(''));
        })
    }

    nextGrid(direction) {
        switch (direction) {
            case 'u':
                return [this.actualGrid[0]-1, this.actualGrid[1]];
            case 'd':
                return [this.actualGrid[0]+1, this.actualGrid[1]];
            case 'l':
                return [this.actualGrid[0], this.actualGrid[1]-1];
            case 'r':
                return [this.actualGrid[0], this.actualGrid[1]+1];
            default: 
                console.log('Invalid command!');
                return this.actualGrid;
        }
    }

    check(direction) {
        this.actualGrid = this.nextGrid(direction);
        if (this.actualGrid[0] == this.hatGrid[0] && this.actualGrid[1] == this.hatGrid[1]) {
            console.log('Congratulation! You found the hat.');
        } else if (this.actualGrid[0]>=this.field.length || this.actualGrid[0]<0 || this.actualGrid[1]>=this.field[0].length || this.actualGrid[1]<0) {
            console.log('You fell off and died!');
        } else if (this.field[this.actualGrid[0]][this.actualGrid[1]] == hole) {
            console.log('You fell in a hole and died!');
        }
        else {
            this.field[this.actualGrid[0]][this.actualGrid[1]] = pathCharacter;
            this.print();
            console.log('Sorry! You didn\'t found the hat. But don\'t give up!');
            this.askForDirection();
        }
    }

    askForDirection() {
        const direction = prompt('Where do you want to move to? ');
        this.check(direction);
    }

    static generateField(rows, columns, holesPercantage) {
        let field = [];
        for (let i=0; i<rows; i++) {
            field.push([]);
            for (let j=0; j<columns; j++) {
                let randNumber = Math.floor(Math.random()*101);
                if (randNumber < holesPercantage) field[i].push(hole);
                else field[i].push(fieldCharacter);
            }
        }
        field[Math.floor(Math.random()*rows)][Math.floor(Math.random()*columns)] = hat;
        field[Math.floor(Math.random()*rows)][Math.floor(Math.random()*columns)] = pathCharacter;
        return field;
    }

    static right(field, actualGrid) {
        if (actualGrid[1]+1 != field[0].length) {
            let gridType = field[actualGrid[0]][actualGrid[1]+1];
            if (gridType == hat) return 'found';
            if (gridType == fieldCharacter) return 'path'
        }
    }

    static left(field, actualGrid) {
        let gridType = field[actualGrid[0]][actualGrid[1]-1];
        if (gridType == hat) return 'found';
        if (gridType == fieldCharacter) return 'path'
    }

    static up(field, actualGrid) {
        if (actualGrid[0] != 0) {
            let gridType = field[actualGrid[0]-1][actualGrid[1]];
            if (gridType == hat) return 'found';
            if (gridType == fieldCharacter) return 'path'
        }
    }

    static down(field, actualGrid) {
        if (actualGrid[0]+1 != field.length) {
            let gridType = field[actualGrid[0]+1][actualGrid[1]];
            if (gridType == hat) return 'found';
            if (gridType == fieldCharacter) return 'path'
        }
    }

    static pathFinder(inField) {
        let field = [];
        inField.forEach(row => {field.push([...row])})
        let actualGrid = initialGrid(field);

        const neighbors = grid => {
            let hatFound = false;
            let dirs = {
                right: Field.right(field, grid),
                left: Field.left(field, grid),
                up: Field.up(field, grid),
                down: Field.down(field, grid)
            }
            if (dirs.right == 'found') {
                hatFound = true;
            } else if (dirs.right == 'path') {
                field[grid[0]][grid[1]+1] = pathCharacter;
                if (neighbors([grid[0], grid[1]+1])) hatFound = true;
            }
            if (dirs.up == 'found') {
                hatFound = true;
            } else if (dirs.up == 'path') {
                field[grid[0]-1][grid[1]] = pathCharacter;
                if (neighbors([grid[0]-1, grid[1]])) hatFound = true;
            }
            if (dirs.left == 'found') {
                hatFound = true;
            } else if (dirs.left == 'path') {
                field[grid[0]][grid[1]-1] = pathCharacter;
                if (neighbors([grid[0], grid[1]-1])) hatFound = true;
            }
            if (dirs.down == 'found') {
                hatFound = true;
            } else if (dirs.down == 'path') {
                field[grid[0]+1][grid[1]] = pathCharacter;
                if (neighbors([grid[0]+1, grid[1]])) hatFound = true;
            }

            if (!hatFound) {
                field[grid[0]][grid[1]] = 'X';
            }

            return hatFound;
        }
        console.log(neighbors(actualGrid));
        field[actualGrid[0]][actualGrid[1]] = 'S';
        field.forEach(element => {
            console.log(element.join(''));
        })
    }
}

const myField = new Field([
    ['*', '░', '░'],

    ['░', 'O', '░'],

    ['░', '^', '░'],
]);


let generatedField = Field.generateField(10, 20, 40);
const randField = new Field(generatedField);
console.log('The generated field: ');
randField.print();
console.log(' ');

generatedField = myField.field;
console.log('The checked field: ');
Field.pathFinder(generatedField);
console.log(' ');
// while (!Field.pathFinder(generatedField)) {
//     generatedField = Field.generateField(3, 3, 20);
//     randField.field = generatedField;
// }

//myField.print();
// console.log('The playing field: ');
// randField.print();
// const direction = prompt('Where do you want to move to? ');
// //myField.check(direction);
// randField.check(direction);


