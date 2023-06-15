 function rgbToHex(rgbValue) {
      const rgbArray = rgbValue.match(/\d+/g).map(Number);
      const r = rgbArray[0];
      const g = rgbArray[1];
      const b = rgbArray[2];

      const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
      const hexValue = `#${hex}`;

      return hexValue;
    }

    let winIndex = -1;
    let pointCount = -1;
    document.getElementById('lastPoint').textContent = 'Last point count: ' + sessionStorage.getItem('pointCount');

    function generateCircles() {
      let circleRowsContainer = document.getElementById('circleRows');
      circleRowsContainer.innerHTML = '';

      let circleCount = sessionStorage.getItem('circleCount') || 10;
      document.getElementById('circleCount').textContent = circleCount;

      let circleRows = [];
      let circles = [];
      pointCount = circleCount;
      let hexColor;

      const circleRow = document.createElement('div');
      circleRow.classList.add('circle-row');
      circleRows.push(circleRow);
      circleRowsContainer.appendChild(circleRow);

      const circlesPerRow = Math.ceil(circleCount / 2);

      for (let i = 0; i < circleCount; i++) {
        let circle = document.createElement('div');
        circle.classList.add(`circle`);
        circles.push(circle);

        const rowIdx = Math.floor(i / circlesPerRow);
        if (circleRows[rowIdx] === undefined) {
          const newCircleRow = document.createElement('div');
          newCircleRow.classList.add('circle-row');
          circleRows.push(newCircleRow);
          circleRowsContainer.appendChild(newCircleRow);
        }
        circleRows[rowIdx].appendChild(circle);
      }

      function chooseRandomCircle() {
        const winningIndex = Math.floor(Math.random() * circles.length);
        const winningCircle = circles[winningIndex];

        circles[winningIndex].winner = true;

        console.log(circles[winningIndex].style.backgroundColor);
        hexColor = rgbToHex(circles[winningIndex].style.backgroundColor);
        document.getElementById('selectedCircle').textContent = `Select a circle with a color of: ${hexColor}`;

        circles.forEach((circle, index) => {
          if (index !== winningIndex) {
            circle.addEventListener('click', () => {
              wrongCircleClick(circle);
            });
          }
        });

        winningCircle.addEventListener('click', () => {
          circles.forEach((circle) => {
            if (circle !== winningCircle) {
              circle.classList.add('hidden');
            }
          });

          buttonContainer = document.getElementsByClassName('btn-container');
          for (let a of buttonContainer) {
            a.remove();
          }
          let refreshButton = document.createElement('button');
          refreshButton.innerHTML = 'Play again?';
          refreshButton.addEventListener('click', () => {
            location.reload();
          });
          messageLine = document.getElementById('messageLine');
          messageLine.innerHTML = '';
          messageLine.style.background = '';
          messageLine.appendChild(refreshButton);
          if (pointCount == 1) {
            pointCount = 0;
          }
          console.log(buttonContainer);
          console.log("TEST");
          winText = document.getElementById('selectedCircle');
          winText.textContent = `YOU CORRECTLY CHOSE ${hexColor}, YOU WON WITH ${pointCount} POINTS!`;
          winText.style.color = hexColor;
          console.log(winText.color);
          sessionStorage.setItem('pointCount', pointCount);
        });
      }

      async function fetchColors() {
        const spareColors = 7;

        const response = await fetch('https://www.colr.org/json/colors/random/' + (circleCount + spareColors)).catch(err => { console.log(err) });
        const data = await response.json();
        const colors = data.colors;

        let hexErrorCount = 0;

        circles.forEach((circle, index) => {
          let color = colors[index % colors.length];
          if (color.hex === "") {
            color = colors[circleCount + spareColors - 1 - hexErrorCount];
            hexErrorCount++;
            /* When we get an empty hex, we just use one of those spare hexes */
          }

          circle.style.backgroundColor = `#${color.hex}`;

          circle.id = color;
        });

        chooseRandomCircle();
      }
      fetchColors();
    }

    function wrongCircleClick(circle) {
      console.log(`Wrong circle.`);
      wrongHex = rgbToHex(circle.style.backgroundColor);
      circle.style.transition = "opacity 0.5s ease";
      circle.style.opacity = "0";
      pointCount--;

      document.getElementById('messageLine').textContent = `You have chosen a wrong color: ${wrongHex}`;
      document.getElementById('messageLine').style.backgroundColor = wrongHex;

      circle.addEventListener("transitionend", function () {
        circle.remove();
      });
    }

    generateCircles();

    document.getElementById('subtractBtn').addEventListener('click', () => {
      let circleCount = sessionStorage.getItem('circleCount') || 10;
      circleCount = parseInt(circleCount) - 1;
      circleCount = Math.max(2, circleCount);
      sessionStorage.setItem('circleCount', circleCount);
      console.log("CLICK");
      generateCircles();
    });

    document.getElementById('addBtn').addEventListener('click', () => {
      let circleCount = sessionStorage.getItem('circleCount') || 10;
      circleCount = parseInt(circleCount) + 1;
      circleCount = Math.min(17, circleCount);
      sessionStorage.setItem('circleCount', circleCount);
      console.log("CLICK");
      generateCircles();
    });