function Login() {
	$.post(
		"./php/index.php?method=login", // адрес обработчика
		$("#login-form").serializeArray(), // отправляемые данные

		function (msg) {
			// получен ответ сервера
			console.log(msg);
			if (msg == "true") {
				document.location.href = "http://beejee-coding-challenge.zzz.com.ua/index.html";
				document.getElementById("exit-user").hidden = true;
			} else if (msg == "false") {
				$("#invalid-entrance").attr("hidden", false);
			}
		}
	);
}
