// additional copyright/license info:
// © All Rights Reserved
//
// Chess.com Bot/Cheat © 2025 by Aries_Hacker
//
// ==UserScript==
// @name         Chess.com Cheat
// @namespace    Aries_Hacker
// @version      1.0.0
// @description  Chess.com Cheat
// @author       Aries_Hacker
// @license      Chess.com Cheat ©  All Rights Reserved
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @icon         https://m.gettywallpapers.com/wp-content/uploads/2023/10/Pfp-aries.jpg
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @resource     stockfish.js https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/9.0.0/stockfish.js
// @require      https://greasyfork.org/scripts/445697/code/index.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// ==/UserScript==

// Don't touch anything below unless you know what you're doing!

function main() {

    var stockfishObjectURL;
    var engine = document.engine = {};
    var myVars = document.myVars = {};
    myVars.autoMovePiece = false;
    myVars.autoRun = false;
    myVars.delay = 0.1;
    var myFunctions = document.myFunctions = {};


    stop_b = stop_w = 0;
    s_br = s_br2 = s_wr = s_wr2 = 0;
    obs = "";
    myFunctions.rescan = function(lev) {
        var ari = $("chess-board")
        .find(".piece")
        .map(function() {
            return this.className;
        })
        .get();
        jack = ari.map(f => f.substring(f.indexOf(' ') + 1));
        function removeWord(arr, word) {
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].replace(word, '');
            }
        }
        removeWord(ari, 'square-');
        jack = ari.map(f => f.substring(f.indexOf(' ') + 1));
        for (var i = 0; i < jack.length; i++) {
            jack[i] = jack[i].replace('br', 'r')
                .replace('bn', 'n')
                .replace('bb', 'b')
                .replace('bq', 'q')
                .replace('bk', 'k')
                .replace('bb', 'b')
                .replace('bn', 'n')
                .replace('br', 'r')
                .replace('bp', 'p')
                .replace('wp', 'P')
                .replace('wr', 'R')
                .replace('wn', 'N')
                .replace('wb', 'B')
                .replace('br', 'R')
                .replace('wn', 'N')
                .replace('wb', 'B')
                .replace('wq', 'Q')
                .replace('wk', 'K')
                .replace('wb', 'B')
        }
        str2 = "";
        var count = 0,
            str = "";
        for (var j = 8; j > 0; j--) {
            for (var i = 1; i < 9; i++) {
                (str = (jack.find(el => el.includes([i] + [j])))) ? str = str.replace(/[^a-zA-Z]+/g, ''): str = "";
                if (str == "") {
                    count++;
                    str = count.toString();
                    if (!isNaN(str2.charAt(str2.length - 1))) str2 = str2.slice(0, -1);
                    else {
                        count = 1;
                        str = count.toString()
                    }
                }
                str2 += str;
                if (i == 8) {
                    count = 0;
                    str2 += "/";
                }
            }
        }
        str2 = str2.slice(0, -1);
        //str2=str2+" KQkq - 0"
        color = "";
        wk = wq = bk = bq = "0";
        const move = $('vertical-move-list')
        .children();
        if (move.length < 2) {
            stop_b = stop_w = s_br = s_br2 = s_wr = s_wr2 = 0;
        }
        if (stop_b != 1) {
            if (move.find(".black.node:contains('K')")
                .length) {
                bk = "";
                bq = "";
                stop_b = 1;
                console.log('debug secb');
            }
        } else {
            bq = "";
            bk = "";
        }
        if (stop_b != 1)(bk = (move.find(".black.node:contains('O-O'):not(:contains('O-O-O'))")
                               .length) ? "" : "k") ? (bq = (move.find(".black.node:contains('O-O-O')")
                                                             .length) ? bk = "" : "q") : bq = "";
        if (s_br != 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match('[abcd]+')) {
                bq = "";
                s_br = 1
            }
        } else bq = "";
        if (s_br2 != 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match('[hgf]+')) {
                bk = "";
                s_br2 = 1
            }
        } else bk = "";
        if (stop_b == 0) {
            if (s_br == 0)
                if (move.find(".white.node:contains('xa8')")
                    .length > 0) {
                    bq = "";
                    s_br = 1;
                    console.log('debug b castle_r');
                }
            if (s_br2 == 0)
                if (move.find(".white.node:contains('xh8')")
                    .length > 0) {
                    bk = "";
                    s_br2 = 1;
                    console.log('debug b castle_l');
                }
        }
        if (stop_w != 1) {
            if (move.find(".white.node:contains('K')")
                .length) {
                wk = "";
                wq = "";
                stop_w = 1;
                console.log('debug secw');
            }
        } else {
            wq = "";
            wk = "";
        }
        if (stop_w != 1)(wk = (move.find(".white.node:contains('O-O'):not(:contains('O-O-O'))")
                               .length) ? "" : "K") ? (wq = (move.find(".white.node:contains('O-O-O')")
                                                             .length) ? wk = "" : "Q") : wq = "";
        if (s_wr != 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match('[abcd]+')) {
                wq = "";
                s_wr = 1
            }
        } else wq = "";
        if (s_wr2 != 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match('[hgf]+')) {
                wk = "";
                s_wr2 = 1
            }
        } else wk = "";
        if (stop_w == 0) {
            if (s_wr == 0)
                if (move.find(".black.node:contains('xa1')")
                    .length > 0) {
                    wq = "";
                    s_wr = 1;
                    console.log('debug w castle_l');
                }
            if (s_wr2 == 0)
                if (move.find(".black.node:contains('xh1')")
                    .length > 0) {
                    wk = "";
                    s_wr2 = 1;
                    console.log('debug w castle_r');
                }
        }
        if ($('.coordinates')
            .children()
            .first()
            .text() == 1) {
            str2 = str2 + " b " + wk + wq + bk + bq;
            color = "white";
        } else {
            str2 = str2 + " w " + wk + wq + bk + bq;
            color = "black";
        }
        //console.log(str2);
        return str2;
    }
    myFunctions.color = function(dat){
        response = dat;
        var res1 = response.substring(0, 2);
        var res2 = response.substring(2, 4);

        if(myVars.autoMove == true){
            myFunctions.movePiece(res1, res2);
        }
        isThinking = false;

        res1 = res1.replace(/^a/, "1")
            .replace(/^b/, "2")
            .replace(/^c/, "3")
            .replace(/^d/, "4")
            .replace(/^e/, "5")
            .replace(/^f/, "6")
            .replace(/^g/, "7")
            .replace(/^h/, "8");
        res2 = res2.replace(/^a/, "1")
            .replace(/^b/, "2")
            .replace(/^c/, "3")
            .replace(/^d/, "4")
            .replace(/^e/, "5")
            .replace(/^f/, "6")
            .replace(/^g/, "7")
            .replace(/^h/, "8");
        $(board.nodeName)
            .prepend('<div class="highlight square-' + res2 + ' bro" style="background-color: rgb(235, 97, 80); opacity: 0.71;" data-test-element="highlight"></div>')
            .children(':first')
            .delay(1800)
            .queue(function() {
            $(this)
                .remove();
        });
        $(board.nodeName)
            .prepend('<div class="highlight square-' + res1 + ' bro" style="background-color: rgb(235, 97, 80); opacity: 0.71;" data-test-element="highlight"></div>')
            .children(':first')
            .delay(1800)
            .queue(function() {
            $(this)
                .remove();
        });
    }

    myFunctions.movePiece = function(from, to){
        for (var each=0;each<board.game.getLegalMoves().length;each++){
            if(board.game.getLegalMoves()[each].from == from){
                if(board.game.getLegalMoves()[each].to == to){
                    var move = board.game.getLegalMoves()[each];
                    board.game.move({
                        ...move,
                        promotion: 'false',
                        animate: false,
                        userGenerated: true
                    });
                }
            }
        }
    }

    function parser(e){
        if(e.data.includes('bestmove')){
            console.log(e.data.split(' ')[1]);
            myFunctions.color(e.data.split(' ')[1]);
            isThinking = false;
        }
    }

    myFunctions.reloadChessEngine = function() {
        console.log(`Reloading the chess engine!`);

        engine.engine.terminate();
        isThinking = false;
        myFunctions.loadChessEngine();
    }

    myFunctions.loadChessEngine = function() {
        if(!stockfishObjectURL) {
            stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText('stockfish.js')], {type: 'application/javascript'}));
        }
        console.log(stockfishObjectURL);
        if(stockfishObjectURL) {
            engine.engine = new Worker(stockfishObjectURL);

            engine.engine.onmessage = e => {
                parser(e);
            };
            engine.engine.onerror = e => {
                console.log("Worker Error: "+e);
            };

            engine.engine.postMessage('ucinewgame');
        }
        console.log('loaded chess engine');
    }

    var lastValue = 11;
    myFunctions.runChessEngine = function(depth){
        //var fen = myFunctions.rescan();
        var fen = board.game.getFEN();
        engine.engine.postMessage(`position fen ${fen}`);
        console.log('updated: ' + `position fen ${fen}`);
        isThinking = true;
        engine.engine.postMessage(`go depth ${depth}`);
        lastValue = depth;
    }

    myFunctions.autoRun = function(lstValue){
        if(board.game.getTurn() == board.game.getPlayingAs()){
            myFunctions.runChessEngine(lstValue);
        }
    }

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 81:
                myFunctions.runChessEngine(1);
                break;
            case 87:
                myFunctions.runChessEngine(2);
                break;
            case 69:
                myFunctions.runChessEngine(3);
                break;
            case 82:
                myFunctions.runChessEngine(4);
                break;
            case 84:
                myFunctions.runChessEngine(5);
                break;
            case 89:
                myFunctions.runChessEngine(6);
                break;
            case 85:
                myFunctions.runChessEngine(7);
                break;
            case 73:
                myFunctions.runChessEngine(8);
                break;
            case 79:
                myFunctions.runChessEngine(9);
                break;
            case 80:
                myFunctions.runChessEngine(10);
                break;
            case 65:
                myFunctions.runChessEngine(11);
                break;
            case 83:
                myFunctions.runChessEngine(12);
                break;
            case 68:
                myFunctions.runChessEngine(13);
                break;
            case 70:
                myFunctions.runChessEngine(14);
                break;
            case 71:
                myFunctions.runChessEngine(15);
                break;
            case 72:
                myFunctions.runChessEngine(16);
                break;
            case 74:
                myFunctions.runChessEngine(17);
                break;
            case 75:
                myFunctions.runChessEngine(18);
                break;
            case 76:
                myFunctions.runChessEngine(19);
                break;
            case 90:
                myFunctions.runChessEngine(20);
                break;
            case 88:
                myFunctions.runChessEngine(21);
                break;
            case 67:
                myFunctions.runChessEngine(22);
                break;
            case 86:
                myFunctions.runChessEngine(23);
                break;
            case 66:
                myFunctions.runChessEngine(24);
                break;
            case 78:
                myFunctions.runChessEngine(25);
                break;
            case 77:
                myFunctions.runChessEngine(26);
                break;
            case 187:
                myFunctions.runChessEngine(100);
                break;
        }
    };

    myFunctions.spinner = function() {
        const spinner = document.getElementById('menuSpinner');
        if (!spinner) return;
        if(isThinking == true){
            spinner.style.display = 'flex';
        } else {
            spinner.style.display = 'none';
        }
    }

    let dynamicStyles = null;

    function addAnimation(body) {
        if (!dynamicStyles) {
            dynamicStyles = document.createElement('style');
            dynamicStyles.type = 'text/css';
            document.head.appendChild(dynamicStyles);
        }

        dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
    }

    var loaded = false;
    myFunctions.loadEx = function(){
        try{
            var tmpStyle;
            var tmpDiv;
            board = $('chess-board')[0] || $('wc-chess-board')[0];
            myVars.board = board;

            // --- CS2 STYLE MENU ---
            var div = document.createElement('div');
            // Animated background layer
            var bgAnim = document.createElement('div');
            bgAnim.setAttribute('id', 'cs2MenuBgAnim');
            bgAnim.setAttribute('style', `
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                z-index: 0;
                border-radius: 18px;
                pointer-events: none;
                background: linear-gradient(135deg, #232946, #3a6ea5, #7ecfff, #8f98ff, #232946);
                background-size: 300% 300%;
                animation: cs2GradientMove 20s ease-in-out infinite;
                opacity: 0.32;
                filter: blur(1px);
            `);
            div.appendChild(bgAnim);
            // Add the animation keyframes for the gradient
            addAnimation(`@keyframes cs2GradientMove {
                0% {background-position: 0% 50%;}
                50% {background-position: 100% 50%;}
                100% {background-position: 0% 50%;}
            }`);
            div.setAttribute('id','cs2Menu');
            div.setAttribute('style',
                'position: fixed; top: 120px; left: 120px; z-index: 99999; min-width: 340px; background: rgba(24,28,36,0.65); color: #e0e0e0; border-radius: 22px; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37), 0 0 16px 2px #7ecfff88; border: 2.5px solid #7ecfff; font-family: Segoe UI, Arial, sans-serif; padding: 32px 32px 20px 32px; user-select: none; overflow: hidden; backdrop-filter: blur(16px); transition: box-shadow 0.25s, transform 0.25s cubic-bezier(.4,2,.6,1), opacity 0.25s cubic-bezier(.4,2,.6,1); opacity: 1; transform: scale(1);');
            // Premium header bar with icon
            div.innerHTML += `<div id=\"cs2MenuHeader\" style=\"cursor: move; font-size: 1.3em; font-weight: bold; margin-bottom: 18px; color: #fff; letter-spacing: 1px; position: relative; z-index: 2; display: flex; align-items: center; gap: 10px; background: linear-gradient(90deg, #7ecfff 0%, #3a6ea5 100%); border-radius: 10px 10px 16px 16px; box-shadow: 0 2px 12px #7ecfff33; padding: 10px 18px 10px 14px;\"><span style=\"font-size:1.3em;\">♟️</span> Chess.com Cheat Menu</div>
            <div style=\"margin: 0 0 0 8px; position: relative; z-index: 2;\">
            <div style=\"margin-bottom: 12px;\"><p id=\"depthText\" style=\"margin:0; font-size:1.1em; font-weight:500;\"> Your Current Depth Is: 11 </p><p style=\"margin:0; color:#b8e0ff; font-size:0.95em;\"> Press a key on your keyboard to change this!</p></div>
            <hr style=\"border: none; border-top: 1.5px solid #7ecfff33; margin: 10px 0 16px 0;\">
            <div style=\"display: flex; align-items: center; gap: 10px; margin-bottom: 10px;\">
            <input type=\"checkbox\" id=\"autoRun\" name=\"autoRun\" value=\"false\" style=\"accent-color:#7ecfff; width:18px; height:18px;\">
            <label for=\"autoRun\" style=\"font-size:1em;\"> Enable auto run</label></div>
            <div style=\"display: flex; align-items: center; gap: 10px; margin-bottom: 10px;\">
            <input type=\"checkbox\" id=\"autoMove\" name=\"autoMove\" value=\"false\" style=\"accent-color:#7ecfff; width:18px; height:18px;\">
            <label for=\"autoMove\" style=\"font-size:1em;\"> Enable auto move</label></div>
            <div style=\"display: flex; align-items: center; gap: 10px; margin-bottom: 10px;\">
            <input type=\"number\" id=\"timeDelayMin\" name=\"timeDelayMin\" min=\"0.1\" value=0.1 style=\"background:rgba(255,255,255,0.08); border:1.5px solid #7ecfff; border-radius:6px; color:#fff; width:60px; padding:3px 8px; font-size:1em;\">
            <label for=\"timeDelayMin\">Auto Run Delay Minimum (Seconds)</label></div>
            <div style=\"display: flex; align-items: center; gap: 10px; margin-bottom: 10px;\">
            <input type=\"number\" id=\"timeDelayMax\" name=\"timeDelayMax\" min=\"0.1\" value=1 style=\"background:rgba(255,255,255,0.08); border:1.5px solid #7ecfff; border-radius:6px; color:#fff; width:60px; padding:3px 8px; font-size:1em;\">
            <label for=\"timeDelayMax\">Auto Run Delay Maximum (Seconds)</label></div>
            </div>`;
            document.body.appendChild(div);

            // Make sure all menu content is above the animated background
            Array.from(div.children).forEach(child => {
                if(child.id !== 'cs2MenuBgAnim') {
                    child.style.position = 'relative';
                    child.style.zIndex = 2;
                }
            });

            // Spinner inside menu (compact, CS2 style)
            var menuSpinner = document.createElement('div');
            menuSpinner.setAttribute('id', 'menuSpinner');
            menuSpinner.setAttribute('style', `
              display: none;
              position: absolute;
              left: 50%; top: 50%;
              transform: translate(-50%, -50%);
              z-index: 100;
              align-items: center; justify-content: center;
              background: rgba(24,28,36,0.85);
              border-radius: 12px;
              padding: 24px 32px;
              box-shadow: 0 4px 24px #0008;
            `);
            var spinr = document.createElement('div');
            spinr.setAttribute('style', `
              width: 48px; height: 48px;
              border: 6px solid #222c3a;
              border-top: 6px solid #7ecfff;
            border-radius: 50%;
              animation: rotate 1s linear infinite;
              box-shadow: 0 0 12px #7ecfff88, 0 0 4px #222c3a;
              position: relative;
            margin: 0 auto;
            `);
            menuSpinner.appendChild(spinr);
            var icon = document.createElement('div');
            icon.innerHTML = '♟️';
            icon.setAttribute('style', `
              position: absolute;
              left: 50%; top: 50%;
              transform: translate(-50%, -50%);
              font-size: 1.4em;
              color: #7ecfff;
              text-shadow: 0 0 8px #7ecfff88;
              pointer-events: none;
            `);
            spinr.appendChild(icon);
            addAnimation(`@keyframes rotate {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}`);
            div.appendChild(menuSpinner);

            // Reload Button (restyled)
            var reSty = `
            #relButDiv { position: relative; text-align: center; margin: 0 0 8px 0; }
            #relEngBut { position: relative; color: #fff; background: #2a2d3a; font-size: 17px; border: 1px solid #7ecfff; padding: 10px 36px; border-radius: 8px; letter-spacing: 1px; cursor: pointer; transition: background 0.2s, color 0.2s; }
            #relEngBut:hover { color: #2a2d3a; background: #7ecfff; }
            #relEngBut:active { background: #1a1d2a; }`;
            var reBut = `<button type="button" name="reloadEngine" id="relEngBut" onclick="document.myFunctions.reloadChessEngine()">Reload Chess Engine</button>`;
            tmpDiv = document.createElement('div');
            var relButDiv = document.createElement('div');
            relButDiv.id = 'relButDiv';
            tmpDiv.innerHTML = reBut;
            reBut = tmpDiv.firstChild;
            tmpStyle = document.createElement('style');
            tmpStyle.innerHTML = reSty;
            document.head.append(tmpStyle);
            relButDiv.append(reBut);
            div.append(relButDiv);

            // Add menu touch-up styles and animated effects
            addAnimation(`#cs2Menu input[type='checkbox']:hover, #cs2Menu input[type='number']:hover { box-shadow: 0 0 0 2px #7ecfff55; border-color: #7ecfff; }`);
            addAnimation(`#cs2Menu input[type='number'] { transition: box-shadow 0.2s, border-color 0.2s; }`);
            addAnimation(`#cs2Menu input[type='checkbox'] { transition: box-shadow 0.2s, border-color 0.2s; position: relative; overflow: hidden; }`);
            // Ripple effect for checkboxes
            addAnimation(`.checkbox-ripple { position: absolute; left: 50%; top: 50%; width: 36px; height: 36px; pointer-events: none; border-radius: 50%; background: rgba(126,207,255,0.25); transform: translate(-50%,-50%) scale(0); opacity: 0.7; transition: transform 0.35s cubic-bezier(.4,2,.6,1), opacity 0.35s; z-index: 10; }`);
            addAnimation(`.checkbox-ripple.active { transform: translate(-50%,-50%) scale(1.2); opacity: 0; }`);
            // Checkbox checkmark animation
            addAnimation(`#cs2Menu input[type='checkbox']:checked { box-shadow: 0 0 0 2px #7ecfff99; border-color: #7ecfff; }`);
            // Reload button press animation
            addAnimation(`#relEngBut:active { transform: scale(0.93); box-shadow: 0 0 16px #7ecfff99; }`);
            addAnimation(`#relEngBut.ripple { animation: relButRipple 0.32s cubic-bezier(.4,2,.6,1); }`);
            addAnimation(`@keyframes relButRipple { 0% { box-shadow: 0 0 0 0 #7ecfff55; } 80% { box-shadow: 0 0 16px 8px #7ecfff55; } 100% { box-shadow: 0 0 0 0 #7ecfff00; } }`);

            // Add intense glitch-out animation keyframes and styles
            addAnimation(`@keyframes glitchOutIntense {
                0% { opacity: 1; transform: scale(1) translate(0,0) skew(0deg,0deg); filter: none; }
                5% { opacity: 0.7; transform: scale(1.05) translate(-8px,2px) skew(-4deg,2deg); filter: hue-rotate(20deg) contrast(1.3) drop-shadow(-2px 0 0 #ff00c8); }
                10% { opacity: 0.5; transform: scale(0.97) translate(12px,-6px) skew(6deg,-3deg); filter: hue-rotate(-20deg) contrast(1.2) drop-shadow(2px 0 0 #00fff7); }
                15% { opacity: 0.8; transform: scale(1.08) translate(-16px,4px) skew(-8deg,4deg); filter: hue-rotate(40deg) contrast(1.4) drop-shadow(-4px 0 0 #ff00c8); }
                20% { opacity: 0.3; transform: scale(0.95) translate(18px,-8px) skew(8deg,-4deg); filter: hue-rotate(-40deg) contrast(1.3) drop-shadow(4px 0 0 #00fff7); }
                25% { opacity: 0.9; transform: scale(1.12) translate(-20px,6px) skew(-10deg,5deg); filter: hue-rotate(60deg) contrast(1.5) drop-shadow(-6px 0 0 #ff00c8); }
                30% { opacity: 0.2; transform: scale(0.93) translate(22px,-10px) skew(10deg,-5deg); filter: hue-rotate(-60deg) contrast(1.4) drop-shadow(6px 0 0 #00fff7); }
                35% { opacity: 0.7; transform: scale(1.15) translate(-24px,8px) skew(-12deg,6deg); filter: hue-rotate(80deg) contrast(1.6) drop-shadow(-8px 0 0 #ff00c8); }
                40% { opacity: 0.1; transform: scale(0.91) translate(26px,-12px) skew(12deg,-6deg); filter: hue-rotate(-80deg) contrast(1.5) drop-shadow(8px 0 0 #00fff7); }
                45% { opacity: 0.8; transform: scale(1.18) translate(-28px,10px) skew(-14deg,7deg); filter: hue-rotate(100deg) contrast(1.7) drop-shadow(-10px 0 0 #ff00c8); }
                50% { opacity: 0.1; transform: scale(0.89) translate(30px,-14px) skew(14deg,-7deg); filter: hue-rotate(-100deg) contrast(1.6) drop-shadow(10px 0 0 #00fff7); }
                55% { opacity: 0.6; transform: scale(1.21) translate(-32px,12px) skew(-16deg,8deg); filter: hue-rotate(120deg) contrast(1.8) drop-shadow(-12px 0 0 #ff00c8); }
                60% { opacity: 0.1; transform: scale(0.87) translate(34px,-16px) skew(16deg,-8deg); filter: hue-rotate(-120deg) contrast(1.7) drop-shadow(12px 0 0 #00fff7); }
                65% { opacity: 0.5; transform: scale(1.24) translate(-36px,14px) skew(-18deg,9deg); filter: hue-rotate(140deg) contrast(1.9) drop-shadow(-14px 0 0 #ff00c8); }
                70% { opacity: 0.1; transform: scale(0.85) translate(38px,-18px) skew(18deg,-9deg); filter: hue-rotate(-140deg) contrast(1.8) drop-shadow(14px 0 0 #00fff7); }
                75% { opacity: 0.4; transform: scale(1.27) translate(-40px,16px) skew(-20deg,10deg); filter: hue-rotate(160deg) contrast(2.0) drop-shadow(-16px 0 0 #ff00c8); }
                80% { opacity: 0.1; transform: scale(0.83) translate(42px,-20px) skew(20deg,-10deg); filter: hue-rotate(-160deg) contrast(1.9) drop-shadow(16px 0 0 #00fff7); }
                85% { opacity: 0.3; transform: scale(1.3) translate(-44px,18px) skew(-22deg,11deg); filter: hue-rotate(180deg) contrast(2.1) drop-shadow(-18px 0 0 #ff00c8); }
                90% { opacity: 0.1; transform: scale(0.81) translate(46px,-22px) skew(22deg,-11deg); filter: hue-rotate(-180deg) contrast(2.0) drop-shadow(18px 0 0 #00fff7); }
                95% { opacity: 0.2; transform: scale(1.33) translate(-48px,20px) skew(-24deg,12deg); filter: hue-rotate(200deg) contrast(2.2) drop-shadow(-20px 0 0 #ff00c8); }
                100% { opacity: 0; transform: scale(0.7) translate(0,0) skew(0deg,0deg); filter: none; }
            }`);
            addAnimation(`#cs2Menu.glitch-out-intense::after {
                content: "";
                position: absolute;
                left: 0; top: 0; width: 100%; height: 100%;
                pointer-events: none;
                z-index: 9999;
                background: repeating-linear-gradient(0deg, transparent, transparent 3px, #fff 3px, #fff 4px, transparent 4px, transparent 8px);
                opacity: 0.15;
                animation: scanlines 0.45s linear;
            }`);
            addAnimation(`@keyframes scanlines {
                0% { opacity: 0.15; }
                50% { opacity: 0.35; }
                100% { opacity: 0.15; }
            }`);

            // --- DRAGGABLE ---
            let dragMenu = document.getElementById('cs2Menu');
            let dragHeader = document.getElementById('cs2MenuHeader');
            let menuOffsetX = 0, menuOffsetY = 0, isMenuDragging = false;
            let lastTrailTime = 0;

            dragHeader.onmousedown = function(e) {
                isMenuDragging = true;
                menuOffsetX = e.clientX - dragMenu.offsetLeft;
                menuOffsetY = e.clientY - dragMenu.offsetTop;
                document.body.style.userSelect = 'none';
                dragMenu.style.transition = 'box-shadow 0.15s, transform 0.15s';
                dragMenu.style.transform = 'scale(1.04)';
                dragMenu.style.boxShadow = '0 16px 48px 0 #7ecfff66, 0 0 32px 4px #7ecfffcc';
                lastTrailTime = Date.now();
                // Prevent menu drag if clicking inside a modal
                if (e.target.closest('#opponentStatsModalCard')) {
                    isMenuDragging = false;
                }
            };

            document.addEventListener('mousemove', function(e) {
                if (isMenuDragging) {
                    dragMenu.style.left = (e.clientX - menuOffsetX) + 'px';
                    dragMenu.style.top = (e.clientY - menuOffsetY) + 'px';
                    // Contrail effect
                    if (Date.now() - lastTrailTime > 18) {
                        lastTrailTime = Date.now();
                        let ghost = dragMenu.cloneNode(true);
                        ghost.id = '';
                        ghost.style.pointerEvents = 'none';
                        ghost.style.position = 'fixed';
                        ghost.style.left = dragMenu.style.left;
                        ghost.style.top = dragMenu.style.top;
                        ghost.style.opacity = '0.32';
                        ghost.style.filter = 'blur(4px) brightness(1.5)';
                        ghost.style.transition = 'opacity 0.35s cubic-bezier(.4,2,.6,1)';
                        ghost.style.zIndex = 99998;
                        document.body.appendChild(ghost);
                        setTimeout(()=>{ ghost.style.opacity = '0'; }, 10);
                        setTimeout(()=>{ if(ghost.parentNode) ghost.parentNode.removeChild(ghost); }, 350);
                    }
                }
            });

            document.addEventListener('mouseup', function() {
                if (isMenuDragging) {
                    isMenuDragging = false;
                    document.body.style.userSelect = '';
                    dragMenu.style.transition = 'box-shadow 0.25s, transform 0.25s cubic-bezier(.4,2,.6,1)';
                    dragMenu.style.transform = 'scale(1)';
                    dragMenu.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.37), 0 0 16px 2px #7ecfff88';
                }
            });

            // --- TOGGLE MENU WITH INSERT KEY ---
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Insert') {
                    let menu = document.getElementById('cs2Menu');
                    if (menu) {
                        if (menu.style.opacity === '0' || menu.style.display === 'none') {
                            // --- TERMINAL REASSEMBLES MENU ---
                            menu.style.display = 'block';
                            menu.style.opacity = '0';
                            menu.style.transform = 'scale(0.85)';
                            // Create slices
                            const rect = menu.getBoundingClientRect();
                            const sliceCount = 12;
                            let splitYs = [0];
                            for (let i = 1; i < sliceCount; i++) {
                                splitYs.push(Math.floor(Math.random() * (rect.height - 1)));
                            }
                            splitYs.push(rect.height);
                            splitYs = splitYs.sort((a, b) => a - b);
                            const slices = [];
                            let sliceContainer = document.createElement('div');
                            sliceContainer.style.position = 'fixed';
                            sliceContainer.style.left = rect.left + 'px';
                            sliceContainer.style.top = rect.top + 'px';
                            sliceContainer.style.width = rect.width + 'px';
                            sliceContainer.style.height = rect.height + 'px';
                            sliceContainer.style.pointerEvents = 'none';
                            sliceContainer.style.zIndex = 100000;
                            document.body.appendChild(sliceContainer);
                            for (let i = 0; i < sliceCount; i++) {
                                let y1 = splitYs[i];
                                let y2 = splitYs[i+1];
                                let slice = document.createElement('div');
                                slice.style.position = 'absolute';
                                slice.style.left = '0px';
                                slice.style.top = y1 + 'px';
                                slice.style.width = rect.width + 'px';
                                slice.style.height = (y2 - y1) + 'px';
                                slice.style.overflow = 'hidden';
                                // Clone the menu visually for this slice
                                let menuClone = menu.cloneNode(true);
                                menuClone.style.margin = '0';
                                menuClone.style.position = 'absolute';
                                menuClone.style.left = '0px';
                                menuClone.style.top = (-y1) + 'px';
                                menuClone.style.pointerEvents = 'none';
                                menuClone.style.opacity = '1';
                                menuClone.style.transform = 'none';
                                slice.appendChild(menuClone);
                                sliceContainer.appendChild(slice);
                                slices.push(slice);
                            }
                            // Hide the real menu while animating
                            menu.style.visibility = 'hidden';
                            // Scatter and glitch each slice
                            slices.forEach((slice, idx) => {
                                const tx = Math.round((Math.random()-0.5)*160);
                                const skewX = Math.round((Math.random()-0.5)*60);
                                const skewY = Math.round((Math.random()-0.5)*40);
                                const baseOpacity = 0.2 + Math.random()*0.8;
                                const hue = Math.round((Math.random()-0.5)*180);
                                const contrast = (1.1 + Math.random()*1.2).toFixed(2);
                                const dropR = Math.round((Math.random()-0.5)*24);
                                const dropB = Math.round((Math.random()-0.5)*24);
                                const dropColor = Math.random() > 0.5 ? '#ff00c8' : '#00fff7';
                                slice.style.transform = `translate(${tx}px,0) skew(${skewX}deg,${skewY}deg)`;
                                slice.style.opacity = baseOpacity;
                                slice.style.filter = `hue-rotate(${hue}deg) contrast(${contrast}) drop-shadow(${dropR}px 0 0 ${dropColor}) drop-shadow(0 ${dropB}px 0 ${dropColor})`;
                            });
                            // --- FAKE CMD TERMINAL (BINARY ONLY) ---
                            let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                            let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                            let termW = 600, termH = 340;
                            let maxLeft = Math.max(0, vw - termW - 20);
                            let maxTop = Math.max(0, vh - termH - 20);
                            let randLeft = Math.floor(Math.random() * maxLeft) + 10;
                            let randTop = Math.floor(Math.random() * maxTop) + 10;
                            let term = document.createElement('div');
                            term.id = 'fakeCmdTerminal';
                            term.style.position = 'fixed';
                            term.style.left = randLeft + 'px';
                            term.style.top = randTop + 'px';
                            term.style.transform = 'none';
                            term.style.width = '600px';
                            term.style.maxWidth = '90vw';
                            term.style.height = '340px';
                            term.style.maxHeight = '70vh';
                            term.style.background = '#181818';
                            term.style.color = '#b6ffb6';
                            term.style.fontFamily = 'Consolas, monospace';
                            term.style.fontSize = '1.05em';
                            term.style.border = '2.5px solid #222';
                            term.style.borderRadius = '8px';
                            term.style.boxShadow = '0 0 32px #000b, 0 0 0 2px #222';
                            term.style.zIndex = 100001;
                            term.style.overflow = 'hidden';
                            term.style.display = 'flex';
                            term.style.flexDirection = 'column';
                            // Title bar
                            let title = document.createElement('div');
                            title.innerText = 'C:\\Windows\\System32\\cmd.exe';
                            title.style.background = 'linear-gradient(90deg,#222 80%,#444)';
                            title.style.color = '#fff';
                            title.style.fontWeight = 'bold';
                            title.style.fontSize = '0.98em';
                            title.style.padding = '6px 12px';
                            title.style.borderBottom = '1.5px solid #111';
                            title.style.letterSpacing = '0.5px';
                            title.style.userSelect = 'none';
                            term.appendChild(title);
                            // Terminal content
                            let termContent = document.createElement('div');
                            termContent.style.flex = '1';
                            termContent.style.padding = '14px 18px 10px 18px';
                            termContent.style.overflow = 'auto';
                            termContent.style.whiteSpace = 'pre-wrap';
                            termContent.style.background = 'none';
                            termContent.style.fontSize = '1.05em';
                            termContent.style.lineHeight = '1.32em';
                            termContent.id = 'fakeCmdContent';
                            term.appendChild(termContent);
                            document.body.appendChild(term);
                            // Typewriter effect for binary only (very fast, 1s total)
                            let binLen = 0;
                            let startTime = Date.now();
                            function typeBinary() {
                                if (Date.now() - startTime < 700) {
                                    let binChunk = '';
                                    for (let i=0; i<Math.floor(Math.random()*32+16); i++) {
                                        binChunk += Math.random()>0.5?'1':'0';
                                    }
                                    termContent.innerText += '\n' + binChunk;
                                    binLen += binChunk.length;
                                    termContent.scrollTop = termContent.scrollHeight;
                                    setTimeout(typeBinary, Math.random()*4+2);
                                } else {
                                    // After binary, reassemble menu
                                    slices.forEach((slice, idx) => {
                                        slice.style.transition = 'transform 0.38s cubic-bezier(.4,2,.6,1), opacity 0.38s cubic-bezier(.4,2,.6,1), filter 0.38s cubic-bezier(.4,2,.6,1)';
                                        slice.style.transform = 'none';
                                        slice.style.opacity = '1';
                                        slice.style.filter = 'none';
                                    });
                                    setTimeout(() => {
                                        if (sliceContainer.parentNode) sliceContainer.parentNode.removeChild(sliceContainer);
                                        menu.style.visibility = 'visible';
                                        menu.style.opacity = '1';
                                        menu.style.transform = 'scale(1)';
                                        // Glitch out the terminal
                                        term.style.transition = 'all 0.18s cubic-bezier(.4,2,.6,1)';
                                        term.style.filter = 'contrast(2) hue-rotate(60deg) blur(1.5px)';
                                        term.style.transform = 'scale(1.08) skew(-6deg,2deg)';
                                        setTimeout(()=>{
                                            term.style.opacity = '0';
                                            term.style.transform = 'scale(0.7) skew(8deg,-4deg)';
                                            setTimeout(()=>{
                                                if (term.parentNode) term.parentNode.removeChild(term);
                                            }, 180);
                                        }, 180);
                                    }, 420);
                                }
                            }
                            typeBinary();
                            menu.classList.remove('glitch-out-intense');
                        } else {
                            // --- MENU GLITCH-OUT AND FAKE CMD TERMINAL IN PARALLEL ---
                            const rect = menu.getBoundingClientRect();
                            const sliceCount = 12;
                            let splitYs = [0];
                            for (let i = 1; i < sliceCount; i++) {
                                splitYs.push(Math.floor(Math.random() * (rect.height - 1)));
                            }
                            splitYs.push(rect.height);
                            splitYs = splitYs.sort((a, b) => a - b);
                            const slices = [];
                            menu.style.opacity = '0';
                            menu.style.transition = 'none';
                            let sliceContainer = document.createElement('div');
                            sliceContainer.style.position = 'fixed';
                            sliceContainer.style.left = rect.left + 'px';
                            sliceContainer.style.top = rect.top + 'px';
                            sliceContainer.style.width = rect.width + 'px';
                            sliceContainer.style.height = rect.height + 'px';
                            sliceContainer.style.pointerEvents = 'none';
                            sliceContainer.style.zIndex = 100000;
                            document.body.appendChild(sliceContainer);
                            // Add scanline overlay
                            let scanline = document.createElement('div');
                            scanline.style.position = 'absolute';
                            scanline.style.left = '0';
                            scanline.style.top = '0';
                            scanline.style.width = '100%';
                            scanline.style.height = '100%';
                            scanline.style.pointerEvents = 'none';
                            scanline.style.background = 'repeating-linear-gradient(0deg, transparent, transparent 3px, #fff 3px, #fff 4px, transparent 4px, transparent 8px)';
                            scanline.style.opacity = '0';
                            scanline.style.transition = 'opacity 0.12s';
                            sliceContainer.appendChild(scanline);
                            setTimeout(()=>{ scanline.style.opacity = '0.18'; }, 60);
                            setTimeout(()=>{ scanline.style.opacity = '0'; }, 320);
                            // Render each slice with random split
                            for (let i = 0; i < sliceCount; i++) {
                                let y1 = splitYs[i];
                                let y2 = splitYs[i+1];
                                let slice = document.createElement('div');
                                slice.style.position = 'absolute';
                                slice.style.left = '0px';
                                slice.style.top = y1 + 'px';
                                slice.style.width = rect.width + 'px';
                                slice.style.height = (y2 - y1) + 'px';
                                slice.style.overflow = 'hidden';
                                // Clone the menu visually for this slice
                                let menuClone = menu.cloneNode(true);
                                menuClone.style.margin = '0';
                                menuClone.style.position = 'absolute';
                                menuClone.style.left = '0px';
                                menuClone.style.top = (-y1) + 'px';
                                menuClone.style.pointerEvents = 'none';
                                menuClone.style.opacity = '1';
                                menuClone.style.transform = 'none';
                                slice.appendChild(menuClone);
                                sliceContainer.appendChild(slice);
                                slices.push(slice);
                            }
                            // Animate each slice with strong flicker and glitch
                            slices.forEach((slice, idx) => {
                                const tx = Math.round((Math.random()-0.5)*160);
                                const skewX = Math.round((Math.random()-0.5)*60);
                                const skewY = Math.round((Math.random()-0.5)*40);
                                const baseOpacity = 0.2 + Math.random()*0.8;
                                const delay = Math.random()*0.08;
                                const hue = Math.round((Math.random()-0.5)*180);
                                const contrast = (1.1 + Math.random()*1.2).toFixed(2);
                                const dropR = Math.round((Math.random()-0.5)*24);
                                const dropB = Math.round((Math.random()-0.5)*24);
                                const dropColor = Math.random() > 0.5 ? '#ff00c8' : '#00fff7';
                                // Flicker effect: rapid opacity/filter changes
                                let flickerSteps = 5 + Math.floor(Math.random()*4);
                                for (let f = 0; f < flickerSteps; f++) {
                                    setTimeout(() => {
                                        slice.style.opacity = (Math.random()*0.7+0.3).toFixed(2);
                                        slice.style.filter = `hue-rotate(${Math.round((Math.random()-0.5)*360)}deg) contrast(${(1+Math.random()*2).toFixed(2)}) drop-shadow(${Math.round((Math.random()-0.5)*32)}px 0 0 ${dropColor}) drop-shadow(0 ${Math.round((Math.random()-0.5)*32)}px 0 ${dropColor})`;
                                    }, delay*400 + f*20);
                                }
                                setTimeout(() => {
                                    slice.style.transition = 'transform 0.38s cubic-bezier(.4,2,.6,1), opacity 0.38s cubic-bezier(.4,2,.6,1), filter 0.38s cubic-bezier(.4,2,.6,1)';
                                    slice.style.transform = `translate(${tx}px,0) skew(${skewX}deg,${skewY}deg)`;
                                    slice.style.opacity = baseOpacity;
                                    slice.style.filter = `hue-rotate(${hue}deg) contrast(${contrast}) drop-shadow(${dropR}px 0 0 ${dropColor}) drop-shadow(0 ${dropB}px 0 ${dropColor})`;
                                }, delay*400 + flickerSteps*20);
                            });
                            // --- FAKE CMD TERMINAL (BINARY ONLY) ---
                            // Randomize position
                            let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                            let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                            let termW = 600, termH = 340;
                            let maxLeft = Math.max(0, vw - termW - 20);
                            let maxTop = Math.max(0, vh - termH - 20);
                            let randLeft = Math.floor(Math.random() * maxLeft) + 10;
                            let randTop = Math.floor(Math.random() * maxTop) + 10;
                            let term = document.createElement('div');
                            term.id = 'fakeCmdTerminal';
                            term.style.position = 'fixed';
                            term.style.left = randLeft + 'px';
                            term.style.top = randTop + 'px';
                            term.style.transform = 'none';
                            term.style.width = '600px';
                            term.style.maxWidth = '90vw';
                            term.style.height = '340px';
                            term.style.maxHeight = '70vh';
                            term.style.background = '#181818';
                            term.style.color = '#b6ffb6';
                            term.style.fontFamily = 'Consolas, monospace';
                            term.style.fontSize = '1.05em';
                            term.style.border = '2.5px solid #222';
                            term.style.borderRadius = '8px';
                            term.style.boxShadow = '0 0 32px #000b, 0 0 0 2px #222';
                            term.style.zIndex = 100001;
                            term.style.overflow = 'hidden';
                            term.style.display = 'flex';
                            term.style.flexDirection = 'column';
                            // Title bar
                            let title = document.createElement('div');
                            title.innerText = 'C:\\Windows\\System32\\cmd.exe';
                            title.style.background = 'linear-gradient(90deg,#222 80%,#444)';
                            title.style.color = '#fff';
                            title.style.fontWeight = 'bold';
                            title.style.fontSize = '0.98em';
                            title.style.padding = '6px 12px';
                            title.style.borderBottom = '1.5px solid #111';
                            title.style.letterSpacing = '0.5px';
                            title.style.userSelect = 'none';
                            term.appendChild(title);
                            // Terminal content
                            let termContent = document.createElement('div');
                            termContent.style.flex = '1';
                            termContent.style.padding = '14px 18px 10px 18px';
                            termContent.style.overflow = 'auto';
                            termContent.style.whiteSpace = 'pre-wrap';
                            termContent.style.background = 'none';
                            termContent.style.fontSize = '1.05em';
                            termContent.style.lineHeight = '1.32em';
                            termContent.id = 'fakeCmdContent';
                            term.appendChild(termContent);
                            document.body.appendChild(term);
                            // Typewriter effect for binary only (very fast, 1s total)
                            let binLen = 0;
                            let startTime = Date.now();
                            function typeBinary() {
                                if (Date.now() - startTime < 700) {
                                    let binChunk = '';
                                    for (let i=0; i<Math.floor(Math.random()*32+16); i++) {
                                        binChunk += Math.random()>0.5?'1':'0';
                                    }
                                    termContent.innerText += '\n' + binChunk;
                                    binLen += binChunk.length;
                                    termContent.scrollTop = termContent.scrollHeight;
                                    setTimeout(typeBinary, Math.random()*4+2);
                                }
                            }
                            typeBinary();
                            // After 1s, glitch out terminal and remove everything
                            setTimeout(()=>{
                                term.style.transition = 'all 0.18s cubic-bezier(.4,2,.6,1)';
                                term.style.filter = 'contrast(2) hue-rotate(60deg) blur(1.5px)';
                                term.style.transform = 'scale(1.08) skew(-6deg,2deg)';
                                setTimeout(()=>{
                                    term.style.opacity = '0';
                                    term.style.transform = 'scale(0.7) skew(8deg,-4deg)';
                                    setTimeout(()=>{
                                        if (term.parentNode) term.parentNode.removeChild(term);
                                        if (sliceContainer.parentNode) sliceContainer.parentNode.removeChild(sliceContainer);
                                        menu.style.display = 'none';
                                        menu.style.opacity = '0';
                                        menu.style.transform = 'scale(0.85)';
                                    }, 180);
                                }, 180);
                            }, 1000);
                        }
                    }
                }
            });

            // Add ripple span to checkboxes and click handler
            setTimeout(() => {
                ['autoRun','autoMove'].forEach(id => {
                    let cb = document.getElementById(id);
                    if (cb && !cb.parentNode.querySelector('.checkbox-ripple')) {
                        let ripple = document.createElement('span');
                        ripple.className = 'checkbox-ripple';
                        cb.parentNode.style.position = 'relative';
                        cb.parentNode.appendChild(ripple);
                        cb.addEventListener('click', function(e) {
                            ripple.classList.remove('active');
                            void ripple.offsetWidth;
                            ripple.classList.add('active');
                        });
                    }
                });
                // Reload button ripple/press effect
                let relBut = document.getElementById('relEngBut');
                if (relBut) {
                    relBut.addEventListener('click', function(e) {
                        relBut.classList.remove('ripple');
                        void relBut.offsetWidth;
                        relBut.classList.add('ripple');
                        setTimeout(()=>{ relBut.classList.remove('ripple'); }, 350);
                    });
                }
            }, 200);

            // Add settings icon to top right
            let settingsIcon = document.createElement('div');
            settingsIcon.id = 'cs2SettingsIcon';
            settingsIcon.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7ecfff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.5"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 16 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.14.31.22.65.22 1v.09A1.65 1.65 0 0 0 21 12c0 .35-.08.69-.22 1z"/></svg>`;
            settingsIcon.style.position = 'absolute';
            settingsIcon.style.top = '14px';
            settingsIcon.style.right = '18px';
            settingsIcon.style.cursor = 'pointer';
            settingsIcon.style.zIndex = 20;
            settingsIcon.style.transition = 'transform 0.18s';
            settingsIcon.style.opacity = '0.85';
            settingsIcon.style.background = 'rgba(24,28,36,0.01)';
            settingsIcon.style.width = '22px';
            settingsIcon.style.height = '22px';
            settingsIcon.onmouseenter = () => settingsIcon.style.transform = 'scale(1.18) rotate(18deg)';
            settingsIcon.onmouseleave = () => settingsIcon.style.transform = 'none';
            document.getElementById('cs2Menu').appendChild(settingsIcon);

            // Settings panel
            let settingsPanel = document.createElement('div');
            settingsPanel.id = 'cs2SettingsPanel';
            settingsPanel.style.position = 'absolute';
            settingsPanel.style.top = '48px';
            settingsPanel.style.right = '18px';
            settingsPanel.style.minWidth = '220px';
            settingsPanel.style.background = 'rgba(24,28,36,0.98)';
            settingsPanel.style.border = '1.5px solid #7ecfff';
            settingsPanel.style.borderRadius = '12px';
            settingsPanel.style.boxShadow = '0 4px 24px #0008';
            settingsPanel.style.padding = '18px 18px 12px 18px';
            settingsPanel.style.display = 'none';
            settingsPanel.style.zIndex = 30;
            settingsPanel.style.color = '#e0e0e0';
            settingsPanel.style.fontFamily = 'inherit';
            settingsPanel.innerHTML = `<div style='font-weight:600;font-size:1.08em;margin-bottom:10px;color:#7ecfff;'>Background Gradient</div>
                <div id='cs2GradientPresets' style='display:flex;flex-direction:column;gap:10px;max-height:220px;overflow-y:auto;'></div>`;
            document.getElementById('cs2Menu').appendChild(settingsPanel);

            // Preset gradients with unique animations and menu styles
            const gradientPresets = [
                {name:'Blue (Default)', colors:['#232946','#3a6ea5','#7ecfff','#8f98ff','#232946'], anim:'cs2GradientMove 20s ease-in-out infinite', size:'300% 300%', border:'#7ecfff', shadow:'#7ecfff88', font:'Segoe UI, Arial, sans-serif', header:'#7ecfff', hoverAnim:'cs2GradientMove 7s linear infinite'},
                {name:'Purple Dream', colors:['#2a1446','#7e3fff','#e664fa','#3a6ea5','#2a1446'], anim:'cs2GradientMove 16s linear infinite', size:'400% 400%', border:'#e664fa', shadow:'#e664fa88', font:'Segoe UI, Arial, sans-serif', header:'#e664fa', hoverAnim:'cs2GradientMoveAlt 6s linear infinite'},
                {name:'Green Matrix', colors:['#0f2027','#2ecc40','#7fffd4','#00ff99','#0f2027'], anim:'cs2GradientMove 14s ease-in infinite', size:'350% 350%', border:'#2ecc40', shadow:'#2ecc4088', font:'Consolas, monospace', header:'#2ecc40', hoverAnim:'cs2GradientMove 4s cubic-bezier(.4,2,.6,1) infinite'},
                {name:'Cyberpunk', colors:['#ff00c8','#00fff7','#232946','#ff00c8'], anim:'cs2GradientMoveAlt 12s linear infinite', size:'400% 400%', border:'#ff00c8', shadow:'#ff00c888', font:'Orbitron, monospace', header:'#ff00c8', hoverAnim:'cs2GradientMoveAlt 3s linear infinite'},
                {name:'Sunset', colors:['#ff9966','#ff5e62','#7ecfff','#232946','#ff9966'], anim:'cs2GradientMove 18s ease-in-out infinite', size:'300% 300%', border:'#ff9966', shadow:'#ff996688', font:'Segoe UI, Arial, sans-serif', header:'#ff9966', hoverAnim:'cs2GradientMove 6s linear infinite'},
                {name:'Red Alert', colors:['#3a0a0a','#ff3a3a','#ff7e5f','#ff3a3a','#3a0a0a'], anim:'cs2GradientMoveAlt 15s cubic-bezier(.4,2,.6,1) infinite', size:'350% 350%', border:'#ff3a3a', shadow:'#ff3a3a88', font:'Segoe UI, Arial, sans-serif', header:'#ff3a3a', hoverAnim:'cs2GradientMoveAlt 2.5s linear infinite'},
                {name:'Ocean Wave', colors:['#2193b0','#6dd5ed','#b2fefa','#2193b0'], anim:'cs2GradientMove 22s linear infinite', size:'400% 400%', border:'#2193b0', shadow:'#2193b088', font:'Segoe UI, Arial, sans-serif', header:'#2193b0', hoverAnim:'cs2GradientMove 5s linear infinite'},
                {name:'Lime Fizz', colors:['#a8ff78','#78ffd6','#43e97b','#38f9d7','#a8ff78'], anim:'cs2GradientMove 13s ease-in-out infinite', size:'350% 350%', border:'#43e97b', shadow:'#43e97b88', font:'Segoe UI, Arial, sans-serif', header:'#43e97b', hoverAnim:'cs2GradientMove 3.5s linear infinite'},
                {name:'Peachy Keen', colors:['#ffecd2','#fcb69f','#ffb347','#ffecd2'], anim:'cs2GradientMoveAlt 17s linear infinite', size:'400% 400%', border:'#ffb347', shadow:'#ffb34788', font:'Segoe UI, Arial, sans-serif', header:'#ffb347', hoverAnim:'cs2GradientMoveAlt 4s linear infinite'},
                {name:'Royal Gold', colors:['#f7971e','#ffd200','#f7971e','#ffd200','#f7971e'], anim:'cs2GradientMove 19s cubic-bezier(.4,2,.6,1) infinite', size:'350% 350%', border:'#ffd200', shadow:'#ffd20088', font:'Georgia, serif', header:'#ffd200', hoverAnim:'cs2GradientMove 2.5s linear infinite'},
                {name:'Midnight', colors:['#232526','#414345','#232526','#232946'], anim:'cs2GradientMove 21s linear infinite', size:'400% 400%', border:'#414345', shadow:'#41434588', font:'Segoe UI, Arial, sans-serif', header:'#414345', hoverAnim:'cs2GradientMove 5s linear infinite'},
                {name:'Candy Pop', colors:['#ff6a00','#ee0979','#ff6a00','#f7971e','#ee0979'], anim:'cs2GradientMoveAlt 14s ease-in-out infinite', size:'400% 400%', border:'#ee0979', shadow:'#ee097988', font:'Comic Sans MS, Comic Sans, cursive', header:'#ee0979', hoverAnim:'cs2GradientMoveAlt 2s linear infinite'}
            ];
            // Add alternate animation keyframes
            addAnimation(`@keyframes cs2GradientMoveAlt {
                0% {background-position: 50% 0%;}
                50% {background-position: 50% 100%;}
                100% {background-position: 50% 0%;}
            }`);
            let presetList = settingsPanel.querySelector('#cs2GradientPresets');
            gradientPresets.forEach((preset, idx) => {
                let btn = document.createElement('button');
                btn.innerText = preset.name;
                btn.style.background = `linear-gradient(90deg,${preset.colors.join(',')})`;
                btn.style.border = '1.5px solid #7ecfff';
                btn.style.borderRadius = '7px';
                btn.style.color = '#fff';
                btn.style.fontWeight = '500';
                btn.style.fontSize = '1em';
                btn.style.padding = '7px 12px';
                btn.style.cursor = 'pointer';
                btn.style.margin = '0';
                btn.style.transition = 'box-shadow 0.18s, border 0.18s';
                btn.onmouseenter = () => {
                    btn.style.boxShadow = '0 0 0 2px #7ecfff99';
                    let bgAnim = document.getElementById('cs2MenuBgAnim');
                    let menuBox = document.getElementById('cs2Menu');
                    let menuHeader = document.getElementById('cs2MenuHeader');
                    if (bgAnim) {
                        bgAnim.style.background = `linear-gradient(135deg,${preset.colors.join(',')})`;
                        bgAnim.style.backgroundSize = preset.size;
                        bgAnim.style.animation = preset.hoverAnim || preset.anim;
                    }
                    if (menuBox) {
                        menuBox.style.border = `2.5px solid ${preset.border}`;
                        menuBox.style.boxShadow = `0 8px 32px 0 rgba(0,0,0,0.37), 0 0 16px 2px ${preset.shadow}`;
                        menuBox.style.fontFamily = preset.font;
                    }
                    if (menuHeader) {
                        menuHeader.style.color = preset.header;
                    }
                    updateTrailStyle(preset);
                };
                btn.onmouseleave = () => {
                    btn.style.boxShadow = 'none';
                    // revert to selected preset
                    let bgAnim = document.getElementById('cs2MenuBgAnim');
                    let menuBox = document.getElementById('cs2Menu');
                    let menuHeader = document.getElementById('cs2MenuHeader');
                    let selected = window.__cs2SelectedPreset || gradientPresets[0];
                    if (bgAnim) {
                        bgAnim.style.background = `linear-gradient(135deg,${selected.colors.join(',')})`;
                        bgAnim.style.backgroundSize = selected.size;
                        bgAnim.style.animation = selected.anim;
                    }
                    if (menuBox) {
                        menuBox.style.border = `2.5px solid ${selected.border}`;
                        menuBox.style.boxShadow = `0 8px 32px 0 rgba(0,0,0,0.37), 0 0 16px 2px ${selected.shadow}`;
                        menuBox.style.fontFamily = selected.font;
                    }
                    if (menuHeader) {
                        menuHeader.style.color = selected.header;
                    }
                    updateTrailStyle(selected);
                };
                btn.onclick = () => {
                    let bgAnim = document.getElementById('cs2MenuBgAnim');
                    let menuBox = document.getElementById('cs2Menu');
                    let menuHeader = document.getElementById('cs2MenuHeader');
                    if (bgAnim) {
                        bgAnim.style.background = `linear-gradient(135deg,${preset.colors.join(',')})`;
                        bgAnim.style.backgroundSize = preset.size;
                        bgAnim.style.animation = preset.anim;
                    }
                    if (menuBox) {
                        menuBox.style.border = `2.5px solid ${preset.border}`;
                        menuBox.style.boxShadow = `0 8px 32px 0 rgba(0,0,0,0.37), 0 0 16px 2px ${preset.shadow}`;
                        menuBox.style.fontFamily = preset.font;
                    }
                    if (menuHeader) {
                        menuHeader.style.color = preset.header;
                    }
                    window.__cs2SelectedPreset = preset;
                };
                presetList.appendChild(btn);
            });
            // Toggle settings panel
            settingsIcon.onclick = function(e) {
                settingsPanel.style.display = (settingsPanel.style.display === 'none' ? 'block' : 'none');
            };
            // Hide panel if click outside
            document.addEventListener('mousedown', function(e) {
                if (settingsPanel.style.display === 'block' && !settingsPanel.contains(e.target) && e.target !== settingsIcon) {
                    settingsPanel.style.display = 'none';
                }
            });

            // Mouse trail effect inside menu
            let menuBox = document.getElementById('cs2Menu');
            // Create a dedicated overlay for the trail
            let trailOverlay = document.createElement('div');
            trailOverlay.id = 'cs2MenuTrailOverlay';
            trailOverlay.style.position = 'absolute';
            trailOverlay.style.left = '0';
            trailOverlay.style.top = '0';
            trailOverlay.style.width = '100%';
            trailOverlay.style.height = '100%';
            trailOverlay.style.pointerEvents = 'none';
            trailOverlay.style.zIndex = 10001;
            menuBox.appendChild(trailOverlay);
            let currentTrailStyle = {
                color: '#7ecfff',
                shadow: '#7ecfff88',
                blur: '8px',
                size: 18
            };
            function updateTrailStyle(preset) {
                currentTrailStyle = {
                    color: preset.header || '#7ecfff',
                    shadow: preset.shadow || '#7ecfff88',
                    blur: '8px',
                    size: 18
                };
                // Unique trail for some presets
                if (preset.name === 'Cyberpunk') {
                    currentTrailStyle.color = '#ff00c8';
                    currentTrailStyle.shadow = '#00fff7';
                    currentTrailStyle.blur = '16px';
                    currentTrailStyle.size = 22;
                } else if (preset.name === 'Green Matrix') {
                    currentTrailStyle.color = '#2ecc40';
                    currentTrailStyle.shadow = '#7fffd4';
                    currentTrailStyle.blur = '12px';
                    currentTrailStyle.size = 16;
                } else if (preset.name === 'Candy Pop') {
                    currentTrailStyle.color = '#ee0979';
                    currentTrailStyle.shadow = '#ff6a00';
                    currentTrailStyle.blur = '10px';
                    currentTrailStyle.size = 20;
                } else if (preset.name === 'Royal Gold') {
                    currentTrailStyle.color = '#ffd200';
                    currentTrailStyle.shadow = '#f7971e';
                    currentTrailStyle.blur = '14px';
                    currentTrailStyle.size = 20;
                } else if (preset.name === 'Midnight') {
                    currentTrailStyle.color = '#414345';
                    currentTrailStyle.shadow = '#232526';
                    currentTrailStyle.blur = '10px';
                    currentTrailStyle.size = 16;
                } else if (preset.name === 'Lime Fizz') {
                    currentTrailStyle.color = '#43e97b';
                    currentTrailStyle.shadow = '#a8ff78';
                    currentTrailStyle.blur = '12px';
                    currentTrailStyle.size = 18;
                }
            }
            // Set initial trail style
            updateTrailStyle(gradientPresets[0]);
            // Mouse trail logic
            if (menuBox) {
                menuBox.addEventListener('mousemove', function(e) {
                    let rect = menuBox.getBoundingClientRect();
                    let x = e.clientX - rect.left;
                    let y = e.clientY - rect.top;
                    let dot = document.createElement('div');
                    dot.style.position = 'absolute';
                    dot.style.left = (x - currentTrailStyle.size/2) + 'px';
                    dot.style.top = (y - currentTrailStyle.size/2) + 'px';
                    dot.style.width = dot.style.height = currentTrailStyle.size + 'px';
                    dot.style.borderRadius = '50%';
                    dot.style.pointerEvents = 'none';
                    dot.style.background = currentTrailStyle.color;
                    dot.style.boxShadow = `0 0 ${currentTrailStyle.blur} 2px ${currentTrailStyle.shadow}`;
                    dot.style.opacity = '0.45';
                    dot.style.zIndex = 10001;
                    dot.style.transition = 'opacity 0.5s linear, transform 0.5s linear';
                    trailOverlay.appendChild(dot);
                    setTimeout(()=>{ dot.style.opacity = '0'; dot.style.transform = 'scale(1.7)'; }, 10);
                    setTimeout(()=>{ if(dot.parentNode) dot.parentNode.removeChild(dot); }, 520);
                });
            }

            // Add Opponent Stats Button
            let statsBtn = document.createElement('button');
            statsBtn.id = 'opponentStatsBtn';
            statsBtn.innerHTML = 'Show Opponent Stats';
            statsBtn.style.background = '#232946';
            statsBtn.style.border = '1px solid #7ecfff';
            statsBtn.style.borderRadius = '5px';
            statsBtn.style.color = '#e0e0e0';
            statsBtn.style.fontWeight = 'normal';
            statsBtn.style.fontSize = '0.88em';
            statsBtn.style.padding = '2px 8px';
            statsBtn.style.margin = '10px 0 10px 0'; // extra space above and below
            statsBtn.style.width = 'auto';
            statsBtn.style.cursor = 'pointer';
            statsBtn.style.boxShadow = 'none';
            statsBtn.style.letterSpacing = 'normal';
            statsBtn.style.transition = 'background 0.18s, color 0.18s, border 0.18s';
            statsBtn.onmouseenter = () => {
                statsBtn.style.background = '#3a6ea5';
                statsBtn.style.color = '#fff';
                statsBtn.style.border = '1px solid #7ecfff';
            };
            statsBtn.onmouseleave = () => {
                statsBtn.style.background = '#232946';
                statsBtn.style.color = '#e0e0e0';
                statsBtn.style.border = '1px solid #7ecfff';
            };
            statsBtn.onclick = function() {
                let opponent = getOpponentUsername();
                fetchOpponentStats(opponent);
            };
            // Insert the button directly after the Auto Run Delay Maximum input
            let maxDelayInput = document.getElementById('timeDelayMax');
            if (maxDelayInput && maxDelayInput.parentNode && maxDelayInput.parentNode.parentNode) {
                maxDelayInput.parentNode.parentNode.insertBefore(statsBtn, maxDelayInput.parentNode.nextSibling);
            } else {
                document.getElementById('cs2Menu').appendChild(statsBtn);
            }

            // Add ESP Mode Toggle
            let espToggleDiv = document.createElement('div');
            espToggleDiv.style.display = 'flex';
            espToggleDiv.style.alignItems = 'center';
            espToggleDiv.style.gap = '8px';
            espToggleDiv.style.margin = '10px 0 10px 0';
            let espToggle = document.createElement('input');
            espToggle.type = 'checkbox';
            espToggle.id = 'espModeToggle';
            espToggle.style.width = '18px';
            espToggle.style.height = '18px';
            let espLabel = document.createElement('label');
            espLabel.htmlFor = 'espModeToggle';
            espLabel.innerText = ' Enable ESP (Hacker Theme)';
            espLabel.style.fontSize = '0.98em';
            espLabel.style.color = '#7ecfff';
            espToggleDiv.appendChild(espToggle);
            espToggleDiv.appendChild(espLabel);
            // Insert ESP toggle just above the Show Opponent Stats button
            if (maxDelayInput && maxDelayInput.parentNode && maxDelayInput.parentNode.parentNode) {
                maxDelayInput.parentNode.parentNode.insertBefore(espToggleDiv, maxDelayInput.parentNode.nextSibling);
            } else {
                document.getElementById('cs2Menu').appendChild(espToggleDiv);
            }

            // ESP mode CSS (dynamic, based on menu theme)
            function applyEspThemeFromMenu() {
                // Try to get the current menu gradient and shadow
                let menuBgAnim = document.getElementById('cs2MenuBgAnim');
                let menuBox = document.getElementById('cs2Menu');
                let menuGradient = menuBgAnim ? menuBgAnim.style.background : 'linear-gradient(135deg, #232946, #3a6ea5, #7ecfff, #8f98ff, #232946)';
                let menuShadow = menuBox ? menuBox.style.boxShadow : '0 0 16px 2px #7ecfff88';
                let menuBorder = menuBox ? menuBox.style.border : '2.5px solid #7ecfff';
                let menuFont = menuBox ? menuBox.style.fontFamily : 'Segoe UI, Arial, sans-serif';
                // Remove old style if present
                if (document.getElementById('espHackerThemeStyle')) document.getElementById('espHackerThemeStyle').remove();
                let espStyle = document.createElement('style');
                espStyle.id = 'espHackerThemeStyle';
                espStyle.innerHTML = `
                    body.esp-hacker-theme {
                        background: ${menuGradient};
                        background-size: 400% 400%;
                        animation: esp-bg-move 18s ease-in-out infinite;
                        color: #7ecfff !important;
                    }
                    @keyframes esp-bg-move {
                        0% {background-position: 0% 50%;}
                        50% {background-position: 100% 50%;}
                        100% {background-position: 0% 50%;}
                    }
                    .esp-hacker-theme * {
                        font-family: ${menuFont} !important;
                        text-shadow: 0 0 4px #00fff7, 0 0 2px #ff00c8;
                    }
                    .esp-hacker-theme .sidebar, .esp-hacker-theme .sidebar-ads, .esp-hacker-theme .ad-container, .esp-hacker-theme .site-header, .esp-hacker-theme .footer, .esp-hacker-theme .chat-component, .esp-hacker-theme .ad, .esp-hacker-theme .upsell, .esp-hacker-theme .board-layout-sidebar, .esp-hacker-theme .board-layout-right, .esp-hacker-theme .board-layout-left {
                        display: none !important;
                    }
                    .esp-hacker-theme .board {
                        box-shadow: ${menuShadow};
                        ${menuBorder ? `border: ${menuBorder};` : ''}
                        border-radius: 18px;
                        animation: esp-board-glow 2.5s linear infinite alternate;
                    }
                    @keyframes esp-board-glow {
                        0% { box-shadow: 0 0 32px #00fff7cc, 0 0 8px #ff00c8cc; }
                        100% { box-shadow: 0 0 64px #ff00c8cc, 0 0 16px #00fff7cc; }
                    }
                    .esp-hacker-theme .piece, .esp-hacker-theme .highlight {
                        filter: drop-shadow(0 0 6px #00fff7) drop-shadow(0 0 2px #ff00c8);
                    }
                    .esp-hacker-theme .move-list, .esp-hacker-theme .vertical-move-list, .esp-hacker-theme .move-list-component {
                        background: rgba(24,28,36,0.85) !important;
                        border: 1.5px solid #00fff7 !important;
                        border-radius: 10px !important;
                        color: #7ecfff !important;
                    }
                `;
                document.head.appendChild(espStyle);
            }

            // ESP mouse-following animation
            let espTrailOverlay = null;
            let espTrailDots = [];
            function enableEspTrail() {
                if (espTrailOverlay) return;
                espTrailOverlay = document.createElement('div');
                espTrailOverlay.id = 'espTrailOverlay';
                espTrailOverlay.style.position = 'fixed';
                espTrailOverlay.style.left = '0';
                espTrailOverlay.style.top = '0';
                espTrailOverlay.style.width = '100vw';
                espTrailOverlay.style.height = '100vh';
                espTrailOverlay.style.pointerEvents = 'none';
                espTrailOverlay.style.zIndex = 1000000;
                document.body.appendChild(espTrailOverlay);
                document.addEventListener('mousemove', espTrailMouseMove);
            }
            function disableEspTrail() {
                if (espTrailOverlay && espTrailOverlay.parentNode) espTrailOverlay.parentNode.removeChild(espTrailOverlay);
                espTrailOverlay = null;
                espTrailDots = [];
                document.removeEventListener('mousemove', espTrailMouseMove);
            }
            function espTrailMouseMove(e) {
                if (!espTrailOverlay) return;
                let dot = document.createElement('div');
                dot.style.position = 'absolute';
                dot.style.left = (e.clientX - 10) + 'px';
                dot.style.top = (e.clientY - 10) + 'px';
                dot.style.width = dot.style.height = '20px';
                dot.style.borderRadius = '50%';
                dot.style.pointerEvents = 'none';
                dot.style.background = 'radial-gradient(circle, #00fff7 0%, #ff00c8 80%, transparent 100%)';
                dot.style.boxShadow = '0 0 24px 8px #00fff7cc, 0 0 8px 2px #ff00c8cc';
                dot.style.opacity = '0.7';
                dot.style.zIndex = 1000000;
                dot.style.transition = 'opacity 0.7s linear, transform 0.7s linear';
                espTrailOverlay.appendChild(dot);
                setTimeout(()=>{ dot.style.opacity = '0'; dot.style.transform = 'scale(1.7)'; }, 10);
                setTimeout(()=>{ if(dot.parentNode) dot.parentNode.removeChild(dot); }, 700);
            }

            espToggle.onchange = function() {
                if (espToggle.checked) {
                    document.body.classList.add('esp-hacker-theme');
                    applyEspThemeFromMenu();
                    enableEspTrail();
                } else {
                    document.body.classList.remove('esp-hacker-theme');
                    if (document.getElementById('espHackerThemeStyle')) document.getElementById('espHackerThemeStyle').remove();
                    disableEspTrail();
                }
            };

            // ESP web/cyber network animation
            let espWebCanvas = null;
            let espWebCtx = null;
            let espWebNodes = [];
            let espWebAnimId = null;
            let espWebMouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
            let espWebLines = [];
            let espWebMouseTrail = [];
            // Add at the top of the ESP web section, after espWebMouse and espWebMouseTrail:
            let espWebMouseInfected = false;
            let espWebMouseInfectionStart = {};
            let espWebMouseInfectionTime = null;
            function espWebMouseMove(e) {
                espWebMouse.x = e.clientX;
                espWebMouse.y = e.clientY;
                // Add to contrail
                espWebMouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
                if (espWebMouseTrail.length > 24) espWebMouseTrail.shift();
            }
            function enableEspWeb() {
                if (espWebCanvas) return;
                // Get menu theme color from menu gradient
                let menuBgAnim = document.getElementById('cs2MenuBgAnim');
                let menuGradient = menuBgAnim ? menuBgAnim.style.background : 'linear-gradient(135deg, #232946, #3a6ea5, #7ecfff, #8f98ff, #232946)';
                // Extract the first color from the gradient string
                let mainColor = '#7ecfff';
                let match = menuGradient.match(/(#[0-9a-fA-F]{6}|rgb\([^\)]+\)|hsl\([^\)]+\))/);
                if (match) mainColor = match[1];
                // Fallback: try to get a color from the menu border
                let menuBox = document.getElementById('cs2Menu');
                if (menuBox && menuBox.style.border) {
                    let borderColor = menuBox.style.border.match(/(#[0-9a-fA-F]{6}|rgb\([^\)]+\)|hsl\([^\)]+\))/);
                    if (borderColor) mainColor = borderColor[1];
                }
                espWebCanvas = document.createElement('canvas');
                espWebCanvas.id = 'espWebCanvas';
                espWebCanvas.width = window.innerWidth;
                espWebCanvas.height = window.innerHeight;
                espWebCanvas.style.position = 'fixed';
                espWebCanvas.style.left = '0';
                espWebCanvas.style.top = '0';
                espWebCanvas.style.width = '100vw';
                espWebCanvas.style.height = '100vh';
                espWebCanvas.style.pointerEvents = 'none';
                espWebCanvas.style.zIndex = 1000000;
                document.body.appendChild(espWebCanvas);
                espWebCtx = espWebCanvas.getContext('2d');
                espWebNodes = [];
                let infectionNodeIdx = Math.floor(Math.random() * 70);
                for (let i = 0; i < 70; i++) {
                    let size = 1.5;
                    espWebNodes.push({
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        vx: (Math.random()-0.5)*1.2, // was 0.6, now 1.2 for faster movement
                        vy: (Math.random()-0.5)*1.2, // was 0.6, now 1.2 for faster movement
                        size,
                        color: mainColor,
                        infected: i === infectionNodeIdx,
                        infectionTime: i === infectionNodeIdx ? Date.now() : null
                    });
                }
                espWebLines = [];
                window.addEventListener('mousemove', espWebMouseMove);
                window.addEventListener('resize', espWebResize);
                espWebAnimId = requestAnimationFrame(function draw() { espWebDraw(mainColor); });
            }
            function disableEspWeb() {
                if (espWebCanvas && espWebCanvas.parentNode) espWebCanvas.parentNode.removeChild(espWebCanvas);
                espWebCanvas = null;
                espWebCtx = null;
                espWebNodes = [];
                espWebLines = [];
                if (espWebAnimId) cancelAnimationFrame(espWebAnimId);
                window.removeEventListener('mousemove', espWebMouseMove);
                window.removeEventListener('resize', espWebResize);
            }
            function espWebResize() {
                if (espWebCanvas) {
                    espWebCanvas.width = window.innerWidth;
                    espWebCanvas.height = window.innerHeight;
                }
            }
            // Add this helper function near the top of ESP web code (before espWebDraw or at the top of the ESP section)
            function getInfectionRGB() {
                const hue = (Date.now() / 8) % 360;
                return `hsl(${hue}, 100%, 55%)`;
            }
            // Helper for RGB gradient
            function getRGBGradient(ctx, x1, y1, x2, y2) {
                let grad = ctx.createLinearGradient(x1, y1, x2, y2);
                const t = (Date.now() / 1200) % 1;
                grad.addColorStop(0, `hsl(${(t*360)%360},100%,60%)`);
                grad.addColorStop(0.5, `hsl(${((t+0.33)*360)%360},100%,60%)`);
                grad.addColorStop(1, `hsl(${((t+0.66)*360)%360},100%,60%)`);
                return grad;
            }
            function espWebDraw(mainColor) {
                if (!espWebCanvas || !espWebCtx) return;
                espWebCtx.clearRect(0, 0, espWebCanvas.width, espWebCanvas.height);

                // Move nodes
                for (let node of espWebNodes) {
                    node.x += node.vx;
                    node.y += node.vy;
                    if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
                    if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;
                }

                // Draw persistent lines (fade out over 1s)
                let now = Date.now();
                espWebLines = espWebLines.filter(line => now - line.time < 1000);
                for (let line of espWebLines) {
                    let alpha = 1 - (now - line.time) / 1000;
                    espWebCtx.save();
                    if (line.toMouse) {
                        // Only lines to the mouse node are solid RGB
                        let rgbHue = (Date.now() / 3) % 360;
                        let rgbColor = `hsl(${rgbHue},100%,60%)`;
                        espWebCtx.strokeStyle = rgbColor;
                        espWebCtx.globalAlpha = 0.45 * alpha;
                        espWebCtx.shadowColor = rgbColor;
                        espWebCtx.shadowBlur = 8;
                        espWebCtx.lineWidth = 1.7;
                    } else {
                        espWebCtx.strokeStyle = mainColor;
                        espWebCtx.globalAlpha = 0.13 * alpha;
                        espWebCtx.shadowColor = mainColor + "88";
                        espWebCtx.shadowBlur = 3;
                        espWebCtx.lineWidth = 1.1;
                    }
                    espWebCtx.beginPath();
                    espWebCtx.moveTo(line.x1, line.y1);
                    espWebCtx.lineTo(line.x2, line.y2);
                    espWebCtx.stroke();
                    espWebCtx.restore();
                }

                // Draw new lines between close nodes (theme color)
                for (let i = 0; i < espWebNodes.length; i++) {
                    for (let j = i+1; j < espWebNodes.length; j++) {
                        let a = espWebNodes[i], b = espWebNodes[j];
                        let dist = Math.hypot(a.x-b.x, a.y-b.y);
                        if (dist < 220) {
                            espWebLines.push({
                                x1: a.x, y1: a.y, x2: b.x, y2: b.y,
                                color: mainColor,
                                shadow: mainColor + "88",
                                time: now,
                                toMouse: false
                            });
                        }
                    }
                }
                // Draw new lines from nodes to mouse if close (RGB)
                for (let node of espWebNodes) {
                    let dist = Math.hypot(node.x-espWebMouse.x, node.y-espWebMouse.y);
                    if (dist < 320) {
                        espWebLines.push({
                            x1: node.x, y1: node.y, x2: espWebMouse.x, y2: espWebMouse.y,
                            color: null,
                            shadow: 'rgba(0,0,0,0)',
                            time: now,
                            toMouse: true
                        });
                    }
                }

                // Draw nodes (theme color)
                for (let node of espWebNodes) {
                    espWebCtx.save();
                    espWebCtx.globalAlpha = 0.22;
                    espWebCtx.beginPath();
                    espWebCtx.arc(node.x, node.y, node.size+7, 0, 2*Math.PI);
                    let grad = espWebCtx.createRadialGradient(node.x, node.y, node.size+1, node.x, node.y, node.size+7);
                    grad.addColorStop(0, mainColor); // theme color
                    grad.addColorStop(1, 'rgba(0,0,0,0)');
                    espWebCtx.fillStyle = grad;
                    espWebCtx.shadowColor = mainColor;
                    espWebCtx.shadowBlur = 4;
                    espWebCtx.fill();
                    espWebCtx.restore();

                    // Main node (solid, less visible)
                    espWebCtx.save();
                    espWebCtx.globalAlpha = 0.32;
                    espWebCtx.beginPath();
                    espWebCtx.arc(node.x, node.y, node.size, 0, 2*Math.PI);
                    espWebCtx.fillStyle = mainColor;
                    espWebCtx.shadowColor = mainColor;
                    espWebCtx.shadowBlur = 2;
                    espWebCtx.fill();
                    espWebCtx.restore();
                }

                // Draw mouse node contrail (RGB, smooth, layered)
                for (let i = 0; i < espWebMouseTrail.length; i++) {
                    let pt = espWebMouseTrail[i];
                    let age = now - pt.time;
                    if (age > 700) continue; // show a bit longer trail
                    let t = ((pt.time/1200)%1);
                    let color = `hsl(${(t*360)%360},100%,60%)`;
                    // Layered effect: draw several circles per point, each smaller and more transparent
                    for (let layer = 0; layer < 3; layer++) {
                        let layerAlpha = 0.18 * (1 - age/700) * (1 - layer/3);
                        let layerSize = (14 - layer*4) * (1 - age/700) + 3;
                        espWebCtx.save();
                        espWebCtx.globalAlpha = layerAlpha;
                        espWebCtx.beginPath();
                        espWebCtx.arc(pt.x, pt.y, layerSize, 0, 2*Math.PI);
                        espWebCtx.fillStyle = color;
                        espWebCtx.shadowColor = color;
                        espWebCtx.shadowBlur = 10 - layer*3;
                        espWebCtx.fill();
                        espWebCtx.restore();
                    }
                }

                // Draw mouse node (your node) as RGB
                espWebCtx.save();
                espWebCtx.beginPath();
                espWebCtx.arc(espWebMouse.x, espWebMouse.y, 1, 0, 2*Math.PI);
                let grad3 = espWebCtx.createRadialGradient(espWebMouse.x, espWebMouse.y, 7, espWebMouse.x, espWebMouse.y, 13);
                const t = (Date.now() / 1200) % 1;
                grad3.addColorStop(0, `hsl(${(t*360)%360},100%,60%)`);
                grad3.addColorStop(1, 'rgba(0,0,0,0)');
                espWebCtx.fillStyle = grad3;
                espWebCtx.shadowColor = `hsl(${(t*360)%360},100%,60%)`;
                espWebCtx.shadowBlur = 12;
                espWebCtx.globalAlpha = 0.85;
                espWebCtx.fill();
                espWebCtx.restore();

                espWebCtx.save();
                espWebCtx.beginPath();
                espWebCtx.arc(espWebMouse.x, espWebMouse.y, 4.5, 0, 2*Math.PI);
                espWebCtx.fillStyle = `hsl(${(t*360)%360},100%,60%)`;
                espWebCtx.shadowColor = `hsl(${(t*360)%360},100%,60%)`;
                espWebCtx.shadowBlur = 8;
                espWebCtx.fill();
                espWebCtx.restore();

                espWebAnimId = requestAnimationFrame(function draw() { espWebDraw(mainColor); });
            }

            espToggle.onchange = function() {
                if (espToggle.checked) {
                    document.body.classList.add('esp-hacker-theme');
                    applyEspThemeFromMenu();
                    enableEspWeb();
                } else {
                    document.body.classList.remove('esp-hacker-theme');
                    if (document.getElementById('espHackerThemeStyle')) document.getElementById('espHackerThemeStyle').remove();
                    disableEspWeb();
                }
            };

            // 1. Ensure the mouse-following node is not drawn at all (remove or comment out the mouse node drawing block)
            // (No code for drawing the mouse node)
            // ... existing code ...
            // 2. Add a subtle glassy overlay to the ESP web canvas
            if (espWebCanvas && !document.getElementById('espWebGlassOverlay')) {
                let glass = document.createElement('div');
                glass.id = 'espWebGlassOverlay';
                glass.style.position = 'fixed';
                glass.style.left = '0';
                glass.style.top = '0';
                glass.style.width = '100vw';
                glass.style.height = '100vh';
                glass.style.pointerEvents = 'none';
                glass.style.zIndex = 999999;
                glass.style.background = 'rgba(30,34,44,0.18)';
                glass.style.backdropFilter = 'blur(2.5px)';
                document.body.appendChild(glass);
            }
            // ... existing code ...
            // 3. Use a multi-stop animated gradient for RGB lines from your node
            function getRGBGradient(ctx, x1, y1, x2, y2) {
                let grad = ctx.createLinearGradient(x1, y1, x2, y2);
                const t = (Date.now() / 1200) % 1;
                grad.addColorStop(0, `hsl(${(t*360)%360},100%,60%)`);
                grad.addColorStop(0.5, `hsl(${((t+0.33)*360)%360},100%,60%)`);
                grad.addColorStop(1, `hsl(${((t+0.66)*360)%360},100%,60%)`);
                return grad;
            }
            // ... existing code ...
            // 4. In the line drawing section, use the premium gradient for lines from your node if infected, and a premium palette for others
            for (let line of espWebLines) {
                let alpha = 1 - (now - line.time) / 1000;
                espWebCtx.save();
                if (line.toMouse && espWebMouseInfected) {
                    espWebCtx.strokeStyle = getRGBGradient(espWebCtx, line.x1, line.y1, line.x2, line.y2);
                    espWebCtx.globalAlpha = 0.85 * alpha;
                    espWebCtx.shadowColor = getInfectionRGB();
                    espWebCtx.shadowBlur = 12;
                } else {
                    espWebCtx.strokeStyle = line.infected ? getInfectionRGB() : mainColor; // use menu theme color for infected, or theme color for others
                    espWebCtx.globalAlpha = line.toMouse ? 0.7 * alpha : 0.08 * alpha;
                    espWebCtx.shadowColor = line.infected ? getInfectionRGB() : mainColor + "88"; // use semi-transparent shadow for infected, or theme color shadow for others
                    espWebCtx.shadowBlur = line.infected ? 10 : 2;
                }
                espWebCtx.lineWidth = 1.1;
                espWebCtx.beginPath();
                espWebCtx.moveTo(line.x1, line.y1);
                espWebCtx.lineTo(line.x2, line.y2);
                espWebCtx.stroke();
                espWebCtx.restore();
                if (line.idxA !== undefined && line.idxB !== undefined && !line.toMouse) {
                    connectionMap[line.idxA].push(line.idxB);
                    connectionMap[line.idxB].push(line.idxA);
                }
            }
            // ... existing code ...
            // 5. In the node drawing section, increase infected node glow and use a premium palette for non-infected nodes
            for (let node of espWebNodes) {
                espWebCtx.save();
                espWebCtx.globalAlpha = node.infected ? 0.65 : 0.22;
                espWebCtx.beginPath();
                espWebCtx.arc(node.x, node.y, node.size+7, 0, 2*Math.PI);
                let grad = espWebCtx.createRadialGradient(node.x, node.y, node.size+1, node.x, node.y, node.size+7);
                if (node.infected) {
                    grad.addColorStop(0, getInfectionRGB());
                    grad.addColorStop(1, 'rgba(0,0,0,0)');
                } else {
                    grad.addColorStop(0, mainColor); // use theme color
                    grad.addColorStop(1, 'rgba(0,0,0,0)');
                }
                espWebCtx.fillStyle = grad;
                espWebCtx.shadowColor = node.infected ? getInfectionRGB() : mainColor;
                espWebCtx.shadowBlur = node.infected ? 18 : 4;
                espWebCtx.fill();
                espWebCtx.restore();
                // Main node (solid, less visible)
                espWebCtx.save();
                espWebCtx.globalAlpha = node.infected ? 0.95 : 0.32;
                espWebCtx.beginPath();
                espWebCtx.arc(node.x, node.y, node.size, 0, 2*Math.PI);
                espWebCtx.fillStyle = node.infected ? '#111' : mainColor;
                espWebCtx.shadowColor = node.infected ? getInfectionRGB() : mainColor;
                espWebCtx.shadowBlur = node.infected ? 10 : 2;
                espWebCtx.fill();
                espWebCtx.restore();
            }
            // ... existing code ...

            // After creating the menu div and before appending other children:
            // Add a canvas for the ESP effect as a background layer inside the menu
            var espMenuCanvas = document.createElement('canvas');
            espMenuCanvas.id = 'espMenuCanvas';
            espMenuCanvas.style.position = 'absolute';
            espMenuCanvas.style.left = '0';
            espMenuCanvas.style.top = '0';
            espMenuCanvas.style.width = '100%';
            espMenuCanvas.style.height = '100%';
            espMenuCanvas.style.pointerEvents = 'none';
            espMenuCanvas.style.zIndex = 0; // below all menu content, above bgAnim
            // Insert as the first child after bgAnim
            if (div.firstChild && div.firstChild.id === 'cs2MenuBgAnim') {
              div.insertBefore(espMenuCanvas, div.firstChild.nextSibling);
            } else {
              div.insertBefore(espMenuCanvas, div.firstChild);
            }

            // Animation logic for the menu ESP effect
            function startMenuEspEffect() {
              var menu = document.getElementById('cs2Menu');
              var canvas = document.getElementById('espMenuCanvas');
              if (!menu || !canvas) return;
              function getMenuMainColor() {
                // Try to get the main color from the menu gradient or border
                let menuBgAnim = document.getElementById('cs2MenuBgAnim');
                let menuGradient = menuBgAnim ? menuBgAnim.style.background : 'linear-gradient(135deg, #232946, #3a6ea5, #7ecfff, #8f98ff, #232946)';
                let mainColor = '#7ecfff';
                let match = menuGradient.match(/(#[0-9a-fA-F]{6}|rgb\([^)]+\)|hsl\([^)]+\))/);
                if (match) mainColor = match[1];
                let menuBox = document.getElementById('cs2Menu');
                if (menuBox && menuBox.style.border) {
                  let borderColor = menuBox.style.border.match(/(#[0-9a-fA-F]{6}|rgb\([^)]+\)|hsl\([^)]+\))/);
                  if (borderColor) mainColor = borderColor[1];
                }
                return mainColor;
              }
              function getRGBGradient(ctx, x1, y1, x2, y2) {
                let grad = ctx.createLinearGradient(x1, y1, x2, y2);
                const t = (Date.now() / 1200) % 1;
                grad.addColorStop(0, `hsl(${(t*360)%360},100%,60%)`);
                grad.addColorStop(0.5, `hsl(${((t+0.33)*360)%360},100%,60%)`);
                grad.addColorStop(1, `hsl(${((t+0.66)*360)%360},100%,60%)`);
                return grad;
              }
              function resizeCanvas() {
                canvas.width = menu.offsetWidth;
                canvas.height = menu.offsetHeight;
              }
              resizeCanvas();
              window.addEventListener('resize', resizeCanvas);
              // Node and line setup
              var nodeCount = 18;
              var nodes = [];
              for (var i = 0; i < nodeCount; i++) {
                nodes.push({
                  x: Math.random() * canvas.width,
                  y: Math.random() * canvas.height,
                  vx: (Math.random() - 0.5) * 0.7,
                  vy: (Math.random() - 0.5) * 0.7,
                  size: 1.2 + Math.random() * 1.8
                });
              }
              var ctx = canvas.getContext('2d');
              // Mouse contrail state
              var mouse = { x: canvas.width/2, y: canvas.height/2 };
              var mouseTrail = [];
              menu.addEventListener('mousemove', function(e) {
                var rect = menu.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
                mouseTrail.push({ x: mouse.x, y: mouse.y, time: Date.now() });
                if (mouseTrail.length > 24) mouseTrail.shift();
              });
              function draw() {
                let mainColor = getMenuMainColor();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Move nodes
                for (var i = 0; i < nodes.length; i++) {
                  var n = nodes[i];
                  n.x += n.vx;
                  n.y += n.vy;
                  if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
                  if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
                }
                // Draw lines (more visible)
                for (var i = 0; i < nodes.length; i++) {
                  for (var j = i + 1; j < nodes.length; j++) {
                    var a = nodes[i], b = nodes[j];
                    var dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 90) {
                      ctx.save();
                      ctx.globalAlpha = 0.32 * (1 - dist / 90); // more visible
                      ctx.strokeStyle = mainColor;
                      ctx.shadowColor = mainColor + 'cc';
                      ctx.shadowBlur = 4;
                      ctx.lineWidth = 1.7;
                      ctx.beginPath();
                      ctx.moveTo(a.x, a.y);
                      ctx.lineTo(b.x, b.y);
                      ctx.stroke();
                      ctx.restore();
                    }
                  }
                }
                // Draw mouse contrail lines to nearby nodes (solid RGB color)
                for (var i = 0; i < nodes.length; i++) {
                  var n = nodes[i];
                  var dist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
                  if (dist < 120) {
                    ctx.save();
                    ctx.globalAlpha = 0.7 * (1 - dist / 120);
                    let rgbHue = (Date.now() / 3) % 360;
                    let rgbColor = `hsl(${rgbHue},100%,60%)`;
                    ctx.strokeStyle = rgbColor;
                    ctx.shadowColor = rgbColor;
                    ctx.shadowBlur = 8;
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    ctx.restore();
                  }
                }
                // Draw mouse contrail trail (fading dots)
                for (var i = 0; i < mouseTrail.length; i++) {
                  var pt = mouseTrail[i];
                  var age = Date.now() - pt.time;
                  if (age > 700) continue;
                  let t = ((pt.time/1200)%1);
                  let color = `hsl(${(t*360)%360},100%,60%)`;
                  ctx.save();
                  ctx.globalAlpha = 0.18 * (1 - age/700);
                  ctx.beginPath();
                  ctx.arc(pt.x, pt.y, 7 * (1 - age/700) + 2, 0, 2 * Math.PI);
                  ctx.fillStyle = color;
                  ctx.shadowColor = color;
                  ctx.shadowBlur = 8;
                  ctx.fill();
                  ctx.restore();
                }
                // Draw nodes
                for (var i = 0; i < nodes.length; i++) {
                  var n = nodes[i];
                  ctx.save();
                  ctx.globalAlpha = 0.22;
                  ctx.beginPath();
                  ctx.arc(n.x, n.y, n.size + 4, 0, 2 * Math.PI);
                  var grad = ctx.createRadialGradient(n.x, n.y, n.size, n.x, n.y, n.size + 4);
                  grad.addColorStop(0, mainColor);
                  grad.addColorStop(1, 'rgba(0,0,0,0)');
                  ctx.fillStyle = grad;
                  ctx.shadowColor = mainColor;
                  ctx.shadowBlur = 2;
                  ctx.fill();
                  ctx.restore();
                  ctx.save();
                  ctx.globalAlpha = 0.32;
                  ctx.beginPath();
                  ctx.arc(n.x, n.y, n.size, 0, 2 * Math.PI);
                  ctx.fillStyle = mainColor;
                  ctx.shadowColor = mainColor;
                  ctx.shadowBlur = 1;
                  ctx.fill();
                  ctx.restore();
                }
                requestAnimationFrame(draw);
              }
              draw();
            }
            setTimeout(startMenuEspEffect, 500);
            // Also update the effect when a gradient preset is selected
            if (window.__cs2SelectedPreset) {
              setTimeout(startMenuEspEffect, 1000);
            }

            loaded = true;
        } catch (error) {console.log(error)}
    }


    function other(delay){
        var endTime = Date.now() + delay;
        var timer = setInterval(()=>{
            if(Date.now() >= endTime){
                myFunctions.autoRun(lastValue);
                canGo = true;
                clearInterval(timer);
            }
        },10);
    }

    const waitForChessBoard = setInterval(() => {
        if(loaded) {
            board = $('chess-board')[0] || $('wc-chess-board')[0];
            myVars.autoRun = $('#autoRun')[0].checked;
            myVars.autoMove = $('#autoMove')[0].checked;
            let minDel = parseInt($('#timeDelayMin')[0].value);
            let maxDel = parseInt($('#timeDelayMax')[0].value);
            myVars.delay = Math.random() * (maxDel - minDel) + minDel;
            myVars.isThinking = isThinking;
            myFunctions.spinner();
            if(board.game.getTurn() == board.game.getPlayingAs()){myTurn = true;} else {myTurn = false;}
            $('#depthText')[0].innerHTML = "Your Current Depth Is: <strong>"+lastValue+"</strong>";
        } else {
            myFunctions.loadEx();
        }

        if(!engine.engine){
            myFunctions.loadChessEngine();
        }
        if(myVars.autoRun == true && canGo == true && isThinking == false && myTurn){
            //console.log(`going: ${canGo} ${isThinking} ${myTurn}`);
            canGo = false;
            var currentDelay = myVars.delay != undefined ? myVars.delay * 1000 : 10;
            other(currentDelay);
        }
    }, 100);
}

//Touching below may break the script

var isThinking = false
var canGo = true;
var myTurn = false;
var board;

window.addEventListener("load", (event) => {
    let currentTime = Date.now();
    main();
});

function getOpponentUsername() {
    // Get all username elements in the player panels
    let userEls = document.querySelectorAll('.cc-user-username-component[data-test-element="user-tagline-username"]');
    if (!userEls || userEls.length < 2) return null;

    // The first is usually the top (opponent), the second is you (bottom)
    // If you want to be extra robust, you can check which one is not you
    // For now, just return the first one (opponent)
    return userEls[0].textContent.trim();
}

function fetchOpponentStats(username) {
    if (!username) return;
    fetch(`https://api.chess.com/pub/player/${username}`)
        .then(res => res.json())
        .then(profile => {
            fetch(`https://api.chess.com/pub/player/${username}/stats`)
                .then(res => res.json())
                .then(data => {
                    // Remove any existing modal
                    let oldModal = document.getElementById('opponentStatsModal');
                    if (oldModal) oldModal.parentNode.removeChild(oldModal);

                    // Create modal background (smaller, not full screen)
                    let modalBg = document.createElement('div');
                    modalBg.id = 'opponentStatsModal';
                    modalBg.style.position = 'fixed';
                    modalBg.style.left = '0';
                    modalBg.style.top = '0';
                    modalBg.style.width = '100vw';
                    modalBg.style.height = '100vh';
                    modalBg.style.background = 'rgba(24,28,36,0.35)';
                    modalBg.style.zIndex = 100010;
                    modalBg.style.display = 'flex';
                    modalBg.style.alignItems = 'center';
                    modalBg.style.justifyContent = 'center';

                    // Create modal card (smaller, more organized)
                    let modal = document.createElement('div');
                    modal.id = 'opponentStatsModalCard';
                    modal.style.background = 'rgba(24,28,36,0.98)';
                    modal.style.border = '3px solid';
                    modal.style.borderRadius = '18px';
                    modal.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.37), 0 0 16px 2px #7ecfff88';
                    modal.style.padding = '0 0 18px 0';
                    modal.style.color = '#e0e0e0';
                    modal.style.fontFamily = 'Segoe UI, Arial, sans-serif';
                    modal.style.maxWidth = '440px';
                    modal.style.width = '100%';
                    modal.style.maxHeight = '80vh';
                    modal.style.overflowY = 'auto';
                    modal.style.position = 'fixed';
                    modal.style.left = '50%';
                    modal.style.top = '20%';
                    modal.style.transform = 'translate(-50%, 0)';
                    modal.style.display = 'flex';
                    modal.style.flexDirection = 'column';
                    modal.style.gap = '0';
                    modal.style.zIndex = 100010;
                    modal.style.cursor = 'default';
                    // RGB border animation
                    modal.style.borderImage = 'linear-gradient(270deg, #ff00c8, #00fff7, #7ecfff, #ff00c8) 1';
                    modal.style.borderImageSlice = '1';
                    modal.style.animation = 'rgb-border 3s linear infinite';

                    // Add RGB border animation style if not present
                    if (!document.getElementById('rgbBorderAnimStyle')) {
                        let style = document.createElement('style');
                        style.id = 'rgbBorderAnimStyle';
                        style.innerHTML = `@keyframes rgb-border {
                            0% { border-image-source: linear-gradient(270deg, #ff00c8, #00fff7, #7ecfff, #ff00c8); }
                            25% { border-image-source: linear-gradient(0deg, #00fff7, #7ecfff, #ff00c8, #00fff7); }
                            50% { border-image-source: linear-gradient(90deg, #7ecfff, #ff00c8, #00fff7, #7ecfff); }
                            75% { border-image-source: linear-gradient(180deg, #ff00c8, #00fff7, #7ecfff, #ff00c8); }
                            100% { border-image-source: linear-gradient(270deg, #ff00c8, #00fff7, #7ecfff, #ff00c8); }
                        }
                        #opponentStatsModalCard .modal-header { cursor: move; user-select: none; background: linear-gradient(90deg,#181c24 60%,#7ecfff22 100%); border-radius: 16px 16px 0 0; padding: 14px 18px 10px 18px; display: flex; align-items: center; justify-content: space-between; }
                        #opponentStatsModalCard .modal-title { font-size: 1.18em; font-weight: 700; color: #7ecfff; letter-spacing: 1px; }
                        #opponentStatsModalCard .modal-close { font-size: 1.7em; color: #7ecfff; background: none; border: none; cursor: pointer; font-weight: bold; padding: 0 8px; }
                        #opponentStatsModalCard .modal-close:hover { color: #ff00c8; }
                        #opponentStatsModalCard .modal-content { padding: 18px 24px 0 24px; display: flex; flex-direction: column; gap: 10px; }
                        #opponentStatsModalCard .modal-section-title { font-size: 1.05em; font-weight: 600; margin-bottom: 2px; color: #7ecfff; }
                        #opponentStatsModalCard .modal-user { display: flex; align-items: center; gap: 16px; margin-bottom: 6px; }
                        #opponentStatsModalCard .modal-avatar { width: 56px; height: 56px; border-radius: 10px; border: 2px solid #7ecfff; background: #232946; }
                        #opponentStatsModalCard .modal-country { margin-top: 4px; border-radius: 4px; border: 1px solid #7ecfff; }
                        #opponentStatsModalCard .modal-report { margin-top: 10px; background: linear-gradient(90deg,#ff3a3a,#ff00c8); color: #fff; border: none; border-radius: 7px; font-weight: bold; font-size: 1em; padding: 7px 18px; cursor: pointer; box-shadow: 0 0 8px #ff00c888; transition: background 0.18s; }
                        #opponentStatsModalCard .modal-report:hover { background: linear-gradient(90deg,#ff00c8,#ff3a3a); }
                        `;
                        document.head.appendChild(style);
                    }

                    // Modal header (for dragging)
                    let header = document.createElement('div');
                    header.className = 'modal-header';
                    let title = document.createElement('div');
                    title.className = 'modal-title';
                    title.innerText = 'Opponent Profile & Stats';
                    let closeBtn = document.createElement('button');
                    closeBtn.className = 'modal-close';
                    closeBtn.innerText = '×';
                    closeBtn.title = 'Close';
                    closeBtn.onclick = function() {
                        if (modal.parentNode) modal.parentNode.removeChild(modal);
                    };
                    header.appendChild(title);
                    header.appendChild(closeBtn);
                    modal.appendChild(header);

                    // Drag logic for modal (header only)
                    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
                    header.onmousedown = function(e) {
                        isDragging = true;
                        dragOffsetX = e.clientX - modal.getBoundingClientRect().left;
                        dragOffsetY = e.clientY - modal.getBoundingClientRect().top;
                        modal.style.transition = 'none';
                        document.body.style.userSelect = 'none';
                    };
                    document.onmousemove = function(e) {
                        if (isDragging) {
                            modal.style.left = (e.clientX - dragOffsetX) + 'px';
                            modal.style.top = (e.clientY - dragOffsetY) + 'px';
                            modal.style.transform = 'none';
                        }
                    };
                    document.onmouseup = function() {
                        if (isDragging) {
                            isDragging = false;
                            document.body.style.userSelect = '';
                        }
                    };

                    // Modal content
                    let content = document.createElement('div');
                    content.className = 'modal-content';

                    // Avatar and username section
                    let avatar = profile.avatar || 'https://www.chess.com/bundles/web/images/noavatar_l.84a92436@3x.gif';
                    let country = profile.country ? profile.country.split('/').pop().toUpperCase() : 'N/A';
                    let countryFlag = profile.country ? `https://flagsapi.com/${country}/flat/32.png` : '';
                    let userSection = `<div class='modal-user'>` +
                        `<img src='${avatar}' alt='avatar' class='modal-avatar'>` +
                        `<div><div style='font-size:1.18em;font-weight:600;color:#7ecfff;'>${profile.username}` +
                        (profile.title ? ` <span style='font-size:0.9em;color:#ff00c8;'>[${profile.title.toUpperCase()}]</span>` : '') +
                        `</div>` +
                        (profile.name ? `<div style='font-size:0.98em;color:#b8e0ff;'>${profile.name}</div>` : '') +
                        (countryFlag ? `<img src='${countryFlag}' alt='${country}' title='${country}' class='modal-country'>` : '') +
                        `</div></div>`;

                    // Ratings section
                    function statRow(label, obj) {
                        if (!obj) return '';
                        let rating = obj.last ? obj.last.rating : 'N/A';
                        let rec = obj.record ? ` <span style='color:#b8e0ff;font-size:0.98em;'>(Wins: ${obj.record.win} Losses: ${obj.record.loss} Draws: ${obj.record.draw})</span>` : '';
                        return `<div style='margin-bottom:4px;'><span style='font-weight:600;'>${label}:</span> <span style='color:#7ecfff;'>${rating}</span>${rec}</div>`;
                    }
                    let ratingsSection = `<div><div class='modal-section-title'>Ratings</div>`;
                    ratingsSection += statRow('Blitz', data.chess_blitz);
                    ratingsSection += statRow('Bullet', data.chess_bullet);
                    ratingsSection += statRow('Rapid', data.chess_rapid);
                    ratingsSection += statRow('Daily', data.chess_daily);
                    ratingsSection += statRow('Puzzle', data.tactics);
                    ratingsSection += statRow('960', data.chess960);
                    ratingsSection += statRow('Three-Check', data.threecheck);
                    ratingsSection += statRow('King of the Hill', data.king_of_the_hill);
                    ratingsSection += statRow('Crazyhouse', data.crazyhouse);
                    ratingsSection += statRow('Bughouse', data.bughouse);
                    ratingsSection += statRow('Atomic', data.atomic);
                    ratingsSection += statRow('Horde', data.horde);
                    ratingsSection += statRow('Racing Kings', data.racing_kings);
                    ratingsSection += statRow('Puzzle Rush', data.puzzle_rush);
                    ratingsSection += `</div>`;

                    // Other info section
                    let otherSection = `<div><div class='modal-section-title'>Other Info</div>`;
                    if (profile.last_online) {
                        let d = new Date(profile.last_online * 1000);
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Last Online: ${d.toLocaleString()}</div>`;
                    }
                    if (profile.joined) {
                        let d = new Date(profile.joined * 1000);
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Joined: ${d.toLocaleDateString()}</div>`;
                    }
                    if (profile.status) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Status: ${profile.status}</div>`;
                    }
                    if (profile.league) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>League: ${profile.league}</div>`;
                    }
                    if (profile.followers !== undefined) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Followers: ${profile.followers}</div>`;
                    }
                    if (profile.is_streamer) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Streamer: Yes</div>`;
                    }
                    if (profile.verified) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Verified: Yes</div>`;
                    }
                    if (profile.location) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Location: ${profile.location}</div>`;
                    }
                    if (profile.fide) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>FIDE Rating: ${profile.fide}</div>`;
                    }
                    if (profile.twitch_url) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'><a href='${profile.twitch_url}' target='_blank' style='color:#7ecfff;text-decoration:underline;'>Twitch</a></div>`;
                    }
                    if (profile.youtube_url) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'><a href='${profile.youtube_url}' target='_blank' style='color:#7ecfff;text-decoration:underline;'>YouTube</a></div>`;
                    }
                    if (profile.title) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Title: ${profile.title.toUpperCase()}</div>`;
                    }
                    if (profile.player_id) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Player ID: ${profile.player_id}</div>`;
                    }
                    if (profile.url) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'><a href='${profile.url}' target='_blank' style='color:#7ecfff;text-decoration:underline;'>Chess.com Profile</a></div>`;
                    }
                    if (profile.clubs && Array.isArray(profile.clubs) && profile.clubs.length > 0) {
                        otherSection += `<div style='font-size:0.98em;color:#b8e0ff;margin-bottom:2px;'>Clubs: ${profile.clubs.map(c => `<a href='${c.url}' target='_blank' style='color:#7ecfff;text-decoration:underline;'>${c.name}</a>`).join(', ')}</div>`;
                    }
                    if (profile.status === 'closed') {
                        otherSection += `<div style='font-size:0.98em;color:#ff3a3a;margin-bottom:2px;'>Account Closed</div>`;
                    }
                    otherSection += `</div>`;

                    // Add all sections to modal content (no report button)
                    content.innerHTML = userSection + ratingsSection + otherSection;
                    modal.appendChild(content);
                    document.body.appendChild(modal);
                });
        });
}

// Usage:
let opponent = getOpponentUsername();
fetchOpponentStats(opponent);