//Global variables/constants
const board = document.querySelector('.gameboard')
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');
const message = document.querySelector('.message');
const inputs = document.querySelector('.inputs');
const playersdisplay = document.querySelector('.playersdisplay')
//global event listeners
startBtn.addEventListener('click',()=>{
    Game.start();
});

restartBtn.addEventListener('click',()=>{
    Game.restart();
})

//store gameboard as an array inside of a Gameboard Object
const Gameboard =(() =>{
    let gameBoard = ['','','','','','','','',''];
    
    //create gameboard (DOM)
    const createGameBoard = () => {
        
        //create DOM  table
        const table = document.createElement('table')
        for (let row=0;row<3;row++){
            //create table rows
            const tr = document.createElement('tr');
            //create table cols
            for (let col = 0;col<3;col++){
                const td = document.createElement('td');
                td.classList.add('cell')
                td.id = row * 3 + col;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        board.appendChild(table);
        //add event listeners to all cells
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.addEventListener('click',Game.updateBoard);
        })
    } 
    const updateGameBoard = (index,symbol) =>{
        gameBoard[index]=symbol;//updates gameboard array
        document.getElementById(index).textContent=symbol;
    }
    //accessor method to get game board indirectly
    const getGameboard = () => gameBoard;
    //Gameboard exports
    return {
        createGameBoard,
        updateGameBoard,
        getGameboard,
    }
})();

//players factory function
const createPlayer = (name,symbol) =>{
    return {
        name,
        symbol,
    }
}
//object to control game flow
const Game =(()=>{
    let players = [];//players array
    let currPlayer,gameOver;
  
    //create playerobjects - use factory func
    const start=()=>{
        players = [
            createPlayer(document.querySelector('#player1').value,"❌"),
            createPlayer(document.querySelector('#player2').value,"⭕")
        ]
        currPlayer=0;
        gameOver=false;
        Gameboard.createGameBoard();
        //remove player inputs and start button
        startBtn.remove();
        inputs.remove();
        //display players
        if (players[0].name && players[1].name){
            playersdisplay.textContent = `${players[0].name} vs ${players[1].name}`
        } else {
            playersdisplay.textContent = `${players[0].symbol} vs ${players[1].symbol}`
        }
        

    }

    const updateBoard = (event) =>{
        if (gameOver){ //dont updateBoard
            return
        }
        index = event.target.id 
        if (Gameboard.getGameboard()[index] !== ''){
            console.log("Sorry cant make this move")
            return;
        }
        //change GameBoard 
        Gameboard.updateGameBoard(index,players[currPlayer].symbol)
        //check if any player has won
        if (isWinningMove(Gameboard.getGameboard(),players[currPlayer].symbol)){
            gameOver=true
           const displayName = players[currPlayer].name ? players[currPlayer].name : players[currPlayer].symbol;
           message.textContent = displayName + ' won 🏆!'; 
        }else if (isDraw(Gameboard.getGameboard())){
            gameOver = true;
            message.textContent='It\'s a draw 🧠!'
        }
        currPlayer = currPlayer == 0 ? 1 : 0; //update current player
    }

    function isDraw(board) {
        //check if all cells are filled
        return board.every(cell => cell !=='');
    }
    function isWinningMove(board){
        const winCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ]
        for (let i=0 ;i<winCombinations.length;i++){
            const [a,b,c] = winCombinations[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]){
                return true; //win
            }
        }
        return false;
    }
    const restart = () => {
        for (let _=0;_<9;_++){
            Gameboard.updateGameBoard(_,"");
        }
        gameOver=false; //reset flag
        message.textContent='';
    }
    //Game exports
    return {
        start,
        updateBoard,
        restart,
    }
})();
