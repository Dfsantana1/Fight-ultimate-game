const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let playerScore = 0;
let enemyScore = 0;

var isGamePaused = false;
var animationId;
var welcomeMessage = document.getElementById('welcomeMessage');
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/fondo.jpg',
})

const house = new Sprite({
  position: {
    x: 600,
    y: 185
  },
  imageSrc: './img/casa.png',
  scale: 1,
  framesMax: 1
})

const tower = new Sprite({
  position: {
    x: 0,
    y: 40
  },
  imageSrc: './img/torre.png',
  scale: 1,
  framesMax: 1
})

const player = new Fighter({
  position: {
    x: 0,
    y: 50
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 75
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 80
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

function hideWelcomeMessage() {
  // O bien, puedes eliminar el elemento del mensaje de bienvenida
   welcomeMessage.parentNode.removeChild(welcomeMessage);
}
function animate() {
  setTimeout(hideWelcomeMessage, 500);
  if (!isGamePaused) {
    animationId = requestAnimationFrame(animate);

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
  
    c.fillStyle = 'rgba(255, 0, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    house.update();
    tower.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = -5;
      player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = 5;
      player.switchSprite('run');
    } else {
      player.switchSprite('idle');
    }

    // jumping
    if (player.velocity.y < 0) {
      player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall');
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = -5;
      enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
      enemy.velocity.x = 5;
      enemy.switchSprite('run');
    } else {
      enemy.switchSprite('idle');
    }

    // jumping
    if (enemy.velocity.y < 0) {
      enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite('fall');
    }

    // detect for collision & enemy gets hit
 if (
  rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
  }) &&
  player.isAttacking &&
  player.framesCurrent === 4
) {
  enemy.takeHit();
  player.isAttacking = false;

  gsap.to('#enemyHealth', {
    width: enemy.health + '%'
  });

  // Incrementar el puntaje del jugador
  playerScore++;
  // Actualizar el marcador del jugador en el HTML
  document.getElementById('playerScore').innerText = playerScore;
} else if (player.isAttacking && player.framesCurrent === 4) {
  player.isAttacking = false;
}

if (
  rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
  }) &&
  enemy.isAttacking &&
  enemy.framesCurrent === 2
) {
  player.takeHit();
  enemy.isAttacking = false;

  gsap.to('#playerHealth', {
    width: player.health + '%'
  });

  // Incrementar el puntaje del enemigo
  enemyScore++;
  // Actualizar el marcador del enemigo en el HTML
  document.getElementById('enemyScore').innerText = enemyScore;
} else if (enemy.isAttacking && enemy.framesCurrent === 2) {
  enemy.isAttacking = false;
}

// Fin del juego basado en la salud
if (enemy.health <= 0 || player.health <= 0) {
  if (enemy.health <= 0 && player.health <= 0) {
    // Empate: ambos jugadores pierden
    determineWinner({ player: null, enemy: null, timerId });
  } else {
    // Hay un ganador claro
    determineWinner({ player, enemy, timerId });
  }

  // Deshabilitar la capacidad de ataque de los jugadores
  player.isAttacking = false;
  enemy.isAttacking = false;
}
  }}


document.addEventListener('DOMContentLoaded', function() {
  var button = document.querySelector('#boton-container button');
  var isGamePaused = false;
  var currentSecond = 0;

  button.addEventListener('click', function() {
    // Alternar el estado del juego al hacer clic en el botón
    isGamePaused = !isGamePaused;

    if (isGamePaused) {
      // Si el juego está pausado, cancelar el temporizador y guardar el segundo actual
      clearTimeout(timerId);
      currentSecond = timer;
      cancelAnimationFrame(animationId);
    } else {

      // Si el juego se reanuda, iniciar o reiniciar el temporizador según el valor inicial
      decreaseTimer(currentSecond);
      animate();
    }
  });
});



document.addEventListener('DOMContentLoaded', function() {
  var resetButton = document.querySelector('#reset-button');
  resetButton.addEventListener('click', function() {
    location.reload(); // Recargar la página para reiniciar todo
  });
});


openModal()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

function openModal() {
  var modal = document.getElementById("videoModal");
  modal.style.display = "block";

  var videoFrame = document.getElementById("videoFrame");
  videoFrame.src = "./img/Fight ultimate game!.mp4";
}

function closeModal() {
  var modal = document.getElementById("videoModal");
  modal.style.display = "none";

  var videoFrame = document.getElementById("videoFrame");
  videoFrame.src = "";
}
