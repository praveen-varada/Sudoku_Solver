// Initial board
var board=[[-1,-1,-1,-1,-1,-1,-1,-1,-1],
           [-1,-1,-1,-1,-1,-1,-1,-1,-1],
           [-1,-1,-1,-1,-1,-1,-1,-1,-1],
           [-1,-1,-1,-1,-1,-1,-1,-1,-1],
           [-1,-1,-1,-1,-1,-1,-1,-1,-1],
           [-1,-1,-1,-1,-1,-1,-1,-1,-1],
           [-1,-1,-1,-1,-1,-1,-1,-1,-1],
           [-1,-1,-1,-1,-1,-1,-1,-1,-1],
           [-1,-1,-1,-1,-1,-1,-1,-1,-1]];

// Array for giving bg color for inputs while showing output is FALSE initial
var bgColor=[[false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false],];

// Array used for generating sudoku board by shuffling them in a "generate()" function
var arr=[1,2,3,4,5,6,7,8,9];

// 9x9 sudoku
const N=9;

// Function to return whether it is safe to place the number "c" in that box by checking respective row, column, 3x3 grid
function isSafe(board,row,column,c)
{
    // Checking the respective row and column except that box "board[row][column]" to find if there is already a number "c" in it
    for(let i=0;i<N;i++)
    {
        if(board[i][column]==c && i!=row){
            return false;
        }
        if(board[row][i]==c && i!=column){
            return false;
        }
    }

    // "xx" and "yy" are starting points of that respective 3x3 grid
    let xx=row-row%3;
    let yy=column-column%3;

    // Checking the respective 3x3 grid except the box "board[row][column]" to find if there is already a number "c" in it
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(xx+i===row && yy+j===column) continue;
            if(board[xx+i][yy+j]==c){
                return false;
            }
        }
    }
    return true;
}

// Function that is called recursively to solve this sudoku using Backtracking algorithm
function solve(board,row,column){

    // If row reaches N then the board is complete and hence we return true
    if(row===N){
        return true;
    }

    // If column reaches N then the same function is called recursivley for next row 0th column
    if(column===N){
        return solve(board,row+1,0);
    }

    // flagch becomes true if the condition executes atleast once

    // We have to insert number only if there is no input i.e, "board[row][column]=-1"
    if(board[row][column]==-1){

        // Checking for every possible number from 1 to N(i.e, 9);
        for(let i=1;i<=N;i++){
            if(isSafe(board, row, column, i)){

                // If it is safe to insert "i" in the box, we go for next box in the row
                board[row][column]=i;
                if(solve(board,row,column+1)){
                    return true;
                }

                // Backtracking
                board[row][column]=-1;
            }
        }

        // Returns false if it is not possible to insert any number from 1 to 9 in that place
      return false;
    }

    // If "board[row][column]!=-1" i.e, if there is a input in the box, we go to solve the next one
    else{
        return solve(board,row,column+1);
    }
}

// Function is called when "solve" button is pressed
// This function reads the input and checks if the given board is valid or not and then calls "solve" function
function solveSudoku(){

    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){

            // "index" will store the ids of the input boxes (eg: #00, #01,..)
            var index="#"+i.toString()+j.toString();

            // If the value at index is not an empty string then the input is read
            if($(index).val()!== ""){
                board[i][j]=$(index).val();

                // Inputs should be strictly between 1 and 9
                console.log(board[i][j]);
                if(board[i][j]>9 || board[i][j]<1){
                    $(index).css('color', 'red');
                    inValid();
                    return;
                }

                // This is stored true to know that this is the input and to change the bg color while printing
                bgColor[i][j]=true;
            }
        }
    }

    // Checking if the given board is valid or not
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            if(board[i][j]!=-1){
                let chk=board[i][j];
                if(!isSafe(board,i,j,chk)){
                    inValid();
                    return;
                }
            }
        }
    }

    // "solve" function is called at row=0 and column=0
    solve(board,0,0);

    // Printing the board
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            var index="#"+i.toString()+j.toString();
            $(index).val(board[i][j]);
            if(bgColor[i][j]){
                $(index).css('backgroundColor', '#aaabb8');
            }
        }
    }
}

// Function is called if the input board is "INVALID"
function inValid(){

    // "hidden" attribute is removed from class "feedback"
    $(".feedback").removeAttr('hidden');

    // Animation
    $(".feedback").fadeOut().fadeIn().fadeOut().fadeIn();
}

// Function is called when "generate" button is pressed to generate a sudoku board
function generate(){

    // The main logic behind this function is we first shuffle an 1 to 9 array and place it in (0,0) to (2,0) 3x3 grid
    // and again shuffled and placed in (3,3) to (5,5) 3x3 grid and then again shuffled and placed in (6,6) to (8,8) 3x3 grid
    // So that these 3 diagonal grids are valid. Now we call the solve function to generate an answer for this input.

    // Reason for selecting those 3 grids:
    // The rows and columns of those 3 grids do not interfere with other grids thus will give us a chance to generate an unique sudoku board

    // Note: Minimum of 17 inputs are required to generate an unique board.


    // Everything is first reset in the board
    reset();

    // "shuffleArray" function shuffles the given array i.e, "arr[1,2,3,4,5,6,7,8,9]"
    shuffleArray(arr);

    // Placing that shuffled array in 3x3 grid
    board[0][0]=arr[0];
    board[0][1]=arr[1];
    board[0][2]=arr[2];
    board[1][0]=arr[3];
    board[1][1]=arr[4];
    board[1][2]=arr[5];
    board[2][0]=arr[6];
    board[2][1]=arr[7];
    board[2][2]=arr[8];

    shuffleArray(arr);

    board[3][3]=arr[0];
    board[3][4]=arr[1];
    board[3][5]=arr[2];
    board[4][3]=arr[3];
    board[4][4]=arr[4];
    board[4][5]=arr[5];
    board[5][3]=arr[6];
    board[5][4]=arr[7];
    board[5][5]=arr[8];

    shuffleArray(arr);

    board[6][6]=arr[0];
    board[6][7]=arr[1];
    board[6][8]=arr[2];
    board[7][6]=arr[3];
    board[7][7]=arr[4];
    board[7][8]=arr[5];
    board[8][6]=arr[6];
    board[8][7]=arr[7];
    board[8][8]=arr[8];

    // With a randomly generated input, we are going to have an unique sudoku board by solving it
    solve(board,0,0);

    // Printing the generated board
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            var t=Math.random();

            // "p" is selected in between 0 and 1
            var p=0.5;

            // Randomly selecting which value to show up.
            // Note: Difficulty level can be changed by changing "p". Greater the "p", harder it is.
            if(t>p){
                var index="#"+i.toString()+j.toString();
                $(index).val(board[i][j]);
            }
        }
    }
}

// Function to Randomize array in-place using Durstenfeld shuffle algorithm
function shuffleArray(array) {

    // Selecting "i" from N-1 to 1
    for (var i = array.length - 1; i > 0; i--) {

        // Using "i" to generate a random number between "0 and i" and swapping elements at their indices
        // Note: It is between 0 and i because we dont want to select already swapped elements in the order.
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Function that resets the entire board
function reset(){
    $(".feedback").attr('hidden', true);
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            var index="#"+i.toString()+j.toString();
            $(index).val("");
            $(index).css('backgroundColor', '#EDF5E1');
            board[i][j]=-1;
            bgColor[i][j]=false;
        }
    }
}

// When the page is ready to handle any functions,
$(document).ready(function() {

    // "hidden" attribute is added to class "feedback"
    $(".feedback").attr('hidden', true);

    $("input").on("click",function(){
        $(".feedback").attr('hidden', true);
        $(this).css('color', 'black');
    });

    // Function call for "solveSudoku()" on clicking "solve" button
    $(".btn-success").on("click",solveSudoku);

    // Function call for "generate()" on clicking "generate" button
    $(".btn-primary").on("click",generate);

    // Function call for "reset()" on clicking "reset" button
    $(".btn-light").on("click",reset)
});
