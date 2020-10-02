let url = new URL(document.URL);
var page = Number(url.searchParams.get("page") ?? 1); //страница
var sortby = url.searchParams.get("sortby") ?? "id"; //какой элемент сортировать, по стандарту стоит - id
var reverse = JSON.parse(url.searchParams.get("reverse") ?? false); //от большего к меньшему сортировать, или наоборот? По стандарту стоит - от меньшего к большему
var rev_urlparams = `page=${page}&sortby=${sortby}${!reverse ? "&reverse=true" : ""}`; //перменная нужная для ссылок на сортировку
//console.log(url, reverse);
var user = GetUser();
//var tasks = new Task();
//изменение иконки сортировки
//если сортировка в противоположну сторону (reverse = true), то иконка будет направлена в верх, в противном же случае, иконка будет направлена вниз
let sortclass = reverse ? "fas fa-sort-up" : "fas fa-sort-down";

$(".sorted").toggleClass("not-sorted").toggleClass("sorted");
$("a[sort='" + sortby + "']")
	.toggleClass("not-sorted")
	.toggleClass("sorted");

$("#sort-" + sortby).attr("class", sortclass);
$(".sorted").attr("href", "./index.html?" + rev_urlparams);
$(".not-sorted").each(function (index, element) {
	element.setAttribute("href", `./index.html?page=${page}&sortby=${element.getAttribute("sort")}`);
});

LoadPage();
//вывод записей на страницу
function LoadPage() {
	$.post(
		"./php/index.php?method=loadTasks", // адрес обработчика
		{ page: page, sortby: sortby, reverse: reverse }, // отправляемые данные
		function (msg) {
			var response = JSON.parse(msg);
			//console.log(response);
			jQuery.each(response, function (i, data) {
				//создание клона блока, куда записываются данные
				let cloneForm = $("#pattern-data-row").clone();
				//запись данных
				cloneForm.removeAttr("id");
				cloneForm.removeAttr("hidden");
				cloneForm.attr("class", "d-flex accordion-toggle");
				cloneForm.attr("id", data.id);
				cloneForm.attr("onclick", "collapse(" + data.id + ")");
				cloneForm.find("[data-place='id']").text(data.id);
				cloneForm.find("[data-place='task']").text(data.task);
				cloneForm.find("[data-place='name']").text(data.name);
				cloneForm.find("[data-place='email']").text(data.email);
				cloneForm.find("[data-place='status']").attr("id", "task-" + data.id);
				if (Boolean(Number(data.status))) {
					cloneForm.find("[data-place='status']").prop("checked", true);
				}
				if (user.role == "admin") {
					cloneForm.find("[data-place='status']").attr("onclick", "ToggleStatus(" + data.id + "," + !Boolean(Number(data.status)) + ")");
				} else {
					cloneForm.find("[data-place='status']").prop("disabled", true);
				}
				cloneForm.find("[data-place]").removeAttr("data-place");
				if (Boolean(Number(data.edit))) {
					cloneForm.find(".fa-pencil-alt").attr("hidden", false);
				}

				$("table").append(cloneForm);
				//создание клона блока, в который записываются данные для изменения
				if (user.role == "admin") {
					let clone = $("#pattern-form").clone();
					clone.removeAttr("id");
					clone.removeAttr("hidden");
					clone.find("form[task-id='-1']").attr("task-id", data.id);
					clone.find("input[name='name']").val(data.name);
					clone.find("input[name='email']").val(data.email);
					clone.find("textarea[name='task']").val(data.task);
					clone.find("input[type='submit']").attr("onclick", "ChangeTask(" + data.id + ")");
					clone.find("input[type='radio']").val(data.id);
					$("table").append(clone);
				}
			});
		}
	);
	$.post(
		"./php/index.php?method=countTasks", // адрес обработчика
		{ page: page, sortby: sortby, reverse: reverse }, // отправляемые данные
		function (msg) {
			var response = JSON.parse(msg);
			Pages(response);
		}
	);
}
$("input").on("click", function () {
	console.log(123);
});
//вывод количества страниц
function Pages(pages) {
	let cells = Math.ceil(pages / 3);
	let i = 0;
	while (i < cells + 2) {
		if (0 < i && i < cells + 1) {
			console.log(i);
			$("#pagination").append(`<li class="page-item"><a class="page-link" href="./index.html?page=${i}&sortby=${sortby}${reverse ? "&reverse=true" : ""}">${i}</a></li>`);
		} else if (i == 0) {
			$("#pagination").append(`<li class="page-item"><a class="page-link" href="./index.html?page=${page == 1 ? 1 : page - 1}&sortby=${sortby}${reverse ? "&reverse=true" : ""}"><</a></li>`);
		} else {
			$("#pagination").append(`<li class="page-item"><a class="page-link" href="./index.html?page=${page == cells ? page : page + 1}&sortby=${sortby}${reverse ? "&reverse=true" : ""}">></a></li>`);
		}
		console.log(cells + 2, i);
		i++;
	}
}
