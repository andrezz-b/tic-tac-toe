const gameBoard = (function(){
    const board = document.querySelector("#board");
    const boardFields = Array.from(board.children);
    let boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0,];

    function init(){
        boardFields.forEach((el, i) => {
            el.setAttribute("data-key", i);
            el.addEventListener("click", populateBoard);
        })
    }

    function render(){
        boardArray.forEach((el, i) => {
            if (el === "x"){
                let span = document.querySelector(`[data-key="${i}"]`).firstChild;
                span.classList.add("cross");
            } else if (el === "o"){
                let span = document.querySelector(`[data-key="${i}"]`).firstChild;
                span.classList.add("circle");
            }
        })
    }

    function populateBoard(e){
        const div = e.target;
        const index = parseInt(div.getAttribute("data-key"));
        if (boardArray[index] === "x" || boardArray[index] === "o") return;
        boardArray.splice(index, 1, gameController.getTurn());
        render();
        checkWinCondition();
        checkTie();
        gameController.changeTurn();
    }

    function checkWinCondition(){
        const winCondition = (gameController.getTurn() === "x") ? "xxx" : "ooo";
        const rows = [];
        for (let i = 3; i <= boardArray.length; i += 3) {
            rows.push(boardArray.slice(i - 3, i));
        }

        for (let i = 0; i < 3; i++) {
            let row = "";
            let column = "";
            let diag1 = "";
            let diag2 = "";
            for (let j = 0; j < 3; j++) {
                 row += rows[i][j];
                 column += rows[j][i];
                 diag1 += rows[j][j]
                 diag2 += rows[2 - j][j]
            }
            switch (winCondition) {
                case row:
                    break;
                case column:
                    break;
                case diag1:
                    break;
                case diag2:
                    break;    
            }
        }
    }

    function checkTie(){
        const moves = boardArray.filter(el => el != 0);
        if (moves.length === 9){
            
        }
    }

    return {
        init,
        render
    }
})();

gameBoard.init();

const Player = function(name){
    let score = 0;

    function increaseScore(){
        score++;
    }

    function getScore(){
        return score;
    }

    function getSym(){
        return sym;
    }

    return {
        name,
        getScore,
        getSym,
        increaseScore,
    }
}

const gameController = (function(){
    const startBtn = document.querySelector("#start-btn");
    const resetBtn = document.querySelector("#reset-btn");
    const setPlayer1btn = document.querySelector("#player1-input button");
    const setPlayer2btn = document.querySelector("#player2-input button");
    const player1 = {name: "Player 1", sym: "o",};
    const player2 = {name: "Player 2", sym: "x",};

    let turn = "o";

    function addListeners(){
        // startBtn.addEventListener("click", start);
        // resetBtn.addEventListener("click", start);
        setPlayer1btn.addEventListener("click", function(e){
            createPlayer(e, player1);
        });
        setPlayer2btn.addEventListener("click", function(e){
            createPlayer(e, player2);
        });
    }

    function getTurn(){
        return turn;
    }
    function changeTurn(){
        turn = (turn === "x") ? "o" : "x";
    }

    function createPlayer(event, player){
        const input = event.target.previousElementSibling.firstElementChild;
        let name = input.value || player.name;
        player = Object.assign(player, Player(name));
        input.value = "";
        setName(player);
    }

    function setName(player){
        let className = (player.sym === "o") ? ".player1" : ".player2";
        const playerElements = document.querySelectorAll(className);
        playerElements.forEach(el => {
            el.textContent = player.name;
        })
    }

    function updateScore(){
        const player1Score = document.querySelector("#counter-player1");
        const player2Score = document.querySelector("#counter-player2");
        player1Score.textContent = player1.getScore();
        player2Score.textContent = player2.getScore();
    }

    return {
        addListeners,
        getTurn,
        changeTurn,
        player1,
        player2,
    }
})();

gameController.addListeners();

const john = Player("John", "x");