const typingText = document.querySelector(".typing-text p"),
  inpField = document.querySelector(".wrapper .input-field"),
  usrinpField = document.querySelector(".wrapper .input-field-off")
  tryAgainBtn = document.querySelector(".content button"),
  timeTag = document.querySelector(".time span b"),
  mistakeTag = document.querySelector(".mistake span"),
  wpmTag = document.querySelector(".wpm span"),
  cpmTag = document.querySelector(".cpm span");

let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = mistakes = isTyping = 0;

let wpmData = [['Seconds', 'WPM']];
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function loadParagraph() {
  const inputParagraph = inpField.value.trim();
  if (inputParagraph !== "") {
    typingText.innerHTML = "";
    inputParagraph.split("").forEach(char => {
      let span = `<span>${char}</span>`;
      typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => usrinpField.focus());
    typingText.addEventListener("click", () => usrinpField.focus());
  }
}

function initTyping() {
  let characters = typingText.querySelectorAll("span");
  let typedChar = usrinpField.value.split("")[charIndex];
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
    characters.forEach(span => span.classList.remove("active"));
    characters[charIndex].classList.add("active");

    let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
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
    let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
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
}

function removeChart() {
  while (document.getElementById('chart').firstChild) {
    document.getElementById('chart').firstChild.remove();
  }
} 

function resetGame() {
  location.reload();
}

function handleEnterKey(event) {
  if (event.keyCode === 13 && inpField.value.trim() !== "") {
    event.preventDefault();
    inpField.removeEventListener("keydown", handleEnterKey);
    inpField.style.display = "none";
    loadParagraph();
    startTyping();
  }
}

function startTyping() {
  usrinpField.addEventListener("input", initTyping);
  tryAgainBtn.addEventListener("click", resetGame);
}

inpField.addEventListener("keydown", handleEnterKey);
