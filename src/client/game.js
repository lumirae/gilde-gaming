// TODO: Nog aanpassen 

// //     let currentPosition = 0; // Initial position

// // function movePicture(direction) {
// //     const picture = document.getElementById("picture");
    
// //     if (direction === "up") {
// //         currentPosition -= 20; // Adjust the amount you want to move up
// //     } else if (direction === "down") {
// //         currentPosition += 20; // Adjust the amount you want to move down
// //     }

// //     // Ensure the picture doesn't go out of bounds
// //     currentPosition = Math.max(currentPosition, 0);
// //     currentPosition = Math.min(currentPosition, 280); // Adjust this value as needed

// //     picture.style.top = currentPosition + "px";
// // }

// // function checkAnswer() {
// //     const answerField = document.getElementById("sumfield");
// //     const answer = parseInt(answerField.value);

// //     if (!isNaN(answer)) {
// //         if (answer === currentQuestion.answer) {
// //             // Correct answer, move the picture up
// //             movePicture("up");
// //             score++;
// //             document.getElementById("score").textContent = "Score: " + score;
// //             currentQuestionIndex++;
// //             displayNextQuestion();
// //             displayMessage("Correct! Your score is now " + score);
// //         } else {
// //             // Incorrect answer, move the picture down
// //             movePicture("down");
// //             displayMessage("Incorrect. Try again! Your score is now " + score);
// //         }

// //         // Clear the input field after checking the answer
// //         answerField.value = "";
// //     } else {
// //         // Handle the case where the input is not a valid number
// //         displayMessage("Please enter a valid number.");
// //     }
// // }
