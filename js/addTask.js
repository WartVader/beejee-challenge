function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function AddTask() {
	if (($("#inputEmail").val() && $("#inputName").val() && $("#inputTask").val()) != "") {
		$("#invalid-null").attr("hidden", true);
		if (validateEmail($("#inputEmail").val())) {
			$("#invalid-email-validate").attr("hidden", true);
			$.post(
				"./php/index.php?method=addTask", // адрес обработчика
				$("#task-form").serializeArray(), // отправляемые данные
				function (msg) {
					// получен ответ сервера

					console.log(msg);
					document.location.href = "http://beejee-coding-challenge.zzz.com.ua/index.html";
				}
			);
		} else {
			$("#invalid-email-validate").attr("hidden", false);
		}
	} else {
		$("#invalid-null").attr("hidden", false);
	}
}
