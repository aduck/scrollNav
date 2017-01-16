/*
* @ nid String 导航ID 必选
* @ cid String 容器ID 可选
*	@ ports Array 监测点 可选
* @ start Function 导航处于可视范围内触发 可选
* @ leave Function 导航不可视时触发 可选
* @ exceptNav 高度识别是否包含导航高度 可选
*/

window.scrollNav=(function(){
	// 高度检测函数
	function wScrollHandler($nav,$container,navOffTop,containerOffTop,navH,containerH,heights,start,leave,exceptNav){
		var sTop=document.documentElement.scrollTop || document.body.scrollTop
		var navState // 可视范围内值为1 其他为0
		var currentId 
		// nav处理
		if($container.length<1){
			if(parseInt(sTop)>navOffTop){
				navState=1
				$nav.addClass('navFix')
				start && start($nav)
			}else{
				$navState=0
				$nav.removeClass('navFix')
				leave && leave($nav)
			}
		}else{
			if(parseInt(sTop)>=navOffTop && parseInt(sTop)<containerOffTop+containerH){
				navState=1
				$nav.addClass('navFix')
				start && start($nav)
			}else{
				navState=0
				$nav.removeClass('navFix')
				leave && leave($nav)
			}
		}
		// 监测点处理
		$.each(heights,function(i,item){
			if(!!exceptNav){
				if(parseInt(sTop)+2*navH>=item.height){
					currentId=item.id
				}
			}else{
				if(parseInt(sTop)>item.height){
					currentId=item.id
				}
			}
		})
		if(currentId && navState){
			$('[data-id]').removeClass('current')
			$('[data-id='+currentId+']').addClass('current')
		}else{
			$('[data-id]').removeClass('current')
		}
	}

	function loadHandler(ports){
		var heights=[]
		if(!ports || !ports instanceof Array) return
		$.each(ports,function(i,port){
			heights.push({
				'id':port,
				'height':parseInt($('#'+port).offset().top)
			})
		})
		function px(o1,o2){
			return o1.height-o2.height
		}
		heights.sort(px)
		return heights
	}

	return {
		init:function(opts){
			var opts= opts || {}
			var nid= opts.nid
			var cid= opts.cid || null
			var ports= opts.ports || []
			var start= opts.start || null
			var leave= opts.leave || null
			var exceptNav= typeof opts.exceptNav!='undefined'? opts.exceptNav : true
			// 初始化
			var $nav=$('#'+nid)
			var $container=$('#'+cid)
			var heights=loadHandler(ports)
			var navOffTop=parseInt($nav.offset().top)
			var containerOffTop=cid ? parseInt($container.offset().top) : null 
			var navH=parseInt($nav.height())
			var containerH=cid ? parseInt($container.height()) : null
			$(window).scroll(function(){
				wScrollHandler($nav,$container,navOffTop,containerOffTop,navH,containerH,heights,start,leave,exceptNav)
			})
		}
	}
})()