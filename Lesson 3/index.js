// Event listeners for if statement game
var ifStatements = [];

var addButton = document.getElementById("AddIfStatementButton");
var gameButton = document.getElementById("RevealIfStatementGameButton");
var gameForm = document.getElementById("IfStatementGameForm");
var revealButton = document.getElementById("RevealIfStatementButton");

addButton.addEventListener("click", function () {

    var ifStatementInput = document.getElementById("IfStatementInput");
    var ifStatementText = ifStatementInput.value;

    if (ifStatementText) {
        ifStatements.push(ifStatementText);

        gameButton.removeAttribute("disabled");
        ifStatementInput.value = "";
    }
});


gameButton.addEventListener("click", function () {

    document.getElementById("IfStatementGameContainer").classList.remove("hidden");
    gameButton.innerText = "Update If Statement";

    var currentIfStatement = ifStatements.shift();
    document.getElementById("IfGameText").innerText = currentIfStatement;

    if (ifStatements.length === 0) {
        gameButton.setAttribute("disabled", "");
    }
});

// Event listener for if statement example
revealButton.addEventListener("click", function () {

    document.getElementById("IfStatementContainer").classList.remove("hidden");
    revealButton.setAttribute("disabled", "");
});