// File javascript Utama

// inisialisasi variabel global

var quantum = 2, // meyimpan jumlah quantum
	duration=500, // menyimpan durasi animasi
	alg, // meyimpan algritma yang dipilih
	ani, // menampung setinterval
	stack = [],  // meyimpan proses yang sedang diproses
	numProses = 0,  // meyimpan jumlah proses
	unFinishProses = [], //meyimpan proses yang belum selesai diproses
	clock = 0, // menyimpan clock
	stackLevel = 0, // jumlah level stack (untuk algoritma feedback)
	cur_proses=null, // proses saat ini
	prev_proses=null, // proses sebelum
	savedStack=[], // meyimpan stack yang telah diproses
	randomColor=[], //menyimpan warna proses
	hold=false; // penentu play/pause



$(document).ready(function() {

	// ketika nilai jumlah proses diubah
	$("#n-proses").change(function(){
		var me = $(this);
		if(isNaN(me.val())){
			alert("bukan angka");
			me.val("").focus();
		}else{
			var numP = me.val();
			var app = "";
			for (var i = 0; i < numP; i++) {
				var str_nama="<td><input class='proses-item i-nama' data-id='"+i+"' value='"+String.fromCharCode(65+i)+"' /></td>";
				var str_datang = "<td><input class='proses-item w-datang' data-type='number' data-id='"+i+"' value='"+(i)+"' /></td>";
				var str_eks = "<td><input class='proses-item w-eks' data-type='number' data-id='"+i+"' value='"+1+"' /></td>";
				app+="<tr>"+str_nama+str_datang+str_eks+"</tr>";
			};
			$("#proses-tabel tbody").html(app);
		}
		return false;
	});

	$("#alg").change(function(){
		alg = $("#alg").val();
		if(alg==1){
			$(".antrian-div").show();
		}else{
			$(".antrian-div").hide();
		}
		if(alg==0 || alg==1){
			$(".kuantum-div").show();	
		}else{
			$(".kuantum-div").hide();	
		}
	});

	// ketika tombol run di klik
	$("#proses-alg").click(function(){

		alg = $("#alg").val();
		randomColor=[];
		numProses = $("#n-proses").val();
		stackLevel = $("#n-antrian").val();
		quantum = $("#kuantum").val();

		start();
		return false;
	});

	$("#close-petunjuk").click(function(){
		$("#content-petunjuk").fadeOut();
		return false;
	});

	$("#petunjuk").click(function(){
		$("#content-petunjuk").fadeIn();
		return false;
	});

	// Tombol replay
	$("#replay").click(function(){
		start();
		return false;
	});

	// Tombol Play/Pause
	$("#pause_play").click(function(){
		if(hold==true){
			$(this).html("Pause");
			hold=false;
		}else{
			$(this).html("Play");
			hold=true;
		}	
		return false;
	});

	// Tombol Faster
	$("#faster").click(function(){
		if(duration>0) duration-=100;
		$("#time-interval").html(duration+" ms");
		return false;
	});

	// Tombol Slower
	$("#slower").click(function(){
		if(duration<2000) duration+=100;
		$("#time-interval").html(duration+" ms");
		return false;
	});

	// Fungsi Memulai simulasi
	function start(){

		hold=false;
		window.clearInterval(ani);
		$("#result  .place").html("");
		$("#ntat-div  .place").html("");
		drawFirst(numProses);

		switch(alg){
			case "0" : proses_rr(); 
			break;
			case "1" : proses_fb();
			break;
			case "2" : proses_spn();
			break;
			case "3" : proses_srt();
			break;
			case "4" : proses_fcfs();
			break;
			default : break;
		}	
	}

});

function drawFirst(numProses){
	$(document).ready(function() {

		var elClockCol = '<div class="clock-div proses-title"><div class="clock-col">Proses</div>';
		for (var i = 0; i < numProses; i++) {
			elClockCol += '<div class="clock-col">'+($(".i-nama[data-id="+i+"]").val())+'</div>';
		};
		elClockCol += '<div class="clock-col clock-number">Clock</div>';
		elClockCol+='</div>';
		$("#result  .place").append($(elClockCol));
	});
}

function drawAnimate(numProses,inAni,clock){

	$(document).ready(function() {
		if(randomColor.length==0){
			for (var i = 0; i < numProses; i++) {
				randomColor[i]=get_random_color();
				console.log(randomColor[i]);
			};	
		}
		
		var elClockCol = '<div class="clock-div"><div class="clock-col proses-title"></div>';
		for (var i = 0; i < numProses; i++) {
			if(i==inAni)	elClockCol += '<div class="clock-col"><span style="background:'+randomColor[inAni]+'"></span></div>';
			else elClockCol += '<div class="clock-col"></div>';
		};

		elClockCol += '<div class="clock-col clock-number">'+clock+'</div>';
		elClockCol+='</div>';
		var mine = $(elClockCol);
		mine.find("span").animate({width:29},duration);
		$("#result  .place").append(mine).width($("#result  .place").width()+32);
	});
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function drawTable(){
	$(document).ready(function() {



		function sortfunction(a, b){
			if(a[0]>b[0]) return 1;
			else if(a[0]<b[0]) return -1;
			else return 0;
		}

		savedStack.sort(sortfunction);

		var header = '<div class="ntat-table-div title">';
				header+='<div class="row-title">Proses</div>';
				header+='<div class="row-title">Finish Time</div>';
				header+='<div class="row-title">Arrival Time</div>';
				header+='<div class="row-title">Turnaround Time(T<sub>r</sub>)</div>';
				header+='<div class="row-title">Service Time(T<sub>s</sub>)</div>';
				header+='<div class="row-title">NTAT(T<sub>r</sub>/T<sub>s</sub>)</div>';
			header+='</div>';
		$("#ntat-div  .place").append(header);


		var elClockCol = '';
		var tr_time = 0;
		var ntat_time = 0;
		for (var i = 0; i < savedStack.length; i++) {
			
			tr_time+=(savedStack[i][3]+1-savedStack[i][1]);
			var temp_ntat_time = ((savedStack[i][3]+1-savedStack[i][1])/savedStack[i][2]).toFixed(2);
			ntat_time+=parseFloat(temp_ntat_time);

			elClockCol+= '<div class="ntat-table-div value">';
				elClockCol+='<div class="val-row top-row">'+$(".i-nama[data-id="+savedStack[i][0]+"]").val()+'</div>';
				elClockCol+='<div class="val-row f-time">'+(savedStack[i][3]+1)+'</div>';
				elClockCol+='<div class="val-row a-time">'+savedStack[i][1]+'</div>';
				elClockCol+='<div class="val-row tr-time">'+(savedStack[i][3]+1-savedStack[i][1])+'</div>';
				elClockCol+='<div class="val-row sr-time">'+(savedStack[i][2])+'</div>';
				elClockCol+='<div class="val-row ntat-time">'+(temp_ntat_time)+'</div>';
			elClockCol+= '</div>';
		};
		$("#ntat-div .place").append(elClockCol).width($("#ntat-div  .place").width()+32);

		var footer = '<div class="ntat-table-div footer">';
				footer+='<div class="row-title">Mean</div>';
				footer+='<div class="row-title">&nbsp;</div>';
				footer+='<div class="row-title">&nbsp;</div>';
				footer+='<div class="row-title">'+(tr_time/savedStack.length)+'</div>';
				footer+='<div class="row-title">&nbsp;</div>';
				footer+='<div class="row-title">'+(ntat_time/savedStack.length).toFixed(2)+'</div>';
			footer+='</div>';
		$("#ntat-div  .place").append(footer).width($("#ntat-div  .place").width()+32);
	});
}