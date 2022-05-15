document.addEventListener("DOMContentLoaded", () => {


    const keys = document.querySelectorAll(".keyboard-row>button")

    let inputBoxes = [[]]
    let availableSpace = [
        {
            "Um": 1,
            "Ming": 1,
            "Wu": 1,
            "Fa": 1
        }
    ]
    let maxSpace = [
        {
            "Um": 16,
            "Ming": 15,
            "Wu": 1,
            "Fa": 8
        }
    ]
    let gong1Status = "No"
    let gong2Status = "No"
    let gong3Status = "No"
    let gong4Status = "No"
    let gong5Status = "No"


    let workingArea = "Um"
    let yellowTracker = "Um1"

    const faArr = ['B1', 'B2', 'B3', 'B4', 'R1', 'R2', 'R3', 'R4']

    document.getElementById(yellowTracker).style.borderColor = "Yellow";

    let gongArr = document.getElementsByClassName('gong')
    for (let i = 0; i < gongArr.length; i++) {
        gongArr[i].onclick = ({ target }) => {
            const clicked_id = target.id
            handleGong(clicked_id)
        }
    }


    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const tile = target.getAttribute("data-key")

            if (tile === 'Enter') {
                handleSumbit()
                return;
            }

            if (tile === 'Delete') {
                handleDelete()
                return;
            }

            if (tile === 'MingCheung') {
                handleMingCheung()
                return;
            }

            if (tile === 'WuCheung') {
                handleWuCheung()
                return;
            }

            if (tile === 'UmCheung') {
                handleUmCheung()
                return;
            }

            if (tile === 'FaCheung') {
                handleFaCheung()
                return;
            }

            if (faArr.includes(tile)) {
                updateFaBoxs(tile)
                return;
            }


            updateBoxs(tile)
        };

    }

    function handleDelete() {
        const lastTileEl = document.getElementById(workingArea + String(availableSpace[0][workingArea] - 1));
        if (lastTileEl) {
            const currentArr = getCurrentArr();
            const removedTile = currentArr.pop();

            inputBoxes[inputBoxes.length - 1] = currentArr;
            colorGrey()


            lastTileEl.style.background = 'none';

            availableSpace[0][workingArea] = availableSpace[0][workingArea] - 1
            yellowTracker = workingArea + String(availableSpace[0][workingArea])
            colorYellow()
        }
    }

    function handleSumbit() {
        const currentArr = getCurrentArr();
        const currentCombo = currentArr.join('')
        console.log(currentCombo)
        //calculation area
    }

    function handleGong(clicked_id) {

        switch (clicked_id) {
            case 'Gong1':
                switch (gong1Status) {
                    case 'No':
                        const cheung = document.getElementById('Ming1').getAttribute('tile')
                        if (document.getElementById('Ming2').getAttribute('tile') === cheung && document.getElementById('Ming3').getAttribute('tile') === cheung) {
                            console.log(gong1Status)
                            gong1Status = "Ming"
                            document.getElementById(clicked_id).style.backgroundImage = 'url(images/' + document.getElementById('Ming1').getAttribute('tile') + '.svg)';
                        }
                        break;
                    case 'Ming':
                            gong1Status = "Um"
                            document.getElementById(clicked_id).style.backgroundImage = 'url(images/back.svg)';
                            break;
                    case 'Um':
                            gong1Status = "No"
                            document.getElementById(clicked_id).style.backgroundImage = 'none';
                            break;
                }
        }
    }



    function handleMingCheung() {
        workingArea = "Ming"
        colorGrey()
        yellowTracker = workingArea + String(availableSpace[0][workingArea])
        colorYellow()
    }

    function handleWuCheung() {
        workingArea = "Wu"
        colorGrey()
        yellowTracker = workingArea + String(availableSpace[0][workingArea])
        colorYellow()
    }

    function handleUmCheung() {
        workingArea = "Um"
        colorGrey()
        yellowTracker = workingArea + String(availableSpace[0][workingArea])
        colorYellow()
    }

    function handleFaCheung() {
        workingArea = "Fa"
        colorGrey()
        yellowTracker = workingArea + String(availableSpace[0][workingArea] - 1)
        colorYellow()
    }







    function getCurrentArr() {
        const numberOfTiles = inputBoxes.length
        return inputBoxes[numberOfTiles - 1]
    }

    function updateBoxs(tile) {
        const currentArr = getCurrentArr()

        if (currentArr && currentArr.length < 17 && availableSpace[0][workingArea] <= maxSpace[0][workingArea]) {
            currentArr.push(tile)

            const availableSpaceEl = document.getElementById(workingArea + String(availableSpace[0][workingArea]))

            availableSpace[0][workingArea] = availableSpace[0][workingArea] + 1;

            availableSpaceEl.style.backgroundImage = 'url(images/' + tile + '.svg)';
            availableSpaceEl.style.backgroundRepeat = "no-repeat";
            availableSpaceEl.style.borderColor = "rgb(58, 58, 60)";
            availableSpaceEl.setAttribute('tile', tile);

            if (currentArr.length === 16) {
                workingArea = "Wu"
                yellowTracker = workingArea + String(availableSpace[0][workingArea])
                colorYellow()
                return
            }

            if (currentArr.length === 17) {
                document.getElementById("enter-button").style.backgroundColor = "yellow";
            } else {
                yellowTracker = workingArea + String(availableSpace[0][workingArea])
                console.log(yellowTracker)
                colorYellow()
            }
        }
    }

    function updateFaBoxs(tile) {
        if (availableSpace[0].Fa <= maxSpace[0].Fa) {
            const availableSpaceEl = document.getElementById('Fa' + String(availableSpace[0].Fa))
            availableSpace[0].Fa = availableSpace[0].Fa + 1;

            availableSpaceEl.style.backgroundImage = 'url(images/' + tile + '.svg)';
            availableSpaceEl.style.backgroundRepeat = "no-repeat";
            availableSpaceEl.style.borderColor = "rgb(58, 58, 60)";
            availableSpaceEl.textContent = ""
        }
    }


    function colorGrey() {
        if (document.getElementById(yellowTracker)) {
            document.getElementById(yellowTracker).style.borderColor = "rgb(58, 58, 60)";
        }
    }

    function colorYellow() {
        if (document.getElementById(yellowTracker)) {
            document.getElementById(yellowTracker).style.borderColor = "yellow";
        }
    }

})