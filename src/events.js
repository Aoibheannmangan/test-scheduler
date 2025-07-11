function addWeeks(date, weeks) {
    return new Date(date.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
}

const today = new Date();
const babyEarly = parseInt(prompt("How many weeks early was the baby born?"), 10);

// Aim High Data
const visit2AHMin = addWeeks(today, 15 + babyEarly);
const visit2AHMax = addWeeks(today, 18 + babyEarly);
console.log(`Visit 2 should be between ${visit2Min.toLocaleDateString()} and ${visit2Max.toLocaleDateString()}`);

const visit3AHMin = addWeeks(visit2Min, 21 + babyEarly);
const visit3AHMax = addWeeks(visit2Max, 34 + babyEarly);      
console.log(`Visit 3 should be between ${visit3Min.toLocaleDateString()} and ${visit3Max.toLocaleDateString()}`);   

const visit4AHMin = addWeeks(visit3Min, 20 + babyEarly);
const visit4AHMax = addWeeks(visit3Max, 30 + babyEarly);              
console.log(`Visit 4 should be between ${visit4Min.toLocaleDateString()} and ${visit4Max.toLocaleDateString()}`);   

const visit5AHMin = addWeeks(visit4Min, 17 + babyEarly);
const visit5AHMax = addWeeks(visit4Max, 26 + babyEarly);      
console.log(`Visit 5 should be between ${visit5Min.toLocaleDateString()} and ${visit5Max.toLocaleDateString()}`);   

const visit6AHMin = addWeeks(visit5Min, 17 + babyEarly);
const visit6AHMax = addWeeks(visit5Max, 26 + babyEarly);
console.log(`Visit 6 should be between ${visit6Min.toLocaleDateString()} and ${visit6Max.toLocaleDateString()}`);   

// EDI Data
const visit2EDIMin = addWeeks(today, 13 + babyEarly);
const visit2EDIMax = addWeeks(today, 17 + babyEarly)
console.log(`Visit 2 should be between ${visit2EDIMin.toLocaleDateString()} and ${visit2EDIMax.toLocaleDateString()}`);

const visit3EDIMin = addWeeks(visit2EDIMin, 21 + babyEarly);
const visit3EDIMax = addWeeks(visit2EDIMax, 34 + babyEarly);
console.log(`Visit 3 should be between ${visit3EDIMin.toLocaleDateString ()} and ${visit3EDIMax.toLocaleDateString()}`);

const visit4EDIMin = addWeeks(visit3EDIMin, 20 + babyEarly);
const visit4EDIMax = addWeeks(visit3EDIMax, 30 + babyEarly);
console.log(`Visit 4 should be between ${visit4EDIMin.toLocaleDateString    ()} and ${visit4EDIMax.toLocaleDateString()}`);         

const visit5EDIMin = addWeeks(visit4EDIMin, 17 + babyEarly);
const visit5EDIMax = addWeeks(visit4EDIMax, 26 + babyEarly);
console.log(`Visit 5 should be between ${visit5EDIMin.toLocaleDateString()} and ${visit5EDIMax.toLocaleDateString()}`); 

const visit6EDIMin = addWeeks(visit5EDIMin, 52 + babyEarly);
const visit6EDIMax = addWeeks(visit5EDIMax, 61 + babyEarly);
console.log(`Visit 6 should be between ${visit6EDIMin.toLocaleDateString()} and ${visit6EDIMax.toLocaleDateString()}`); 

//Coolprime Data
const visit2CPMin = addWeeks(today, 13 + babyEarly);
const visit2CPMax = addWeeks(today, 17 + babyEarly);        
console.log(`Visit 2 should be between ${visit2CPMin.toLocaleDateString()} and ${visit2CPMax.toLocaleDateString()}`);   

const visit3CPMin = addWeeks(visit2CPMin, 22 + babyEarly);
const visit3CPMax = addWeeks(visit2CPMax, 39 + babyEarly);
console.log(`Visit 3 should be between ${visit3CPMin.toLocaleDateString()}  and ${visit3CPMax.toLocaleDateString()}`);  

const visit4CPMin = addWeeks(visit3CPMin, 44 + babyEarly);
const visit4CPMax = addWeeks(visit3CPMax, 61 + babyEarly);
console.log(`Visit 4 should be between ${visit4CPMin.toLocaleDateString()} and ${visit4CPMax.toLocaleDateString()}`);       
