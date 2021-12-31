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
        boardArray.splice(index, 1, "o");
        render();
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
        player1,
        player2,
    }
})();

gameController.addListeners();

const john = Player("John", "x");