const config = {
    title: "",
    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        type: Phaser.AUTO,
        parent: "contenedor",
        width: 800,
        height: 600,
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default:'arcade',
        arcade: {
            gravity:{y: 300},
            debug: false
        }
    },
    
}

var game = new Phaser.Game(config);
var Puntos = 0;
var PuntosTexto;
var gameOver = false;
var Nivel = 1;
var NivelTexto;


function preload (){
    this.load.setPath('./Assets/');
    
    this.load.image(['Esfera','Fondo','Plataforma']);
    
    this.load.spritesheet('Jugador','Jugador.png',{ frameWidth: 32.5, frameHeight: 41 });

    this.load.audio('sonido', 'coin_audio.mp3');
    this.load.audio('soundNivel2', 'nivel2.mp3');
    this.load.audio('soundNivel3', 'nivel3.mp3');
    this.load.audio('soundNivel4', 'nivel4.mp3');
    this.load.audio('soundMuerte', 'grito.mp3');
    this.load.audio('soundCelebracion', 'celebracion.mp3');

    this.load.image('particula', 'Particle/corazon.png');
    this.load.image('Coin', 'Img/item-corazon.png');
};
function create (){

    this.add.image(400,300,'Fondo').setScale(1,1.15);
    // Particulas
    particulas = this.add.particles('particula');
    var emitter = particulas.createEmitter({
        speed : 100,
        repeat: 1,
        frameRate: 0,
        scale : { start:0.02, end: .1 },
        blendMode : 'ADD',
    });
    Plataforma = this.physics.add.staticGroup();

    console.log(emitter);

    Plataforma.create(400,590,'Plataforma').setScale(2.1,1.1);
    Plataforma.create(400, 590, 'Plataforma').setScale(2.1, 1).refreshBody();
    Plataforma.create(400, 0, 'Plataforma').setScale(2.1, 1).refreshBody();
    Plataforma.create(700, 410, 'Plataforma').setScale(0.3, 1).refreshBody();
    Plataforma.create(400, 300, 'Plataforma').setScale(0.2, 1).refreshBody();
    
    // Plataforma 1
    Plataforma.create(320, 170, 'Plataforma').setScale(0.2, 1).refreshBody();
    // Plataforma 2
    Plataforma.create(580, 450, 'Plataforma').setScale(0.1, 1).refreshBody();

    Plataforma.create(800, 150, 'Plataforma');
    Plataforma.create(-50, 300, 'Plataforma');
    Plataforma.create(0, 450, 'Plataforma');

    Jugador = this.physics.add.sprite(230,100,'Jugador');
    Jugador.setCollideWorldBounds(true);
    Jugador.setBounce(0.2);
    this.physics.add.collider(Jugador,Plataforma);
    Plataforma.getChildren()[0].setOffset(0,10);

    this.anims.create({
        key: 'Izquierda',
        frames: this.anims.generateFrameNumbers('Jugador', {start:0, end:3}),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'Derecha',
        frames: this.anims.generateFrameNumbers('Jugador', {start:5, end:8}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'Quieto',
        frames: [ { key: 'Jugador', frame: 4 } ],
        frameRate: 20
    });


    coins = this.physics.add.group({
        key: 'Coin',
        repeat: 11,
        setXY: { x: 12, y: 50, stepX: 70 }
    });
 
    this.physics.add.collider(Plataforma, coins);

    coins.children.iterate(function(child){
        child.setBounce(Phaser.Math.FloatBetween(0.4,0.8));
    });

    this.physics.add.overlap(Jugador, coins, esconder,null,this);
 
    PuntosTexto = this.add.text(300,560,'Puntos: 0', { fontSize: '40px', fill: 'red'});
    NivelTexto = this.add.text(50,570,'Nivel : 1', { fontSize: '20px', fill: 'black' ,    backgroundColor : 'white',});
    enemigos = this.physics.add.group();
    
    this.physics.add.collider(Plataforma,enemigos);

    this.physics.add.collider(Jugador,enemigos,choque,null,this);
    
    emitter.startFollow(Jugador);

    
};

function choque(Jugador, enemigos){
    this.sound.play('soundMuerte');
    this.physics.pause();
    this.add.text(300,200,'GAME OVER', { fontSize: '60px', fill: 'white'});
    Jugador.tint = 0;
    Jugador.anims.play('Quieto');
    gameOver = true;

    
}

function esconder(Jugador, Coin){
    this.sound.play('sonido');
    Coin.disableBody(true, true);

    Puntos+= 10;
    PuntosTexto.setText('Puntos:'+ Puntos);
  
    if(Puntos == 300){
        this.sound.play('soundCelebracion');    
    }

    
    if (coins.countActive(true) === 0)
    {
        Nivel +=1;
        NivelTexto.setText('Nivel: '+ Nivel);

        coins.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true)
        });

        var x = (Jugador.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        if(Nivel % 2 == 0 && Nivel !=2){
            Esferas = enemigos.create(x, 16, 'Esfera').setScale(3,1);
            Esferas.setBounce(1);
            Esferas.setCollideWorldBounds(true);
            Esferas.setVelocity(Phaser.Math.Between(-100, 100), 5);
        }else{
            
            Esferas = enemigos.create(x, 16, 'Esfera');
            Esferas.setBounce(1);
            Esferas.setCollideWorldBounds(true);
            Esferas.setVelocity(Phaser.Math.Between(-100, 100), 5);
        }

      
        switch (Nivel) {
            case 2:
                this.sound.play('soundNivel2');
                break;
            case 3:
                this.sound.play('soundNivel3');
                break;
            case 4:
                this.sound.play('soundNivel4');
                break;
        }
    
    }
}

function update(time, delta){
    if(gameOver){
        return;
    }
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown)
    {
        Jugador.setVelocityX(-200);
        Jugador.anims.play('Izquierda', true);
    }
    else if (cursors.right.isDown)
    {
        Jugador.setVelocityX(200);
        Jugador.anims.play('Derecha', true);
    }
    else
    {
        Jugador.setVelocityX(0);
        Jugador.anims.play('Quieto');
    }

    if (cursors.up.isDown && Jugador.body.touching.down)
    {
        Jugador.setVelocityY(-310);
    }
}; 