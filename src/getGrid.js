const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const isValid = (grid, row, col, num) => {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num) {
            return false;
        }
    }

    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }

    return true;
};

const fillGrid = (grid,N) => {
    const numbers = [];

    for(let i=1;i<=N;i++){
        numbers.push(i);
    }

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (grid[i][j] === 0) {
                shuffleArray(numbers);
                for (let num of numbers) {
                    if (isValid(grid, i, j, num)) {
                        grid[i][j] = num;
                        if (fillGrid(grid,N)) {
                            return true;
                        }
                        grid[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

export const getGrid = (N,difficulty) => {
    const grid = Array.from({ length: N }, () => Array(N).fill(0));
    const solvedGrid = Array.from(grid, rowArray => Array.from(rowArray));
    fillGrid(solvedGrid,N);
    const unsolvedGrid = Array.from(solvedGrid, rowArray => Array.from(rowArray));

    let empty =  0;
    let maxEmpty = 0;
    switch(difficulty){
        case "easy" : maxEmpty = 30; break;
        case "medium" : maxEmpty = 38; break;
        case "hard" : maxEmpty = 45; break;
        case "hardest" : maxEmpty = 55; break;
        default: maxEmpty = null; break;
    }
    while(empty !== maxEmpty){
        let row = Math.floor(Math.random()*9);
        let col = Math.floor(Math.random()*9);

        if(unsolvedGrid[row][col] === ' ')
            continue

        unsolvedGrid[row][col] = ' ';
        empty++;
    }

    return {solvedGrid , unsolvedGrid};
};
