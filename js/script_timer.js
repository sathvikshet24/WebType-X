const typingText = document.querySelector(".typing-text p"),
  inpField = document.querySelector(".wrapper .input-field"),
  tryAgainBtn = document.querySelector(".content button"),
  timeTag = document.querySelector(".time span b"),
  mistakeTag = document.querySelector(".mistake span"),
  wpmTag = document.querySelector(".wpm span"),
  cpmTag = document.querySelector(".cpm span");


let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = mistakes = isTyping = 0;
  seconds = WPM = 0;

let wpmData = [[0, 0]];
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function loadParagraph() {
  const ranIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = "";
  paragraphs[ranIndex].split("").forEach((char) => {
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
  try {
    var data = google.visualization.arrayToDataTable(wpmData);

    var options = {
      title: 'WPM for Each Second',
      hAxis: {
        title: 'Seconds Remaining',
        minValue: timeLeft,
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
  } catch (error) {
    // Handle the error gracefully
    console.error('An error occurred while drawing the chart:'  );
  }
}


  function removeChart() {
    while (document.getElementById('chart').firstChild) {
      document.getElementById('chart').firstChild.remove();
    }
}


function resetGame() {
  loadParagraph();
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

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
const timeOptions = [15, 30, 45, 60];
const timeOptionsContainer = document.createElement("div");
timeOptionsContainer.classList.add("time-options");
timeOptions.forEach((time) => {
  const button = document.createElement("button");
  button.textContent = `${time}s`;

  button.addEventListener("click", () => {
    maxTime = time;
    resetGame();
  });

  timeOptionsContainer.appendChild(button);
});

const content = document.querySelector(".content");
content.insertBefore(timeOptionsContainer, content.firstChild);
