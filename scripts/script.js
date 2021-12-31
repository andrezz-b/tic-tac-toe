const gameBoard = (function () {
	const board = document.querySelector("#board");
	const boardFields = Array.from(board.children);
	let boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	function init() {
		boardFields.forEach((el, i) => {
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
		render();
	}

	function populateBoard(e) {
		const div = e.target;
		const index = parseInt(div.getAttribute("data-key"));

        // If there is something in the array at that index, stop
		if (boardArray[index] === "x" || boardArray[index] === "o") return;

		boardArray.splice(index, 1, gameController.getTurn());
		render();
		if (checkWinCondition() || checkTie()) return;
		gameController.changeTurn();
	}

	function checkWinCondition() {
		const winCondition = gameController.getTurn() === "x" ? "xxx" : "ooo";
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
				diag1 += rows[j][j];
				diag2 += rows[2 - j][j];
			}
			if (
				row === winCondition ||
				column === winCondition ||
				diag1 === winCondition ||
				diag2 === winCondition
			) {
				gameController.createOverlay();
				return 1;
			}
		}
		return 0;
	}

	function checkTie() {
        // If the length of the non 0 array is 9 that means all have been played, 
        // and if the win condition didn't trigger then the it's a tie
		const moves = boardArray.filter((el) => el != 0);
		if (moves.length === 9) {
			gameController.createOverlay(true);
			return 1;
		}
		return 0;
	}

	return {
		init,
		resetBoard,
	};
})();

const Player = function (name) {
	let score = 0;

	function increaseScore() {
		score++;
	}

	function getScore() {
		return score;
	}

	function getSym() {
		return sym;
	}

	return {
		name,
		getScore,
		getSym,
		increaseScore,
	};
};

const gameController = (function () {
	const resetBtn = document.querySelector("#reset-btn");
	const setPlayer1btn = document.querySelector("#player1-input button");
	const setPlayer2btn = document.querySelector("#player2-input button");
	const overlay = document.querySelector(".overlay");
	const player1 = { name: "Player 1", sym: "o" };
	const player2 = { name: "Player 2", sym: "x" };

	let turn = "o";

	init();

	function addListeners() {
		resetBtn.addEventListener("click", reset);
		overlay.addEventListener("click", function () {
			removeOverlay();
			nextRound(overlay.getAttribute("data-tie"));
		});
		setPlayer1btn.addEventListener("click", function (e) {
			reset();
			createPlayer(e, player1);
		});
		setPlayer2btn.addEventListener("click", function (e) {
			reset();
			createPlayer(e, player2);
		});
	}

	function init() {
		createPlayer(undefined, player1);
		createPlayer(undefined, player2);
		gameBoard.init();
	}

	function reset() {
		removeOverlay();
		gameBoard.resetBoard();
		createPlayer(undefined, player1);
		createPlayer(undefined, player2);
		updateScore();
		turn = "o";
	}

	function createOverlay(tie) {
		overlay.style.display = "flex";
		if (tie) {
			overlay.firstChild.textContent = "Tie!";
            // Adds the data attribute for checking the tie later without the 
            // need to pass it as an argument
			overlay.setAttribute("data-tie", 1);
		} else {
			if (getTurn() === "o") {
				overlay.firstChild.textContent = `${player1.name} wins!`;
			} else {
				overlay.firstChild.textContent = `${player2.name} wins!`;
			}
		}
	}

	function removeOverlay() {
		overlay.style.display = "none";
	}

	function getTurn() {
		return turn;
	}
	function changeTurn() {
		turn = turn === "x" ? "o" : "x";
	}

	function createPlayer(event, player) {
		let name = player.name;
		if (event != undefined) {
			const input = event.target.previousElementSibling.firstElementChild;
			name = input.value;
			input.value = "";
		}
		player = Object.assign(player, Player(name));
		setName(player);
	}

	function setName(player) {
		let className = player.sym === "o" ? ".player1" : ".player2";
		const playerElements = document.querySelectorAll(className);
		playerElements.forEach((el) => {
			el.textContent = player.name;
		});
	}

	function nextRound(tie) {
		gameBoard.resetBoard();
		if (!tie) {
			if (getTurn() === "o") {
				player1.increaseScore();
			} else {
				player2.increaseScore();
			}
		}
		updateScore();
		turn = "o";
	}

	function updateScore() {
		const player1Score = document.querySelector("#counter-player1");
		const player2Score = document.querySelector("#counter-player2");
		player1Score.textContent = player1.getScore();
		player2Score.textContent = player2.getScore();
	}

	return {
		addListeners,
		createOverlay,
		nextRound,
		getTurn,
		changeTurn,
	};
})();

gameController.addListeners();
