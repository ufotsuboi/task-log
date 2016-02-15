import $ from 'jquery'
import { ipcRenderer } from 'electron'

let timer;
let time = 0;

function start() {
  if (timer === undefined) {
    console.log("start");
    // タイマースタート
    var n = new Notification("Taslog", {
      body: `タイマースタート！`,
    });
    timer = setInterval(() => {
      time++;
      $("#timer").text(time);
    }, 1000);

    // ボタンの処理
    $("#start").hide();
    $("#stop").show();
  }
}

function stop() {
  if (timer !== undefined) {
    let data = JSON.parse(localStorage.getItem("hoge")) || [];
    console.log("stop", time);
    // 現在の日付取得
    var nObj = new Date();
    var month = nObj.getMonth() + 1;
    var date = nObj.getDate() ;
    // テーブルに表示
    $("#table").append(`<tr><td>${month}月${date}日</td><td>${time}秒</td></tr>`);
    data.push({
      time: time,
      name: "テスト",
    });
    localStorage.setItem("hoge", JSON.stringify(data));
    var n = new Notification("Taslog", {
      body: `${time}秒を記録しました。`,
    });

    // タイマーリセット
    time = 0;
    $("#timer").text(time);
    clearInterval(timer);
    timer = undefined;

    // ボタンの処理
    $("#start").show();
    $("#stop").hide();
  }
}

// ボタンイベントバインド
$("#start").on('click', start);
$("#stop").on('click', stop);

// キーボードイベントバインド
$(window).keydown(function(e){
  if(event.ctrlKey){
    if(e.keyCode === 83){
      start();
    } else if(e.keyCode === 76){
      stop();
    }
  }
});

// ショートカットキーイベントバインド
ipcRenderer.on('menu-start', start);
ipcRenderer.on('menu-stop', stop);
