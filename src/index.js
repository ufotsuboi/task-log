import $ from 'jquery'
import { ipcRenderer } from 'electron'

let timer;
let time = 0;
let name = 1;

function start(sender, id = 1) {
  if (timer === undefined) {
    name = id;
    // タイマースタート
    var n = new Notification("Taslog", {
      body: `タスク${name}の計測開始`,
    });
    timer = setInterval(() => {
      time++;
      $("#timer").text(time);
    }, 1000);
  }
}

function stop(sender) {
  if (timer !== undefined) {
    // 現在の日付取得
    var nObj = new Date();
    var month = nObj.getMonth() + 1;
    var date = nObj.getDate() ;
    let key = `${month}-${date}`;
    let data = JSON.parse(localStorage.getItem(key)) || [];
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
  }
}

// ショートカットキーイベントバインド
ipcRenderer.on('menu-start', start);
ipcRenderer.on('menu-stop', stop);

$(() => {
  var nObj = new Date();

  for (var i = 0; i < 14; i++) {
    var month = nObj.getMonth() + 1;
    var date = nObj.getDate() ;
    let key = `${month}-${date}`;
    let data = JSON.parse(localStorage.getItem(key)) || null;
    nObj.setDate (nObj.getDate() - 1);

    if (data === null ) continue;
    let result = {
      1: 0, 2: 0, 3: 0, sum: 0,
    };
    data.forEach((v) => {
      result[v.name] += v.time;
      result.sum += v.time;
    });
    $("#table").append(`<tr><td>${month}月${date}日</td><td>${result[1]}秒</td><td>${(result[1]/result.sum*100).toFixed(2)}％</td><td>${result[2]}秒</td><td>${(result[2]/result.sum*100).toFixed(2)}％</td><td>${result[3]}秒</td><td>${(result[3]/result.sum*100).toFixed(2)}％</td><td>${result.sum}</td></tr>`);
  }
});
