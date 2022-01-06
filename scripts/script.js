const gameBoard = (function () {
	const board = document.querySelector("#board");
	const boardFields = Array.from(board.children);
	let boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	let winner = 0;

	function init() {
		boardFields.forEach((el) => {
			el.addEventListener("click", populateBoard);
		});
	}

	function render() {
		boardArray.forEach((el, i) => {
			let span = document.querySelector(`[data-key="${i}"]`).firstChild;
			if (el === "x") {
				span.classList.add("cross");
			} else if (el === "o") {
				span.classList.add("circle");
			} else {
				span.classList.remove("cross");
				span.classList.remove("circle");
			}
		});
	}

	function resetBoard() {
		boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		winner = 0;
		render();
	}

	function populateBoard(e) {
		const div = e.target;
		const index = parseInt(div.getAttribute("data-key"));

        // If there is something in the array at that index, stop
		if (boardArray[index] === "x" || boardArray[index] === "o") return;

		boardArray.splice(index, 1, gameController.getTurn());
		render();
		checkWinner();
		if (winner) return;
		gameController.changeTurn();
	}

	function checkWinner() {
		const winCondition = (gameController.getTurn() === "x") ? "xxx" : "ooo";
		const player = (gameController.getTurn() === "x") ? "player2" : "player1";
		const rows = [];
		const moves = boardArray.filter((el) => el != 0);

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
				diag1 += rows[j][j];
				diag2 += rows[2 - j][j];
			}
			if (
				row === winCondition ||
				column === winCondition ||
				diag1 === winCondition ||
				diag2 === winCondition
			) {
				winner = player;
				displayController.createOverlay();
				return;
			}
		}

		// If the length of the non 0 array is 9 that means all have been played, 
        // and if the win condition didn't trigger then it's a tie
		
		if (moves.length === 9) {
			winner = "tie";
			displayController.createOverlay();
		}

		return;
	}

	function getWinner(){
		return winner;
	}

	return {
		init,
		resetBoard,
		getWinner
	};
})();

const Player = function (name, sym) {
	let score = 0;

	function increaseScore() {
		score++;
	}

	function resetScore(){
		score = 0;
	}

	function getScore() {
		return score;
	}

	function getSym() {
		return sym;
	}

	return {
		name,
		sym,
		getScore,
		resetScore,
		getSym,
		increaseScore,
	};
};

const gameController = (function () {
	const resetBtn = document.querySelector("#reset-btn");

	const player1 = Player("Player 1", "o");
	const player2 = Player("Player 2", "x");

	let turn = "o";

	init();

	function addListeners() {
		resetBtn.addEventListener("click", reset);
	}

	function init() {
		addListeners();
		gameBoard.init();
	}

	function reset() {
		displayController.removeOverlay();
		gameBoard.resetBoard();
		player1.resetScore();
		player2.resetScore();
		displayController.updateScore();
		turn = "o";
	}

	function getTurn() {
		return turn;
	}

	function changeTurn() {
		turn = (turn === "x") ? "o" : "x";
	}

	function createPlayer(event, player) {
		const input = event.target.parentElement.previousElementSibling;
		// Stops from setting empty names
		if (input.value === "") return;

		let sym = player.sym
		let name = input.value ? input.value : name;
		input.value = "";
		// When a new name is set it's creating a new player so it treats it like a new game
		reset();
		player = Object.assign(player, Player(name, sym));
		displayController.setName(player);
	}

	function nextRound() {
		if (!(gameBoard.getWinner() === "tie")) {
			if (gameBoard.getWinner() === "player1") {
				player1.increaseScore();
			} else if (gameBoard.getWinner() === "player2") {
				player2.increaseScore();
			}
		}
		gameBoard.resetBoard();
		displayController.updateScore();
		turn = "o";
	}

	function getPlayers(){
		return [player1, player2];
	}

	return {
		nextRound,
		getTurn,
		changeTurn,
		getPlayers,
		createPlayer
	};
})();

const displayController = (function(){
	const overlay = document.querySelector(".overlay");

	addListeners();

	function removeOverlay() {
		overlay.style.display = "none";
	}

	function createOverlay() {
		overlay.style.display = "flex";
		if (gameBoard.getWinner() === "tie") {
			overlay.firstChild.textContent = "Tie!";
		} else {
			if (gameBoard.getWinner() === "player1") {
				overlay.firstChild.textContent = `${gameController.getPlayers()[0].name} wins!`;
			} else {
				overlay.firstChild.textContent = `${gameController.getPlayers()[1].name} wins!`;
			}
		}
	}

	function updateScore() {
		const player1Score = document.querySelector("#counter-player1");
		const player2Score = document.querySelector("#counter-player2");
		player1Score.textContent = gameController.getPlayers()[0].getScore();
		player2Score.textContent = gameController.getPlayers()[1].getScore();
	}

	function setName(player) {
		let className = (player.sym === "o") ? ".player1" : ".player2";
		const playerNameElement = document.querySelector(className).childNodes;
		playerNameElement.forEach(el => {
			if (el.nodeValue != null) {
				el.nodeValue = (el.nodeValue.trim() != "") ? player.name : el.nodeValue;
			}
		})
	}

	function addListeners(){
		overlay.addEventListener("click", function () {
			removeOverlay();
			gameController.nextRound();
		});
	}

	return {
		removeOverlay,
		createOverlay,
		updateScore,
		setName
	}
})();

const inputController = (function(){
	const inputPopupBtn = document.querySelectorAll(".fa-pencil-square-o");
	const inputSetBtn = document.querySelectorAll(".input-set");
	const inputCancelBtn = document.querySelectorAll(".input-cancel");

	addListeners();

	function addListeners(){
		inputPopupBtn.forEach(el => el.addEventListener("click", openPopup));
		inputCancelBtn.forEach(el => el.addEventListener("click", closePopup));
		inputSetBtn.forEach(el => el.addEventListener("click", changeName))
	}

	function openPopup(e){
		const player = e.target.parentElement.getAttribute("class").slice(0, 7);
		const inputElement = document.querySelector(`#${player}-input`);
		const inputText = inputElement.firstElementChild;
		inputText.value = "";
		inputElement.classList.toggle("displayOn");
	}

	function changeName(e){
		const playerIndex = parseInt(e.target.closest("h2 ~ div").getAttribute("id").slice(6, 7)) - 1;
		gameController.createPlayer(e, gameController.getPlayers()[playerIndex]);
		closePopup(e);
	}

	function closePopup(e){
		const inputElement = e.target.closest("h2 ~ div");
		inputElement.classList.remove("displayOn");
	}
})();