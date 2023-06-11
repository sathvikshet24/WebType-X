const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".input-field");
const tryAgainBtn = document.querySelector(".try-again");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = mistakes = isTyping = 0;
let wpmData = [['Seconds', 'WPM']];
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function loadQuote() {
  typingText.innerHTML = "";
  const quote = getRandomQuote();
  quote.content.split("").forEach((char) => {
    let span = `<span>${char}</span>`;
    typingText.innerHTML += span;
  });
  typingText.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
  let characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];
  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }
    if (typedChar == null) {
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (characters[charIndex].innerText == typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");

    let wpm = Math.round(
      ((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60
    );
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    wpmTag.innerText = wpm;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;

    wpmData.push([timeLeft, wpm]);
  } else {
    clearInterval(timer);
    inpField.value = "";
    drawChart();
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
    let wpm = Math.round(
      ((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60
    );
    wpmTag.innerText = wpm;
  } else {
    clearInterval(timer);
  }
}

function drawChart() {
  var data = google.visualization.arrayToDataTable(wpmData);

  var options = {
    title: 'WPM for Each Second',
    hAxis: {
      title: 'Seconds Remaining',
      minValue: 0,
      maxValue: maxTime
    },
    vAxis: {
      title: 'Words Per Minute',
      minValue: 0
    },
    curveType: 'function',
    legend: { position: 'none' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart'));
  chart.draw(data, options);
}

function removeChart() {
  while (document.getElementById('chart').firstChild) {
    document.getElementById('chart').firstChild.remove();
  }
}

function resetGame() {
  loadQuote();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  inpField.value = "";
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
  removeChart();
  wpmData = [['Seconds', 'WPM']];
}

function getRandomQuote() {
  const quotes = [
    { content: "The only way to do great work is to love what you do." },
    { content: "In the middle of difficulty lies opportunity." },
    { content: "Success is not final, failure is not fatal: It is the courage to continue that counts." },
    { content: "The future belongs to those who believe in the beauty of their dreams." },
    { content: "Believe you can, and you're halfway there." },
    { content: "The only limit to our realization of tomorrow will be our doubts of today." },
    { content: "The greatest glory in living lies not in never falling, but in rising every time we fall." },
    { content: "Challenges are what make life interesting and overcoming them is what makes life meaningful." },
    { content: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart." },
    { content: "The harder you work for something, the greater you'll feel when you achieve it." },
    { content: "The only way to discover the limits of the possible is to go beyond them into the impossible." },
    { content: "Every day is a new beginning. Take a deep breath and start again" },
    { content: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle." },
    { content: "Success is not measured by money, but by the difference you make in people's lives." },
    { content: "Every day may not be good, but there is something good in every day." },
    { content: "The only person you should try to be better than is the person you were yesterday." },
    { content: "Dream big, work hard, stay focused, and surround yourself with good people." },          // Add more quotes as needed
  ];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

loadQuote();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
