
// get last week's weight and body fat readings
// get calorie totals for the past 7 days
// calculate average calories per day for the week
// get this week's weight and body fat readings
// calculate whether weight gained or lost
//      and whether the majority was fat or lean body mass
// then make calorie recommendations: maintenance, +100 or -100 average
var fs = require('fs');
var inquirer = require('inquirer');
var oldWeight;
var oldBodyFat;
var oldLBM; // LBM = lean body mass
var newWeight;
var newBodyFat;
var newLBM;
var weightChange;
var bodyFatChange;
var caloriesEachDay = [];
var totalCaloriesPerWeek = 0;
var averageDailyCalories; // average for the past week per day
var differenceInLBM; 
var percentFatChange;
var percentLBMChange;
var recommendedCalories; // recommended daily calories for the upcoming week
  
inquirer.prompt([
    {
        name: "oldBodyWeight",
        type: "input",
        message: "LEAN BODY MASS OPTIMIZER\n------------------------\nEnter your weight 7 days ago: "
    },
    {
        name: "oldBodyFatPercentage",
        type: "input",
        message: "Enter your body fat percentage 7 days ago: "
    },
    {
        name: "calories",
        type: "input",
        message: "Enter your calories per day for the past 7 days (separated by commas only): "
    },
    {
        name: "newBodyWeight",
        type: "input",
        message: "Enter your weight today: "
    },
    {
        name: "newBodyFatPercentage",
        type: "input",
        message: "Enter your body fat percentage today: "
    }
]).then(function (answers){
    oldWeight = parseFloat(answers.oldBodyWeight);
    oldBodyFat = parseFloat(answers.oldBodyFatPercentage);
    caloriesEachDay = answers.calories.split(',');
    for (var i = 0; i < 7; i++){
        totalCaloriesPerWeek += parseInt(caloriesEachDay[i]);
    }
    averageDailyCalories = Math.round(totalCaloriesPerWeek / 7);
    console.log("Average daily calories this week was " + averageDailyCalories + ".");

    newWeight = parseFloat(answers.newBodyWeight);
    newBodyFat = parseFloat(answers.newBodyFatPercentage);
    if (Math.abs(newWeight - oldWeight) > 0 || Math.abs(newBodyFat - oldBodyFat) > 0){
        weightChange = newWeight - oldWeight;
        oldLBM = (oldWeight * (100 - oldBodyFat) / 100);
        console.log("Old lean body mass: " + oldLBM);
        newLBM = (newWeight * (100 - newBodyFat) / 100);
        console.log("New lean body mass: " + newLBM);
        differenceInLBM = newLBM - oldLBM;
        console.log("Difference in lean mass: "+ differenceInLBM);
        percentLBMChange = Math.round(differenceInLBM / weightChange * 100);
        percentFatChange = 100 - percentLBMChange;
        console.log("Weight change: " + weightChange);
        console.log("Lean body mass change: " + differenceInLBM);
        console.log("Percent lean body mass change: " + percentLBMChange);
        console.log("Percent body fat change: " + percentFatChange);
        if (weightChange < 0) {
            // user lost weight
            if (percentFatChange > percentLBMChange){
                recommendedCalories = averageDailyCalories;
                console.log("Since most of the weight you lost was body fat,");
                console.log("your target maintenance calories this week are " + recommendedCalories + ";");
                console.log("however, you may subtract 100 from this number if your goal is to lose more weight.");
            } else if (percentFatChange < percentLBMChange) {
                console.log("You lost more lean mass than fat.");
                recommendedCalories = averageDailyCalories + 100;
                console.log("Target daily calories this week: " + recommendedCalories);
                console.log("This will help you retain lean mass.");
            } else {
                console.log("You lost equal amounts of fat and lean mass.");
                recommendedCalories = averageDailyCalories;
                console.log("Target maintenance calories this week: " + recommendedCalories);
            }
        } else if (weightChange > 0){
            // user gained weight
            if (percentLBMChange > percentFatChange) {
                // user gained mostly lean mass
                recommendedCalories = averageDailyCalories;
                console.log("Since you gained mostly lean mass this week,");
                console.log("Your target maintenance calories this week are "+ recommendedCalories);
                console.log("You may add 100 to this number if your goal is to continue to add lean mass.");
            } else if (percentLBMChange < percentFatChange) {
                // user gained mostly body fat
                console.log("Your weight gain was mostly body fat.");
                recommendedCalories = averageDailyCalories - 100;
                console.log("Target daily calories this week: " + recommendedCalories);
                console.log("Hit this target every day.");
            } else {
                console.log("You gained equal amounts of body fat and lean mass.");
                recommendedCalories = averageDailyCalories;
                console.log("Your target maintenance calories this week: " + recommendedCalories);
            }
        }
    } else {
        console.log("Your weight and bodyfat remained the same this week.");
        console.log("Target maintenance calories this week: " + averageDailyCalories);
        console.log("You can add or subtract 100 from this number if your goal is to gain or lose weight.");
    }
    console.log("Next log date is 7 days from today.");
    var line = new Date().toLocaleString() + ": " + newWeight + " lb. " + newBodyFat + "% BF " + averageDailyCalories + " cal/day " + percentLBMChange + "% LBM " + percentFatChange + "% BF " + recommendedCalories + " recommended\r\n";
    fs.appendFileSync('log.txt', line);
});

// write to log.txt:
// - date
// - weight in pounds
// - body fat
// - average calories per day for the week
// - %LBM weekly change
// - %fat weekly change
// - recommended average calories for the next week