let test = [[10,30],[20,50],[30,70],[40,90]];


class Pop{
	constructor(bots,values){
		this.bots = bots;
		this.values = values;
		this.best = -1;
		this.mutrates = [1,1];
	}
	
	randpop(){
		let n = this.bots.length;
		this.bots = []
		for(var i=0;i<n;i++){
			this.bots.push(new Bot([(Math.random()-0.5)*4,(Math.random()-0.5)*4],this.values,this.mutrates))
		}
	}
	
	run(num){
		for(i=0;i<num;i++){
			let maxerr = this.getmaxerror();
			this.newpop(maxerr);
		}
		return this.getbest().genome;
	}
	
	visualize(maxx,miny,maxy){
		let func = this.run(1)
		let layout = {
			title:'Lineare Regression',
			xaxis:{range:[0,maxx]},
			yaxis:{range:[miny,maxy]}
		};
		let line = {
			x:[0,maxx],
			y:[func[1],func[0]*maxx+func[1]],
			mode:'lines'
		};
		let pointx = []
		let pointy = []
		for(var v of this.values){
			pointx.push(v[0]);
			pointy.push(v[1]);
		}
		let points = {
			x:pointx,
			y:pointy,
			mode:'markers'
		};
		Plotly.newPlot('display', [line,points], layout);
	}
	
	getmaxerror(){
		let currentmax = 0;
		let currentbest = -1;
		let leasterror = Infinity;
		var i = -1;
		for(var bot of this.bots){
			i++;
			let be = bot.geterror()
			if(Math.abs(be)>currentmax){currentmax = be;}
			if(be<leasterror){
				currentbest = i;
				leasterror = be;
			}
		}
		this.best = currentbest;
		return currentmax;
	}
	
	getbest(){
		return this.bots[this.best];
	}
	
	newpop(maxerror){
		let breeder = []
		var i = -1;
		for(bot of this.bots){
			i++;
			for(var n=0;n<=Math.floor(bot.getscore(maxerror));n++){breeder.push(i);}
		}
		let newbots = []
		for(var b=0;b<this.bots.length-1;b++){
			let parent1 = this.bots[breeder[Math.floor(Math.random() * breeder.length)]].genome;
			let parent2 = this.bots[breeder[Math.floor(Math.random() * breeder.length)]].genome;
			let child = [[parent1[0],parent2[0]][Math.floor(Math.random() * 2)],[parent1[1],parent2[1]][Math.floor(Math.random() * 2)]]
			newbots.push(new Bot(child,this.values,this.mutrates))
		}
		for(var bot of newbots){
			bot.mutate();
		}
		newbots.push(new Bot(this.getbest().genome,this.values,this.mutrates));
		this.bots = [...newbots];
	}
}

class Bot{
	constructor(genome,values,mutrates=[1,1]){
		this.genome = genome;
		this.values = values;
		this.error = 0;
		this.mutrate1 = mutrates[0];
		this.mutrate2 = mutrates[1];
	}

	mutate(){
		if(Math.random()>0.5){this.genome[0]+=(Math.random()-0.5)*this.mutrate1;}
		if(Math.random()>0.5){this.genome[1]+=(Math.random()-0.5)*this.mutrate2;}
	}
	
	geterror(){
		this.error = 0;
		let g = this.genome;
		g = [-g[0],-g[1]];
		for(var v of this.values){
			let dist = Math.abs((g[0]*v[0]+v[1]+g[1])/(Math.sqrt(g[0]**2+1)));
			this.error+=dist;
		}
		this.error = (this.error**2)*10;
		return this.error;
	}
	
	getscore(maxerror){
		this.score = (maxerror+1-this.error)
		return this.score;
	}
}

function calc(vals,nbots=20,ngen=100){
	let bs = []
	for(i=0;i<nbots;i++){
		bs.push( new Bot([(Math.random()-0.5)*4,(Math.random()-0.5)*200],vals) )
	}
	let p = new Pop(bs,vals)
	p.run(ngen);
	p.visualize(100,-10,100);
	let f = p.getbest().genome;
	document.getElementById("func").innerHTML = "f(x) = "+f[0]+"x + "+f[1]
}

function calc_tbox(){
	let values = document.getElementById("area");
	arr = []
	for(line of values.value.split("\n")){
		let l = line.split(" ");
		let valx = parseFloat(l[0]);
		let valy = parseFloat(l[1]);
		arr.push([valx,valy]);
	}
	let ngen = parseInt(document.getElementById("numgen").value);
	let nbot = parseInt(document.getElementById("numbot").value);
	//alert(arr);
	calc(arr,nbot,ngen);
}

//calc(test)