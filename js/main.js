/*  
	Your Project Title
	Author: You
*/

(function($){
	
	/*
	===============================================
	=========================== APPLICATION GLOBALS	
	*/
	
	var win = $(window),
		body = $(document.body),
		container = $('#container'),	// the only element in index.html
		currentUser = {},
		currentID = {},
		clientList = [],
		projectList = [],
		clientID = undefined,
		projectID
	;
	
	
	/*
	===============================================
	========================= APPLICATION FUNCTIONS	
	*/

	var setIndexTask = function(){
		$('.pt_list').each(function(index){
			var taskID = $(this).attr('data-id');
			$(this).attr('data-index', index);
			console.log(this);
			$.ajax({
				url:"xhr/update_task.php",
				type:"post",
				dataType:"json",
				data:{
					taskID: taskID,
					specs: index
				},
				success: function(response){
					console.log(response);
					if(response.error){
					///ERROR
					}else{
						console.log('success');
					}
				}
			});
		});
	};

	var setIndexProject = function(){
		$('.p_list').each(function(index){
			var projectID = $(this).attr('data-id');
			$(this).attr('data-index', index);
			console.log(this);
			$.ajax({
				url:"xhr/update_project.php",
				type:"post",
				dataType:"json",
				data:{
					projectID: projectID,
					teamID: index
				},
				success: function(response){
					console.log(response);
					if(response.error){
					///ERROR
					}else{
						console.log('success');
					}
				}
			});
		});
	};

	var setIndexClient = function(){
		$('.c_list').each(function(index){
			var clientID = $(this).attr('data-client');
			$(this).attr('data-index', index);
			console.log(clientID);
			$.ajax({
				url:"xhr/update_client.php",
				type:"post",
				dataType:"json",
				data:{
					clientID: clientID,
					email: index
				},
				success: function(response){
					console.log(response);
					if(response.error){
					///ERROR
					}else{
						console.log('success');
					}
				}
			});
		});
	};
	
	var loadApp = function(){
		$.get('templates/app.html', function(html){
			var h = $(html);
			var appCode = h.find('#template_app').html();
			$.template('app', appCode);		// compile template
			$.render(currentUser, 'app');		// use template
			container.html(appCode);
		});
		getClients();
	};
	
	var loadLanding = function(){
		$.get('templates/landing.html', function(html){
			var h = $(html);
			var landingCode = h.find('#template_landing').html();
			$.template('landing', landingCode);		// compile template
			$.render(currentUser, 'landing');		// use template
			container.html(landingCode);
		});
	};
	
	var loadProject = function(){
		// console.log(currentUser);
		$.get('templates/app.html', function(html){
			var h = $(html);
			var projectCode = h.find('#template_project_link').html();
			$.template('app', projectCode);		// compile template
			$.render(currentUser, 'app');		// use template
			container.html(projectCode);
		});
		getProjects();
	};

	var loadSideProjects = function(){
		$.ajax({
			url:"xhr/get_projects.php",
			type:"get",
			dataType:"json",
			success: function(response){
				if(response.error){
					///ERROR
				}else{
					currentUser = response.projects;
					$.get('templates/app.html', function(html){
						var h = $(html);
						var projectCode = h.find('#template_task_link').html();
						$.template('app', projectCode);		// compile template
						$.render(currentUser, 'app');		// use template
						container.html(projectCode);

						var wrapper = $('.divider'),
							projectList = h.find('#template_side_projects').html()
							
						$.template('projectList', projectList);		// compile template
						var render = $.render(currentUser, 'projectList');

						wrapper.append(render);
					});
				};
			}
		});
	};

	var loadProjectsClients = function(){
		$.get('templates/app.html', function(html){
			var h = $(html);
			var projectCode = h.find('#template_project_link').html();
			$.template('app', projectCode);		// compile template
			$.render(currentUser, 'app');		// use template
			container.html(projectCode);

			var wrapper = $('.app_main'),
				projectList = h.find('#template_project_view').html()
				
			$.template('projectList', projectList);		// compile template
			var render = $.render(currentUser, 'projectList');

			wrapper.append(render);
		});

	};
	

	var loadTasks = function(){
		$.get('templates/app.html', function(html){
			var h = $(html);
			var taskCode = h.find('#template_task_link').html();
			$.template('app', taskCode);		// compile template
			$.render(currentUser, 'app');		// use template
			container.html(taskCode);
			getTasks();
		});
		
	};

	var checkLoginState = function(){
		$.ajax({
			url: 'xhr/check_login.php',
			type: 'get',
			dataType: 'json',
			success: function(response){
				// if user, loadApp()
				// if error, loadLanding()
				if(response.user){
					currentID = response.user.id;
					loadApp();
				}else{
					loadLanding();
					// console.log("im runing")
					$("input, textarea").placeholder();
				};
			}
		});
	};


	var getClients = function(){
		$.ajax({
			url:"xhr/get_clients.php",
			type:"get",
			dataType:"json",
			data:{

			},
			success: function(response){
				if(response.error){
				//	console.log(response.error);
					currentUser = "<p>"+response.error+"</p>";
					// showLoginError();
				}else{
					var clients = response.clients;
					console.log(clients);
					clients.sort(function(a,b){return a.email-b.email});
					console.log(clients);
					clientID = response.clientID;
					$.get('templates/app.html', function(html){
						var h = $(html),
							wrapper = $('.app_main'),
							clientList = h.find('#template_client_view').html()
							
						$.template('clientList', clientList);		// compile template
						var render = $.render(clients, 'clientList');

						wrapper.append(render);

						$('.app_main').sortable({
							revert: true,
							update: function(even, ui){
								setIndexClient();
							}
					 	}).disableSelection();

						// $('.project').each(funtion(){
						// 	if($(this).attr('data-clientID') !== client_id){
						// 		$(this).remove();
						// 	};
						// });
					});
				};
			}
		});
	};


	var getProjects = function(){
		$.ajax({
			url:"xhr/get_projects.php",
			type:"get",
			dataType:"json",
			success: function(response){
				if(response.error){
				//	console.log(response.error);
					currentUser = "<p>"+response.error+"</p>";
					// showLoginError();
				}else{
					var projects = response.projects;
					projects.sort(function(a,b){return a.teamID-b.teamID});
					console.log(projects);
					// console.log(projects);
					projectID = response.projectID
					$.get('templates/app.html', function(html){
						var h = $(html),
							wrapper = $('.app_main'),
							projectList = h.find('#template_project_view').html()
							
						$.template('projectList', projectList);		// compile template
						var render = $.render(projects, 'projectList');

						wrapper.html(render);
						$('.app_main').sortable({
							revert: true,
							update: function(even, ui){
								setIndexProject();
							}
					 	}).disableSelection();

						// $('.project').each(funtion(){
						// 	if($(this).attr('data-clientID') !== client_id){
						// 		$(this).remove();
						// 	};
						// });
					});
				};
			}
		});
	};

	var getTasks = function(){
		console.log(projectID);
		$.ajax({
			url:"xhr/get_tasks.php",
			type:"get",
			dataType:"json",
			data:{
				projectID: projectID
			},
			success: function(response){
				// console.log(response);
				if(response.error){
					console.log(response.error);
					// currentUser = "<p>"+response.error+"</p>";
					// showLoginError();
				}else{
					var tasks = response.tasks;
					tasks.sort(function(a,b){return a.specs-b.specs});
					console.log(tasks);
					$.get('templates/app.html', function(html){
						var h = $(html),
							wrapper = $('.app_main_task'),
							taskList = h.find('#template_task_view').html();

						wrapper.html('');

						$.template('taskList', taskList);		// compile template
						var render = $.render(tasks, 'taskList');

						wrapper.html(render);
						$('.app_main_task').sortable({
							revert: true,
							update: function(even, ui){
								setIndexTask();
							}
					 	}).disableSelection();

						// $('.project').each(funtion(){
						// 	if($(this).attr('data-clientID') !== client_id){
						// 		$(this).remove();
						// 	};
						// });
					});
				};
			}
		});
	};

	

	// 	============================================
	//	SETUP FOR INIT
		
	var init = function(){
	
		checkLoginState();
	};
	
	
	init();
	
		
	/*
	===============================================
	======================================== EVENTS	
	*/
	
	

	win.on('click', ".add_task", function(){
		// projectID = $(this).attr('data-projectID');
		// console.log(projectID);
		$('#modal_task').dialog({
			autoOpen: false,
			minHeight: 395,
			width: 580,
			modal: true,
			resizable: false,
			draggable: false,
			dialogClass: "alert",
			position: { my: "center top", at: "center bottom", of: window },
			title: "Creat A New Task",
			buttons: {
				"Submit": function() {
					var tName = $('#task_name').val();
					var description = $('#task_description').val();
					var date = $('#new_task_date').val();
					var status = $('.custom_theme').val();

					$.ajax({
						url: "xhr/new_task.php",
						data: {
								taskName: tName,
								status: status,
								projectID: projectID,
								
								//more hidden form stuff

								dueDate: date,
								taskDescription: description
							},
							type: "post",
							dataType: "json",
							success: function(response){
									// console.log(response);
									projectList.push(response.task);
									$(".app_main_task").html('');
									getTasks();
								
							}

					});
				}
			}
		}).dialog("open");
	});

	win.on('click', ".edit_task", function(e){
	    projectID = $(this).attr('data-projectID');
	    taskID = $(this).attr('data-id');
		$('#modal_task').dialog({
			autoOpen: false,
			minHeight: 395,
			width: 580,
			modal: true,
			resizable: false,
			draggable: false,
			dialogClass: "alert",
			position: { my: "center top", at: "center bottom", of: window },
			title: "Edit This Task",
			buttons: {
				"Submit": function() {
					var tName = $('#task_name').val();
					var description = $('#task_description').val();
					var date = $('#new_task_date').val();
					var status = $('.custom_theme').val();
					
					// console.log(taskID);
					$.ajax({
						url: "xhr/update_task.php",
						data: {
								taskName: tName,
								status: status,
								taskID: taskID,
								projectID: projectID,
								//more hidden form stuff

								dueDate: date,
								taskDescription: description
							},
							type: "post",
							dataType: "json",
							success: function(response){
									// console.log(response);
									$(".app_main_task").html('');
									getTasks();
								
							}

					});
				}
			}
		}).dialog("open");
		e.preventDefault();
		return false;
	});

	win.on('click', ".add_project", function(){
		$('#modal_project').dialog({
			autoOpen: false,
			minHeight: 395,
			width: 580,
			modal: true,
			resizable: false,
			draggable: false,
			dialogClass: "alert",
			position: { my: "center top", at: "center bottom", of: window },
			title: "Creat A New Task",
			buttons: {
				"Submit": function() {
					var tName = $('#project_name').val();
					var description = $('#project_description').val();
					var date = $('#project_date').val();
					var status = $('.custom_theme').val();
					
					$.ajax({
						url: "xhr/new_project.php",
						data: {
								projectName: tName,
								status: status,
								clientID: clientID,
								
								//more hidden form stuff

								dueDate: date,
								projectDescription: description
							},
							type: "post",
							dataType: "json",
							success: function(response){
									
									projectList.push(response.newproject);
									$(".app_main").html('');
									getProjects();
								
							}

					});
				}
			}
		}).dialog("open");
	});

	win.on('click', ".edit_project", function(e){
	    projectID = $(this).attr('data-id');
		$('#modal_project').dialog({
			autoOpen: false,
			minHeight: 395,
			width: 580,
			modal: true,
			resizable: false,
			draggable: false,
			dialogClass: "alert",
			position: { my: "center top", at: "center bottom", of: window },
			title: "Edit This Project",
			buttons: {
				"Submit": function() {
					var tName = $('#project_name').val();
					var description = $('#project_description').val();
					var date = $('#project_date').val();
					var status = $('.custom_theme').val();
					
					// console.log(projectID);
					$.ajax({
						url: "xhr/update_project.php",
						data: {
								projectName: tName,
								status: status,
								projectID: projectID,
								
								//more hidden form stuff

								dueDate: date,
								projectDescription: description
							},
							type: "post",
							dataType: "json",
							success: function(response){
									// console.log(response);
									$(".app_main").html('');
									getProjects();
								
							}

					});
				}
			}
		}).dialog("open");
		e.preventDefault();
		return false;
	});


	win.on('click', ".edit_clients", function(e){

		$('#modal_client').dialog({
			autoOpen: false,
			minHeight: 395,
			width: 580,
			modal: true,
			resizable: false,
			draggable: false,
			dialogClass: "alert",
			position: { my: "center top", at: "center bottom", of: window },
			title: "Edit this Client",
			buttons: {

				"Submit": function() {
					var cName = $('#client_name').val();
					var cContact = $('#client_contact').val();
					var clientID = $('.edit_clients').attr('data-id');
					// console.log(clientID);
					$.ajax({
						url: "xhr/update_client.php",
						data: {
							clientName: cName,
							phone: cContact,
							primaryContact: currentID,
							clientID: clientID
						},
						type: "post",
						dataType: "json",
						success: function(response){
							// console.log(response);
							projectList.push(response);
							$(".app_main").html('');

							$.ajax({
								url: 'xhr/get_clients.php',
								type: 'get',
								dataType: 'json',
								success: function(response){
									// console.log(response.clients);
									// console.log(response.clients[response.clients.length-1]);


									
									//console.log(lastId);

									getClients();
								}
							});
						}
					});
				}
			}
		}).dialog("open");
		e.preventDefault();
		return false;
	});


	win.on('click', ".add_client", function(){
		$('#modal_client').dialog({
			autoOpen: false,
			minHeight: 395,
			width: 580,
			modal: true,
			resizable: false,
			draggable: false,
			dialogClass: "alert",
			position: { my: "center top", at: "center bottom", of: window },
			title: "Creat A New Client",
			buttons: {

				"Submit": function() {
					var cName = $('#client_name').val();
					var cContact = $('#client_contact').val();

					$.ajax({
						url: "xhr/new_client.php",
						data: {
							clientName: cName,
							phone: cContact,
							primaryContact: currentID
						},
						type: "post",
						dataType: "json",
						success: function(response){
							// console.log(response);
							projectList.push(response);
							$(".app_main").html('');

							$.ajax({
								url: 'xhr/get_clients.php',
								type: 'get',
								dataType: 'json',
								success: function(response){
									// console.log(response.clients);
									// console.log(response.clients[response.clients.length-1]);


									var lastId = response.clients[response.clients.length].id;
									//console.log(lastId);

									getClients();
								}
							});
						}
					});
				}
			}
		}).dialog("open");

	});


	


	win.on('click', ".cta_button", function(){
		// console.log("i've been clicked");
		$('#dialog-form').dialog({
			autoOpen: false,
			minHeight: 395,
			width: 580,
			modal: true,
			resizable: false,
			draggable: false,
			dialogClass: "alert",
			position: { my: "center top", at: "center bottom", of: window },
			title: "Creat A New Task",
			buttons: {
				"Submit": function() {
					var mail = $("#new_email").val();
					var user = $("#new_username").val();
           			var pass = $("#new_pass").val();
					$.ajax({
								url: "xhr/register.php",
								data: {
									email: mail,
									username: user,
									password: pass
								},
								type: "post",
								dataType: "json",
								success: function(response){
									if(response.error){
										// console.log(response.error);
										currentUser = {};
										$("#modal-error").show().html(response.error);
									}else{
										// console.log("success");
										// currentUser = response.user;
										// loadApp();
									};
								}
							});///success check
				}// ajax call
			} //submit

		}).dialog("open");

	});

	win.on('click', '.login', function(e){
           var user = $("#username").val();
           var pass = $("#pass").val();

           $.ajax({
                   url: "xhr/login.php",
                   data: {
                           username: user,
                           password: pass
                   },
                   type: "post",
                   dataType: "json",
                   success: function(response){
                           if(response.error){
                                 // console.log(response.error);
                                   // currentUser = $('#error-mes').html("<img src='images/error_img.jpg' /><p>" +response.error+"</p>");
                                   // showLoginError();
                                   $("#login-error").show().html(response.error);
                           }else{
                           		// console.log("I've been loged in");
                                //   console.log("success");
                                	currentID = response.user.id;
                                   currentUser = response.user;
                                  // console.log(currentUser)
                                   loadApp();
                           };
                   }
           });

           return false;
   });

	win.on('click', '.logout', function(){
		$.get('xhr/logout.php', function(){
			loadLanding();
		});
		return false;
	});

	win.on('click', '.projects', function(){
		loadProject();
	});

	win.on('click', '.clients', function(){
		loadApp();
	});

	win.on('click', '.c_list', function(){
		var wrapper = $('.app_main');
		// console.log("I've been clicked");
		// console.log($(this).attr("data-client"));
		clientID = $(this).attr("data-client");
		$.ajax({
			url:"xhr/get_projects.php",
			type:"get",
			dataType:"json",
			success: function(response){

				if(response.error){
				//	console.log(response.error);
					currentUser = "<p>"+response.error+"</p>";
					// showLoginError();
				}else{

					wrapper.html('');
					var projects = response.projects;
					var projectWithClient = [];
					$(projects).each(function(i){
						
						if(this.clientID === clientID){
							projectWithClient.push(projects[i]);
						};

					});

					// console.log(projects);
					// console.log(projectWithClient);
					// jQuery.grep(projects, function(i){
					// 	console.log(projects[i].clientID !== clientID);
					// });

					// $.get('templates/app.html', function(html){
					// 	var h = $(html),
					// 		projectList = h.find('#template_project_view').html()
							
					// 	$.template('projectList', projectList);		// compile template
					// 	var render = $.render(projectWithClient, 'projectList');
					// 	wrapper.append(render);
					// });

					currentUser = projectWithClient;
					loadProjectsClients();
				};
			}
		});
	});

	win.on('click', '.p_list', function(){
		projectID = $(this).attr('data-id');
		loadTasks();
		loadSideProjects();
		// console.log("load tasks");
	});

	win.on('click', '.pl_list', function(){
	 	// $(this).attr('class', 'pl_active');
		projectID = $(this).attr('data-id');
		getTasks();
	});

	win.on('click', '.finished_btn', function(){
		taskID = $(this).attr('data-id');
		// console.log(taskID);
		$.ajax({
				url: "xhr/update_task.php",
				data: {
						taskID: taskID,
						status: "finished"
					},
					type: "post",
					dataType: "json",
					success: function(response){
							// console.log(response);
							$(".app_main_task").html('');
							getTasks();
					}
				});
	});

	// win.on('submit', '#user-reg-form', function(){
		
	// 	return false;
	// });
	
	/*	
	==================================== END EVENTS 
	===============================================
	*/
		
		

	
})(jQuery); // end private scope




