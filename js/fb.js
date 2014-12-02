function proses_fb(){
	$(document).ready(function() {	

		stack = [], 
		savedStack=[],
		unFinishProses = [],
		clock = 0,
		cur_proses=null,
		prev_proses=null;

		
		// mengisikan unFinishProses dengan semua proses
		for (var i = 0; i < numProses; i++) 	unFinishProses.push(i);
		// inisialisasi jumlah stack
		for (var i = 0; i < stackLevel; i++) 	stack[i]=[];

		ani = window.setInterval(function(){
			if(hold==false){
				// lanjutkan proses di level n jika kuantum masih ada
				if(prev_proses!=null){
					if(prev_proses[2]!=quantum)	cur_proses = stack[prev_proses[3]].shift();
				}	

				// jika tidak ada proses yang sedang dijalankan, maka jalankan proses di level 0
				if(stack[0].length>0 && cur_proses==null){
					cur_proses = stack[0].shift();
				}	

			 	$(".w-datang").each(function(){
			 		var me = $(this);

			 		// first time put proses on stack
			 		if(me.val()==clock){
			 			// masukan proses ke stack
			 			var id_proses = me.attr("data-id");
			 			var w_eks = $(".w-eks[data-id="+id_proses+"]").val();
			 			var w_datang = $(".w-datang[data-id="+id_proses+"]").val();
			 			var w_initial = w_eks;
			 			var level = 0;

			 			stack[0].push([id_proses,w_eks,quantum,level,w_datang,w_initial]);

			 			// jika proses sekarang levelnya 0 dan merupakan proses sebelum
			 			if(cur_proses!=null){
			 				if(cur_proses[3]==0 && cur_proses[2]==quantum){
			 					if(prev_proses!=null){
			 						// barusan diproses
			 						if(prev_proses[0]==cur_proses[0]){
				 						stack[0].push(cur_proses);
			 							cur_proses=null;
			 						}
			 						// belum diproses
			 					}
			 					// ga ada proses sebelum
				 			}	
			 			}
			 			
			 			if(cur_proses==null)	cur_proses=stack[0].shift();
			 		}
			 	});

			 	var next=false;
			 	var filled=false;
			 	// jika suatu proses sudah selesai jatahnya dan tidak ada proses di level 0
			 	if(cur_proses==null){
			 		next=true;
			 	}else{
			 		if(prev_proses!=null){
			 			if(prev_proses[0]==cur_proses[0] && cur_proses[2]==quantum){
			 				filled=true;
			 				next=true;
			 			}
			 		}
			 	}

			 	if(next==true){
			 		for (var i = 1; i < stackLevel; i++) {
			 			if(stack[i].length>0){
			 				var isDo = false;
			 				if(prev_proses!=null){
			 					if(!(prev_proses[3]==i && stack[i][0][0]==prev_proses[0])){
				 					isDo=true;
				 				}	
			 				}else{
			 					isDo=true;
			 				}
			 				if(isDo==true){
			 					if (filled==true) {
				 					stack[cur_proses[3]].push(cur_proses);
				 				}
				 				cur_proses=stack[i].shift();
				 				break;	
			 				}
			 				
			 			} 
			 		}
			 	}
			 	// 0 = id, 1=service time,2=quantum
			 	// memproses proses
			 	if(cur_proses!=null){

			 		// turunkan level proses sebelumnya
			 		if(prev_proses!=null){
			 			if(prev_proses[0]!=cur_proses[0]){
							var prev = stack[prev_proses[3]].pop();	
							if((prev[3]+1)<stackLevel)	prev[3]++;
				 			stack[prev[3]].push(prev);	
			 			}
			 		}
			 		

			 		// kurangi nilai kuantum proses tersebut
			 		cur_proses[2]--;

			 		// kurangi service time
			 		cur_proses[1]--;

			 		// jika masih ada service time 
			 		if(cur_proses[1]>0){

			 			// jika nilai kuantum habis
				 		if(cur_proses[2]==0){

				 			// kembalikan nilai kuantum
				 			cur_proses[2]=quantum;
			 				stack[cur_proses[3]].push(cur_proses);
				 		}else{
				 			// taruh elemen didepan lagi
				 			stack[(cur_proses[3])].unshift(cur_proses);
				 		}
				 		prev_proses=cur_proses;
			 		}else{
			 			// remove proses dari unFinishProses
			 			var posEl = unFinishProses.indexOf(parseInt(cur_proses[0]));
			 			savedStack.push([cur_proses[0],cur_proses[4],cur_proses[5],clock]);
			 			unFinishProses.splice(posEl, 1);
			 			prev_proses=null;
			 		} 
			 		
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