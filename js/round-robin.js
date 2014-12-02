function proses_rr(){
	$(document).ready(function() {	

		stack = [], 
		unFinishProses = [],
		clock = 0,
		savedStack=[],
		cur_proses=null,
		prev_proses=null;

		// mengisikan unFinishProses dengan semua proses
		for (var i = 0; i < numProses; i++) 	unFinishProses.push(i);

		ani = window.setInterval(function(){
			if(hold==false){

				if(stack.length>0)	cur_proses = stack.shift();

			 	$(".w-datang").each(function(){
			 		var me = $(this);

			 		// first time put proses on stack
			 		if(me.val()==clock){
			 			// masukan proses ke stack
			 			var id_proses = me.attr("data-id");
			 			var w_eks = $(".w-eks[data-id="+id_proses+"]").val();
			 			var w_datang = $(".w-datang[data-id="+id_proses+"]").val();
			 			var w_initial = w_eks;
			 			
			 			var newProses = [id_proses,w_eks,quantum,w_datang,w_initial]; 
			 			if(cur_proses==null){
			 				cur_proses=newProses;
			 			}else if(stack.length==0 && cur_proses!=null && prev_proses==cur_proses[0] && cur_proses[2]==quantum){
			 				stack.unshift(cur_proses);
			 				cur_proses=newProses;
			 			}else if(stack.length>0){
							var backEl = stack.pop();
			 				if(backEl[0]==prev_proses){
			 					stack.push(newProses);
			 					stack.push(backEl);
			 				}else{
			 					stack.push(backEl);
			 					stack.push(newProses);
			 				}
			 			}else{
			 				stack.push(newProses);
			 			}
			 		}
			 	});


			 	// 0 = id, 1=service time,2=quantum
			 	// pop elemen
			 	if(cur_proses!=null){
			 		// proses kuantum
			 		cur_proses[2]--;

			 		// kurangi service time
			 		cur_proses[1]--;

			 		// jika masih ada service time 
			 		if(cur_proses[1]>0){
				 		if(cur_proses[2]==0){
				 			// kembalikan nilai kuantum
				 			cur_proses[2]=quantum;
				 			// taruh elemen di belakang
				 			stack.push(cur_proses);
				 		}else{
				 			// taruh elemen didepan lagi
				 			stack.unshift(cur_proses);
				 		}
			 		}else{
			 			// remove proses dari unFinishProses
			 			
			 			var posEl = unFinishProses.indexOf(parseInt(cur_proses[0]));
			 			savedStack.push([cur_proses[0],cur_proses[3],cur_proses[4],clock]);
			 			unFinishProses.splice(posEl, 1);
			 		} 
			 		prev_proses=cur_proses[0];
			 		drawAnimate(numProses,cur_proses[0],clock);
			 	}else{
			 		prev_proses=null;
			 		drawAnimate(numProses,-1,clock);
			 	}	


			 	

				// set current proses ke null lagi
			 	cur_proses=null;

			 	// naikan clock
			 	clock+=1;

			 	// semua proses udah dijalankan
			 	if(unFinishProses.length==0){	
			 		drawTable();
			 		window.clearInterval(ani);
			 	}
			 }
		},duration);
	});
}