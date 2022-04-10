<<<<<<< HEAD
//https://jqueryui.com/tabs/





//now what?
//api:  http://www.ist.rit.edu/api/
$(document).ready(function () {
	// //get the about page
	//load content of page with calls inside other calls depending on how far down the element is on the page 
	$.ajax({
		type: 'get',
		url: 'proxy.php',
		data: { path: "/about/" },
		dataType: 'json'
	}).done(function (msg) {
		console.log(msg);
		$('#about').html('<h1 id="title">' + msg.title + '</h1>');
		$('#about').append('<div id="description"><p>' + msg.description + '</p></div>');
		$('#title').css({ "overflow": "auto" });
		$('#description').css({ "display": "inline", "overflow": "auto" });
		$('#quote').append('"'+msg.quote+'"' +'<br><br>'+ '-'+msg.quoteAuthor);


	});
	

	//get undergrad
	xhr('get', { path: '/degrees/' }).done(function (msg) {
		console.log('HERE+++' + msg);
		console.log(msg);
		$.each(msg.undergraduate, function (i, item) {
			// console.log(item.title);
			//creating undergrad accordion
			$("#undergrad_accordion").append('<h3>' + item.title + '</h3>');
			$("#undergrad_accordion").append('<div><p class="accordion_description">' + this.description + `<br><button class="glow-on-hover" data-degreeTitle='${item.title}' data-degreeName='${item.degreeName}' type='button' onclick='openConcentration(this)'>View concentrations</button></p></div>`);
		});
		let x = ''
		$.each(msg.graduate, function (i, item) {
			console.log(item.title);
			if (item.degreeName == "graduate advanced certificates") {//checking if certificate
				$("#graduate_accordion").append('<h3>' + "Graduate Advanced Certificates" + '</h3>');
				$.each(item.availableCertificates, function (i, item) {
					x += `${item} <br>`;
				});
				$("#graduate_accordion").append(`<div><p class="accordion_description">${x}</p></div>`);
			} else {
				$("#graduate_accordion").append('<h3>' + item.title + '</h3>');
				$("#graduate_accordion").append('<div><p class="accordion_description">' + this.description + `<br><button class="glow-on-hover" data-degreeTitle='${item.title}' data-degreeName='${item.degreeName}' type='button' onclick='openConcentration(this,"grad")'>View concentrations</button></p></div>`);
			}

		});
		//initiating accordion
		$("#undergrad_accordion").accordion();
		$("#graduate_accordion").accordion();
		$("#section_2_content").append('<div id="dialog-1" title="Concentration"></div>')
		$("#dialog-1").dialog({
			autoOpen: false,
		});
		$(".open_dialog").click(function () {
			$("#dialog-1").dialog("open");
		});
	});
	//using utility 

	//get minors
	xhr('get', { path: '/minors/' }).done(function (item) {
		console.log(item);
		$.each(item.UgMinors, function (i, item) {
			//creating minors accordion
			$("#minors_accordion").append('<h3>' + item.title + '</h3>');
			$("#minors_accordion").append('<div><p class="accordion_description">' + this.description + `<br><button class="glow-on-hover" data-courses='${item.courses}' type='button' onclick='openMinor(this)'>View Courses</button></p></div>`);
		});

		$("#minors_accordion").accordion({heightStyle: 'panel'});
	});

	

	xhr('get', { path: '/employment/' }).done(function (item) {
		console.log(item);
		//adding basic page info
		$("#introduction").append(`<h2 id="introductionTitle">${item.introduction.title}</h2>`);
		$.each(item.introduction.content, function (i, json) {
			$("#introduction").append(`<div><h2>${json.title}</h2><p>${json.description}</p></div>`);
		});

		//doing the stats
		$("#introduction").append(`<h2>${item.degreeStatistics.title}</h2>`);
		$("#introduction").append(`<div id="degreeStats"></div>`);
		$.each(item.degreeStatistics.statistics, function (i, json) {
			$("#degreeStats").append(`<div class="degreeStatsBox"><h2>${json.value}</h2><br><span>${json.description}</span></div>`);
		});

		//doing the employers
		$("#introduction").append(`<h2>${item.employers.title}</h2>`);
		$("#introduction").append(`<div id="employers"></div>`);
		$.each(item.employers.employerNames, function (i, json) {
			$("#employers").append(`<span>${json}</span> | `);
		});

		//doing the careers
		$("#introduction").append(`<h2>${item.careers.title}</h2>`);
		$("#introduction").append(`<div id="careers"></div>`);
		$.each(item.careers.careerNames, function (i, json) {
			$("#careers").append(`<span>${json}</span> | `);
		});
	});
	const createCoopTable = new Promise((resolve, reject) => {
		xhr('get', { path: '/employment/' }).done(function (item) {
			//setting up co-op table
			$("#coopTableDiv").append('<table id="coopTable"></table>');
			$("#coopTable").append('<thead><tr id="coopHeaderRow"></tr></thead>');
			$("#coopHeaderRow").append(`<th>Employer</th>`);
			$("#coopHeaderRow").append(`<th>Degree</th>`);
			$("#coopHeaderRow").append(`<th>City</th>`);
			$("#coopHeaderRow").append(`<th>Term</th>`);
			$("#coopTable").append('<tbody id="coopBody"></tbody>');
			$.each(item.coopTable.coopInformation, function (i,field) {
				$("#coopBody").append(`<tr><td>${field.employer}</td><td>${field.degree}</td><td>${field.city}</td><td>${field.term}</td></tr>`);
				if (i === item.coopTable.coopInformation.length - 1){
					resolve();
				} 
			});
			
		});
		
	});
	createCoopTable.then(function(){
		$('#coopTable').DataTable({
			paging: true,
		});
	});
	const createGradTable = new Promise((resolve, reject) => {
		xhr('get', { path: '/employment/' }).done(function (item) {
			//setting up grad table
			$("#gradTableDiv").append('<table id="gradTable"></table>');
			$("#gradTable").append('<thead><tr id="gradHeaderRow"></tr></thead>');
			$("#gradHeaderRow").append(`<th>Employer</th>`);
			$("#gradHeaderRow").append(`<th>Degree</th>`);
			$("#gradHeaderRow").append(`<th>City</th>`);
			$("#gradHeaderRow").append(`<th>Title</th>`);
			$("#gradHeaderRow").append(`<th>Start Date</th>`);
			$("#gradTable").append('<tbody id="gradBody"></tbody>');
			$.each(item.employmentTable.professionalEmploymentInformation, function (i,field) {
				$("#gradBody").append(`<tr><td>${field.employer}</td><td>${field.degree}</td><td>${field.city}</td><td>${field.title}</td><td>${field.startDate}</td></tr>`);
				if (i === item.employmentTable.professionalEmploymentInformation.length - 1){

					resolve();
					
				} 
			});
			
		});
		
	});
	createGradTable.then(function(){
		$('#gradTable').DataTable({
			paging: true,
		});
	});

	//get people
	xhr('get', { path: '/people/' }).done(function (json) {
		// console.log(json);
		//just faculty 
		//put out the people and name 
		let x = ''
		$.each(json.faculty, function () {
			x += '<div class="faculty" data-username="' + this.username + '"><h5>' + this.name + '</h5><img style="max-width:150px" src="' + this.imagePath + '"/></div>';
		});
		$('#people').append(x);
		//while I have json, assign the event to get it 
		$('.faculty, .staff').on('click', function () {
			console.log(json);
			var username = $(this).attr('data-username');
			var me = getAttributesByName(json.faculty, 'username', username);
			console.log(me);
		});
	});


});//end of document ready

//opening the dialog for concentrations
function openConcentration(dom, who){
	var degreeName = dom.getAttribute('data-degreeName');
	var degreeTitle= dom.getAttribute('data-degreeTitle');
	if(who=='grad'){
		xhr('get', { path: `/degrees/graduate/degreeName=${degreeName}` }).done(function (json) {
			console.log("here");
			console.log(json.concentrations);
			let x = ''
			$.each(json.concentrations, function (i,item) {
				console.log(item);
				x += `<span>-${item}</span> <br>`;
			});
			//creating and opening dialog 
			$(dom).parent().append(`<div id="dialog" title='${degreeTitle} Concentrations'><p>${x}</p></div>`)
			$( "#dialog" ).dialog({
				width : 500,
				autoOpen: true,
				show: {
				  effect: "bounce",
				  duration: 1000
				},
				hide: {
				  effect: "explode",
				  duration: 500
				}
			  });
		});
	}else{
		//getting based off degree name
		xhr('get', { path: `/degrees/undergraduate/degreeName=${degreeName}` }).done(function (json) {
			console.log("here");
			console.log(json.concentrations);
			let x = ''
			$.each(json.concentrations, function (i,item) {
				console.log(item);
				x += `<span>-${item}</span> <br>`;
			});
			//creating and opening dialog 
			$(dom).parent().append(`<div id="dialog" title='${degreeTitle} Concentrations'><p>${x}</p></div>`);
			$( "#dialog" ).dialog({
				width : 500,
				autoOpen: true,
				show: {
				effect: "bounce",
				duration: 1000
				},
				hide: {
				effect: "explode",
				duration: 500
				}
			});
		});
	}
}
//dialog for minors
function openMinor(dom){
	var courses = dom.getAttribute('data-courses');
	//creating array of courses
	var courseArray = courses.split(',');
	//displaying courses in decent manner
	const getCoursesPromise = new Promise((resolve, reject) => {
		let x = ''
		$.each(courseArray, function (i,course) {
			var courseName;
			xhr('get', { path: `/course/courseID=${course}`}).done(function (json) {
				courseName = json.title;
				//building list of courses
				x += `<li style="cursor: pointer;" data-course='${course}'; data-courseName='${courseName}'; data-courseDescription='${json.description}'; onclick="openCourseDetails(this)";>` + course + ':'+ courseName + '</li>';
				//adding this here to load dialog when done with all items
				if (i === courseArray.length -1){
					resolve(x);
				} 
			});
			
		});
		
	});
	//on complete of the promise displaying dialog
	getCoursesPromise.then(function(x){
		$(dom).parent().append(`<div id="dialog" title='Courses'"><ul>${x}</ul></div>`);
		$( "#dialog" ).dialog({
			width : 1000,
			autoOpen: true,
			show: {
				effect: "bounce",
				duration: 1000
			},
			hide: {
				effect: "explode",
				duration: 500
			}
		});
	})
}
//opening course details
function openCourseDetails(dom){
	//getting details here so dont have to call again
	var course = dom.getAttribute('data-course');
	var courseName = dom.getAttribute('data-courseName');
	var courseDescription = dom.getAttribute('data-courseDescription');
	console.log(courseName);
	$(dom).append(`<div id="dialog-2" title='${course}:${courseName}'><p>${courseDescription}</p></div>`);
	$( "#dialog-2" ).dialog({
		width : 500,
		autoOpen: true,
		show: {
		effect: "bounce",
		duration: 1000
		},
		hide: {
		effect: "explode",
		duration: 500
		}
	});
}
///////////////////////////////////////////////////////////////////////
//ajax util
// args
//		getPost - is it a get or a post
//		d - data
//		idForSpinner - the id of the tag to put the spinner in 
//
//	example: xhr: ('get',{path:'/about/'}, '#content').done();
//	OR example: xhr: ('get',{path:'/about/'}).done();


//use this function to get an exact match on the attribute you are looking for
//array - array to look into 
//name - name of the name=value pair to find the object
//val - value of the name=value pair to find the object

//getAttributesByName(json.faculty,'username','dsbcis')
function getAttributesByName(array, name, val) {
	var result = null;
	$.each(array, function () {
		if (this[name] == val) {
			result = this;
		}
	});

	return result;
}

function xhr(getPost, d, idForSpinner) {
	return $.ajax({
		type: getPost,
		data: d,
		dataType: 'json',
		cache: false,
		async: true,
		url: 'proxy.php',
		beforeSend: function () {
			$(idForSpinner).append('<img src="./assets/media/gears.gif" class="bsSpinner"/>')
		}

	}).always(function () {
		// $(idForSpinner).find('.bsSpinner').fadeOut(500).remove();
		$(idForSpinner).find('.bsSpinner').fadeOut(500, function () { this.remove() });

	}).fail(function (err) {
		console.log(err);
	});
=======
//https://jqueryui.com/tabs/





//now what?

function buildConcentrationDialog() {
	$("#section_2_content").append('<div id="dialog-1" title="Concentration"></div>')

}
//api:  http://www.ist.rit.edu/api/
$(document).ready(function () {
	// //get the about page
	//load content of page with calls inside other calls depending on how far down the element is on the page 
	$.ajax({
		type: 'get',
		url: 'proxy.php',
		data: { path: "/about/" },
		dataType: 'json'
	}).done(function (msg) {
		console.log(msg);
		$('#about').html('<h1 id="title">' + msg.title + '</h1>');
		$('#about').append('<h2 id="description">' + msg.description + '</h2>');
		$('#title').css({ "overflow": "auto" });
		$('#description').css({ "display": "inline", "overflow": "auto" });


	});


	//get undergrad
	xhr('get', { path: '/degrees/' }).done(function (msg) {
		console.log('HERE+++' + msg);
		console.log(msg);
		$.each(msg.undergraduate, function (i, item) {
			console.log(item.title);

			$("#undergrad_accordion").append('<h3>' + item.title + '</h3>');
			$("#undergrad_accordion").append('<div><p>' + this.description + '</p></div>');
		});
		let x = ''
		$.each(msg.graduate, function (i, item) {
			console.log(item.title);
			if (item.degreeName == "graduate advanced certificates") {
				$("#graduate_accordion").append('<h3>' + "Graduate Advanced Certificates" + '</h3>');
				$.each(item.availableCertificates, function (i, item) {

					x += `${item} <br>`;

				});
				$("#graduate_accordion").append(`<div><p>${x}</p></div>`);
			} else {
				$("#graduate_accordion").append('<h3>' + item.title + '</h3>');
				$("#graduate_accordion").append('<div><p>' + this.description + '</p></div>');
				$("#graduate_accordion").append('<button class="concentrationButton">Open concentration details</button>');

			}

		});
		$("#undergrad_accordion").accordion();
		$("#graduate_accordion").accordion();

		$("#dialog-1").dialog({
			autoOpen: false,
		});
		$(".concentrationButton").click(function () {
			$("#dialog-1").dialog("open");
		});
	});
	//using utility 
	//get minors
	xhr('get', { path: '/minors/' }, '#minors').done(function (json) {
		console.log(json);
	});

	//get people
	xhr('get', { path: '/people/' }).done(function (json) {
		// console.log(json);
		//just faculty 
		//put out the people and name 
		let x = ''
		$.each(json.faculty, function () {
			x += '<div class="faculty" data-username="' + this.username + '"><h5>' + this.name + '</h5><img style="max-width:150px" src="' + this.imagePath + '"/></div>';
		});
		// $('#people').append(x);
		//do staff on own
		//while I have json, assign the event to get it 
		$('.faculty, .staff').on('click', function () {
			console.log(json);
			var username = $(this).attr('data-username');
			var me = getAttributesByName(json.faculty, 'username', username);
			console.log(me);
		});
	});


});//end of document ready

///////////////////////////////////////////////////////////////////////
//ajax util
// args
//		getPost - is it a get or a post
//		d - data
//		idForSpinner - the id of the tag to put the spinner in 
//
//	example: xhr: ('get',{path:'/about/'}, '#content').done();
//	OR example: xhr: ('get',{path:'/about/'}).done();


//use this function to get an exact match on the attribute you are looking for
//array - array to look into 
//name - name of the name=value pair to find the object
//val - value of the name=value pair to find the object

//getAttributesByName(json.faculty,'username','dsbcis')
function getAttributesByName(array, name, val) {
	var result = null;
	$.each(array, function () {
		if (this[name] == val) {
			result = this;
		}
	});

	return result;
}

function xhr(getPost, d, idForSpinner) {
	return $.ajax({
		type: getPost,
		data: d,
		dataType: 'json',
		cache: false,
		async: true,
		url: 'proxy.php',
		beforeSend: function () {
			$(idForSpinner).append('<img src="./assets/media/gears.gif" class="bsSpinner"/>')
		}

	}).always(function () {
		// $(idForSpinner).find('.bsSpinner').fadeOut(500).remove();
		$(idForSpinner).find('.bsSpinner').fadeOut(500, function () { this.remove() });

	}).fail(function (err) {
		console.log(err);
	});
>>>>>>> bb5d08707d5dabc0b38185b533f9be3edeee95db
}