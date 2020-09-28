let url = new URL(document.URL);
var page = Number(url.searchParams.get("page") ?? 1);
var orderby = url.searchParams.get("orderby") ?? "id";
var reverse = JSON.parse(url.searchParams.get("reverse") ?? true);
console.log(reverse);

function getCook(cookiename) {
	// Get name followed by anything except a semicolon
	var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
	// Return everything after the equal sign, or an empty string if the cookie name not found
	return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}

//Sample usage
var role = getCook("role");

/* <ul class="pagination">
						<li class="page-item"><a class="page-link" href="#">Previous</a></li>
						<li class="page-item"><a class="page-link" href="#">1</a></li>
						<li class="page-item"><a class="page-link" href="#">2</a></li>
						<li class="page-item"><a class="page-link" href="#">3</a></li>
						<li class="page-item"><a class="page-link" href="#">Next</a></li>
					</ul> */

$.post(
	"./php/index.php?method=loadTasks", // адрес обработчика
	{ page: page, orderby: orderby, reverse: reverse }, // отправляемые данные
	function (msg) {
		var response = JSON.parse(msg);

		jQuery.each(response, function (i, data) {
			$("#table-tasks").append(
				'<tr class="d-flex">' +
					'<th scope="row" class="col-1">' +
					data.id +
					"</th>" +
					'<td  class="col-4">' +
					data.task +
					"</td>" +
					'<td  class="col-3">' +
					data.name +
					"</td>" +
					'<td  class="col-3">' +
					data.email +
					"</td>" +
					'<td  class="col-1"><div class="d-flex justify-content-center">' +
					'<input class="form-check-input" type="checkbox" id="task-' +
					data.id +
					'"' +
					(Boolean(Number(data.status)) ? "checked " : "") +
					(role == "admin" ? 'onclick="ToggleStatus(' + data.id + "," + !Boolean(Number(data.status)) + ')"' : "disabled>") +
					"</div></td>" +
					"</tr>"
			);
		});
	}
);

$.post(
	"./php/index.php?method=countTasks", // адрес обработчика
	null, // отправляемые данные
	function (msg) {
		var count = JSON.parse(msg);

		let i = 0;
		console.log(JSON.parse(msg));
		let pages = Math.ceil(count / 3);
		while (i < pages + 2) {
			if (0 < i && i < pages + 1) {
				$("#pagination").append('<li class="page-item"><a class="page-link" href="http://beejee-coding-challenge.zzz.com.ua/index.html?page=' + i + '">' + i + "</a></li>");
			} else if (i == 0) {
				$("#pagination").append('<li class="page-item"><a class="page-link" href="http://beejee-coding-challenge.zzz.com.ua/index.html?page=' + (page == 1 ? 1 : page - 1) + '"><</a></li>');
			} else {
				$("#pagination").append('<li class="page-item"><a class="page-link" href="http://beejee-coding-challenge.zzz.com.ua/index.html?page=' + (page == pages ? page : page + 1) + '">></a></li>');
			}
			console.log(pages + 2, i);
			i++;
		}
	}
);

function ToggleStatus(id, status) {
	$.post(
		"./php/index.php?method=toggleStatus", // адрес обработчика
		{ id: id, status: status }, // отправляемые данные
		function (msg) {
			if (JSON.parse(msg)) {
				$("#task-" + id).attr("onclick", "ToggleStatus(" + id + "," + !Boolean(Number(status)) + ")");
			}
			console.log(JSON.parse(msg));
		}
	);
}
