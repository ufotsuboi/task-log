import $ from 'jquery'
import { ipcRenderer } from 'electron'

let timer;
let time = 0;
let name = 1;

function start(sender, id = 1) {
  if (timer === undefined) {
    console.log("start");
    console.log(id);
    name = id;
    // タイマースタート
    var n = new Notification("Taslog", {
      body: `タスク${name}の計測開始`,
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

function stop(sender) {
  if (timer !== undefined) {
    // 現在の日付取得
    var nObj = new Date();
    var month = nObj.getMonth() + 1;
    var date = nObj.getDate() ;
    let key = `${month}/${date}`;
    let data = JSON.parse(localStorage.getItem(key)) || [];
    console.log("stop", time);
    // テーブルに表示
    $("#table").append(`<tr><td>${month}月${date}日</td><td>${time}秒</td></tr>`);
    data.push({
      time: time,
      name: name,
      key: key,
    });
    localStorage.setItem(key, JSON.stringify(data));
    var n = new Notification("Taslog", {
      body: `タスク${name}を${time}秒記録`,
    });

    // タイマーリセット
    time = 0;
    name = 1;
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
