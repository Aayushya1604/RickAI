function responseFromWit(data) {
  console.log("data from wit:");
  console.log(JSON.stringify(data));

  const intent = (data.intents.length > 0 && data.intents[0]) || "__foo__";

  switch (intent.name) {
    case "give_advice":
      // return "result1";
      return giveAdvice();
    case "receive_thanks":
      return receiveThanks();
  }

  return handleGibberish();
}

// ----------------------------------------------------------------------------
// handleGibberish

function handleGibberish() {
  return Promise.resolve(
    "Hi, I am a chat bot that is based on the character Rick from the show 'Rick and Morty'. Ask me for great, never seen before Rick advice/quotes."
  );
}
// ----------------------------------------------------------------------------
// giveAdvice

function giveAdvice() {
  var quotes;
  var order = 5;
  var beginnings = [];
  var ngrams = {};
  var result = "";

  var fs = require("fs");
  try {
    quotes = fs.readFileSync("quotes.txt", "utf8").split("\n"); // read from text file and store in the quotes variable
    //console.log(quotes.toString());
  } catch (e) {
    console.log("Error:", e.stack);
  }

  for (var i = 0; i < quotes.length; i++) {
    var txt = quotes[i];
    for (var j = 0; j <= txt.length - order; j++) {
      var gram = txt.substring(j, j + order);
      if (j == 0) {
        beginnings.push(gram);  // keep track of all the sentence beginnings
      }

      if (!ngrams[gram]) {
        ngrams[gram] = []; 
      }
      ngrams[gram].push(txt.charAt(j + order)); // add the next character of the gram to the array
    }
  }

  var currentGram = beginnings[Math.floor(Math.random() * beginnings.length)];  
  result = currentGram;

  for (var i = 0; i < 200; i++) {
    var possibilities = ngrams[currentGram]; // array of all the possible next characters of the currentGram
    if (!possibilities) {
      break;
    }
    //var next = Math.random(possibilities);
    var next = possibilities[Math.floor(Math.random() * possibilities.length)];
    result += next;
    currentGram = result.substring(result.length - order, result.length);
  }

  return result;
}

// ----------------------------------------------------------------------------
// receiveThanks

function receiveThanks() {
  return "Yeah you're welcome";
}

exports.responseFromWit = responseFromWit;
