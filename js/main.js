//@codekit-prepend "libs/jquery.min.js";
//@codekit-prepend "libs/jquery.migrate.min.js";
//@codekit-prepend "libs/jquery.scrollpanel.js";
//@codekit-prepend "libs/iscroll.js";
//@codekit-prepend "libs/jquery.mousewheel.js";
//@codekit-prepend "libs/TweenMax.min.js";
//@codekit-prepend "libs/modernizr.custom.js";
//@codekit-prepend "libs/PxLoader.js";
//@codekit-prepend "libs/PxLoaderImage.js";

let data, loader;
let pages = [];
let thumbs = [];
let currPage = null;
let isLoaded = false;
let isTimeout = false;
let isAnimating = false;
let to;
let getCategory;

// TODO:
//1 -  add black background on videos where the aspect is smaller - done
// 2 - is it still possible to keep projects grouped ie - Taylor Made? -- available
// 3 - replace icon - awaiting eddie

function init() {
	//Init resize event
	$(window).resize(onResize);
	checkWindowSize();

	if (window.innerWidth > 820) {
		onResize();

		//Load xml
		$.ajax({
			type: "GET",
			url: "json/film.json",
			dataType: "json",
			success: parseData,
		});
	}

	if (window.innerWidth <= 820) {
		$.ajax({
			type: "GET",
			url: "json/mobile.json",
			dataType: "json",
			success: parseMobileData,
		});
	}
}

function fetchProjects(category) {
	$.ajax({
		type: "GET",
		url: `json/${category}.json`,
		dataType: "json",
		success: function (response) {
			data = response; // Store the response data
			renderProjects(data); // Render projects
		},
		error: function () {
			console.error("Error fetching JSON data.");
		},
	});
}

// Function to render projects based on filtered data
function renderProjects(projects) {
	const navContainer = $("#nav");
	navContainer.empty(); // Clear the container

	if (projects.length === 0) {
		navContainer.append("<p>No projects found for this category.</p>");
		return;
	}

	loadData(projects);

	loader.start();

	setTimeout(onTimeout, 250);
	isLoaded = true;
	initEvents(projects.projects); //after filtering
}

$("#filter-film").on("click", function () {
	fetchProjects("film");
	closePageContainer();
});

$("#filter-commercials").on("click", function () {
	fetchProjects("commercial"); // Fetch commercial.json
	closePageContainer();
});

function loadData(d) {
	// logic for data and thumbnails go here
	data = d;
	//Init thumbs
	let count = 0;
	let projects;

	projects = data.projects;

	console.log("projects length:", projects.length);

	for (let i = 0; i < projects.length; i++) {
		if (projects[i].isCenter == "true") {
			//add center gif
			const center = document.createElement("div");
			center.setAttribute("class", "center");
			center.style.left = count * (100 / 9) + "%";
			center.style.width = 100 / 9 + "%";
			$("#nav")[0].appendChild(center);

			const imgCenter = loader.addImage("assets/img/ui/center.gif");
			center.appendChild(imgCenter);

			const imgHighlight = document.createElement("div");
			imgHighlight.setAttribute("class", "highlight");
			center.appendChild(imgHighlight);
		} else {
			const div = document.createElement("div");
			div.setAttribute("class", "thumb");
			div.style.left = count * (100 / 9) + "%";
			div.style.width = 100 / 9 + "%";
			$("#nav")[0].appendChild(div);

			const img = loader.addImage(projects[i].thumb);

			div.appendChild(img);

			jQuery.data(div, "ident", i);
		}

		count++;
	}

	for (i = 0; i < projects.length; i++) {
		if (projects[i].isCenter != "true") {
			for (let j = 0; j < projects[i].spots.length; j++) {
				const spot = projects[i].spots[j];

				const page = document.createElement("div");
				page.setAttribute("class", "page page" + i + "" + j);

				// clears the container after new projects are reloaded, so the dom is cleaner
				if ($("#pageContainer")[0].childNodes.length > 8) {
					$("#pageContainer").empty();
				}
				$("#pageContainer")[0].appendChild(page);

				jQuery.data(page, "projectID", i);
				jQuery.data(page, "spotID", j);

				const container1 = document.createElement("div");
				container1.setAttribute("class", "imgContainer topleft container1");

				page.appendChild(container1);

				const image1 = loader.addImage(spot.folder + "01.jpg");
				container1.appendChild(image1);

				const container2 = document.createElement("div");
				container2.setAttribute("class", "imgContainer topright container2");
				jQuery.data(container2, "ident", i);
				page.appendChild(container2);

				const image2 = loader.addImage(spot.folder + "02.jpg");
				container2.appendChild(image2);

				const container3 = document.createElement("div");
				container3.setAttribute("class", "imgContainer bottomleft container3");
				jQuery.data(container3, "ident", i);
				page.appendChild(container3);

				const image3 = loader.addImage(spot.folder + "03.jpg");
				container3.appendChild(image3);

				const container4 = document.createElement("div");
				container4.setAttribute("class", "imgContainer bottomright container4");
				page.appendChild(container4);

				const image4 = loader.addImage(spot.folder + "04.jpg");
				container4.appendChild(image4);

				jQuery.data(container1, "projectID", i);
				jQuery.data(container1, "spotID", j);

				jQuery.data(container2, "projectID", i);
				jQuery.data(container2, "spotID", j);

				jQuery.data(container3, "projectID", i);
				jQuery.data(container3, "spotID", j);

				jQuery.data(container4, "projectID", i);
				jQuery.data(container4, "spotID", j);
			}
		}
	}

	const leftImageWidth = $(".container3").outerWidth(true);
	const rightImageWidth = $(".container4").outerWidth(true);

	const parentContainer = $("#pageContainer").width();
	const availableWidth = parentContainer - (leftImageWidth + rightImageWidth);

	$(".copy").css({
		width: availableWidth + "px",
	});

	// Indicator
	getCategory = projects[0].category;

	if (getCategory === "film") {
		$("#filter-film").css("color", "#b5b5b5");
		$("#filter-commercials").css("color", "rgba(255, 255, 255, 0.4)");
	}

	if (getCategory === "commercial") {
		$("#filter-film").css("color", "rgba(255, 255, 255, 0.4)");
		$("#filter-commercials").css("color", "#b5b5b5");
	}
}
function parseData(d) {
	data = d;

	//Init loader
	loader = new PxLoader();

	//Init copy
	$("#copytop").html(data.copy.top);
	$("#copybottom").html(data.copy.bottom);

	TweenMax.set($(".copy").find("li"), { x: -50, opacity: 0 });
	TweenMax.set($(".copy").find("h1"), { x: -50, opacity: 0 });
	TweenMax.set($(".top-nav").find("ul"), { x: -50, opacity: 0 });

	//Init thumbs
	loadData(data);

	loader.start();

	setTimeout(onTimeout, 4000); //change this to 4000 later
	isLoaded = true;

	initEvents(data.projects); // first load

	onResize();
}

function initEvents(projects) {
	//Init events

	$(".thumb").click(function () {
		const index = jQuery.data(this, "ident");

		if (!isAnimating) {
			getPage(index, 0);
		}
	});

	$(".imgContainer").click(function () {
		const container = $("#pageContainer");
		const background = document.createElement("div");
		const w = $(window).width();

		if (data.projects[jQuery.data(this, "projectID")].isStills == "true") {
			window.open("https://www.flickr.com/photos/eddiealcazar/", "_blank");
		} else if (
			data.projects[jQuery.data(this, "projectID")].spots[
				jQuery.data(this, "spotID")
			].video != null
		) {
			$("iframe").attr(
				"src",
				data.projects[jQuery.data(this, "projectID")].spots[
					jQuery.data(this, "spotID")
				].video + "?title=0&byline=0&badge=0&loop=1&autoplay=1&color=333",
			);
			// adds black background to fill width of screen
			$(background).css({
				height: w / (1600 / 600) + "px",
			});
			$(background).attr("class", "cinema");
			container.append(background);

			TweenMax.to($("#player"), 1, { width: "100%", ease: Expo.easeInOut });
		}
	});

	$("#player").hover(
		function () {
			TweenMax.to($(".close"), 1, { opacity: 1 });
		},
		function () {
			TweenMax.to($(".close"), 1, { opacity: 0 });
		},
	);

	$(".close").hover(
		function () {
			TweenMax.to(this, 0.5, { rotation: 90, ease: Expo.easeOut });
		},
		function () {
			TweenMax.to(this, 0.5, { rotation: 0, ease: Expo.easeOut });
		},
	);

	$(".close").click(function () {
		TweenMax.to($("#player"), 1, {
			width: "0%",
			ease: Expo.easeInOut,
			onComplete: function () {
				$("iframe").attr("src", "");
			},
		});

		const cinema = $(".cinema");
		cinema.remove();
	});

	// when the current project is open, close the current project if user clicks blackspace
	$(".page").click(function (event) {
		if (
			!$(event.target).hasClass("imgContainer") &&
			!$(event.target).hasClass("thumb") &&
			!$(event.target).closest(".imgContainer").length
		) {
			closePageContainer();
		}
	});

	// close current project when margin is clicked
	$(".desktop").click(function (event) {
		const container = $("#container");
		const offset = container.offset();
		const marginTop = parseInt(container.css("marginTop"));

		const clickY = event.pageY;

		const withinMargin = clickY > offset.top - marginTop && clickY < offset.top;

		if (withinMargin) {
			closePageContainer();
		}
	});

	$(".center").click(function () {
		if (currPage != null) {
			let prevPage = currPage;
			isAnimating = true;
			TweenMax.staggerTo(
				currPage.find(".imgContainer"),
				1,
				{ opacity: 0, ease: Expo.easeInOut },
				0.2,
				function () {
					$("#pageContainer").css("visibility", "hidden");
					prevPage.css("visibility", "hidden");
					isAnimating = false;
				},
			);
			currPage = null;

			TweenMax.staggerTo(
				$("#copytop").find("li"),
				0.3,
				{ x: 50, opacity: 0, delay: 0.1, ease: Expo.easeOut },
				0.05,
			);

			TweenMax.to($("#copybottom").find("h1"), 0.3, {
				x: 50,
				opacity: 0,
				delay: 0.1,
				ease: Expo.easeOut,
			});
			TweenMax.staggerTo(
				$("#copybottom").find("li"),
				0.3,
				{ x: 50, opacity: 0, delay: 0.2, ease: Expo.easeOut },
				0.05,
			);
			$("#copybottom").css("z-index", "0");
			TweenMax.delayedCall(1, function () {
				$("#copytop").html(data.copy.top);
				$("#copybottom").html(data.copy.bottom);

				TweenMax.set($(".copy").find("li"), { x: -50, opacity: 0 });
				TweenMax.set($("#copybottom").find("h1"), { x: -50, opacity: 0 });

				TweenMax.staggerTo(
					$("#copytop").find("li"),
					0.5,
					{ x: 0, opacity: 1, delay: 0.1, ease: Expo.easeOut },
					0.1,
				);

				TweenMax.to($("#copybottom").find("h1"), 0.5, {
					x: 0,
					opacity: 1,
					delay: 0.2,
					ease: Expo.easeOut,
				});
				TweenMax.staggerTo(
					$("#copybottom").find("li"),
					0.5,
					{ x: 0, opacity: 1, delay: 0.3, ease: Expo.easeOut },
					0.1,
					function () {
						$("#copybottom").css("z-index", "10");
					},
				);
			});
		}
	});
}

function checkWindowSize() {
	if ($(window).width() <= 820) {
		$(".desktop").remove();
	} else {
		$(".mobile").remove();
		$(".project-modal").remove();
	}
}

function parseMobileData(d) {
	data = d;

	//Init copy
	$(".copytop-mobile").html(data.copy.top);
	$(".copybottom-mobile").html(data.copy.bottom);

	//Init thumbs
	let count = 0;
	for (let i = 0; i < data.projects.length; i++) {
		if (data.projects[i].thumb) {
			let div = document.createElement("div");
			div.setAttribute("class", "thumb");
			$("#projects")[0].appendChild(div);

			for (let j = 0; j < data.projects[i].spots.length; j++) {
				let img = new Image();

				if (data.projects[i].spots[j].thumb) {
					img.src = data.projects[i].spots[j].thumb;
				} else {
					img.src = "../" + data.projects[i].spots[j].folder + "thumb.jpg";
				}

				div.appendChild(img);
				jQuery.data(img, "ident", i);
				jQuery.data(img, "spot", j);
			}

			count++;
		}
	}

	//Init events
	$("#projects")
		.find("img")
		.click(function () {
			const index = jQuery.data(this, "ident");
			const spot = jQuery.data(this, "spot");
			getProject(index, spot);
		});
}

function closePageContainer() {
	if (currPage != null) {
		let prevPage = currPage;
		isAnimating = true;

		TweenMax.staggerTo(
			currPage.find(".imgContainer"),
			1,
			{ opacity: 0, ease: Expo.easeInOut },
			0.2,
			function () {
				$("#pageContainer").css("visibility", "hidden");
				prevPage.css("visibility", "hidden");
				isAnimating = false;
			},
		);
		currPage = null;

		TweenMax.staggerTo(
			$("#copytop").find("li"),
			0.3,
			{ x: 50, opacity: 0, delay: 0.1, ease: Expo.easeOut },
			0.05,
		);

		TweenMax.to($("#copybottom").find("h1"), 0.3, {
			x: 50,
			opacity: 0,
			delay: 0.1,
			ease: Expo.easeOut,
		});

		TweenMax.staggerTo(
			$("#copybottom").find("li"),
			0.3,
			{ x: 50, opacity: 0, delay: 0.2, ease: Expo.easeOut },
			0.05,
		);

		$("#copybottom").css({ "z-index": "0" });

		TweenMax.delayedCall(1, function () {
			$("#copytop").html(data.copy.top);
			$("#copybottom").html(data.copy.bottom);

			TweenMax.set($(".copy").find("li"), { x: -50, opacity: 0 });

			TweenMax.set($("#copybottom").find("h1"), { x: -50, opacity: 0 });
			TweenMax.set($("#copybottom").find("li"), { x: -50, opacity: 0 });

			TweenMax.staggerTo(
				$("#copytop").find("li"),
				0.5,
				{ x: 0, opacity: 1, delay: 0.1, ease: Expo.easeOut },
				0.1,
			);

			TweenMax.to($("#copybottom").find("h1"), 0.5, {
				x: 0,
				opacity: 1,
				delay: 0.2,
				ease: Expo.easeOut,
			});

			TweenMax.staggerTo(
				$("#copybottom").find("li"),
				0.5,
				{ x: 0, opacity: 1, delay: 0.3, ease: Expo.easeOut },
				0.1,
				function () {
					$("#copybottom").css("z-index", "10");
				},
			);
		});
	}
}

let isPressOpen = false;
let currPageID = -1;

function openPress() {
	if (currPage != null) {
		let prevPage = currPage;
		isAnimating = true;
		TweenMax.staggerTo(
			currPage.find(".imgContainer"),
			1,
			{ opacity: 0, ease: Expo.easeInOut },
			0.2,
			function () {
				$("#pageContainer").css("visibility", "hidden");
				prevPage.css("visibility", "hidden");
				isAnimating = false;
			},
		);
		currPage = null;

		TweenMax.staggerTo(
			$("#copytop").find("li"),
			0.3,
			{ x: 50, opacity: 0, delay: 0.1, ease: Expo.easeOut },
			0.05,
		);

		TweenMax.to($("#copybottom").find("h1"), 0.3, {
			x: 50,
			opacity: 0,
			delay: 0.1,
			ease: Expo.easeOut,
		});

		TweenMax.staggerTo(
			$("#copybottom").find("li"),
			0.3,
			{ x: 50, opacity: 0, delay: 0.2, ease: Expo.easeOut },
			0.05,
		);

		$("#copybottom").css("z-index", "0");

		TweenMax.delayedCall(1, function () {
			$("#copytop").html(data.copy.top);
			$("#copybottom").html(data.copy.bottom);

			TweenMax.set($(".copy").find("li"), { x: -50, opacity: 0 });
			TweenMax.set($("#copybottom").find("h1"), { x: -50, opacity: 0 });

			TweenMax.staggerTo(
				$("#copytop").find("li"),
				0.5,
				{ x: 0, opacity: 1, delay: 0.1, ease: Expo.easeOut },
				0.1,
			);

			TweenMax.to($("#copybottom").find("h1"), 0.5, {
				x: 0,
				opacity: 1,
				delay: 0.2,
				ease: Expo.easeOut,
			});

			TweenMax.to(
				$("#copybottom").find("li"),
				0.5,
				{ x: 0, opacity: 1, delay: 0.3, ease: Expo.easeOut },
				0.1,
				function () {
					$("#copybottom").css("z-index", "10");
				},
			);
		});
	}

	isPressOpen = true;
}

function getPage(indexPage, indexSpot) {
	let prevPage;

	if (indexPage != currPageID || indexSpot != currSpotID) {
		let page;
		page = $(".page" + indexPage + "" + indexSpot);

		TweenMax.set(page.find("img"), { scale: 1 });
		TweenMax.set(page.find(".imgContainer"), { opacity: 0 });

		$("#pageContainer").css("visibility", "visible");
		if (currPage != null) {
			currPage.css("z-index", "1");
		}
		page.css("z-index", "5");
		page.css("visibility", "visible");

		if (currPage != null) {
			prevPage = currPage;
		}

		isAnimating = true;

		TweenMax.staggerTo(
			page.find("img"),
			10,
			{ scale: 1.1, ease: Expo.easeOut },
			0.2,
		);
		TweenMax.staggerTo(
			page.find(".imgContainer"),
			1,
			{ opacity: 1, ease: Expo.easeInOut },
			0.2,
			function () {
				if (prevPage != null) {
					prevPage.css("visibility", "hidden");
				}
				isAnimating = false;
			},
		);

		if (currPage != null) {
			console.log(indexPage + "-" + currPageID);
		}
		if (currPage == null || indexPage != currPageID) {
			TweenMax.staggerTo(
				$("#copytop").find("li"),
				0.3,
				{ x: 50, opacity: 0, delay: 0.1, ease: Expo.easeOut },
				0.05,
			);

			TweenMax.to($("#copybottom").find("h1"), 0.3, {
				x: 50,
				opacity: 0,
				delay: 0.1,
				ease: Expo.easeOut,
			});

			TweenMax.staggerTo(
				$("#copybottom").find("li"),
				0.3,
				{ x: 50, opacity: 0, delay: 0.2, ease: Expo.easeOut },
				0.08,
			);

			$("#copybottom")[0].style.zIndex = "0";
			TweenMax.delayedCall(1, function () {
				$("#copytop").html(data.projects[indexPage].copytop);
				$("#copybottom").html(data.projects[indexPage].copybottom);

				if (data.projects[indexPage].spots.length > 1) {
					for (let i = 0; i < data.projects[indexPage].spots.length; i++) {
						let spot = data.projects[indexPage].spots[i];
						$("#copybottom").append(
							'<h1><a href="#" onclick="getPage(' +
								indexPage +
								"," +
								i +
								')">' +
								spot.title +
								"</a></h1>",
						);
					}
				}

				TweenMax.set($(".copy").find("li"), { x: -50, opacity: 0 });
				TweenMax.set($("#copybottom").find("h1"), { x: -50, opacity: 0 });

				TweenMax.staggerTo(
					$("#copytop").find("li"),
					0.5,
					{ x: 0, opacity: 1, delay: 0.1, ease: Expo.easeOut },
					0.1,
				);

				TweenMax.to($("#copybottom").find("h1"), 0.5, {
					x: 0,
					opacity: 1,
					delay: 0.2,
					ease: Expo.easeOut,
				});

				TweenMax.staggerTo(
					$("#copybottom").find("li"),
					0.5,
					{ x: 0, opacity: 1, delay: 0.3, ease: Expo.easeOut },
					0.1,
					function () {
						$("#copybottom")[0].style.zIndex = "10";
					},
				);
			});
		}

		currPage = page;
		currPageID = indexPage;
		currSpotID = indexSpot;
	}
}

function animateIn() {
	$(".thumb").each(function (i) {
		const $this = $(this); // Store the current element

		const delay = Math.abs(i - 3.5) * 0.2 * 1000; // Calculate delay in milliseconds

		setTimeout(function () {
			$this.css("opacity", 1); // Change the opacity to 1
		}, delay);
	});

	TweenMax.to($("#copytop").find("h1"), 0.5, {
		x: 0,
		opacity: 1,
		delay: 1.2,
		ease: Expo.easeOut,
	});

	TweenMax.staggerTo(
		$("#copytop").find("li"),
		0.5,
		{ x: 0, opacity: 1, delay: 1.1, ease: Expo.easeOut },
		0.1,
	);

	TweenMax.to($("#copybottom").find("h1"), 0.5, {
		x: 0,
		opacity: 1,
		delay: 1.4,
		ease: Expo.easeOut,
	});

	TweenMax.staggerTo(
		$("#copybottom").find("li"),
		0.5,
		{ x: 0, opacity: 1, delay: 1.5, ease: Expo.easeOut },
		0.1,
	);

	TweenMax.staggerTo($(".top-nav").find("ul"), 0.5, {
		x: 0,
		opacity: 1,
		delay: 2,
		ease: Expo.easeOut,
	});

	$(".thumb").hover(
		function () {
			TweenMax.to(this, 0.1, { opacity: 0.5 });
			TweenMax.to($(this).find(".cs"), 0.1, { opacity: 1 });
		},
		function () {
			TweenMax.to(this, 0.1, { opacity: 1 });
			TweenMax.to($(this).find(".cs"), 0.1, { opacity: 0 });
		},
	);

	TweenMax.to($("#footer"), 4, { opacity: 1 });

	onResize();
}

function onTimeout() {
	isTimeout = true;

	if (isLoaded) {
		animateIn();
	}
}

function onResize() {
	const w = $(window).width();
	// only resize on medium screens and up
	if (w > 575) {
		const container = document.querySelector("#container");
		const width = w + "px";
		const height = w / (1600 / 600) + "px";
		const marginTop = `${(window.innerHeight - parseFloat(height)) / 2}px`;

		container.style.width = width;
		container.style.height = height;
		container.style.marginTop = marginTop;

		$("iframe").css("width", w + "px");
		$("iframe").css("height", $(window).width() / (1600 / 600) + "px");

		$("#playerContainer").css("width", w + "px");
		$("#playerContainer").css("height", w / (1600 / 600) + "px");

		$("#nav").css("width", w + "px");
		$("#nav").css("height", w / (1600 / 66) + "px");
		$("#navWrapper").css("height", w / (1600 / 66) + "px");
		$("#navWrapper").css("margin-top", -$("#nav").height() / 2 + "px");

		$(".copy").css("width", $(".center").width() + "px");
	}
}

function getProject(ident, spot) {
	// mobile only

	$("#project-modal").html("");

	if (data.projects[ident].spots[spot].video) {
		$("#project-modal").append(
			"<iframe width=" +
				$(window).width() +
				" height=" +
				$(window).width() / 2.7 +
				' src="' +
				data.projects[ident].spots[spot].video +
				'" frameborder=0></iframe>',
		);
	}
	if (data.projects[ident].spots[spot].video) {
		$("#project-modal").append(
			'<img src="' + data.projects[ident].spots[spot].folder + '01.jpg" />',
		);
	} else {
		$("#project-modal").append(
			'<img style="margin-top:50px" src="' +
				data.projects[ident].spots[spot].folder +
				'01.jpg" />',
		);
	}
	$("#project-modal").append(
		'<img src="' + data.projects[ident].spots[spot].folder + '02.jpg" />',
	);
	$("#project-modal").append(
		'<img src="' + data.projects[ident].spots[spot].folder + '03.jpg" />',
	);
	$("#project-modal").append(
		'<img src="' + data.projects[ident].spots[spot].folder + '04.jpg" />',
	);
	const description = document.createElement("div");
	description.setAttribute("class", "copy");
	description.innerHTML = data.projects[ident].copybottom;
	$("#project-modal")[0].appendChild(description);
	$("#project-modal").append(
		'<img src="assets/img/ui/back.png" style="position:absolute;top:5px;left:5px;width:auto;" class="backBtn" />',
	);

	TweenMax.set($("#project-modal")[0], { x: $(window).width(), autoAlpha: 1 });
	TweenMax.to($("#project-modal")[0], 1, { x: 0, ease: Expo.easeOut });

	$("#project-modal").find(".backBtn").click(closeProject);
}

function closeProject() {
	TweenMax.to($("#project-modal")[0], 0.6, {
		x: $(window).width(),
		ease: Expo.easeOut,
		onComplete: function () {
			TweenMax.set($("#project-modal")[0], { autoAlpha: 0 });
			$("#project-modal")[0].innerHTML = "";
		},
	});
}

$(document).ready(init);
