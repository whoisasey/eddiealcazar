//@codekit-prepend "libs/jquery.min.js";
//@codekit-prepend "libs/jquery.migrate.min.js";
//@codekit-prepend "libs/jquery.scrollpanel.js";
//@codekit-prepend "libs/iscroll.js";
//@codekit-prepend "libs/jquery.mousewheel.js";
//@codekit-prepend "libs/TweenMax.min.js";
//@codekit-prepend "libs/modernizr.custom.js";
//@codekit-prepend "libs/PxLoader.js";
//@codekit-prepend "libs/PxLoaderImage.js";

//detect phone and tablet devices and redirect accordingly
var isMobile = {
	AndroidPhone: function () {
		if (
			navigator.userAgent.match(/Android/i) &&
			navigator.userAgent.match(/Mobile/i)
		) {
			return true;
		} else {
			return false;
		}
	},
	AndroidTablet: function () {
		if (
			navigator.userAgent.match(/Android/i) &&
			!navigator.userAgent.match(/Mobile/i)
		) {
			return true;
		} else {
			return false;
		}
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	},
	iPad: function () {
		return navigator.userAgent.match(/iPad/i) ? true : false;
	},
	iPhone: function () {
		return navigator.userAgent.match(/iPhone|iPod/i) ? true : false;
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	},
	any: function () {
		return (
			isMobile.AndroidPhone() ||
			isMobile.AndroidTablet() ||
			isMobile.BlackBerry() ||
			isMobile.iPad() ||
			isMobile.Windows()
		);
	},
};

if (isMobile.iPhone() || isMobile.BlackBerry() || isMobile.AndroidPhone()) {
	document.location =
		document.location.href.replace(document.location.hash, "") +
		"mobile/" +
		document.location.hash;
}

//Set namesapce
var H = H || {};

// H.createScroll = function (el) {
// 	var ret;
// 	if (Modernizr.touch) {
// 		var rand = Math.floor(Math.random() * 1000);
// 		$(el).wrapInner('<div id="' + rand + 'viewport" />');
// 		$("#" + rand + "viewport").css({
// 			height: $(el).height(),
// 			overflow: "hidden",
// 		});
// 		ret = new iScroll($("#" + rand + "viewport")[0], {
// 			vScrollbar: false,
// 			bounce: true,
// 		});
// 	} else {
// 		ret = $(el).scrollpanel().data("scrollpanel");
// 	}
// 	return ret;
// };

H.updateScroll = function (scroll) {
	if (scroll.refresh) {
		scroll.refresh();
	} else {
		scroll.update();
	}
};

var data, loader;
var pages = [];
var thumbs = [];
var currPage = null;
var isLoaded = false;
var isTimeout = false;
var isAnimating = false;
var to;

function init() {
	//Init resize event
	$(window).resize(onResize);
	onResize();

	//Load xml
	$.ajax({
		type: "GET",
		url: "json/site.json",
		dataType: "jsonp",
		crossDomain: "true",
		success: parseData,
		jsonpCallback: "callback",
	});
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

	console.log("projects length:", data.projects.length);

	//Init thumbs
	var count = 0;
	for (var i = 0; i < data.projects.length; i++) {
		// if (data.projects[i].isCenter == "true
		var div = document.createElement("div");
		div.setAttribute("class", "thumb");

		// div.style.left = count * (100 / data.projects.length) + "%";
		// div.style.width = 100 / data.projects.length + "%";

		// at regular desktop screens, width should be capped at 100/8
		// at large screens, width should be capped at 100/9

		if (window.innerWidth <= 1440) {
			// assuming 1440px as the laptop screen width threshold
			// console.log("width = 100 /8");
			div.style.left = count * (100 / 8) + "%";
			div.style.width = 100 / 8 + "%";
		}
		if (window.innerWidth > 1440) {
			div.style.left = count * (100 / 9) + "%";
			div.style.width = 100 / 9 + "%";
		}

		$("#nav")[0].appendChild(div);

		var img = loader.addImage(data.projects[i].thumb);
		div.appendChild(img);

		jQuery.data(div, "ident", i);

		count++;
	}

	for (i = 0; i < data.projects.length; i++) {
		if (data.projects[i].isCenter != "true") {
			for (var j = 0; j < data.projects[i].spots.length; j++) {
				var spot = data.projects[i].spots[j];

				var page = document.createElement("div");
				page.setAttribute("class", "page page" + i + "" + j);
				$("#pageContainer")[0].appendChild(page);

				jQuery.data(page, "projectID", i);
				jQuery.data(page, "spotID", j);

				var container1 = document.createElement("div");
				container1.setAttribute("class", "imgContainer topleft container1");

				page.appendChild(container1);

				var image1 = loader.addImage(spot.folder + "01.jpg");
				container1.appendChild(image1);

				var container2 = document.createElement("div");
				container2.setAttribute("class", "imgContainer topright container2");
				jQuery.data(container2, "ident", i);
				page.appendChild(container2);

				var image2 = loader.addImage(spot.folder + "02.jpg");
				container2.appendChild(image2);

				var container3 = document.createElement("div");
				container3.setAttribute("class", "imgContainer bottomleft container3");
				jQuery.data(container3, "ident", i);
				page.appendChild(container3);

				var image3 = loader.addImage(spot.folder + "03.jpg");
				container3.appendChild(image3);

				var container4 = document.createElement("div");
				container4.setAttribute("class", "imgContainer bottomright container4");
				page.appendChild(container4);

				var image4 = loader.addImage(spot.folder + "04.jpg");
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

	loader.start();
	// Remove the video after 4 seconds
	setTimeout(function () {
		$("#video").fadeOut(2000, function () {
			$(this).remove();
		});
	}, 4000);
	to = setTimeout(onTimeout, 4000);
	isLoaded = true;

	//Init events
	$(".thumb").click(function () {
		var index = jQuery.data(this, "ident");
		if (!isAnimating) {
			getPage(index, 0);
		}
	});

	$(".imgContainer").click(function () {
		if (data.projects[jQuery.data(this, "projectID")].isStills == "true") {
			window.open("https://www.flickr.com/photos/eddiealcazar/", "_blank");
		} else if (
			data.projects[jQuery.data(this, "projectID")].spots[
				jQuery.data(this, "spotID")
			].video != null
		) {
			var index = $(".imgContainer").index(this);
			$("iframe").attr(
				"src",
				data.projects[jQuery.data(this, "projectID")].spots[
					jQuery.data(this, "spotID")
				].video + "?title=0&byline=0&badge=0&loop=1&autoplay=1&color=333",
			);
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
	});

	// when the current project is open, close the stills if user clicks blackspace
	$(".page").click(function (event) {
		if (
			!$(event.target).hasClass("imgContainer") &&
			!$(event.target).hasClass("thumb") &&
			!$(event.target).closest(".imgContainer").length
		) {
			closePageContainer();
		}
	});

	// Add an event listener for the scroll event to translate vertical scroll to horizontal scroll
	$(window).on("wheel", function (event) {
		if (event.originalEvent.deltaY !== 0) {
			$("#scroll-container")[0].scrollLeft += event.originalEvent.deltaY;
		}
	});

	onResize();
}

function closePageContainer() {
	if (currPage != null) {
		var prevPage = currPage;
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
					$("#copybottom").css("z-index", "15");
				},
			);
		});
	}

	if (isPressOpen) {
		TweenMax.to($("#awards"), 0.5, { autoAlpha: 0 });
		TweenMax.to($("#press"), 0.5, { autoAlpha: 0, delay: 0.1 });
	}
}

var isPressOpen = false;
var currPageID = -1;

function openPress() {
	if (currPage != null) {
		var prevPage = currPage;
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
					$("#copybottom").css("z-index", "15");
				},
			);

			H.updateScroll(pressScroll);
			H.updateScroll(awardsScroll);
		});
	}

	isPressOpen = true;

	TweenMax.to($("#awards"), 1, { autoAlpha: 1 });
	TweenMax.to($("#press"), 1, { autoAlpha: 1, delay: 0.2 });
}

function getPage(indexPage, indexSpot) {
	if (indexPage != currPageID || indexSpot != currSpotID) {
		var page = $(".page" + indexPage + "" + indexSpot);

		TweenMax.set(page.find("img"), { scale: 1 });
		TweenMax.set(page.find(".imgContainer"), { opacity: 0 });

		$("#pageContainer").css("visibility", "visible");
		if (currPage != null) {
			currPage.css("z-index", "1");
		}
		page.css("z-index", "5");
		page.css("visibility", "visible");

		if (currPage != null) {
			var prevPage = currPage;
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

		if (isPressOpen) {
			TweenMax.to($("#awards"), 0.5, { autoAlpha: 0 });
			TweenMax.to($("#press"), 0.5, { autoAlpha: 0, delay: 0.1 });
		}
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
				0.05,
			);
			$("#copybottom")[0].style.zIndex = "0";
			TweenMax.delayedCall(1, function () {
				$("#copytop").html(data.projects[indexPage].copytop);
				$("#copybottom").html(data.projects[indexPage].copybottom);

				if (data.projects[indexPage].spots.length > 1) {
					for (var i = 0; i < data.projects[indexPage].spots.length; i++) {
						var spot = data.projects[indexPage].spots[i];
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
						$("#copybottom")[0].style.zIndex = "15";
					},
				);
			});
		}

		currPage = page;
		currPageID = indexPage;
		currSpotID = indexSpot;
	}
}

var pressScroll;
var awardsScroll;

function animateIn() {
	$(".thumb").each(function (i) {
		TweenMax.to(this, 1, { opacity: 1, delay: Math.abs(i - 3.5) * 0.2 });
	});

	TweenMax.to($("#copytop").find("h1"), 0.5, {
		x: 0,
		opacity: 1,
		delay: 1,
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
		delay: 1.2,
		ease: Expo.easeOut,
	});
	TweenMax.staggerTo(
		$("#copybottom").find("li"),
		0.5,
		{ x: 0, opacity: 1, delay: 1.3, ease: Expo.easeOut },
		0.1,
	);

	$(".center").hover(
		function () {
			TweenMax.set($(this).find(".highlight"), { opacity: 0.2 });
			TweenMax.to($(this).find(".highlight"), 0.5, { opacity: 0 });
		},
		function () {},
	);

	$(".thumb").hover(
		function () {
			TweenMax.to(this, 0.3, { opacity: 0.5 });
			TweenMax.to($(this).find(".cs"), 0.3, { opacity: 1 });
		},
		function () {
			TweenMax.to(this, 0.3, { opacity: 1 });
			TweenMax.to($(this).find(".cs"), 0.3, { opacity: 0 });
		},
	);

	TweenMax.to($("#footer"), 1, { opacity: 1 });

	// pressScroll = H.createScroll($("#press-scroller")[0]);
	// awardsScroll = H.createScroll($("#awards-scroller")[0]);

	onResize();
}

function onTimeout() {
	isTimeout = true;

	if (isLoaded) {
		animateIn();
	}
}

function onResize() {
	var w = $(window).width();
	/*if(w<1080){
        w=1080;
    }*/

	const container = document.querySelector("#container");
	const width = w + "px";
	const height = w / (1600 / 600) + "px";
	const marginTop = `${(window.innerHeight - parseFloat(height)) / 2}px`;

	container.style.width = width;
	container.style.height = height;
	container.style.marginTop = marginTop;

	// $("#guide").css("width", w + "px");
	// $("#guide").css("height", w / (1600 / 600) + "px");
	// $("#guide").css(
	// 	"top",
	// 	($(window).height() - $("#container").height()) / 2 + "px",
	// );

	$("iframe").css("width", w + "px");
	$("iframe").css("height", $(window).width() / (1600 / 600) + "px");

	$("#playerContainer").css("width", w + "px");
	$("#playerContainer").css("height", w / (1600 / 600) + "px");

	$("#nav").css("width", w + "px");
	$("#nav").css("height", w / (1600 / 66) + "px");
	$("#navWrapper").css("height", w / (1600 / 66) + "px");
	$("#navWrapper").css("margin-top", -$("#nav").height() / 2 + "px");

	$(".copy").css("width", $(".center").width() + "px");
	$(".copy").css("margin-left", -($(".center").width() / 2) + "px");

	$("#press-scroller").css(
		"height",
		$("#press").height() - $("#press").find("h1").eq(0).height() - 20 + "px",
	);
	$("#awards-scroller").css(
		"height",
		$("#awards").height() - $("#awards").find("h1").eq(0).height() - 20 + "px",
	);

	if (pressScroll) {
		H.updateScroll(pressScroll);
	}
	if (awardsScroll) {
		H.updateScroll(awardsScroll);
	}
}

$(document).ready(init);
