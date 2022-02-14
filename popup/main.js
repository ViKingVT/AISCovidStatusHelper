const CSS = "input:focus {  outline: none !important;  border: 1px solid red !important;  box-shadow: 0 0 10px #719ECE !important;}";
const CSSres = '@charset "UTF-8";' +
  '.shadow-container {' +
  'background:#FFFFFF;' +
  'box-shadow:0 1px 4px #e3ebfc,' +
  '0 24px 48px rgba(230,' +
  '235,' +
  '245,' +
  '.4);' +
  'border-radius:8px;' +
  'padding:24px' +
  '}' +
  '.grid-row-gap-24 {' +
  'grid-row-gap:24px' +
  '}' +
  '.whitespace-nowrap {' +
  'white-space:nowrap' +
  '}' +
  '.trobber {' +
  'color:#0b1f33;' +
  'font:16px/24px Lato,Arial,sans-serif' +
  '}' +
  '.radio {' +
  'margin-right:16px' +
  '}' +
  '.line-top {' +
  'border-top:1px solid #CDD1D4' +
  '}' +
  '.grid-row {' +
  'grid-gap:16px' +
  '}' +
  '.search-result   .title {' +
  'padding-left:48px;' +
  'font:18px/24px Lato-Bold,Arial,sans-serif;' +
  'background:url(https://gu-st.ru/covid-web-st/found.ffcd0d9a3223eb6ffac9.svg) no-repeat 0 2px' +
  '}' +
  '.search-result.not-found   .title {' +
  'background:url(https://gu-st.ru/covid-web-st/not_found.02207fbb9eca765f5d97.svg) no-repeat 0 0' +
  '}' +
  '.search-result   .hint {' +
  'color:#66727f' +
  '}' +
  '.search-result   .result {' +
  'display:-ms-flexbox;' +
  'display:flex;' +
  '-ms-flex-pack:justify;' +
  'justify-content:space-between;' +
  'background:#F5F7FA;' +
  'border-radius:8px;' +
  ' padding:16px 57px 16px 27px' +
  '}' +
  '.search-result   .result   .cert {' +
  'padding:5px 0 0 57px;' +
  'background:url(https://gu-st.ru/covid-web-st/pdf_icon.a1644054f7032e279cbb.svg) no-repeat 0 0' +
  '}' +
  '.search-result   .result   .download {' +
  'text-align:right' +
  '}' +
  '.search-result   .change {' +
  'margin-bottom:24px' +
  '}' +
  '@media all and (min-width: 768px) {' +
  '.buttons {' +
  'display:-ms-flexbox;' +
  'display:flex;' +
  '-ms-flex-pack:center;' +
  'justify-content:center' +
  '}' +
  '.buttons   .button {' +
  'margin-right:32px' +
  '}' +
  '.buttons   .button.change {' +
  'margin-bottom:0' +
  ' }' +
  '}';

function listenForClicks() {
  document.addEventListener("click", (e) => {

    function alertContents(httpRequest) {
      console.log('response');

      if (httpRequest.status == 200) {
        console.log(httpRequest.responseText);
      } else {
        console.warn('С запросом возникла проблема.');
      }

    }

    async function fetchZap(referrer, body, tab, result) {
      try {
        const response = await fetch("https://www.gosuslugi.ru/api/covid-cert/v3/status-cert?_=0.5669856214901583", {
          "credentials": "include",
          "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/json",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
          },
          "referrer": referrer,
          "body": JSON.stringify(body),
          "method": "POST",
          "mode": "cors"
        });
        console.log(fetch.body);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Ой, мы не получили JSON!");
        }
        var json = await response.json();

        browser.tabs.sendMessage(tab.id, {
          command: "showdata",
          result: result,
          js_result: json
        });
        /* Дальнейшая обработка JSON */
      } catch (error) {
        console.log(error);
      }
    }

    function getBody(data) {
      var body = {
        lastName: data.fam,
        firstName: data.name,
        middleName: data.otch,
        birthDate: data.birthday.split('T')[0],
        personData: {
          document: {
            series: data.Docum.p_ser.replace(/\s+/g, ''),
            number: data.Docum.p_num,
            type: "RF_PASSPORT",
            issuedBy: data.Docum.kem,
            issueDate: data.Docum.dvidp.split('T')[0]
          }
        }
      }

      if (data.pol === "Ж") {
        body.personData.gender = "FEMALE";
      } else {
        body.personData.gender = "MALE";
      }
      //var b = JSON.stringify(body);
      return body
    }

    function transferComplete(tabs, evt) {
      let tab = tabs[0];
      var req = evt.currentTarget;
      if (req.status != 200) {
        console.warn(`Ошибка получения данных. ${req.status}: ${req.statusText}`);
        return;
      }
      if (req.response === null) {
        console.warn(`Ошибка получения данных. Пустой ответ.`);
        return;
      }
      var result = JSON.parse(req.response);
      if (result.result === "success") {
        var body = getBody(result.User);
      }
      //const b = body.substring(1, body.length - 1);
      fetchZap(tab.url, body, tab, result);

    }

    function transferFailed(evt) {
      console.error("При загрузке файла произошла ошибка.");
    }

    function sendrequest(url, tabs) {
      console.log("url: " + url);
      let httpRequest = new XMLHttpRequest();

      httpRequest.addEventListener("load", transferComplete.bind(null, tabs), false);
      httpRequest.addEventListener("error", transferFailed, false);

      httpRequest.open('GET', url, true);
      httpRequest.responseType = 'json';
      httpRequest.send();
      console.log('send');
    }

    function finduser(tabs) {
      var idf = document.getElementById('idf').value;
      console.log('id: ' + idf);
      sendrequest("https://develop.mfc.local/users/" + idf, tabs);

      console.log('finduser end');
    }

    function reportError(error) {
      console.error(`Error: ${error}`);
    }

    if (e.target.id === "findbutton") {
      browser.tabs.query({ active: true, currentWindow: true })
        .then(finduser)
        .catch(reportError);
    }

  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({ file: "/content_scripts/main.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);

function logTabs(tabs) {
  // tabs[0].url requires the `tabs` permission or a matching host permission.
  console.log(tabs[0].url);
  browser.tabs.insertCSS({ code: CSS + CSSres });
}

function onError(error) {
  console.log(`Error: ${error}`);
}

let querying = browser.tabs.query({ currentWindow: true, active: true });
querying.then(logTabs, onError);
