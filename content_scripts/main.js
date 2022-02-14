(function () {

  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function paste(js_result) {
    if (js_result.isCertFound) {
      const fio = `${js_result.lastName} ${js_result.firstName} ${js_result.middleName}`;
      var parent = document.getElementsByClassName("container")[3];
      let data = document.createElement("div");
      data.classList.add("grid-row", "js_result", "mt-24")
      data.innerHTML = ''+
        '<div class="col-3 col-md-6 col-lg-9">'+
          '<div class="shadow-container search-result">'+
            '<div class="grid-row">'+
              '<div class="title mb-24 col-md-4 col-lg-9">'+
                'Данные о пользователе найдены'+
              '</div>'+
            '</div>'+
            '<div class="mb-8 ng-star-inserted">' + `${fio}` + '</div>'+
            '<div class="hint mb-24">Информация о перенесённых заболеваниях и вакцинах</div>'+
            '<div class="result mb-24 ng-star-inserted">'+
              '<div class="mt-8 cert"> Сертификат COVID-19 </div>'+
              '<div class="download">'+
                '<p><a href='+`${js_result.pdfUrl.ru}`+' target="_blank"><span class="link-plain">Скачать на русском</span></a></p>'+
              '</div>'+
            '</div>'+
          '</div>'+
      '</div >';
      parent.insertBefore(data, parent.firstChild);
    }
    else  {
      var parent = document.getElementsByClassName("container")[3];
      let data = document.createElement("div");
      data.classList.add("grid-row", "js_result", "mt-24")
      data.innerHTML = ''+
        '<div class="col-3 col-md-6 col-lg-9">'+
          '<div class="shadow-container search-result not-found">'+
            '<div class="grid-row">'+
              '<div class="title mb-24 col-md-4 col-lg-9">'+
                'По введенным данным сведения о сертификате не найдены'+
              '</div>'+
            '</div>'+
          '</div>'+
      '</div >';
      parent.insertBefore(data, parent.firstChild);      
    }

  }

  function showData(result) {
    //document.body.style.border = "5px solid red";
    var lastName = angular.element(document.querySelector("lib-plain-input[formControlName='lastName']"));
    var inp = lastName[0].getElementsByTagName('input')[0];
    inp.focus();
    inp.value = result.User.fam;
    lastName[0].removeAttribute("class");
    lastName.addClass('ng-touched ng-dirty ng-valid');

    var firstName = angular.element(document.querySelector("lib-plain-input[formControlName='firstName']"));
    var inp = angular.element(firstName[0].getElementsByTagName('input')[0]);
    inp[0].value = result.User.name;
    inp[0].focus();
    // firstName.removeClass('ng-invalid');
    // firstName.addClass('ng-valid');
    firstName[0].removeAttribute("class");
    firstName.addClass('ng-touched ng-dirty ng-valid');


    var middleName = angular.element(document.querySelector("lib-plain-input[formControlName='middleName']"));
    var inp = angular.element(middleName[0].getElementsByTagName('input')[0]);
    inp[0].value = result.User.otch;
    // middleName.removeClass('ng-invalid');
    // middleName.addClass('ng-valid');
    middleName[0].removeAttribute("class");
    middleName.addClass('ng-touched ng-dirty ng-valid');


    var element = angular.element(document.querySelector('#gender'));
    var radiob = angular.element(element[0].getElementsByClassName('radio'));
    if (result.User.pol === "М") {
      var pol = angular.element(radiob[0].getElementsByClassName('radio-button'));
      pol[0].click();
    }
    else {
      var pol = angular.element(radiob[2].getElementsByClassName('radio-button'));
      pol[0].click();
    }

    var element = angular.element(document.querySelector('#birthDate'));
    var inp = angular.element(element[0].getElementsByTagName('input')[0]);
    var dt = Date.parse(result.User.birthday);
    var dd = Intl.DateTimeFormat('ru-RU').format(dt);
    inp[0].value = dd;
    element.removeClass('ng-pristine');
    element.addClass('ng-star-inserted ng-touched ng-dirty');

    var element = angular.element(document.querySelector("lib-base-masked-input[formControlName='series']"));
    var inp = angular.element(element[0].getElementsByClassName('text-input masked-input')[0]);
    inp[0].value = result.User.Docum.p_ser;
    // element.removeClass('ng-invalid');
    // element.addClass('ng-valid');
    element[0].removeAttribute("class");
    element.addClass('ng-touched ng-dirty ng-valid');

    var element = angular.element(document.querySelector("lib-base-masked-input[formControlName='number']"));
    var inp = angular.element(element[0].getElementsByClassName('text-input masked-input')[0]);
    inp[0].value = result.User.Docum.p_num;
    // element.removeClass('ng-invalid');
    // element.addClass('ng-valid');
    element[0].removeAttribute("class");
    element.addClass('ng-touched ng-dirty ng-valid');

    var element = angular.element(document.querySelector("lib-date-picker[formControlName='issueDate']"));
    var inp = angular.element(element[0].getElementsByTagName('input')[0]);
    var dt = Date.parse(result.User.Docum.dvidp);
    var dd = Intl.DateTimeFormat('ru-RU').format(dt);
    inp[0].value = dd;
    element.removeClass('ng-pristine');
    element.addClass('ng-star-inserted ng-touched ng-dirty');

    var element = angular.element(document.querySelector("lib-plain-input[formControlName='issuedBy']"));
    var inp = angular.element(element[0].getElementsByClassName('text-input')[0]);
    inp[0].value = result.User.Docum.kem;
    element[0].removeAttribute("class");
    element.addClass('ng-touched ng-dirty ng-valid');

    var element = angular.element( document.querySelector( '#snils' ) );
    var inp = angular.element(element[0].getElementsByTagName('input')[0]);
    inp[0].value = result.User.snils;    
    element[0].removeAttribute("class");
    element.addClass('ng-touched ng-dirty ng-valid');   


    var but = angular.element(document.getElementsByTagName('button'));
    but[0].click();
  }

  function clearResult () {
    var results = document.getElementsByClassName("js_result");
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      element.remove();
      
    }
  }


  function handleMessage(message) {
    console.log(message);
    if (message.command === "showdata") {
      clearResult();
      showData(message.result);
      paste(message.js_result);
    }
  }

  browser.runtime.onMessage.addListener(handleMessage);

})();
