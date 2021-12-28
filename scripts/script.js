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
gameBoard.render();