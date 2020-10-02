//Регистрация
$("#signup").click(function () {
	//console.log($("#r_form").serializeArray());
	console.log(CheckReg());
	if (CheckReg()) {
		Signup();
	}
	//let data = $("#r_form").serializeArray();
	//Signup();
});
function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function CheckReg() {
	let res = true; //result, здесь хранятся результаты проверки

	//Проверка на ввод
	if ($("#inputLogin").val() == "") {
		res = false;
		$("#invalid-login-null").attr("hidden", false);
	} else {
		$("#invalid-login-null").attr("hidden", true);
	}
	if ($("#inputPassword").val() == "") {
		res = false;
		$("#invalid-password-null").attr("hidden", false);
	} else {
		$("#invalid-password-null").attr("hidden", true);
	}
	if ($("#inputEmail").val() == "") {
		res = false;
		$("#invalid-email-null").attr("hidden", false);
		$("#invalid-email-validate").attr("hidden", true);
	} else {
		$("#invalid-email-null").attr("hidden", true);
		//Провека почту на валидность (с помощью регулярных выражений)
		if (!validateEmail($("#inputEmail").val())) {
			res = false;
			$("#invalid-email-validate").attr("hidden", false);
		} else {
			$("#invalid-email-validate").attr("hidden", true);
		}
	}

	//проверка на валидацию пароля (пароль должен быть не более 30 символов)
	if ($("#inputPassword").val().length > 30) {
		res = false;
		$("#invalid-password-30").attr("hidden", false);
	} else {
		$("#invalid-password-30").attr("hidden", true);
	}
	return res;
}

function Signup() {
	$.post(
		"./php/index.php?method=checkReg", // адрес обработчика
		$("#signup-form").serializeArray(), // отправляемые данные

		function (msg) {
			let status = JSON.parse(msg);
			console.log(msg);
			if (status.login) {
				$("#invalid-login-exist").attr("hidden", false);
			} else {
				$("#invalid-login-exist").attr("hidden", true);
			}
			if (status.email) {
				$("#invalid-email-exist").attr("hidden", false);
			} else {
				$("#invalid-email-exist").attr("hidden", true);
			}
			//если пользователь с такими данными не сущестует, то происходит регистрация
			if (!status.login && !status.email) {
				$.post(
					"./php/index.php?method=registration", // адрес обработчика
					$("#signup-form").serializeArray(), // отправляемые данные

					function (msg) {
						console.log(msg);
						document.location.href = "./index.html"; //после регистрации данные записываются в куки и происходит переход на главную страницу
					}
				);
			}
		}
	);
}
