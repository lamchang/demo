 setTimeout(function() {
$( document ).ready(function() {
    	
    // Global variables
	var url ='';
	console.log(window.location.hostname);
	if(window.location.hostname=="")
		url='http://legixapp.abardev.net';

    var step = 1;
    var num=0;
    function set_follows_unreads(){
		
		$.post(url+'api/follow/get_follows_unread',{'send_data':'send_data'})
			.success(function(response){
				
				response = $.parseJSON( response );
				return response.total;
				//console.log(response.total);
					/*if( response.total > 0 )
						$(".not-count").html("").html( response.total );*/
			})

	}
	// Notificación
    function notification() {
		$.post(url+'api/follow/get_follows_unread',{'send_data':'send_data'})
			.success(function(response){
				
			response = $.parseJSON( response );
		//	setTimeout(function() {
				if($('.notification > i > span').length == 0) {
					if(response.total>0)
						$('.notification > i').append('<span class="not-count">'+response.total+'</span>');
				}
			//}, 500);
			});
    }
    notification();
    $(document).on('click', function() {
        notification(); 
		
    });
    
    // Mostrar grupo
    $('body').on('click', '#show-all', function() {
        $('.image-list').toggleClass('active');
        if($('.image-list').hasClass('active') != true) {
            $(this).html('Ver todos');
        } else {
            $(this).html('Ver menos');
        }
    });
       
	// Botón visto 
    $('body').on('click', 'a.read', function(e){
		e.preventDefault();
				var feeds_noleidos=$(".feed_noread").size();
				var feeds_leidos=$(".feed_read").size();
				var $obj = $(this);
				var html = "";
				var feed_id = $obj.parents(".feeds").data("id");
				console.log(feed_id);
			if(!$(this).hasClass('active')){	
				$.post(url+'api/feeds_load',{read:'already',feed_id:feed_id}, function(response){
					 resp=$.parseJSON(response);
					if(resp.message="feed_leido"){
						$('.feeds[data-id="'+feed_id+'"]').addClass("feed_read");
						$('.feeds[data-id="'+feed_id+'"]').hide();
						$('.feeds[data-id="'+feed_id+'"]').removeClass("feed_noread");
						$(this).children('i').toggleClass('ion-ios-eye-outline');
						$(this).children('i').toggleClass('ion-ios-eye');
					}else if(resp.message="error")
						console.log("Fallo de conexión con la base de datos");
				});
			}else console.log("feed ya leido");
    });
	
    // input comentar
    $('body').on('click', '.icon-message', function() {
         $(this).parent().toggleClass('active');
        $(this).parent().parent().parent().children('.input-comment').toggleClass('active');
    });
    
    // button seen menu: active para botones de no leido & leido
    $( 'body' ).on( 'click', '.seen-menu a', function() {
        $( '.seen-menu a' ).removeClass( 'active' );
        $( this ).addClass( 'active' );
		if($(this).hasClass('active')){
					$('.feeds').hide();
					$('.'+$(this).data('class')).removeClass('ng-hide');
					$('.'+$(this).data('class')).show();
				}
    });
    
    // button search: activa lighbox de busqueda
    $( 'body' ).on( 'click', '.ion-search, .btn-cancel', function() {
        $( '.lightbox-search' ).toggleClass( 'active' );
		setTimeout(function(){
						$('#search').focus();
					}, 300);	
    });

    // button share: activa lighbox de compartir
    $( 'body' ).on( 'click', '.show-share', function() {
        $( '.share' ).addClass( 'active' );
        return false;
    });
    
    // button share email: activa lighbox de compartir por email
     $( 'body' ).on( 'click', '.show-lightbox-share', function() {
        $( '.share' ).removeClass( 'active' );
        $( '.lightbox-share' ).addClass( 'active' );
        return false;
    });
     // button edit folder: activa lighbox de edicion folder favorito
     $( 'body' ).on( 'click', '.show-lightbox-folder', function(e) {
        e.preventDefault();
		var folder_id=$(this).parent().data('id');
		var folder_name=$(this).parent('li').find('h2').html();
		console.log(folder_name)
		$("#folder_id").attr("ng-value",folder_id);
		$(".folder_title").attr("placeholder",folder_name);
		$( '.lightbox-add.update-folder' ).toggleClass( 'active' );
		setTimeout(function(){
			$('.folder_title').focus();
		}, 300);	
      });
    // oculta los lightbox's
    $( 'body' ).on( 'click', '.close-lightbox', function() {
        $( '.share, .lightbox' ).removeClass( 'active' );
		$(".folder_title").val("");
		$(".title_folder").val("");
        return false;
    });

    // button comments: activa & oculta comentarios
    $( 'body' ).on( 'click', '.show-comments', function() {
        $( this ).parent( '.item-comments' ).toggleClass( 'active' );
		var num= $(this).find('span.comments-count').html();
        if( $( '.item-comments' ).hasClass( 'active') ) {
            $( this ).html( 'Ocultar <span class="comments-count">'+num+'</span> comentarios previos' );
        } else {
            $( this ).html( 'Mostrar <span class="comments-count">'+num+'</span> comentarios previos' );
        }

        return false;
    });
    
    // button favorite
    $( 'body' ).on( 'click', '.btn-favorite', function(e) {
		
      
        e.preventDefault(); 
			
			//  if( $( this ).children( 'i' ).hasClass( 'active' ) == false ) {
            $( '.lightbox-favorited' ).addClass( 'active' );
            //$( this ).children( 'i' ).toggleClass( 'active' );
       // } else {
        //    $( '.warning-remove' ).addClass( 'active' );
        //}
			var id=$(this).parents('.feeds').data('id');
			$('.feed_id').val(id);
				$("li.list_folder").each(function(){
					
											$(this).removeClass("selected");	
											$(this).children('input').removeAttr("checked");	
								});	console.log(id); 
			if(id > 0){
				$.ajax({
	                type: "POST",
	                url: url+'api/add_folder',
	                data: {folder:"send_data", feed_id:id},
	                error: function(){
						console.log("no se recibieron datos");
			        },
	                success: function(response){
						var resp = $.parseJSON( response );
						console.log(resp);
	                    if( resp.message="folders_ok" ){
							if(resp.folder_id.length>0){
							for(i=0;i<resp.folder_id.length;i++){
								$("li.list_folder").each(function(){
										if($(this).data("id")==resp.folder_id[i]){
											$(this).addClass("selected");	
										$(this).children('input').attr('checked','checked');	}
								});
							}
							}
	        		}
					},
				});
	        }
        return false;
    });
    
    // button add: agreca folder a favoritos
    $( 'body' ).on( 'click', '.btn-add', function() {
        $( this ).text( function( i, text ) {
             return text === "Agregar archivero favorito" ? "Guardar" : "Agregar archivero favorito";
        });
        $( '.lightbox-favorited-content .btn-invisible' ).parent().removeClass( 'selected' );
        $( '.btn-delete' ).toggleClass( 'show' );
    });

    // list expand toggle: despliega las listas
    $( 'body' ).on( 'click', '.list-expand', function() {
        $( this ).parent().parent().children( '.list-content' ).toggleClass( 'active' );
        $( this ).children( 'i' ).toggleClass( 'ion-arrow-down-b ion-arrow-up-b' );
        return false;
    });
     
     // button selected: seleccion de carpeta favorito donde se guardara el feed
     $( 'body' ).on( 'click', '.lightbox-favorited-content .btn-invisible', function() {
         $( this ).parent().toggleClass( 'selected' );
        // $( this ).attr( 'checked', 'checked' );
		 if( $( this ).attr("checked") ){
				$( this ).removeAttr( 'checked' );
		}else
			$( this ).attr( 'checked','checked' )		
         return false;
     });
     
     // button active tutorial
    $( 'body' ).on( 'click', '.show-tutorial, .hide-tutorial, .btn-skip', function(e) {
		e.preventDefault();
        if( ($( this ).attr( 'href' ) != '') && ($( this ).attr( 'href' ) != ' ') && ($( this ).attr( 'href' ) != '#') ) {
            var tutorial = $( this ).attr( 'href' );
            $( tutorial ).toggleClass( 'active' );
        } else {
            var what_tutorial = $( '.tutorial.active' ).attr( 'id' );
            
            $( '#' + what_tutorial ).toggleClass( 'active' );
            
            if( $( this ).hasClass( 'btn-skip' )) {
                setTimeout( function(){
                    $( '.next-tutorial' ).removeClass( 'btn-skip' );
                    $( '.next-tutorial' ).html( 'Siguiente' );
                    $( '.step' ).removeClass( 'active' );
                    $( '.step-1' ).addClass( 'active' );
                    
                    step = 1;
                }, 500);
            }
            
        }
        return false;
    });
     
    $( 'body' ).on( 'click', '.show-warning', function() {
        $( '.warning.grl' ).addClass( 'active' );
        return false;
    });

	 // button hide warning
    $( 'body' ).on( 'click', '.hide-warning', function() {
        $( '.warning' ).removeClass( 'active' );
        return false;
    });

    // center element
    $( '.center' ).each(function() {
        var element_height = $(this).innerHeight();
            element_height = parseInt(element_height);

        var margin_top = - element_height / 2;

        $(this).css('margin-top', margin_top);
     });

    // tutorial: seleccion de temas

    $( 'body' ).on( 'click', '.next-tutorial', function() {
        step = step + 1;
        
        if( $( this ).parent().parent().attr('id') != 'temas') {
            if( step == 1 ) {
                $( '.step' ).removeClass( 'active' );
                $( '.step-1' ).addClass( 'active' );
            } else if( step == 2 ) {
                $( '.step' ).removeClass( 'active' );
                $( '.step-2' ).addClass( 'active' );
                $( '.next-tutorial' ).addClass( 'btn-skip' );
                $( '.next-tutorial' ).html( 'Finalizar' );
            } else {
                step = 1;
            }
        } else {

            step1 = "Selecciona el origen para mostrar sus temas";
            step2 = "Elige un tema seleccionando su casilla";
            step3 = "Despliega seleccionando el icono para ver el contenido de cada tema";

            if(step == 1) {
                $( '.step-header span' ).html( step );
                $( '.step-header p' ).html( step1 );
                $( '.point-1' ).addClass( 'active' );
                $( '.point-3' ).removeClass( 'active' );
            }
            else if(step == 2) {
                $( '.example .li-master' ).children( '.list-content' ).addClass( 'active' );
                $( '.step-header span' ).html( step );
                $( '.step-header p' ).html( step2 );
                $( '.point-2' ).addClass( 'active' );
                $( '.point-1' ).removeClass( 'active' );
            }
            else if(step == 3) {
                //step = 1;
                $( '.example .li-parent' ).children( '.list-content' ).addClass( 'active' );
                $( '.step-header span' ).html( step );
                $( '.step-header p' ).html( step3 );
                $( '.next-tutorial' ).html( 'Finalizar' );
                $( '.next-tutorial' ).addClass( 'btn-skip' );
                $( '.point-3' ).addClass( 'active' );
                $( '.point-2' ).removeClass( 'active' );
            } else {
                step = 1;
                $( '.next-tutorial' ).removeClass( 'btn-skip' );

                if( $( '.tutorial' ).hasClass( 'active' ) != true ) {
                    setTimeout(function(){
                        $( '.step-header span' ).html( step );
                        $( '.step-header p' ).html( step1 );
                        $( '.next-tutorial' ).html( 'Siguiente' )
                        $( '.example .list-content' ).removeClass( 'active' );
                        $( '.point-1' ).addClass( 'active' );
                        $( '.point-3' ).removeClass( 'active' );
                    }, 500);
                }

            }
        }

        $( this ).children( 'i' ).toggleClass( 'ion-arrow-down-b ion-arrow-up-b' );
        return false;
    });
	//-------------------------------INDEX HTML FUNCTIONS--------------------------------
	
	$('body').on('click','.update_folder',function(e){ 
				e.preventDefault();
				var $obj = $(this);
				var input=  $('.folder_title');
				var folder_id = $('#folder_id').attr("ng-value");
				var title= input.val().trim();
				var user= window.localStorage.getItem('user');
				if(title.length>0){
					$.post(url+'/api/update_folder',{'title':title,'folder_id':folder_id})
					
						 .error(function(){
								console.log("no se recibieron datos");
								input.val( "" );
	                        })
						 .success(function(data){
						 
							data=$.parseJSON(data);
							console.log(data);
							console.log(data.message);
							if(data.message=="folder_guardado"){
								$.get(url+'api/user_data').error(function(){
								
									console.log('error de conexión');
								}).success(function(response){
									window.localStorage.setItem('user',response);
								});
								$("li[data-id="+data.id+"]").find('h2').html('').html(data.title);
								$("li[data-id="+data.id+"]").find('a.btn-invisible').attr('href','#/tab/favorites/feed/'+data.title+'/'+data.id);
								$( '.lightbox-add.update-folder' ).toggleClass( 'active' );
							}
						 });
				
				}
			});
			$('body').on('click','.deleted_folder',function(e){ 
				e.preventDefault();
				var folder_name =$('.folder_title').attr("placeholder");
				$( '.warning-content.grl' ).find('p').html("").html( '¿Estás seguro de borrar <strong>'+folder_name+'</strong> y todos sus contenidos?' );
				$('.warning-actions.grl').find('a#returns').attr('href',"#");
				$('.warning-actions.grl').find('a#btn-aceptar').addClass('deleted_folder_ok');
				$( '.warning.grl' ).addClass( 'active' );
				return false;
			});
			$('body').on('click','.deleted_folder_ok',function(e){ 
				e.preventDefault();
				var folder_id =  $('#folder_id').attr("ng-value");
				var count_folder="";
				console.log(folder_id);
				if(folder_id>0){
					
					$.post(url+'/api/delete_folder', {'send_data':'eliminar','folder_id':folder_id})
	                        .error(function(){
								console.log("no se recibieron datos");
	                        })
						 .success(function(data){
							data=$.parseJSON(data);
							if(data.message=="folder_eliminado"){
								$.get(url+'api/user_data').error(function(){
								
									console.log('error de conexión');
								}).success(function(response){
									window.localStorage.setItem('user',response);
									response=$.parseJSON(response)
									count_folder=response.favfolder.length;
									console.log(count_folder);
									if(count_folder<1)
										$('.msg').removeClass("ng-hide");
								});
								$("li[data-id="+data.id+"]").remove();
								$( '.lightbox-add.update-folder' ).toggleClass( 'active' );
								$( '.warning-content.grl' ).find('p').html("").html( ' No has dado de alta ningún Tema. Sin personalización de Temas, solo recibirás el Feed genérico sin notificaciones en las sección de Temas ni de Mis Feeds. Puedes continuar y posteriormente hacerlo.' );
								$('.warning-actions.grl').find('a#returns').attr('href',"#/tab/config-feeds");
								$('.warning-actions.grl').find('a#btn-aceptar').removeClass('deleted_folder_ok');
								
								//$( '.warning' ).removeClass( 'active' );
							}
						 });
				}
			});			
			$('body').on('click','#returns', function(e){
				e.preventDefault();
				$( '.warning-content.grl' ).find('p').html("").html( ' No has dado de alta ningún Tema. Sin personalización de Temas, solo recibirás el Feed genérico sin notificaciones en las sección de Temas ni de Mis Feeds. Puedes continuar y posteriormente hacerlo.' );
				$(this).attr('href',"#/tab/config-feeds");
				$('.warning-actions.grl').find('a#btn-aceptar').removeClass('deleted_folder_ok');
				});
			$('body').on('click','.btn-add-folder, .cancel_folder',function(e){
				e.preventDefault();
				$( '.lightbox-add.create-folder' ).toggleClass( 'active' );
				setTimeout(function(){
						$(".title_folder").focus();
					}, 300);	
			});
			$("body").on('click','.create_folder',function(e){
				e.preventDefault();
				var title= $('.title_folder').val().trim();
				if(title.length>0){
					$.post(url+'/api/add_folder', {'title':title})
					
				        .error(function(){
								console.log("no se recibieron datos");
								$('.title_folder').val( "" );
	                        })
						 .success(function(data){
							data=$.parseJSON(data);
							console.log(data);
							if(data.message=='folder_guardado'){
								$.get(url+'api/user_data').error(function(){
									console.log('error de conexión');
								}).success(function(response){
									
									window.localStorage.setItem('user',response);
								});
								var favfolder 	= '<li class="category-element item item-avatar item-icon-left item-button-right" data-id="'+data.id+'">'+
															'<a class="btn-invisible" href="#/tab/favorites/feed/'+data.title+'/'+data.id+'"></a>'+
																'<i class="sprite2x icon icon-folder">0</i>'+
																'<h2>'+data.title+'</h2>'+
																'<p></p>'+
															'<a class="button button-outline button-positive show-lightbox-folder" href="#" onclick="return false;">Editar</a>'+
															'</li>';
								var favfolder2 ='<li class="category-element item item-avatar item-icon-left item-button-right" data-id="'+data.id+'">'+
														'<input class="btn-invisible" type="checkbox">'+
														'<i class="sprite2x icon icon-folder">0</i>'+
														'<h2>'+data.title+'</h2>'+
														'<a class="button button-outline button-positive btn-delete" href="#">Eliminar</a>'+
													'</li>';
								$('.title_folder').val( "" );
								$(".favorite_feeds").append(favfolder);
								$(".favorite_folders").append(favfolder2);
								$(".lightbox-add.create-folder").toggleClass("active");
								$(".msg").addClass('ng-hide');
							}else
								$('.title_folder').css('border','1px solid #FF0000');
							
						 });
				
				}else{
					$('.title_folder').css('border','1px solid #FF0000');
				}
				
			});
			$('body').on('click','.ok_temas',function(e){ 
				var temas_name=[]
				var topics = $("#count_tema").data("topic");
				var temas = $("#count_tema").data("temas");
				
				console.log(topics+' / '+temas )
				$(".tema_id").each(function(){
					if($(this).is(":checked")){
						temas_name.push($(this).data("name"));
					}
				});
				console.log(temas_name)
				if(temas_name.length==0){
					$( '.warning-content.grl' ).find('p').html("").html( ' No has dado de alta ningún Tema. Sin personalización de Temas, solo recibirás el Feed genérico sin notificaciones en las sección de Temas ni de Mis Feeds. Puedes continuar y posteriormente hacerlo.' );
					
				}else{	
					if((topics-temas)>0){
						$('.warning-actions.grl').find('a#btn-aceptar').addClass('add_temas_ok');
						$('.warning-actions.grl').find('a#btn-aceptar').removeAttr('onclick');
						$( '.warning-content.grl' ).find('p').html("").html( 'Temas contratados: '+temas+'/'+topics+', libres: '+(topics-temas)+'<br> Estas seguro de seleccionar este(os) tema(s): <strong>'+temas_name+'.</strong>');
					}else{
						$( '.warning-content.grl' ).find('p').html("").html( 'Temas contratados: '+temas+'/'+topics+', libres: '+(topics-temas)+'<br> ¡Has llegado al límite de tus temas contratados, ya no puedes agregar temas!');
					}
				}
			});
			$('body').on('click','.add_temas_ok', function(e){
				e.preventDefault();
				var temas_id= []
				var temas_name=[]
			
				$(".tema_id").each(function(){
					if($(this).is(":checked")){
						temas_id.push($(this).val());
						temas_name.push($(this).data("name"));
					}
				});
				console.log(temas_id)
				console.log(temas_name)
				$.post(url+'/api/update_temas', {'temas_id':temas_id})
					.error(function(data){
						console.log(data.message);
					})
					.success(function(data){
						data= $.parseJSON(data);
						$.get(url+'api/user_data').error(function(){
										console.log('error de conexión');
								}).success(function(response){
									window.localStorage.setItem('user',response);
								});
						console.log(data);
					});
			});
		$("body").on('click','.btn-upload',function(){
			$('#load_photo').toggleClass("active");
		});			
		$("html").on('keyup','#search',function(e){
			console.log(e.keyCode);
			if(e.keyCode==13){
				var text=$(this).val()
					console.log(text);
					        $( '.lightbox-search' ).toggleClass( 'active' );
						$('#search').val("")
						window.location="#/tab/feeds/busqueda/"+text;
			}
		});
/*---------------------------------------functions bar------------------------------------*/
		
		$("body").delegate(".add_comment", "keypress", function(e){
					if(e.keyCode==13){	
					e.preventDefault();
					var comment = $(this).val().trim();
					var feed_id = $(this).parents(".feeds").data("id");
					var num_comments =$(this).parents(".feeds").find('div.item-body').find('div.item-comments').find('a.show-comments').find("span.comments-count").html();
					var $obj = $(this);
					var href='';
					console.log(comment);
					console.log(feed_id);
					console.log(num_comments);
					if(comment.length > 0){
						$.post(url+'/api/add_comment', {'send_data':'send_data', 'comment': comment, 'feed_id':feed_id})
						.error(function(data){
							console.log("no se recibieron datos");
							$obj.val( "" );
						}).success(function(response){
								var resp = $.parseJSON( response );
								console.log(resp);
								if( resp.message="comentario guardado" ){
									$obj.val( "" );
									$obj.parents(".feeds").find('div.item-body').find('div.item-comments').show().removeClass("ng-hide");
									//$obj.parents(".comments").find("p.comment.active.show").removeClass( "active show" );
									var code = '<li class="comment last-comment">'+
															'<h3 class="ng-binding">'+resp.name.trim()+'</h3>'+
															'<p class="ng-binding"> '+resp.comment.trim()+'</p>'+
															'<p class="date ng-binding">'+resp.date+'</p>'+
														'</li>';
								$obj.parents(".feeds").find('div.item-body').find('div.item-comments').find("ul.comments-list").append( code );
							   }
								if(!$(this).parents(".feeds").find('div.item-body').find('div.item-comments').find('a.show-comments').is(':visible')){
									if((num_comments.length+2)>2) 
										$(this).parents(".feeds").find('div.item-body').find('div.item-comments').find('a.show-comments').show().removeClass("ng-hide").find("span.comments-count").html("").html("Ocultar "+(num_comments.length)+" comentarios previos");	
								}						
						});
	                }else
						console.log("llena el campo para mandar tu comentario");
				}
				});
			$("body").delegate(".add_comment_btn", "click", function(e){
					e.preventDefault();
					var input= $(this).parent().find('label.item-input-wrapper').find('input');
					var comment = input.val().trim();
					var feed_id = $(this).parents(".feeds").data("id");
					var num_comments =$(this).parents(".feeds").find('div.item-body').find('div.item-comments').find('a.show-comments').find("span.comments-count").html();
					var $obj = $(this);
					var href='';
					console.log(comment);
					console.log(feed_id);
					console.log(num_comments);
					if(comment.length > 0){
						$.post(url+'/api/add_comment', {'send_data':'send_data', 'comment': comment, 'feed_id':feed_id})
						.error(function(data){
							console.log("no se recibieron datos");
							input.val( "" );
						}).success(function(response){
								var resp = $.parseJSON( response );
								console.log(resp);
								if( resp.message="comentario guardado" ){
									input.val( "" );
									$obj.parents(".feeds").find('div.item-body').find('div.item-comments').show().removeClass("ng-hide");
									//$obj.parents(".comments").find("p.comment.active.show").removeClass( "active show" );
									var code = '<li class="comment last-comment">'+
															'<h3 class="ng-binding">'+resp.name.trim()+'</h3>'+
															'<p class="ng-binding"> '+resp.comment.trim()+'</p>'+
															'<p class="date ng-binding">'+resp.date+'</p>'+
														'</li>';
								$obj.parents(".feeds").find('div.item-body').find('div.item-comments').find("ul.comments-list").append( code );
							   }
								if(!$(this).parents(".feeds").find('div.item-body').find('div.item-comments').find('a.show-comments').is(':visible')){
									if((num_comments.length+2)>2) 
										$(this).parents(".feeds").find('div.item-body').find('div.item-comments').find('a.show-comments').show().removeClass("ng-hide").find("span.comments-count").html("").html("Ocultar "+(num_comments.length)+" comentarios previos");	
								}						
						});
	                }else
						console.log("llena el campo para mandar tu comentario");
			
				});
	$('body').delegate('.add_to_favfolder','click',function(e){

			e.preventDefault();
			
			var folder_to_add 		= [];
			var folder_to_remove 	= [];

			var $obj 		= $(this);
			var feed_id 	= $("input.feed_id").val();
			
			$(".folder_add").each(function(){
				if( $( this ).attr("checked") ){
					folder_to_add.push( $(this).data('id') );
				}else{
					folder_to_remove.push( $(this).data('id') );
				}
				
			});
			console.log(folder_to_add);
			console.log(folder_to_remove);
			$.ajax({
                type: "POST",
                url: url+'api/add_folder',
                data: {send_data:"send_data", folder_id:folder_to_add, to_remove:folder_to_remove, feed_id:feed_id},
                error: function(){
					console.log("no se recibieron datos");
					$( '.lightbox-favorited' ).toggleClass( 'active' );
                },
                success: function(response){
					
                       // $("body").css("cursor", "default");
                       
                        var resp = $.parseJSON( response );
						console.log(resp);

                        if( resp.message="feed_guardado" ){
							/*$("li.list_folder").each(function(){
								if($(this).hasClass("selected")){
									var num= $(this).find('i').html();
									$(this).find('i').html("").html(parseInt(num)+1);
								}else{
									var num= $(this).find('i').html();
									$(this).find('i').html("").html(parseInt(num)-1);
								}
								});*/
                        	$( '.lightbox-favorited' ).toggleClass( 'active' );

							if( folder_to_add.length > 0 )
								$( this ).children( 'i' ).toggleClass( 'active' );
							else
								$( this ).children( 'i' ).removeClass( 'active' );

							//Pasa a leidos los agregados a favoritos <<< Sólo si está en no leídos >>>
							var read = $('.feeds[data-id="' + feed_id + '"]').hasClass("feed_read");

							if( !read ){
								//$('article.feed[data-id="' + feed_id + '"]').find(".read").remove();
								
								var feeds_noleidos 	= $(".feed_noread").size();
								var feeds_leidos 	= $(".feed_read").size();
								
								$.post('api/feeds_load',{read:'already',feed_id:feed_id}, function(response){
									 	
									 	resp=$.parseJSON(response);

										if( resp.message="feed_leido" ){
											$('.feed[data-id="'+feed_id+'"]').addClass("feed_read");
											$('.feed[data-id="'+feed_id+'"]').removeClass("feed_noread");
											$('.feed[data-id="'+feed_id+'"]').hide();
											$('.feed[data-id="'+feed_id+'"]').find('div.item-header').find('a.read').children('i').toggleClass('ion-ios-eye-outline');
											$('.feed[data-id="'+feed_id+'"]').find('div.item-header').find('a.read').children('i').toggleClass('ion-ios-eye');
											if(feeds_noleidos==1) $(".nof_read").html('').htm(feeds_noleidos-1);
											

										}else if(resp.message="error")
											console.log("Fallo de conexión con la base de datos");
								});
							}
						$.get(url+'api/user_data').error(function(){
										console.log('error de conexión');
								}).success(function(response){
									window.localStorage.setItem('user',response);
								});
						}else{
							$(".msg").html('').html("Ocurrió un error, intenta mas tarde").css('color', 'red').show();
								setTimeout(function(){
									$(".msg").hide();
								}, 4000);
						}
                    },
            });
				
		});
			
});
 }, 1000);