document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("defaultOpen").click();

    const keys = document.querySelectorAll(".keyboard-row>button")


    let inputBoxes = [
        []
    ]
    let availableSpace = [{
        "Um": 1,
        "Ming": 1,
        "Wu": 1,
        "Fa": 1
    }]
    let maxSpace = [{
        "Um": 16,
        "Ming": 15,
        "Wu": 1,
        "Fa": 8
    }]
    let cheung, secondTile, thirdTile;
    let arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8;


    let workingArea = "Um"
    let yellowTracker = "Um1"

    const faArr = ['B1', 'B2', 'B3', 'B4', 'R1', 'R2', 'R3', 'R4'];
    let count = {};
    let count2 = {};
    let temp = [];
    let finalCombo = [];
    let finalCombo_temp = [];
    let combinationsCombo = [];


    document.getElementById(yellowTracker).style.borderColor = "Yellow";

    let inputArr = document.getElementsByClassName('farnInput')
    for (let i = 0; i < inputArr.length; i++) {
        inputArr[i].oninput = handleInput
    }

    function handleInput(e) {
        e.target.closest('tr').querySelector(".farnNumber").textContent = e.target.value
    }


    document.getElementById('closeButton').onclick = function () {
        toggleOverlay()
    }

    document.getElementById('ExportButton').onclick = function () {
        let output = {}
        document.querySelectorAll(".MU").forEach(i => {
            output[i.id] = i.checked
        })
        document.querySelectorAll(".YN").forEach(i => {
            output[i.id] = i.checked
        })
        document.querySelectorAll(".farnNumber").forEach(i => {
            output[i.id] = i.textContent
        })

        toggleOverlay()

        document.getElementById('Export').innerHTML = JSON.stringify(output)
        //alert("請另外保全以下字串 \n" + JSON.stringify(output))
        //console.log(output);
    }

    function toggleOverlay() {
        let overlayDiv = document.getElementById("ImportExportOverLay");
        console.log(overlayDiv.style.opacity);
        if (overlayDiv.style.display === 'block') {
            overlayDiv.style.display = 'none';
        } else {
            overlayDiv.style.display = 'block';
        }
    }


    document.getElementById('confirmButton').onclick = function () {
        const obj = JSON.parse(document.getElementById("Import").value)
        console.log(obj)
        Object.keys(obj).forEach(i => {
            if (i.substring(i.length - 1, i.length) === 'f') {
                document.getElementById(i).textContent = obj[i]
            } else {
                document.getElementById(i).checked = obj[i]
            }
        })
    }


    //clicking gong
    let gongArr = document.getElementsByClassName('gong')
    for (let i = 0; i < gongArr.length; i++) {
        gongArr[i].onclick = ({
            target
        }) => {
            const clicked_id = target.id
            handleGong(clicked_id)
        }
    }

    let wuArr = document.getElementsByClassName('wu')
    for (let i = 0; i < wuArr.length; i++) {
        wuArr[i].onclick = ({
            target
        }) => {
            handleWuCheung()
        }
    }

    let umButton = document.getElementsByClassName('box')
    for (let i = 0; i < umButton.length; i++) {
        umButton[i].onclick = ({
            target
        }) => {
            handleUmCheung()
        }
    }

    let mingButton = document.getElementsByClassName('ming')
    for (let i = 0; i < mingButton.length; i++) {
        mingButton[i].onclick = ({
            target
        }) => {
            handleMingCheung()
        }
    }

    let faButton = document.getElementsByClassName('fa')
    for (let i = 0; i < faButton.length; i++) {
        faButton[i].onclick = ({
            target
        }) => {
            handleFaCheung()
        }
    }


    //keys onclick
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({
            target
        }) => {
            const tile = target.getAttribute("data-key")

            if (tile === 'Enter') {
                handleSumbit()
                return;
            }

            if (tile === 'Delete') {
                handleDelete()
                return;
            }

            if (tile === 'Reset') {
                handleReset()
                return;
            }

            // if (tile === 'MingCheung') {
            //     handleMingCheung()
            //     return;
            // }

            // if (tile === 'WuCheung') {
            //     handleWuCheung()
            //     return;
            // }

            // if (tile === 'UmCheung') {
            //     handleUmCheung()
            //     return;
            // }

            // if (tile === 'FaCheung') {
            //     handleFaCheung()
            //     return;
            // }

            if (faArr.includes(tile)) {
                updateFaBoxs(tile)
                return;
            }


            updateBoxs(tile)
        };

    }

    function handleReset() {
        let arr = [mingButton, umButton, faButton, wuArr]
        arr.forEach(item => {
            [].forEach.call(item, i => {
                i.style.background = 'none';
                i.setAttribute('tile', "None")
            })
        });
        [].forEach.call(gongArr, i => {
            i.setAttribute('gongStatus', "No");
            i.style.backgroundImage = 'none';
        });
        inputBoxes = [
            []
        ]

        availableSpace = [{
            "Um": 1,
            "Ming": 1,
            "Wu": 1,
            "Fa": 1
        }]
        document.getElementById("output").innerHTML = "";
        document.getElementById("output-board").innerHTML = "";
        handleUmCheung()
    }

    //delete button
    function handleDelete() {
        const lastTileEl = document.getElementById(workingArea + String(availableSpace[0][workingArea] - 1));
        if (lastTileEl) {
            const currentArr = getCurrentArr();
            const removedTile = currentArr.pop();

            inputBoxes[inputBoxes.length - 1] = currentArr;
            colorGrey()


            lastTileEl.style.background = 'none';
            lastTileEl.setAttribute('tile', "None")

            availableSpace[0][workingArea] = availableSpace[0][workingArea] - 1
            yellowTracker = workingArea + String(availableSpace[0][workingArea])
            colorYellow()
        }
    }

    //submit button
    function handleSumbit() {

        //const wuArr = getCurrentArr();

        //const currentCombo = currentArr.join('')

        //calculation area
        const mingArr = ([].slice.call(document.getElementsByClassName("Ming")).map(x => x.getAttribute('tile'))).filter(a => a !== 'None')
        const umArr = ([].slice.call(document.getElementsByClassName("box")).map(x => x.getAttribute('tile'))).filter(a => a !== 'None')


        //add wu tile in umArr as it need to be considered
        umArr.push(document.getElementById("Wu1").getAttribute('tile'))

        const wuArr = [].concat(mingArr, umArr)

        console.log(mingArr)
        console.log(umArr)
        console.log(wuArr)
        count = []
        wuArr.forEach(tile => {
            count[tile] = (count[tile] || 0) + 1;
        });
        //console.log(count[wuArr[0]])
        console.log(count)
        //console.log(Object.values(count))

        //check if the wu is valid
        if (wuArr.length < 17) {
            alert("小相公")
            return;
        } else if (wuArr.length > 17) {
            alert("大相公")
            return;
        } else if (Math.max(...Object.values(count)) > 4) {
            //insert check for >4 tiles here
            //need to add gong in too*********************************************TO DO
            alert("多過4隻, 出千?")
            return;

        } else {
            checkWu(wuArr, umArr, mingArr, count)
        }

    }

    function checkWu(wuArr, umArr, mingArr, count) {
        let liguCheck = false
        let usedTile = []
        let index
        //findAllPosCombo(umArr, count, posCombo)
        posCombo = []
        posCombo = findAllPosCombo(umArr)


        console.table(posCombo)

        //先搵眼
        count = {}
        umArr.forEach(tile => {
            count[tile] = (count[tile] || 0) + 1;
        });
        console.log(Object.entries(count).sort().toString())

        //Breaking an Object into entries, filtering by >2, then create a new Object with fromEntries
        //then use object.keys to transform into array of keys only

        const eye = Object.keys(Object.fromEntries(Object.entries(count).filter(([k, v]) => v >= 2)))
        console.log("eye: " + eye)

        for (let i = 0; i < eye.length; i++) {
            //for each pair of eye
            //remove from the umArr
            let workingTile = umArr.map((x) => x)
            for (let j = 0; j < 2; j++) {
                index = workingTile.indexOf(eye[i])
                workingTile.splice(index, 1)
            }
            //now workingTile don't have eye
            posCombo = findAllPosCombo(workingTile)
            //console.table(posCombo)
            let kan = workingTile.length / 3

            /*Driver function*/
            combinationsCombo = []
            printCombination(posCombo, posCombo.length, kan);
            //console.table(JSON.stringify(combinationsCombo))

            finalCombo_temp = []

            combinationsCombo.forEach(el => {
                el.push([eye[i], eye[i]]);

                count2 = [];
                el.flat().forEach(tile => {
                    count2[tile] = (count2[tile] || 0) + 1;
                });
                //console.log(Object.entries(count2).sort().toString())
                if (Object.entries(count).sort().toString() ===
                    Object.entries(count2).sort().toString()) {
                    finalCombo_temp.push(el)
                }
            });


        }
        finalCombo = []
        console.table(JSON.stringify(finalCombo_temp))
        finalCombo = finalCombo_temp.map(a => a.map(x => x.join(',')).join(';')).filter((e, i, a) => a.indexOf(e) == i).map(a => a.split(';').map(x => x.split(',')))
        console.table(JSON.stringify(finalCombo))

        console.log(yiu13(wuArr))
        console.log(dap16(wuArr))
        console.log(ligu(wuArr))



        if (yiu13(wuArr) || dap16(wuArr) || ligu(wuArr)) {
            const newDiv = document.createElement("div");
            const newDivName = "finalComboS1"
            newDiv.id = newDivName
            newDiv.className = "finalComboA"


            document.getElementById("output-board").appendChild(newDiv)

            newDiv.innerHTML += '<div class = "spacer">暗</div>';


            const newSet = document.createElement("div");
            newSet.className = "newSet"
            document.getElementById(newDivName).appendChild(newSet)
            umArr.forEach(l => {
                newSet.innerHTML += '<div id="Temp" class="output-tile"></div>';
                const Temp = document.getElementById('Temp')
                Temp.style.backgroundImage = 'url(images/' + l + '.svg)';
                Temp.style.backgroundRepeat = "no-repeat";
                Temp.style.borderColor = "rgb(58, 58, 60)";
                Temp.setAttribute('tile', l)
                Temp.setAttribute('id', 'none')
            })

            newDiv.innerHTML += '<div class = "spacer"></div><p>';
            //calc area
            const calcDiv = document.createElement("div");
            calcDiv.id = "Calc-" + (newDivName)
            calcDiv.className = "finalComboACalc"
            document.getElementById(newDivName).appendChild(calcDiv)


            if (yiu13(wuArr)) {
                calcFarn([], umArr, calcDiv, 'yiu13')
            }
            if (dap16(wuArr)) {
                calcFarn([], umArr, calcDiv, 'dap16')
            }
            if (ligu(wuArr)) {
                calcFarn([], umArr, calcDiv, 'liguOnly')
                liguCheck = true
            }




        }

        let wuWay
        const wuTile = document.getElementById("Wu1").getAttribute('tile')
        if (document.getElementById("自摸").checked) {
            wuWay = "自摸"
            console.log(wuWay)
        } else if (document.getElementById("出統").checked) {
            wuWay = "出統";
            console.log(wuWay)
        }

        let tempMingArr = []
        let tempUmArr = []
        let tempUmArr2 = []
        for (let i = 0; i < finalCombo.length; i++) {
            //出統: 暗變明

            let boolen = false
            //console.log(finalCombo[i])

            for (let j = 0; j < finalCombo[i].length; j++) {

                // console.log(wuWay)
                // console.log(finalCombo[i][j])
                // console.log(wuTile)
                // console.log(finalCombo[i][j].length)


                if (wuWay === "出統" && finalCombo[i][j].includes(wuTile) && finalCombo[i][j].length === 3) {
                    const tempArr = finalCombo[i].map((x) => x)
                    tempMingArr.push(tempArr.splice(j, 1))

                    tempUmArr.push(tempArr)
                    boolen = true
                }

            }
            if (boolen === false) {
                tempUmArr2.push(finalCombo[i])
            }
        }

        //槓:明變暗
        let tempMingArr2 = []
        for (let i = 0; i < 5; i++) {
            const gongID = "Gong" + (i + 1);
            const mingID = "Ming" + ((i * 3) + 1);
            const gongTile = document.getElementById(mingID).getAttribute('tile')
            let tempArr = mingArr.map((x) => x);

            //console.log(tempArr)


            if (document.getElementById(gongID).getAttribute('gongstatus') !== "No") {

                tempUmArr.forEach(arr => {
                    arr.push([gongTile, gongTile, gongTile])
                })
                tempUmArr2.forEach(arr => {
                    arr.push([gongTile, gongTile, gongTile])
                })

            } else if (gongTile !== "None") {
                tempMingArr2.push(tempArr.splice(i * 3, 3))
            }
        }

        //正確組合
        //TMA2 (無槓) + TUA2 (自摸+槓)
        //TMA2 (無槓) +TMA(出統間) + TUA (槓+暗)  

        //console.table(tempUmArr2)


        let counter = 1
        console.log(tempUmArr2)
        console.table(JSON.stringify(tempUmArr2))
        tempUmArr2.forEach(i => {
            const newDiv = document.createElement("div");
            const newDivName = "finalComboA" + (counter)
            newDiv.id = newDivName
            counter++
            newDiv.className = "finalComboA"


            console.log(newDiv)
            document.getElementById("output-board").appendChild(newDiv)

            newDiv.innerHTML += '<div class = "spacer">明</div>';
            console.log(tempMingArr2)
            console.table(JSON.stringify(tempMingArr2))
            if (tempMingArr2.length > 0) {
                // tempMingArr2.forEach(j => {
                //     console.log(j)
                //     j.forEach(k => {
                tempMingArr2.forEach(k => {
                    const newSet = document.createElement("div");
                    newSet.className = "newSet"
                    document.getElementById(newDivName).appendChild(newSet)
                    k.forEach(l => {
                        newSet.innerHTML += '<div id="Temp" class="output-tile"></div>';
                        const Temp = document.getElementById('Temp')
                        Temp.style.backgroundImage = 'url(images/' + l + '.svg)';
                        Temp.style.backgroundRepeat = "no-repeat";
                        Temp.style.borderColor = "rgb(58, 58, 60)";
                        Temp.setAttribute('tile', l)
                        Temp.setAttribute('id', 'none')
                    })
                })
                newDiv.innerHTML += '<div class = "spacer"></div>';

                //})
            }
            newDiv.innerHTML += '<div class = "spacer">暗</div>';
            console.log(i)
            // i.forEach(j =>{
            //     console.log(j)
            //     j.forEach(k=>{
            i.forEach(k => {
                const newSet = document.createElement("div");
                newSet.className = "newSet"
                document.getElementById(newDivName).appendChild(newSet)
                k.forEach(l => {
                    newSet.innerHTML += '<div id="Temp" class="output-tile"></div>';
                    const Temp = document.getElementById('Temp')
                    Temp.style.backgroundImage = 'url(images/' + l + '.svg)';
                    Temp.style.backgroundRepeat = "no-repeat";
                    Temp.style.borderColor = "rgb(58, 58, 60)";
                    Temp.setAttribute('tile', l)
                    Temp.setAttribute('id', 'none')

                })


                // })

            })
            newDiv.innerHTML += '<div class = "spacer"></div><p>';
            //calc area
            const calcDiv = document.createElement("div");
            calcDiv.id = "Calc-" + (newDivName)
            calcDiv.className = "finalComboACalc"
            document.getElementById(newDivName).appendChild(calcDiv)

            if (liguCheck === true) {
                calcFarn(tempMingArr2, i, calcDiv, 'ligu')
            } else {
                calcFarn(tempMingArr2, i, calcDiv, 'no')
            }
        })

        console.log(tempUmArr)
        console.table(JSON.stringify(tempUmArr))
        for (let i = 0; i < tempUmArr.length; i++) {

            const newDiv = document.createElement("div");
            const newDivName = "finalComboA" + (counter)
            newDiv.id = newDivName
            counter++
            newDiv.className = "finalComboA"


            console.log(newDiv)
            document.getElementById("output-board").appendChild(newDiv)

            newDiv.innerHTML += '<div class = "spacer">明</div>';
            console.log(tempMingArr2)
            console.table(JSON.stringify(tempMingArr2))
            if (tempMingArr2.length > 0) {
                // tempMingArr2.forEach(j => {
                //     console.log(j)
                //     j.forEach(k => {
                tempMingArr2.forEach(k => {
                    const newSet = document.createElement("div");
                    newSet.className = "newSet"
                    document.getElementById(newDivName).appendChild(newSet)
                    k.forEach(l => {
                        newSet.innerHTML += '<div id="Temp" class="output-tile"></div>';
                        const Temp = document.getElementById('Temp')
                        Temp.style.backgroundImage = 'url(images/' + l + '.svg)';
                        Temp.style.backgroundRepeat = "no-repeat";
                        Temp.style.borderColor = "rgb(58, 58, 60)";
                        Temp.setAttribute('tile', l)
                        Temp.setAttribute('id', 'none')
                    })
                })
                newDiv.innerHTML += '<div class = "spacer"></div>';

                //})
            }
            //tempMingArr(出統間)
            console.log(tempMingArr[i])
            tempMingArr[i].forEach(k => {
                const newSet = document.createElement("div");
                newSet.className = "newSet"
                document.getElementById(newDivName).appendChild(newSet)
                k.forEach(l => {
                    newSet.innerHTML += '<div id="Temp" class="output-tile"></div>';
                    const Temp = document.getElementById('Temp')
                    Temp.style.backgroundImage = 'url(images/' + l + '.svg)';
                    Temp.style.backgroundRepeat = "no-repeat";
                    Temp.style.borderColor = "rgb(58, 58, 60)";
                    Temp.setAttribute('tile', l)
                    Temp.setAttribute('id', 'none')
                })
            })
            newDiv.innerHTML += '<div class = "spacer"></div>';

            newDiv.innerHTML += '<div class = "spacer">暗</div>';
            console.log(tempUmArr[i])
            // i.forEach(j =>{
            //     console.log(j)
            //     j.forEach(k=>{
            tempUmArr[i].forEach(k => {
                const newSet = document.createElement("div");
                newSet.className = "newSet"
                document.getElementById(newDivName).appendChild(newSet)
                k.forEach(l => {
                    newSet.innerHTML += '<div id="Temp" class="output-tile"></div>';
                    const Temp = document.getElementById('Temp')
                    Temp.style.backgroundImage = 'url(images/' + l + '.svg)';
                    Temp.style.backgroundRepeat = "no-repeat";
                    Temp.style.borderColor = "rgb(58, 58, 60)";
                    Temp.setAttribute('tile', l)
                    Temp.setAttribute('id', 'none')

                })


                // })

            })
            newDiv.innerHTML += '<div class = "spacer"></div><p>';
            //calc area
            const calcDiv = document.createElement("div");
            calcDiv.id = "Calc-" + (newDivName)
            calcDiv.className = "finalComboACalc"
            document.getElementById(newDivName).appendChild(calcDiv)

            let combineMingArr = [].concat(tempMingArr2, tempMingArr[i])

            console.log(combineMingArr)

            if (liguCheck === true) {
                calcFarn(combineMingArr, tempUmArr[i], calcDiv, 'ligu')
            } else {
                calcFarn(combineMingArr, tempUmArr[i], calcDiv, 'no')
            }

        }


        //const newContent = document.createTextNode(JSON.stringify(finalCombo[i]))
        //newDiv.appendChild(newContent)
        //document.getElementById("output-board").appendChild(newDiv)

        let maxFarn = {}
        document.querySelectorAll(".totalsum").forEach(i => {
            maxFarn[i.id] = i.textContent;
        })
        console.log(maxFarn)
        maxFarnID = (Object.keys(maxFarn).reduce((a, b) => maxFarn[a] > maxFarn[b] ? a : b))
        maxFarnID = maxFarnID.substring(0, maxFarnID.length - 3)
        const clone = document.getElementById(maxFarnID).cloneNode(true)
        document.getElementById('output').appendChild(clone)




    }



    function yiu13(y13arr) {
        const arr = ['East', 'South', 'West', 'North', 'Green', 'Red', 'White', '1B', '9B', '1C', '9C', '1D', '9D'];
        let wuArr = y13arr.map(x => x)

        if (arr.every(val => wuArr.includes(val))) {
            arr.forEach(i => {
                wuArr.splice(wuArr.indexOf(i), 1)
                //wuArr = wuArr.filter(x => x !== i)
            })
            wuArr.sort
            let combo = findAllPosCombo(wuArr)
            console.log(combo)
            if (combo.length > 0) {
                for (let i = 0; i < combo.length; i++) {

                    let tempArr = wuArr.map(x => x)

                    if ((combo[i][0] === combo[i][1] && combo[i][1] === combo[i][2]) || (+combo[i][0].substring(0, 1) + 1 === +combo[i][1].substring(0, 1) && +combo[i][1].substring(0, 1) + 1 === +combo[i][2].substring(0, 1))) {
                        tempArr.splice(tempArr.indexOf(combo[i][0]), 1)
                        tempArr.splice(tempArr.indexOf(combo[i][1]), 1)
                        tempArr.splice(tempArr.indexOf(combo[i][2]), 1)
                        if (arr.includes(tempArr[0])) {
                            return true;
                        }
                    }
                }
            }
        }
    }

    function dap16(d16arr) {
        const arr = ['East', 'South', 'West', 'North', 'Green', 'Red', 'White'];
        let wuArr = d16arr.map(x => x)

        if (arr.every(val => wuArr.includes(val))) {

            arr.forEach(i => {
                wuArr.splice(wuArr.indexOf(i), 1)
                //wuArr = wuArr.filter(x => x !== i)
            })
            wuArr.sort
            if (wuArr.length === 10) {

                //check if eye is one of the 7 tile
                let wuArr2 = wuArr.filter(item => !arr.includes(item))


                let counter = 0;
                uniq = [...new Set(wuArr2)];


                ['B', 'C', 'D'].forEach(i => {

                    temp = uniq.filter(x => x.substring(1, 2) === i)

                    if (temp.length === 3) {
                        if (+temp[0].substring(0, 1) + 2 < +temp[1].substring(0, 1) && +temp[1].substring(0, 1) + 2 < +temp[2].substring(0, 1)) {
                            counter++
                        }
                    }

                })

                if (counter === 3) {
                    return true;
                }



            }
        }
    }


    function ligu(wuArr) {
        let dui = 0
        let eye = false
        let count = {}
        wuArr.forEach(tile => {
            count[tile] = (count[tile] || 0) + 1;
        });
        console.log(count)
        Object.values(count).forEach(val => {
            if (val === 2) {
                dui++
            } else if (val === 3) {
                eye = true
            } else if (val === 4) {
                dui++
                dui++
            }
        })
        if (eye === true && dui === 7) {
            return true;
        }

    }

    function calcFarn(ming, um, calcDiv, specialWu) {
        //花字
        let 花 = 0
        let 正花 = 0
        let 風 = 0
        let 正位風 = 0
        let 正圈風 = 0
        let 字 = 0
        let 位 = 0
        let 三元牌 = 0
        let 風牌 = 0
        let 無花 = false
        let 自摸 = false
        let 無字 = false
        let 門清 = false
        let 聽 = false
        let 無字花 = false
        let 對對胡 = false
        let 槓 = 0
        let 暗槓 = 0
        let rF = 0
        let bF = 0
        let 么 = false
        let n, t, t2, t3
        const wuTile = document.getElementById('Wu1').getAttribute('tile')
        const umArr = ([].slice.call(document.getElementsByClassName("box")).map(x => x.getAttribute('tile'))).filter(a => a !== 'None')
        const fullArr = [].concat(ming, um)
        const flatArr = fullArr.flat()
        console.table(JSON.stringify(ming))
        console.table(JSON.stringify(um))
        console.table(JSON.stringify(fullArr))

        console.log(ming)
        console.log(um)

        //底唔計入雞
        populateChickenFarn('底', calcDiv, 1)


        if (specialWu === 'yiu13') {
            populateFarn('十三么', calcDiv, 1)
            //十三飛
            uniq = [...new Set(umArr)];
            if (uniq.length === 16) {
                populateFarn('十三飛', calcDiv, 1)
            }
        } else if (specialWu === 'dap16') {
            populateFarn('十六不搭', calcDiv, 1)
            //十六飛
            uniq = [...new Set(umArr)];
            if (uniq.length === 16) {
                populateFarn('不搭十六飛', calcDiv, 1)
            }
            //三相逢
            let dap16arr = um.map(x => x)
            let tilearr = ['East', 'South', 'West', 'North', 'Green', 'Red', 'White']
            tilearr.forEach(i => {
                dap16arr = dap16arr.filter(x => x !== i)
            })

            uniq = [...new Set(dap16arr)];

            let dap16arr2 = uniq.map(x => x.substring(0, 1))
            dap16arr2.sort
            count = []
            dap16arr2.forEach(tile => {
                count[tile] = (count[tile] || 0) + 1;
            });

            console.log(count)


            if (Object.values(count).every(x => x === 3)) {
                populateFarn('不搭三相逢', calcDiv, 1)
            }

            //雜龍
            if (Object.values(count).every(x => x === 1)) {
                populateFarn('不搭雜龍', calcDiv, 1)
            }

        } else if (specialWu === 'liguOnly' || specialWu === 'ligu') {
            populateFarn('嚦咕嚦咕', calcDiv, 1)
            if (specialWu === 'liguOnly') {
                count = []
                um.forEach(tile => {
                    count[tile] = (count[tile] || 0) + 1;
                });
                //般
                let bungo = []
                Object.keys(count).forEach(val => {
                    if (count[val] === 2 || count[val] === 4) {
                        if (val.length === 2) {
                            bungo.push(val)
                        }
                    }
                })
                console.log(bungo)
                combo = 0
                bungo.sort
                bungo.forEach(i => {
                    if (bungo.includes((+i.substring(0, 1) + 1) + i.substring(1, 2)) && bungo.includes((+i.substring(0, 1) + 2) + i.substring(1, 2))) {
                        combo++
                    }
                })
                if (combo > 0) {
                    populateFarn('般高', calcDiv, combo)
                }

                //四歸一
                Object.values(count).forEach(val => {
                    if (val === 4) {
                        populateFarn('嚦咕嚦咕四歸一', calcDiv, 1)
                    }
                })
                //小三兄弟
                let larr = Object.keys(count)
                larr.sort
                let eye = Object.keys(count).find(k => count[k] === 3)
                console.log(eye)
                console.log(larr)
                if (eye.length === 2) {
                    n = eye.substring(0, 1)
                    t = eye.substring(1, 2)
                    if (t === 'B') {
                        t2 = 'C', t3 = 'D'
                    }
                    if (t === 'C') {
                        t2 = 'B', t3 = 'D'
                    }
                    if (t === 'D') {
                        t2 = 'C', t3 = 'B'
                    }
                    if (larr.includes(n + t2) && larr.includes(n + t3)) {
                        populateFarn('嚦咕嚦咕小三兄弟', calcDiv, 1)
                    }
                    //小三姊妹
                    if (larr.includes((+n - 2) + t) && larr.includes((+n - 1) + t)) {
                        populateFarn('嚦咕嚦咕小三姊妹', calcDiv, 1)
                    }
                    if (larr.includes((+n - 1) + t) && larr.includes((+n + 1) + t)) {
                        populateFarn('嚦咕嚦咕小三姊妹', calcDiv, 1)
                    }
                    if (larr.includes((+n + 1) + t) && larr.includes((+n + 2) + t)) {
                        populateFarn('嚦咕嚦咕小三姊妹', calcDiv, 1)
                    }



                    //小四喜
                } else {
                    if (['East', 'South', 'West', 'North'].includes(eye)) {
                        if (larr.includes('East') && larr.includes('South') && larr.includes('West') && larr.includes('North')) {
                            populateFarn('嚦咕嚦咕小四喜', calcDiv, 1)
                        }
                    }
                    //小三元
                    if (['Green', 'Red', 'White'].includes(eye)) {
                        if (larr.includes('Green') && larr.includes('Red') && larr.includes('White') ) {
                            populateFarn('嚦咕嚦咕小三元', calcDiv, 1)
                        }
                    }
                }





                //八飛
                count = []
                umArr.forEach(tile => {
                    count[tile] = (count[tile] || 0) + 1;
                });
                if (Object.values(count).every(x => x === 2)) {
                    populateFarn('嚦咕嚦咕八飛', calcDiv, 1)
                }
            }
        }

        //莊唔計入雞
        if (document.getElementById('莊連').value >= 0) {
            calcDiv.innerHTML += '<div>莊連</div><div class="c_sum">' + (+((document.getElementById('莊連').value) * 2) + 1) + '</div>';
        }

        if (ming.length === 0) {
            門清 = true
        }
        if (document.getElementById('自摸').checked) {
            自摸 = true
        }
        if (document.getElementById('聽牌').value === "立直" || document.getElementById('聽牌').value === "天聽") {
            聽 = true
        }

        let 半求人 = false
        if (ming.length === 5) {
            if (自摸 === true) {
                populateFarn('半求人', calcDiv, 1)
                半求人 = true
            } else {
                populateFarn('全求人', calcDiv, 1)
            }
        }

        if (門清 === true) {
            if (自摸 !== true && 聽 !== true) {
                populateFarn('門清', calcDiv, 1)
            }
            if (自摸 === true && specialWu === 'No') {
                populateFarn('門清自摸', calcDiv, 1)
            } else {
                //奇牌必須門清
                populateFarn('自摸', calcDiv, 1)
            }
            if (聽 === true) {
                if (document.getElementById('聽牌').value === "天聽") {

                    populateFarn('天聽', calcDiv, 1)
                } else {
                    populateFarn('門清聽', calcDiv, 1)
                }
            }
        } else {
            if (自摸 === true && document.getElementById('wuSpeed').value !== '海底撈月') {
                if (半求人 === false) {
                    populateFarn('自摸', calcDiv, 1)
                }
            }
            if (聽 === true) {
                populateFarn('聽', calcDiv, 1)
            }
        }
        //一發唔計入雞
        if (document.getElementById('一發').checked) {
            populateChickenFarn('一發', calcDiv, 1)
        }
        if (document.getElementById('搶槓').checked) {
            populateFarn('搶槓', calcDiv, 1)
        }
        //時序唔計入雞
        if (document.getElementById('wuSpeed').value !== '無') {
            populateChickenFarn(document.getElementById('wuSpeed').value, calcDiv, 1)
        }

        if (document.getElementById('eatway').value !== '無') {
            populateFarn(document.getElementById('eatway').value, calcDiv, 1)
        }

        if (document.getElementById('絕章').value !== '無') {
            populateFarn(document.getElementById('絕章').value, calcDiv, 1)
        }

        if (document.getElementById('花上').value > 0) {
            populateFarn('花上胡', calcDiv, document.getElementById('花上').value)
        }

        if (document.getElementById('槓上').value > 0) {
            populateFarn('槓上胡', calcDiv, document.getElementById('槓上').value)
        }

        for (let i = 0; i < 5; i++) {
            let gongID = "Gong" + (i + 1)
            if (document.getElementById(gongID).getAttribute('gongstatus') === "Um") {
                槓++
                暗槓++
            } else if (document.getElementById(gongID).getAttribute('gongstatus') === "Ming") {
                槓++
            }
        }
        if (槓 > 0) {
            populateFarn('明槓', calcDiv, 槓)
        }
        if (暗槓 > 0) {
            populateFarn('暗槓', calcDiv, 暗槓)
        }





        switch (document.getElementById('wind').value) {
            case '東':
                風 = 1;
                console.log(風);
                break;
            case '南':
                風 = 2;
                console.log(風);
                break;
            case '西':
                風 = 3;
                console.log(風);
                break;
            case '北':
                風 = 4;
                console.log(風);
                break;
        }

        switch (document.getElementById('place').value) {
            case '東':
                位 = 1;
                console.log(位);
                break;
            case '南':
                位 = 2;
                console.log(位);
                break;
            case '西':
                位 = 3;
                console.log(位);
                break;
            case '北':
                位 = 4;
                console.log(位);
                break;
        }


        for (let i = 0; i < 8; i++) {
            const fa = "Fa" + (i + 1)
            const redFa = ['R1', 'R2', 'R3', 'R4']
            const blueFa = ['B1', 'B2', 'B3', 'B4']


            if (redFa.includes(document.getElementById(fa).getAttribute('tile'))) {
                rF++
            } else if (blueFa.includes(document.getElementById(fa).getAttribute('tile'))) {
                bF++
            }

            console.log(document.getElementById(fa).getAttribute('tile'));
            if (+((document.getElementById(fa).getAttribute('tile')).substring(1, 2)) === 位) {
                花++
                正花++
            } else if (document.getElementById(fa).getAttribute('tile') !== "None") {
                花++
            }
        }

        if (花 === 0) {
            //無字花
            無花 = true

            //calcDiv.innerHTML += '<div>無花</div><div class="sum">' + document.getElementById('無花f').textContent + '</div>';
        } else {
            populateFarn('花', calcDiv, 花)
            populateFarn('正花', calcDiv, 正花)
            //calcDiv.innerHTML += '<div>花</div><div class="sum">' + (+document.getElementById('花f').textContent * 花) + '</div>';
            //calcDiv.innerHTML += '<div>正花</div><div class="sum">' + (+document.getElementById('正花f').textContent * 正花) + '</div>';
        }

        //字
        count = {}
        flatArr.forEach(tile => {
            count[tile] = (count[tile] || 0) + 1;
        });

        console.log(count)

        let arr, arr2, arr3
        arr = ['Green', 'White', 'Red'];
        const 三元 = Object.keys(count)
            .filter(key => arr.includes(key))
            .reduce((obj, key) => {
                obj[key] = count[key];
                return obj;
            }, {});

        console.log(三元)
        console.log(Object.values(三元))

        if (Object.values(三元).length === 3 && specialWu === 'no') {
            if (Object.values(三元).every(e => e === 3)) {
                populateFarn('大三元', calcDiv, 1)
            } else {
                populateFarn('小三元', calcDiv, 1)
            }
        }
        字 += ((Object.values(三元)).filter(a => a === 3)).length
        三元牌 += ((Object.values(三元)).filter(a => a === 3)).length

        arr = ['East', 'South', 'West', 'North'];
        const 四喜 = Object.keys(count)
            .filter(key => arr.includes(key))
            .reduce((obj, key) => {
                obj[key] = count[key];
                return obj;
            }, {});

        console.log(四喜)
        console.log(Object.values(四喜))

        if ((Object.values(四喜)).length === 0 && (Object.values(三元)).length === 0) {
            無字 = true
            console.log("無字CHECK")
        }

        if (Object.values(四喜).length === 3 && specialWu === 'no') {
            if (Object.values(四喜).every(e => e === 3)) {
                populateFarn('大三風', calcDiv, 1)
            } else {
                populateFarn('小三風', calcDiv, 1)
            }
        }
        if (Object.values(四喜).length === 4 && specialWu === 'no') {
            if (Object.values(四喜).every(e => e === 3)) {
                populateFarn('大四喜', calcDiv, 1)
            } else {
                populateFarn('小四喜', calcDiv, 1)
            }
        }
        字 += ((Object.values(四喜)).filter(a => a === 3)).length
        風牌 += ((Object.values(四喜)).filter(a => a === 3)).length

        if (四喜['East'] === 3) {
            if (風 === 1) {
                正圈風++
            }
            if (位 === 1) {
                正位風++
            }
        }
        if (四喜['South'] === 3) {
            if (風 === 2) {
                正圈風++
            }
            if (位 === 2) {
                正位風++
            }
        }
        if (四喜['West'] === 3) {
            if (風 === 3) {
                正圈風++
            }
            if (位 === 3) {
                正位風++
            }
        }
        if (四喜['North'] === 3) {
            if (風 === 4) {
                正圈風++
            }
            if (位 === 4) {
                正位風++
            }
        }

        if (無字 === true) {
            if (無花 === true) {
                無字花 = true
            } else {
                populateFarn('無字', calcDiv, 1)
            }

        } else {
            if (無花 === true) {
                populateFarn('無花', calcDiv, 1)
            }
            if (三元牌 > 0) {
                populateFarn('三元牌', calcDiv, 三元牌)
            }
            if (風牌 > 0) {
                populateFarn('風牌', calcDiv, 風牌)
            }
            if (正圈風 > 0) {
                populateFarn('正圈風', calcDiv, 正圈風)
            }
            if (正位風 > 0) {
                populateFarn('正位風', calcDiv, 正位風)
            }
        }

        counter = 0
        fullArr.forEach(i => {
            if (i[0] === i[1] && i[0] === i[2]) {
                counter++
            }
        })
        if (counter === 5) {

            對對胡 = true
        }
        if (counter === 0 && specialWu === 'no') {
            if (無字花 === true) {
                populateFarn('大平胡', calcDiv, 1)
            } else {
                populateFarn('平胡', calcDiv, 1)
            }

        } else if (無字花 === true) {
            populateFarn('無字花', calcDiv, 1)
        }

        arr = fullArr.filter(tile => tile.length === 2)
        console.log(arr[0][0])
        if (arr[0][0].substring(0, 1) === '2' || arr[0][0].substring(0, 1) === '5' || arr[0][0].substring(0, 1) === '8') {
            populateFarn('將眼', calcDiv, 1)
        }

        // let 對碰 = false
        // fullArr.forEach(i => {
        //     if (i.includes(wuTile) === true && i[0] === i[1] && i[0] === i[2]) {
        //         對碰 = true
        //     }
        // })
        // if (對碰 === true) {
        //     populateFarn('對碰', calcDiv, 1)
        // }

        //一色
        let 字一色 = false
        arr = ['East', 'South', 'West', 'North', 'Green', 'White', 'Red']
        console.log(字)
        console.log(Object.keys(count).find(key =>
            count[key] === 2))
        if (字 === 5 && arr.includes(Object.keys(count).find(key =>
                count[key] === 2))) {
            populateFarn('字一色', calcDiv, 1)
            字一色 = true
        }


        //get an array of all numbers
        if (specialWu === 'no') {
            arr = []
            fullArr.forEach(i => {
                if (i[0].length === 2) {
                    arr.push(i.map(x => +x.substring(0, 1)))
                }
            });
            console.log(arr)
            if (arr.every(e => e.includes(1) || e.includes(9)) && 字一色 === false) {
                if (對對胡 === true) {
                    if (無字 === true) {
                        populateFarn('清么', calcDiv, 1)
                        么 = true
                    } else {
                        populateFarn('混么', calcDiv, 1)
                    }
                } else {
                    if (無字 === true) {
                        populateFarn('全帶么', calcDiv, 1)
                        么 = true
                    } else {
                        populateFarn('混帶么', calcDiv, 1)
                    }
                }
            }

        }

        if (specialWu !== 'dap16' && specialWu !== 'yiu13') {
            let 混帶counter = 0
            for (let i = 1; i <= 9; i++) {
                ////////////////////////////////////////////////////////////////////check box adjustment here also
                if (arr.every(e => e.includes(i)) && 字一色 === false) {
                    if (無字 === true) {
                        calcDiv.innerHTML += '<div>全帶' + i + '</div><div class="sum">' + (+document.getElementById('全帶f').textContent) + '</div>';
                    } else {
                        calcDiv.innerHTML += '<div>混帶' + i + '</div><div class="sum">' + Math.floor((+document.getElementById('混帶f').textContent) / Math.pow(2, 混帶counter)) + '</div>';
                        混帶counter++
                    }
                }
            }
        }




        arr = flatArr.filter(tile => tile.length === 2)

        arr2 = arr.map(x => x.substring(1, 2))

        count2 = {}
        arr2.forEach(tile => {
            count2[tile] = (count2[tile] || 0) + 1;
        });
        console.log(arr2)
        console.log(count2)
        if (無字 === true && Object.keys(count2).length === 1) {
            populateFarn('清一色', calcDiv, 1)
        } else if (無字 === true && Object.keys(count2).length === 2) {
            populateFarn('缺一門', calcDiv, 1)
        } else if (無字 === false && Object.keys(count2).length === 1 && 字一色 === false) {
            populateFarn('混一色', calcDiv, 1)
        }

        let 大五門 = new Set()
        let 小五門 = new Set()
        let arrFung = ['East', 'South', 'West', 'North']
        let arrYuen = ['Green', 'White', 'Red']
        if (Object.keys(count2).length === 3) {
            fullArr.forEach(i => {

                if (i[0].length === 2) {
                    if (i.length === 3) {
                        大五門.add(i[0].substring(1, 2))
                        小五門.add(i[0].substring(1, 2))
                    } else {
                        小五門.add(i[0].substring(1, 2))
                    }
                } else if (arrFung.includes(i[0])) {
                    if (i.length === 3) {
                        大五門.add('風')
                        小五門.add('風')
                    } else {
                        小五門.add('風')
                    }
                } else if (arrYuen.includes(i[0])) {
                    if (i.length === 3) {
                        大五門.add('元')
                        小五門.add('元')
                    } else {
                        小五門.add('元')
                    }
                }

            })
            let 七門 = false
            if (rF > 0 && bF > 0) {
                七門 = true
            }
            if (大五門.size === 5) {
                if (七門 === true) {
                    populateFarn('大七門齊', calcDiv, 1)
                } else {
                    populateFarn('大五門齊', calcDiv, 1)
                }
            } else if (小五門.size === 5) {
                if (七門 === true) {
                    populateFarn('七門齊', calcDiv, 1)
                } else {
                    populateFarn('五門齊', calcDiv, 1)
                }
            }
        }

        arr3 = []
        arr3 = arr.map(x => x.substring(0, 1))

        console.log(arr3)
        console.log(count2)
        if (arr3.filter(x => x <= 5).length === 0 && 字一色 === false) {
            if (無字 === true) {
                populateFarn('全大', calcDiv, 1)
            } else {
                populateFarn('混全大', calcDiv, 1)
            }
        }
        if (arr3.filter(x => x >= 5).length === 0 && 字一色 === false) {
            if (無字 === true) {
                populateFarn('全小', calcDiv, 1)
            } else {
                populateFarn('混全小', calcDiv, 1)
            }
        }

        if (!arr3.includes('5') && 無字 === true && 么 === false) {
            populateFarn('缺五', calcDiv, 1)
        }

        console.log(arr3.filter(x => x > 5))

        if (!arr3.includes('1') && !arr3.includes('9') && 無字 === true) {
            populateFarn('斷么', calcDiv, 1)
        }

        arr = []
        temp = ''
        fullArr.forEach(i => {
            if (i.length === 3 && i[0] === i[1] && i[0] === i[2]) {
                arr.push(i)
            }
            if (i.length === 2) {
                temp = i[0]
            }
        })

        console.log("眼: " + temp)
        if (arr.length > 0) {
            arr.forEach(tile => {
                count2[tile] = (count2[tile] || 0) + 1;
            });
            arr2 = (arr.map(x => x[0])).sort()
            if (temp !== '') {
                arr2.push(temp)
            }
            console.log(arr2)

            tempArr = arr2.map(x => x)


            while (tempArr.length > 0) {
                let i = tempArr[0]
                //tempArr.forEach(i => {
                arr = []
                n = +(i.substring(0, 1))
                t = i.substring(1, 2)
                if (tempArr.includes((n + 8) + t)) {
                    populateFarn('老少碰', calcDiv, 1, [i + ', ' + ((n + 8) + t)])
                }
                if (tempArr.includes((n + 1) + t)) {
                    arr.push(tempArr.splice(tempArr.indexOf(i), 1)[0])
                    arr.push(tempArr.splice(tempArr.indexOf((n + 1) + t), 1)[0])
                    if (tempArr.includes((n + 2) + t)) {
                        arr.push(tempArr.splice(tempArr.indexOf((n + 2) + t), 1)[0])
                        if (tempArr.includes((n + 3) + t)) {
                            arr.push(tempArr.splice(tempArr.indexOf((n + 3) + t), 1)[0])
                            if (tempArr.includes((n + 4) + t)) {
                                arr.push(tempArr.splice(tempArr.indexOf((n + 4) + t), 1)[0])
                                if (tempArr.includes((n + 5) + t)) {
                                    arr.push(tempArr.splice(tempArr.indexOf((n + 5) + t), 1)[0])
                                    populateFarn('全連碰', calcDiv, 1, arr)
                                } else if (arr.includes(temp)) {
                                    populateFarn('小五姊妹', calcDiv, 1, arr)
                                } else {
                                    populateFarn('五姊妹', calcDiv, 1, arr)
                                }
                            } else if (arr.includes(temp)) {
                                populateFarn('小四姊妹', calcDiv, 1, arr)
                            } else {
                                populateFarn('四姊妹', calcDiv, 1, arr)
                            }
                        } else if (arr.includes(temp)) {
                            populateFarn('小三姊妹', calcDiv, 1, arr)
                        } else {
                            populateFarn('三姊妹', calcDiv, 1, arr)
                        }
                    } else if (!arr.includes(temp)) {
                        populateFarn('姊妹', calcDiv, 1, arr)
                    }
                } else {
                    tempArr.splice(tempArr.indexOf(i), 1)
                }
                console.log(n + t)
                console.log(tempArr)
                console.log(arr)
            }
            //})


            tempArr = arr2.map(x => x)
            console.log(tempArr)
            while (tempArr.length > 0) {
                let i = tempArr[0]
                //tempArr.forEach(i => {
                arr = []
                n = i.substring(0, 1)
                t = i.substring(1, 2)
                if (t === 'B') {
                    t2 = 'C', t3 = 'D'
                }
                if (t === 'C') {
                    t2 = 'B', t3 = 'D'
                }
                if (t === 'D') {
                    t2 = 'C', t3 = 'B'
                }
                if (tempArr.includes(n + t2) && tempArr.includes(n + t3)) {
                    arr.push(tempArr.splice(tempArr.indexOf(i), 1)[0])
                    arr.push(tempArr.splice(tempArr.indexOf(n + t2), 1)[0])
                    arr.push(tempArr.splice(tempArr.indexOf(n + t3), 1)[0])
                    if (arr.includes(temp)) {
                        populateFarn('小三兄弟', calcDiv, 1, arr)
                    } else {
                        populateFarn('大三兄弟', calcDiv, 1, arr)
                    }
                } else if (tempArr.includes(n + t2)) {
                    arr.push(tempArr.splice(tempArr.indexOf(i), 1)[0])
                    arr.push(tempArr.splice(tempArr.indexOf(n + t2), 1)[0])
                    if (!arr.includes(temp)) {
                        populateFarn('兄弟', calcDiv, 1, arr)
                    }
                } else if (tempArr.includes(n + t3)) {
                    arr.push(tempArr.splice(tempArr.indexOf(i), 1)[0])
                    arr.push(tempArr.splice(tempArr.indexOf(n + t3), 1)[0])
                    if (!arr.includes(temp)) {
                        populateFarn('兄弟', calcDiv, 1, arr)
                    }
                } else {
                    tempArr.splice(tempArr.indexOf(i), 1)
                }

            }
            //})


            tempArr = arr2.map(x => x)
            console.log(tempArr)
            //tempArr.forEach(i => {
            while (tempArr.length > 0) {
                let i = tempArr[0]
                let 雜連碰 = 0
                arr = []
                n = +(i.substring(0, 1))
                t = i.substring(1, 2)
                if (t === 'B') {
                    t2 = 'C', t3 = 'D'
                }
                if (t === 'C') {
                    t2 = 'B', t3 = 'D'
                }
                if (t === 'D') {
                    t2 = 'C', t3 = 'B'
                }
                if (tempArr.includes((n + 1) + t2) && tempArr.includes((n + 2) + t3)) {
                    arr.push(i)
                    arr.push(tempArr[tempArr.indexOf((n + 1) + t2)])
                    arr.push(tempArr[tempArr.indexOf((n + 2) + t3)])
                    if (arr.includes(temp)) {
                        populateFarn('小雜連碰', calcDiv, 1, arr)
                    } else {
                        populateFarn('雜連碰', calcDiv, 1, arr)
                    }
                }
                arr = []
                if (tempArr.includes((n + 1) + t3) && tempArr.includes((n + 2) + t2)) {
                    arr.push(i)
                    arr.push(tempArr[tempArr.indexOf((n + 1) + t3)])
                    arr.push(tempArr[tempArr.indexOf((n + 2) + t2)])
                    if (arr.includes(temp)) {
                        populateFarn('小雜連碰', calcDiv, 1, arr)
                    } else {
                        populateFarn('雜連碰', calcDiv, 1, arr)
                    }
                }
                tempArr.splice(tempArr.indexOf(i), 1)
                //})
            }
        }


        if (specialWu === 'none' || specialWu === 'ligu') {
            let 般高 = false

            arr = []
            temp = ''
            fullArr.forEach(i => {
                if (i.length === 3 && i[0] !== i[1] && i[0] !== i[2]) {
                    arr.push(i)
                }
                if (i.length === 2) {
                    temp = i[0]
                }
            })
            console.log(fullArr)
            console.log(arr)
            //arr = 所有順子
            if (arr.length > 0) {
                tempArr = arr.map(x => x.join(','))
                let tempUmArr = um.map(x => x.join(','))
                console.log(tempArr)
                while (tempArr.length > 0) {
                    arr2 = []
                    let i = tempArr[0]
                    count = tempArr.reduce((n, x) => n + (x === i), 0)
                    //明暗
                    if (count > 1) {
                        let countUm = tempUmArr.reduce((n, x) => n + (x === i), 0)
                        let umCombo = 0
                        if (countUm > 1) {
                            umCombo = nCr(countUm, 2)
                        }
                        let combo = nCr(count, 2) - umCombo

                        //小雙
                        n = +(i.substring(0, 1))
                        t = i.substring(1, 2)
                        if (umCombo > 0) {
                            if (temp === ((n - 1) + t) || temp === ((n + 3) + t)) {
                                //////////////////////////////////////////// to do - check logic here
                                if (wuTile === temp && ((umArr.flat()).filter(x => x === temp)).length === 2 && 自摸 !== true) {
                                    umCombo--
                                    populateFarn('小雙般高', calcDiv, 1, i.split(','))
                                    般高 = true
                                } else {
                                    umCombo--
                                    populateFarn('小雙般高', calcDiv, 1, i.split(','), true)
                                    般高 = true

                                }
                                console.log(wuTile)
                                console.log((umArr.flat()).filter(x => x === temp))

                            }
                        }
                        if (umCombo > 0) {
                            populateFarn('般高', calcDiv, umCombo, i.split(','), true)
                            般高 = true

                        }
                        if (combo > 0) {
                            populateFarn('般高', calcDiv, combo, i.split(','))
                            般高 = true

                        }
                    }
                    tempArr = tempArr.filter(x => x !== i)
                }


                let 三相逢 = false
                let 兩相逢 = false
                let 全姊妹 = false
                //arr = 所有順子
                tempArr = arr.map(x => x.join(','))
                while (tempArr.length > 0) {
                    let tempUmArr = um.map(x => x.join(','))
                    arr2 = []
                    let i = tempArr[0]
                    n = +(i.substring(0, 1))
                    t = i.substring(1, 2)
                    if (t === 'B') {
                        t2 = 'C', t3 = 'D'
                    }
                    if (t === 'C') {
                        t2 = 'B', t3 = 'D'
                    }
                    if (t === 'D') {
                        t2 = 'C', t3 = 'B'
                    }
                    let t2Arr = i.replaceAll(t, t2)
                    let t3Arr = i.replaceAll(t, t3)
                    console.log(t2Arr)
                    console.log(t3Arr)

                    let combo, umCombo

                    if (tempArr.includes(t2Arr) && tempArr.includes(t3Arr)) {
                        combo = tempArr.filter(x => x === i).length * tempArr.filter(x => x === t2Arr).length * tempArr.filter(x => x === t3Arr).length
                        let comboLength = tempArr.filter(x => x === i).length + tempArr.filter(x => x === t2Arr).length + tempArr.filter(x => x === t3Arr).length
                        if (tempUmArr.includes(i) && tempUmArr.includes(t2Arr) && tempUmArr.includes(t3Arr)) {
                            umCombo = tempUmArr.filter(x => x === i).length * tempUmArr.filter(x => x === t2Arr).length * tempUmArr.filter(x => x === t3Arr).length
                            combo -= umCombo
                            populateFarn('三相逢', calcDiv, umCombo, i.split(','), true)
                        } else {
                            populateFarn('三相逢', calcDiv, combo, i.split(','))
                        }
                        三相逢 = true
                        tempArr = tempArr.filter(x => x !== i)
                        tempArr = tempArr.filter(x => x !== t2Arr)
                        tempArr = tempArr.filter(x => x !== t3Arr)

                        let tempArr2 = tempArr.map(x => x)
                        count = tempArr2.reduce((n, x) => n + (x === tempArr2[0]), 0)

                        if (count > 1 || comboLength === 5) {
                            全姊妹 = true
                        }





                    } else if (tempArr.includes(t2Arr)) {
                        combo = tempArr.filter(x => x === i).length * tempArr.filter(x => x === t2Arr).length
                        populateFarn('兩相逢', calcDiv, combo, i.split(','))
                        兩相逢 = true

                    } else if (tempArr.includes(t3Arr)) {
                        combo = tempArr.filter(x => x === i).length * tempArr.filter(x => x === t3Arr).length
                        populateFarn('兩相逢', calcDiv, combo, i.split(','))
                        兩相逢 = true
                    }
                    tempArr = tempArr.filter(x => x !== i)
                    tempArr = tempArr.filter(x => x !== t2Arr)
                    tempArr = tempArr.filter(x => x !== t3Arr)

                }

                if (全姊妹 === true || (兩相逢 === true && 三相逢 === true)) {
                    populateFarn('全姊妹', calcDiv, 1)
                }

                //arr = 所有順子
                tempArr = arr.map(x => x.join(','))
                while (tempArr.length > 0) {
                    let tempUmArr = um.map(x => x.join(','))
                    arr2 = []
                    let i = tempArr[0]
                    n = +(i.substring(0, 1))
                    t = i.substring(1, 2)
                    if (t === 'B') {
                        t2 = 'C', t3 = 'D'
                    }
                    if (t === 'C') {
                        t2 = 'B', t3 = 'D'
                    }
                    if (t === 'D') {
                        t2 = 'C', t3 = 'B'
                    }
                    let temp
                    let t1Arr = i
                    let t1Arr2 = i
                    let t2Arr = i.replaceAll(t, t2)
                    let t2Arr2 = i.replaceAll(t, t2)
                    let t3Arr = i.replaceAll(t, t3)
                    let t3Arr2 = i.replaceAll(t, t3)
                    for (let j = 9; j >= 0; j--) {
                        t1Arr = t1Arr.replaceAll(j, j + 1)
                        t1Arr2 = t1Arr2.replaceAll(j, j + 2)
                        t2Arr = t2Arr.replaceAll(j, j + 1)
                        t2Arr2 = t2Arr2.replaceAll(j, j + 2)
                        t3Arr = t3Arr.replaceAll(j, j + 1)
                        t3Arr2 = t3Arr2.replaceAll(j, j + 2)
                    }
                    //will return [#明步, #暗步, 明暗]
                    temp = bobogo(i, t1Arr, t1Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('同色步步高', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('同色步步高', calcDiv, temp[0], i.split(','))
                            }
                        } else if (temp[2] === 'Ming') {
                            populateFarn('同色步步高', calcDiv, temp[0], i.split(','))
                        }
                    }

                    temp = bobogo(i, t2Arr, t3Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('步步高', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('步步高', calcDiv, temp[0], i.split(','))
                            }
                        } else if (temp[2] === 'Ming') {
                            populateFarn('步步高', calcDiv, temp[0], i.split(','))
                        }
                    }
                    temp = bobogo(i, t3Arr, t2Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('步步高', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('步步高', calcDiv, temp[0], i.split(','))
                            }
                        } else if (temp[2] === 'Ming') {
                            populateFarn('步步高', calcDiv, temp[0], i.split(','))
                        }
                    }

                    //二步高
                    t1Arr = i
                    t1Arr2 = i
                    t2Arr = i.replaceAll(t, t2)
                    t2Arr2 = i.replaceAll(t, t2)
                    t3Arr = i.replaceAll(t, t3)
                    t3Arr2 = i.replaceAll(t, t3)
                    for (let j = 9; j >= 0; j--) {
                        t1Arr = t1Arr.replaceAll(j, j + 2)
                        t1Arr2 = t1Arr2.replaceAll(j, j + 4)
                        t2Arr = t2Arr.replaceAll(j, j + 2)
                        t2Arr2 = t2Arr2.replaceAll(j, j + 4)
                        t3Arr = t3Arr.replaceAll(j, j + 2)
                        t3Arr2 = t3Arr2.replaceAll(j, j + 4)
                    }
                    //will return [#明步, #暗步, 明暗]
                    temp = bobogo(i, t1Arr, t1Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('同色二步高', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('同色二步高', calcDiv, temp[0], i.split(','))
                            }
                        } else if (temp[2] === 'Ming') {
                            populateFarn('同色二步高', calcDiv, temp[0], i.split(','))
                        }
                    }

                    temp = bobogo(i, t2Arr, t3Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('二步高', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('二步高', calcDiv, temp[0], i.split(','))
                            }
                        } else if (temp[2] === 'Ming') {
                            populateFarn('二步高', calcDiv, temp[0], i.split(','))
                        }
                    }
                    temp = bobogo(i, t3Arr, t2Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('二步高', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('二步高', calcDiv, temp[0], i.split(','))
                            }
                        } else if (temp[2] === 'Ming') {
                            populateFarn('二步高', calcDiv, temp[0], i.split(','))
                        }
                    }

                    //龍
                    let 龍 = false
                    t1Arr = i
                    t1Arr2 = i
                    t2Arr = i.replaceAll(t, t2)
                    t2Arr2 = i.replaceAll(t, t2)
                    t3Arr = i.replaceAll(t, t3)
                    t3Arr2 = i.replaceAll(t, t3)
                    for (let j = 9; j >= 0; j--) {
                        t1Arr = t1Arr.replaceAll(j, j + 3)
                        t1Arr2 = t1Arr2.replaceAll(j, j + 6)
                        t2Arr = t2Arr.replaceAll(j, j + 3)
                        t2Arr2 = t2Arr2.replaceAll(j, j + 6)
                        t3Arr = t3Arr.replaceAll(j, j + 3)
                        t3Arr2 = t3Arr2.replaceAll(j, j + 6)
                    }
                    //will return [#明步, #暗步, 明暗]
                    temp = bobogo(i, t1Arr, t1Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('清龍', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('清龍', calcDiv, temp[0], i.split(','))
                            }
                            龍 = true
                        } else if (temp[2] === 'Ming') {
                            populateFarn('清龍', calcDiv, temp[0], i.split(','))
                            龍 = true
                        }
                    }

                    temp = bobogo(i, t2Arr, t3Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('雜龍', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('雜龍', calcDiv, temp[0], i.split(','))
                            }
                        } else if (temp[2] === 'Ming') {
                            populateFarn('雜龍', calcDiv, temp[0], i.split(','))
                        }
                    }
                    temp = bobogo(i, t3Arr, t2Arr2, tempArr, tempUmArr)
                    if (temp[0] > 0 || temp[1] > 0) {
                        if (temp[2] === 'Um') {
                            populateFarn('雜龍', calcDiv, temp[1], i.split(','), true)
                            if (temp[0] > 0) {
                                populateFarn('雜龍', calcDiv, temp[0], i.split(','))
                            }
                        } else if (temp[2] === 'Ming') {
                            populateFarn('雜龍', calcDiv, temp[0], i.split(','))
                        }
                    }

                    if (+i.substring(0, 1) === 1) {
                        temp = i.replace(1, 7)
                        temp = temp.replace(2, 8)
                        temp = temp.replace(3, 9)
                        console.log(temp)
                        if (tempArr.includes(temp) && 龍 === false) {
                            count = tempArr.filter(x => x === i).length * tempArr.filter(x => x === temp).length
                            populateFarn('老少', calcDiv, count, i.split(','))
                        }

                    }

                    tempArr = tempArr.filter(x => x !== i)
                }


            }
        }







        let 坎坎胡 = false

        arr = []
        console.log(um)
        um.forEach(i => {
            if (i.length === 3 && i[0] === i[1] && i[0] === i[2]) {
                arr.push(i[0])
            }
        })
        console.log(arr)
        if (槓 === 5) {
            populateFarn('十八羅漢', calcDiv, 1)
        } else {

            if (arr.length === 2) {
                populateFarn('二暗刻', calcDiv, 1)
            }
            if (arr.length === 3) {
                populateFarn('三暗刻', calcDiv, 1)
            }
            if (arr.length === 4) {
                populateFarn('四暗刻', calcDiv, 1)
            }
            if (arr.length === 5) {
                if (自摸 === true & 槓 === 0) {
                    populateFarn('坎坎胡', calcDiv, 1)
                    坎坎胡 = true
                } else {
                    populateFarn('五暗刻', calcDiv, 1)
                }
            }
        }

        if (坎坎胡 === false && 對對胡 === true && 字一色 === false) {
            populateFarn('對對胡', calcDiv, 1)
        }

        count = []
        flatArr.forEach(tile => {
            count[tile] = (count[tile] || 0) + 1;
        });
        temp = Object.keys(count).filter(key => count[key] === 4)
        console.table(count)
        console.log(temp)

        temp.forEach(i => {
            let temp2 = false
            combo = 0
            fullArr.forEach(j => {
                if (j.includes(i)) {
                    combo++
                }
            })
            umCombo = 0
            um.forEach(j => {
                if (j.includes(i)) {
                    umCombo++
                }
            })
            console.log(fullArr)
            console.log(um)
            if (umCombo === combo) {
                temp2 = true
            }
            if (specialWu !== 'liguOnly'){
            if (combo === 2) {
                populateFarn('四歸一', calcDiv, 1, [i], temp2)
            } else if (combo === 3) {
                populateFarn('四歸二', calcDiv, 1, [i], temp2)
            } else if (combo === 4) {
                populateFarn('四歸四', calcDiv, 1, [i], temp2)
            }
        }
        })

        let sum = 0
        document.querySelectorAll("#" + calcDiv.id + "> .sum").forEach(s => {
            sum += Number(s.textContent)
        })


        if (自摸 === true && sum <= 3) {
            if (花 === 1 || 無花 === true) {
                calcDiv.innerHTML += '<div>自摸雞胡</div><div class="c_sum">' + ((+document.getElementById('自摸雞胡f').textContent) - sum) + '</div>';
            }
        } else if (sum <= 2) {
            if (花 === 1 || 無花 === true) {
                calcDiv.innerHTML += '<div>雞胡</div><div class="c_sum">' + ((+document.getElementById('雞胡f').textContent) - sum) + '</div>';
            }
        }

        //加回雞唔用嘅番
        document.querySelectorAll("#" + calcDiv.id + "> .c_sum").forEach(s => {
            sum += Number(s.textContent)
        })

        calcDiv.innerHTML += '<div class="total">總番數</div><div class="totalsum" id="' + calcDiv.id + 'sum">' + sum + '</div>';



    }

    function bobogo(arr1, arr2, arr3, fullArr, umArr) {
        if (fullArr.includes(arr2) && fullArr.includes(arr3)) {
            let combo = fullArr.filter(x => x === arr1).length * fullArr.filter(x => x === arr2).length * fullArr.filter(x => x === arr3).length;
            if (umArr.includes(arr2) && umArr.includes(arr3)) {
                let umCombo = umArr.filter(x => x === arr1).length * umArr.filter(x => x === arr2).length * umArr.filter(x => x === arr3).length;
                combo -= umCombo;
                return [combo, umCombo, 'Um'];
            } else {
                return [combo, 0, 'Ming'];
            }
        } else {
            return [0, 0, 0];
        }
    }


    function product_Range(a, b) {
        var prd = a,
            i = a;

        while (i++ < b) {
            prd *= i;
        }
        return prd;
    }


    function nCr(n, r) {
        if (n == r || r == 0) {
            return 1;
        } else {
            r = (r < n - r) ? n - r : r;
            return product_Range(r + 1, n) / product_Range(1, n - r);
        }
    }



    function populateChickenFarn(farn, calcDiv, multiplier, stringarr, mingUm) {
        const f = farn + "f"
        const m = farn + "m"

        console.log(farn)
        calcDiv.innerHTML += '<div>' + farn + '</div><div class="c_sum">' + (+document.getElementById(f).textContent) + '</div>';

    }


    function populateFarn(farn, calcDiv, multiplier, stringarr, mingUm) {
        const f = farn + "f"
        const m = farn + "m"
        let u = ''
        let text = ''
        let y = farn + "y"
        let mapObj = {
            B: '索',
            C: '萬',
            D: '筒'
        }
        let umMul = 1
        let ynMul = 1
        let textMul = ''

        if (multiplier > 1) {
            textMul = '[x' + multiplier + ']'
        }

        if (mingUm) {
            u = '暗'
            if (document.getElementById(m).checked) {

                umMul *= 2
            }
        }

        if (document.getElementById(y)) {
            if (!document.getElementById(y).checked) {
                ynMul = 0
            }
        }
        console.log(document.getElementById(y))

        if (stringarr) {
            const temp = (stringarr.flat()).join(',')
            text = temp.replace(/B|C|D/gi, function (i) {
                return mapObj[i]
            })
            console.log(text)

        }
        console.log(farn)
        calcDiv.innerHTML += '<div>' + text + ' ' + u + farn + textMul + '</div><div class="sum">' + (+document.getElementById(f).textContent * multiplier * umMul * ynMul) + '</div>';

    }



    /* arr[]  ---> Input Array
    data[] ---> Temporary array to store current combination
    start & end ---> Starting and Ending indexes in arr[]
    index  ---> Current index in data[]
    r ---> Size of a combination to be printed */
    function combinationUtil(arr, data, start, end, index, r) {
        // Current combination is ready to be printed, print it
        if (index == r) {
            temp = []
            for (let j = 0; j < r; j++) {
                temp.push(data[j]);
            }
            //console.log(temp + "added to combo")

            combinationsCombo.push(temp)



        }

        // replace index with all possible elements. The condition
        // "end-i+1 >= r-index" makes sure that including one element
        // at index will make a combination with remaining elements
        // at remaining positions
        for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
            data[index] = arr[i];
            combinationUtil(arr, data, i + 1, end, index + 1, r);
        }
    }

    // The main function that prints all combinations of size r
    // in arr[] of size n. This function mainly uses combinationUtil()
    function printCombination(arr, n, r) {
        // A temporary array to store all combination one by one
        let data = new Array(r);

        // Print all combination using temporary array 'data[]'
        combinationUtil(arr, data, 0, n - 1, 0, r);
    }





    function findAllPosCombo(Arr) {
        //搵出所有可能組合
        let posCombo = []
        let workingTile = Arr.map((x) => x)
        let count = {}

        workingTile.forEach(tile => {
            count[tile] = (count[tile] || 0) + 1;
        });



        while (workingTile.length > 0) {
            if (count[workingTile[0]] >= 3) {
                //is 碰
                posCombo.push([workingTile[0], workingTile[0], workingTile[0]])
            }
            //番子無上
            if (Number.isInteger(+(workingTile[0].substring(0, 1)))) {
                let number = +(workingTile[0].substring(0, 1))
                const tile = (workingTile[0].substring(1, 2))

                //find if -1, -2, +1 and +2 exist 
                checkNeg1 = workingTile.includes((number - 1) + tile)
                checkNeg2 = workingTile.includes((number - 2) + tile)
                checkPos1 = workingTile.includes((number + 1) + tile)
                checkPos2 = workingTile.includes((number + 2) + tile)
                if (checkNeg1 && checkNeg2) {
                    for (let i = 0; i < count[workingTile[0]]; i++) {

                        posCombo.push([(number - 2) + tile, (number - 1) + tile, number + tile])
                    }

                }
                if (checkNeg1 && checkPos1) {
                    for (let i = 0; i < count[workingTile[0]]; i++) {

                        posCombo.push([(number - 1) + tile, number + tile, (number + 1) + tile])
                    }

                }
                if (checkPos1 && checkPos2) {
                    for (let i = 0; i < count[workingTile[0]]; i++) {

                        posCombo.push([number + tile, (number + 1) + tile, (number + 2) + tile])
                    }

                }
            }
            workingTile = workingTile.filter(i => i !== workingTile[0])



        }
        return posCombo;
    }




    function handleGong(clicked_id) {
        let gongStatus = document.getElementById(clicked_id).getAttribute('gongStatus')

        switch (gongStatus) {
            case 'No':
                switch (clicked_id) {
                    case 'Gong1':
                        cheung = document.getElementById('Ming1').getAttribute('tile')
                        secondTile = document.getElementById('Ming2').getAttribute('tile')
                        thirdTile = document.getElementById('Ming3').getAttribute('tile')
                        break;
                    case 'Gong2':
                        cheung = document.getElementById('Ming4').getAttribute('tile')
                        secondTile = document.getElementById('Ming5').getAttribute('tile')
                        thirdTile = document.getElementById('Ming6').getAttribute('tile')
                        break;
                    case 'Gong3':
                        cheung = document.getElementById('Ming7').getAttribute('tile')
                        secondTile = document.getElementById('Ming8').getAttribute('tile')
                        thirdTile = document.getElementById('Ming9').getAttribute('tile')
                        break;
                    case 'Gong4':
                        cheung = document.getElementById('Ming10').getAttribute('tile')
                        secondTile = document.getElementById('Ming11').getAttribute('tile')
                        thirdTile = document.getElementById('Ming12').getAttribute('tile')
                        break;
                    case 'Gong5':
                        cheung = document.getElementById('Ming13').getAttribute('tile')
                        secondTile = document.getElementById('Ming14').getAttribute('tile')
                        thirdTile = document.getElementById('Ming15').getAttribute('tile')
                        break;
                }
                if (cheung !== 'None') {
                    if (secondTile === cheung && thirdTile === cheung) {
                        document.getElementById(clicked_id).setAttribute('gongStatus', "Ming");
                        document.getElementById(clicked_id).style.backgroundImage = 'url(images/' + cheung + '.svg)';
                    }
                }
                break;
            case 'Ming':
                document.getElementById(clicked_id).setAttribute('gongStatus', "Um");
                document.getElementById(clicked_id).style.backgroundImage = 'url(images/back.svg)';
                break;
            case 'Um':
                document.getElementById(clicked_id).setAttribute('gongStatus', "No");
                document.getElementById(clicked_id).style.backgroundImage = 'none';
                break;

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

        if (currentArr && currentArr.length < 17 && availableSpace[0][workingArea] <= maxSpace[0][workingArea] && workingArea !== "Fa") {
            currentArr.push(tile)

            const availableSpaceEl = document.getElementById(workingArea + String(availableSpace[0][workingArea]))

            availableSpace[0][workingArea] = availableSpace[0][workingArea] + 1;

            availableSpaceEl.style.backgroundImage = 'url(images/' + tile + '.svg)';
            availableSpaceEl.style.backgroundRepeat = "no-repeat";
            availableSpaceEl.style.borderColor = "rgb(58, 58, 60)";
            availableSpaceEl.setAttribute('tile', tile);

            if (availableSpaceEl.id === "Ming15" && currentArr.length !== 16) {
                workingArea = "Um"
                yellowTracker = workingArea + String(availableSpace[0][workingArea])
                colorYellow()
                return
            }

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
            availableSpaceEl.setAttribute('tile', tile)
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


function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}




//check/uncheck all checkbox
function cbClickAll() {
    const cbAll = document.getElementById('cbAll');
    const tbs = document.getElementsByClassName('YN');
    console.log(cbAll)
    if (cbAll.checked) {
        for (let i = 0; i < tbs.length; i++) {
            tbs[i].checked = true
        }
    } else {
        for (let i = 0; i < tbs.length; i++) {
            tbs[i].checked = false
        }
    }
}





//old code


// //第一個組合

// let comboTile = []
// let newCombo = []
// let addedCombo = []
// let index
// let tempPosCombo = posCombo.map((x) => x)

// umArr.forEach(tile => {
//     count[tile] = (count[tile] || 0) + 1;
// });

//sorting method - does not work as there can be multiple 
// workingTile.sort((a, b) => {
//     if (a.substring(1, 2) > b.substring(1, 2)) return 1;
//     if (a.substring(1, 2) < b.substring(1, 2)) return -1;

//     if (+a.substring(0, 1) > +b.substring(0, 1)) return 1;
//     if (+a.substring(0, 1) < +b.substring(0, 1)) return -1;
// })

//第一間

// for (let j = 0; j < posCombo.length; j++) {
//     let workingTile = umArr.map((x) => x)
//     newCombo = []
//     for (let i = 0; i < tempPosCombo.length; i++) {

//         comboTile = tempPosCombo[i]
//         console.log("i is "+ i)
//         console.log(comboTile)

//         //!!!orignal code, only good for 1st set
//         // for (let i = 0; i < 3; i++) {
//         //     index = workingTile.indexof(comboTile[i])
//         //     workingTile.splice(index,1)
//         // }
//         // addedCombo.push(comboTile)

//         //!!! for sorting method, no good
//         // j = 0
//         // while (j < workingTile.length) {
//         //     if (comboTile[0] !== workingTile[j]) {
//         //         j++
//         //     } else if (comboTile[1] == workingTile[j + 1] && comboTile[2] == workingTile[j + 2]) {
//         //         addedCombo.push(comboTile);
//         //         workingTile.splice(j, 3);
//         //     }
//         // }

//         if (comboTile[0] === comboTile[1]) {
//             //pong handle
//             if (count[comboTile[0]] >= 3) {
//                 newCombo.push([comboTile[0], comboTile[1], comboTile[2]]);
//                 workingTile.splice(workingTile.indexOf(comboTile[0]), 1)
//                 workingTile.splice(workingTile.indexOf(comboTile[0]), 1)
//                 workingTile.splice(workingTile.indexOf(comboTile[0]), 1)
//             }
//         } else {
//             for (let k = 0; k < 4; k++) {
//             //may have same sheung for 4 times
//             if (workingTile.includes(comboTile[0]) && workingTile.includes(comboTile[1]) && workingTile.includes(comboTile[2])) {
//                 //sheung handle
//                 newCombo.push([comboTile[0], comboTile[1], comboTile[2]]);
//                 workingTile.splice(workingTile.indexOf(comboTile[0]), 1)
//                 workingTile.splice(workingTile.indexOf(comboTile[1]), 1)
//                 workingTile.splice(workingTile.indexOf(comboTile[2]), 1)
//             }


//         }
//         }


//         console.table(newCombo)
//         console.log(workingTile)
//     }
//     //眼match
//     if (workingTile.length === 2 && (workingTile[0] === workingTile[1])) {
//         newCombo.push([workingTile[0], workingTile[1]]);
//     } else {
//         newCombo = []
//     }
//     console.log(j + "first combo found")
//     console.table(JSON.stringify(newCombo))
//     addedCombo.push(newCombo)
// }
// console.table(JSON.stringify(addedCombo))