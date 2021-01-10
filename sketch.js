// NETZWERK:
//  y Vogel, h Pipe, Entfernung zur Pipe

// network = [ [g1,g2,g3,g4,g5,g6,g1,g2],[b1,b2,b3] ] 

dnet = []

class Bird{
  //constructor
  constructor(network){
    this.network = network;
    this.y = 250;
    this.v = 0;
    this.score = 0;
  }
  //Mutation
  mutate(){
    for(let n=0;n<this.network[0].length;n++){
      if(random()>0.90){
      this.network[0][n]+=random(-0.03,0.03);}
    }
    for(let o=0;o<this.network[1].length;o++){
      if(random()>0.90){
      this.network[1][o]+=random(-0.03,0.03);}
    }
    //alert("mutate")
  }
  //Anzeige
  display(best){
	if(best){fill(0,0,255);}
    else{fill(255,0,0);}
    ellipse(50,this.y,30,30);
  }
  //Denken und Rechen
  think(d,h){
    //for()
    this.layer2 = [0,0];
    this.layer2[0] = Math.tanh(this.y/250*this.network[0][0]+h/250*this.network[0][1]+d/250*this.network[0][2]+this.network[1][0]);
    this.layer2[1] = Math.tanh(this.y/250*this.network[0][3]+h/250*this.network[0][4]+d/250*this.network[0][5]+this.network[1][1]);
    
    this.outp = this.sig(this.layer2[0]*this.network[0][6]+this.layer2[1]*this.network[0][7]+this.network[1][2]);
    
    if(this.outp>0.5){this.impuls();}
    this.y-=this.v;
    this.v-=0.3;
  }
  impuls(){
    this.v = 5;
  }
  sig(x){
    return 1/(1+exp(-x));
  }
}

pipes = [];
pipehole = 150;

birds = [];
deadbirds = [];

pipespeed = 2;

gen = 1

sco=0

function newpipe(){
  pipes.push([500,random(25,475-pipehole)]);
}
function newbird(){
  Bot = new Bird([[random(-1,1),random(-1,1),random(-1,1),random(-1,1),random(-1,1),random(-1,1),random(-1,1),random(-1,1)],[random(-1,1),random(-1,1),random(-1,1)]]);
  birds.push(Bot);
}
function newpop(){
  pipespeed=2;
  sco=0;
  gen++;
  pipes=[];
  N = popsize-1;
  birdpool = []
  for(db=0;db<deadbirds.length;db++){
    for(i=0;i<pow(deadbirds[db].score+1,2);i++){birdpool.push(db);}
  }
  birds = []
  //alert(popsize)
  for(i=0;i<popsize-1;i++){
    
	fathernet = deadbirds[birdpool[int(random(0,birdpool.length))]].network;
	mothernet = deadbirds[birdpool[int(random(0,birdpool.length))]].network;
	//alert(fathernet);
	//alert(mothernet);
	childnet = [[],[]]
	for(net=0;net<fathernet[0].length;net++){
		if(random()>0.5){childnet[0].push(fathernet[0][net]);}
		else{childnet[0].push(mothernet[0][net]);}
	}
	for(net=0;net<fathernet[1].length;net++){
		if(random()>0.5){childnet[1].push(fathernet[1][net]);}
		else{childnet[1].push(mothernet[1][net]);}
	}
	//alert(childnet);
    birds.push(new Bird(childnet));
	birds[birds.length-1].mutate();
  }
  birds.push(new Bird(deadbirds[deadbirds.length-1].network));
  deadbirds = [];
  bestalive=true;
  return birds[birds.length-1].network;
}
function drawnet(){
	noFill();
	stroke(0,0,0,100);
	rect(280,10,200,110);
	stroke(0);
	fill(0,0,0,200);
	ellipse(300,30,10,10);
	ellipse(300,60,10,10);
	ellipse(300,90,10,10);
	
	ellipse(380,45,10,10);
	ellipse(380,75,10,10);
	
	ellipse(460,60,10,10);
	
	stroke(	(dnet[0][0]+1)*127,255-(dnet[0][0]+1)*127,0 	);
	line(300,30,380,45);
	stroke(	(dnet[0][1]+1)*127,255-(dnet[0][1]+1)*127,0 	);
	line(300,60,380,45);
	stroke(	(dnet[0][2]+1)*127,255-(dnet[0][2]+1)*127,0 	);
	line(300,90,380,45);
	stroke(	(dnet[0][0]+1)*127,255-(dnet[0][3]+1)*127,0 	);
	line(300,30,380,75);
	stroke(	(dnet[0][1]+1)*127,255-(dnet[0][4]+1)*127,0 	);
	line(300,60,380,75);
	stroke(	(dnet[0][2]+1)*127,255-(dnet[0][5]+1)*127,0 	);
	line(300,90,380,75);
	stroke(	(dnet[0][1]+1)*127,255-(dnet[0][4]+1)*127,0 	);
	line(380,45,460,60);
	stroke(	(dnet[0][2]+1)*127,255-(dnet[0][5]+1)*127,0 	);
	line(380,75,460,60);
	stroke(0);
}

function setup() {
  bestalive = false;
  createCanvas(500,500);
  popsize = 50
  for(i=0;i<popsize;i++){
  newbird();}
}
N = 1000000000;
function draw() {
  background(135,206,250);
  b = 0
  while(b<birds.length & pipes.length>0){
    birds[b].think(pipes[0][0],pipes[0][1]);
    if(birds[b].y-15>500 || birds[b].y+15<0){if(b==birds.length-1){bestalive=false;}deadbirds.push(birds[b]);birds.splice(b,1);}
    else if(pipes[0][0]>=35 & pipes[0][0]<=65){
      if(birds[b].y-15<=pipes[0][1] || birds[b].y+15>=pipes[0][1]+pipehole){if(b==birds.length-1){bestalive=false;}deadbirds.push(birds[b]);birds.splice(b,1);}
      else{birds[b].display(b==birds.length-1 & bestalive);b++;}  
    }
    else{birds[b].display(b==birds.length-1 & bestalive);b++;}
  }
  N++;if(N>=300/pipespeed){newpipe();N=0;}
  for(p=0;p<pipes.length;p++){
    pipes[p][0]-=pipespeed;
    fill(0,200,0);
    rect(pipes[p][0],0,30,pipes[p][1]);
    rect(pipes[p][0],pipes[p][1]+pipehole,30,500)}
  if(pipes.length>0){
    if(pipes[0][0]<-30){
	  pipespeed+=0.1;
	  sco++;
      pipes.shift();
      for(b=0;b<birds.length;b++){
        birds[b].score++;
      }
    }
  }
  if(birds.length==0){dnet = newpop();}
  fill(0);
  text("Generation: "+gen,0,20);
  text("Current Score: "+sco,0,50)
  if(dnet.length>0)drawnet();
}