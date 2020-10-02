class Task {
	constructor() {
		var allTasks;
		var length;
		$.post(
			"./php/index.php?method=loadTasks", // адрес обработчика
			{ all: true }, // отправляемые данные
			function (msg) {
				allTasks = JSON.parse(msg);
				length = allTasks.length;
				console.log(allTasks);
			}
		);
	}
	addTask() {
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

						document.location.href = document.location.href;
					}
				);
			} else {
				$("#invalid-email-validate").attr("hidden", false);
			}
		} else {
			$("#invalid-null").attr("hidden", false);
		}
	}
	get allTasks() {
		return allTasks;
	}
	get length() {
		return length;
	}
}

window.tasks = new Task();

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
					document.location.href = "./index.html";
				}
			);
		} else {
			$("#invalid-email-validate").attr("hidden", false);
		}
	} else {
		$("#invalid-null").attr("hidden", false);
	}
}

function ChangeTask(id) {
	let changeForm = $("form[task-id='" + id + "']");
	let data = changeForm.serializeArray();
	if ((data[0].value && data[1].value && data[2].value) != "") {
		changeForm.children("[error='change-null']").attr("hidden", true);
		if (validateEmail(data[1].value)) {
			changeForm.children("[error='change-email-validate']").attr("hidden", true);
			$.post(
				"./php/index.php?method=changeTask", // адрес обработчика
				data, // отправляемые данные
				function (msg) {
					// получен ответ сервера

					console.log(msg);
					document.location.href = document.location.href;
				}
			);
		} else {
			changeForm.children("[error='change-email-validate']").attr("hidden", false);
		}
	} else {
		changeForm.children("[error='change-null']").attr("hidden", false);
	}
}

//изменение статуса задания
function ToggleStatus(id, status) {
	$.post(
		"./php/index.php?method=toggleStatus", // адрес обработчика
		{ id: id, status: status }, // отправляемые данные
		function (msg) {
			if (JSON.parse(msg)) {
				$("#task-" + id).attr("onclick", "ToggleStatus(" + id + "," + !Boolean(Number(status)) + ")");
			}
			//console.log(JSON.parse(msg));
		}
	);
}
