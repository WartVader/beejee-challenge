$("#exit-user").click(function () {
	$.post(
		"./php/index.php?method=exit", // адрес обработчика
		null, // отправляемые данные
		function (msg) {
			document.getElementById("exit-user").hidden = true;
			document.location.href = "http://beejee-coding-challenge.zzz.com.ua/index.html";
			console.log(msg);
		}
	);
});

var user = GetUser();

//Функция проверяющая пользователя
function GetUser(id) {
	var data;

	var request = new XMLHttpRequest();
	request.open("POST", "./php/index.php?method=getUserInfo", false);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	if (id != null && id != undefined) {
		let send = "id=" + id;
		request.send(send);
	} else {
		request.send();
	}
	if (request.status == 200) {
		data = JSON.parse(request.responseText);
	}
	if (data.id != null) {
		document.getElementById("exit-user").hidden = false;
	} else {
		document.getElementById("exit-user").hidden = true;
	}
	return data;
}
