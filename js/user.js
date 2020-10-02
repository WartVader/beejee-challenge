/* class User {
	constructor() {
		var role = null; //роль пользователя
		var id = null; //id пользователя
		var isLogged = null; //вошел ли пользователь
		var data;
		$.post(
			"./php/index.php?method=getUserInfo", // адрес обработчика
			null, // отправляемые данные
			function (msg) {
				data = JSON.parse(msg);

				if (data.id != null) {
					document.getElementById("exit-user").hidden = false;
					id = data.id;
					isLogged = true;
					role = data.role;
				} else {
					role = "stranger";
					id = -1;
					isLogged = false;
					document.getElementById("exit-user").hidden = true;
				}
			}
		);
	}

	get role() {
		while (role == undefined) {}
		return role;
	}
	get id() {
		while (id == null) {}
		return id;
	}
	get isLogged() {
		while (isLogged == null) {}
		return isLogged;
	}
} */

$("#exit-user").click(function () {
	$.post(
		"./php/index.php?method=exit", // адрес обработчика
		null, // отправляемые данные
		function (msg) {
			document.getElementById("exit-user").hidden = true;
			document.location.href = "./index.html";
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
		console.log(JSON.parse(request.responseText));
		data = JSON.parse(request.responseText);
	}
	if (data != null) {
		document.getElementById("exit-user").hidden = false;
	} else {
		data = { id: -1, role: "visitor" };
		document.getElementById("exit-user").hidden = true;
	}
	return data;
}
