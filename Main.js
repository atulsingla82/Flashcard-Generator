var Basic = require("./Basic");
var Cloze = require("./Cloze");
var inquirer = require("inquirer");
var fs = require("fs");
var correct = 0;
var wrong = 0;
var cardArray = [];


// ********************************* Main Process *************************************

const flashcards = function() {

        inquirer.prompt([{

                type: 'list',
                name: 'userType',
                message: 'What would you like to do?',
                choices: ['create-basic-cards', 'create-cloze-cards', 'basic-quiz', 'cloze-quiz', 'quit']
            }

        ]).then(function(choice) {

            if (choice.userType === 'create-basic-cards') {
                readCards('log.txt');
                createCards(basicPrompt, 'log.txt');
            } else if (choice.userType === 'create-cloze-cards') {
                readCards('cloze-log.txt');
                createCards(clozePrompt, 'cloze-log.txt');
            } else if (choice.userType === 'basic-quiz') {
                quiz('log.txt', 0);
            } else if (choice.userType === 'cloze-quiz') {
                quiz('cloze-log.txt', 0);
            } else if (choice.userType === 'quit') {
                console.log('Thanks for playing!');
            }
        });
    }
    //***************************************** Functions *********************************

const readCards = function(logfile) {
    cardArray = [];
    //This grabs any previously created cards and saves them to a new array...
    fs.readFile(logFile, "utf8", function(error, data) {

        var jsonContent = JSON.parse(data);

        for (let i = 0; i < jsonContent.length; i++) {
            cardArray.push(jsonContent[i]);
        }
    });
};
const createCards = function (promptType, logfile) {

    inquirer.prompt(promptType).then(function(answers) {

        cardArray.push(answers);

        if (answers.makeMore) {

            createCards(promptType, logFile);
        } else {

            writeToLog(logFile, JSON.stringify(cardArray));
            flashcards();
        }
    });
};

const quiz = function (logFile, x) {

    fs.readFile(logFile, "utf8", function(error, data) {

        var jsonContent = JSON.parse(data);

        if (x < jsonContent.length) {

            if (jsonContent[x].hasOwnProperty("front")) {

                var gameCard = new SimpleCard(jsonContent[x].front, jsonContent[x].back);
                var gameQuestion = gameCard.front;
                var gameAnswer = gameCard.back.toLowerCase();
            } else {
                var gameCard = new Cloze(jsonContent[x].text, jsonContent[x].cloze);
                var gameQuestion = gameCard.message;
                var gameAnswer = gameCard.cloze.toLowerCase();
            }

            inquirer.prompt([{
                name: "question",
                message: gameQuestion,
                validate: function(value) {

                    if (value.length > 0) {
                        return true;
                    }

                    return 'Come on !! , take wild a guess!';
                    console.log("")
                    console.log("=========================")
                    console.log("")
                    
                }

            }]).then(function(answers) {

                if (answers.question.toLowerCase().indexOf(gameAnswer) > -1) {
                    console.log('Correct!');
                    correct++;
                    x++;
                    quiz(logFile, x);
                } else {
                    gameCard.printAnswer();
                    wrong++;
                    x++;
                    quiz(logFile, x);
                }

            })

        } else {
            console.log("")
            console.log("--------------------------------------")
            console.log('Here\'s how you did: ');
            console.log('correct: ' + correct);
            console.log('wrong: ' + wrong);
            console.log("")
            console.log("--------------------------------------")
            correct = 0;
            wrong = 0;
            flashcards();
           
        }
    });
};

const writeToLog = function (logFile,info) {

    fs.writeFile(logFile, info, function(err) {
        if (err)
            console.error(err);
    });
}

const basicPrompt = [{
    name: "front",
    message: "Enter Front of Card: "
}, {
    name: "back",
    message: "Enter Back of Card: "

}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card (hit enter for YES)?',
    default: true
}]

const clozePrompt = [{
    name: "text",
    message: "Enter a sentence, with the word you want to hide in parentheses, example: 'I (cannot) tell a lie'",
    validate: function(value) {
        var parentheses = "";
        if (value.search(parentheses) > -1) {
            return true;
        }
        return 'Please put a word in your sentence in parentheses'
    }
}, {
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card (hit enter for YES)?',
    default: true
}]

const makeMore = {
    //Prompt to find out if user wants to make more cards (default is yes)
    type: 'confirm',
    name: 'makeMore',
    message: 'Create another card (hit enter for YES)?',
    default: true
}

flashcards();
