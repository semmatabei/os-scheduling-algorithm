function proses_spn(){
	$(document).ready(function() {	

		stack = [], 
		unFinishProses = [],
		clock = 0,
		savedStack=[],
		cur_proses=null;

		// mengisikan unFinishProses dengan semua proses
		for (var i = 0; i < numProses; i++) 	unFinishProses.push(i);

		ani = window.setInterval(function(){
			if(hold==false){

			 	$(".w-datang").each(function(){
			 		var me = $(this);

			 		// first time put proses on stack
			 		if(me.val()==clock){
			 			// masukan proses ke stack
			 			var id_proses = me.attr("data-id");
			 			var w_eks = $(".w-eks[data-id="+id_proses+"]").val();
			 			var w_datang = $(".w-datang[data-id="+id_proses+"]").val();
			 			var w_initial = w_eks;
			 			// cek elemen pertama sudah diproses atau belum
			 			
			 			stack.unshift([id_proses,w_eks,w_initial,w_datang]);

			 			// sorting
			 			if(stack.length>1){
			 				// jika sudah terproses yg pertama
				 			if(stack[1][1]!=stack[1][2]){
				 				var _temp = stack.shift();
				 				var _temp2 = stack.shift();
				 				stack.unshift(_temp);
				 				stack.sort(sortfunction);
				 				stack.unshift(_temp2);
				 			}else{
				 				stack.sort(sortfunction);
				 			}
			 			}
		 					
			 		}
			 	});

			 	function sortfunction(a, b){
					if(a[2]>b[2]) return 1;
					else if(a[2]<b[2]) return -1;
					else if(a[3]<b[3]) return -1;
					else if(a[3]>b[3]) return 1;
					else return 0;
				}

			 	// 0 = id, 1=service time,2=quantum
			 	// pop elemen
			 	if(stack.length>0){

			 		cur_proses = stack.shift();
			 		// kurangi service time
			 		cur_proses[1]--;

			 		// jika masih ada service time 
			 		if(cur_proses[1]>0){
				 		stack.unshift(cur_proses);
			 		}else{
			 			// remove proses dari unFinishProses
			 			var posEl = unFinishProses.indexOf(parseInt(cur_proses[0]));
			 			savedStack.push([cur_proses[0],cur_proses[3],cur_proses[2],clock]);
			 			unFinishProses.splice(posEl, 1);
			 		} 
			 		drawAnimate(numProses,cur_proses[0],clock);
			 	}else{
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