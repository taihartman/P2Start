	//https://jqueryui.com/tabs/





	//now what?
	//api:  http://www.ist.rit.edu/api/
	$(document).ready(function(){
		// //get the about page
		//load content of page with calls inside other calls depending on how far down the element is on the page 
		$.ajax({
			type:'get',
			url:'proxy.php',
			data:{path:"/about/"},
			dataType:'json'
		}).done(function(msg){
			console.log(msg);
			$('#section_1').html('<h1 id="title">'+msg.title+'</h1>');
            $('#section_1').append('<h2 id="description">'+msg.description+'</h2>');
            $('#title').css({"overflow": "auto"});
            $('#description').css({"display":"inline","overflow": "auto"});
           
            
		});


		//get undergrad
		xhr('get',{path:'/degrees/undergraduate/'}).done(function(msg){
			console.log('HERE+++'+msg);
			console.log(msg);
			$.each(msg.undergraduate,function(i,item){
				console.log(item.title);

				$("#content").append('<h4>'+item.title+'</h4>');
				$("#content").append('<p>'+this.description+'</p>');
			});
		});
		//using utility 
		//get minors
		xhr('get',{path:'/minors/'},'#minors').done(function(json){
			console.log(json);
		});

		//get people
		xhr('get',{path:'/people/'}).done(function(json){
			// console.log(json);
			//just faculty 
			//put out the people and name 
			let x=''
			$.each(json.faculty,function(){
				x+='<div class="faculty" data-username="'+this.username+'"><h5>'+this.name+'</h5><img style="max-width:150px" src="'+ this.imagePath+'"/></div>';
			});
			$('#people').append(x);
			//do staff on own
			//while I have json, assign the event to get it 
			$('.faculty, .staff').on('click',function(){
				console.log(json);
				var username = $(this).attr('data-username');
				var me = getAttributesByName(json.faculty,'username',username);
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
	function getAttributesByName(array,name,val){
		var result = null;
		$.each(array,function(){
			if(this[name]==val){
				result=this;
			}
		});

		return result;
	}

	function xhr(getPost,d,idForSpinner){
		return $.ajax({
			type: getPost,
			data: d,
			dataType:'json',
			cache:false,
			async:true,
			url: 'proxy.php',
			beforeSend: function(){
				$(idForSpinner).append('<img src="./assets/media/gears.gif" class="bsSpinner"/>')
			}

		}).always(function(){
			// $(idForSpinner).find('.bsSpinner').fadeOut(500).remove();
			$(idForSpinner).find('.bsSpinner').fadeOut(500,function(){this.remove()});

		}).fail(function(err){
			console.log(err);
		});
	}