
const nombreIngresado = prompt("Ingresa un nombre para el contador:");

class Contador {
    // Variable estática para contar todas las instancias de Contador
    static contadorGlobal = 0;
  
    constructor(nombre) {
      // Atributos de instancia
      this.nombre = nombre;
      this.cuentaIndividual = 0;
  
      // Incrementar el contador global al crear una nueva instancia
      Contador.contadorGlobal += 1;
    }
  
    getResponsable() {
      // Devolver el responsable del contador
      return this.nombre;
    }
  
    contar(cantidad = 1) {
      // Incrementar tanto la cuenta individual como la cuenta global
      this.cuentaIndividual += cantidad;
      Contador.contadorGlobal += cantidad;
    }
  
    getCuentaIndividual() {
      // Devolver la cuenta individual del contador
      return this.cuentaIndividual;
    }
  
    getCuentaGlobal() {
      // Devolver la cuenta global
      return Contador.contadorGlobal;
    }
  }
  
  // Ejemplo de uso y prueba de individualidad entre las instancias
  const contador1 = new Contador("Responsable1");
  const contador2 = new Contador("Responsable2");
  
  // Incrementar los contadores
  contador1.contar();
  contador2.contar(2);
  
  // Mostrar información
  console.log(`${contador1.getResponsable()}: Cuenta Individual: ${contador1.getCuentaIndividual()}, Cuenta Global: ${contador1.getCuentaGlobal()}`);
  console.log(`${contador2.getResponsable()}: Cuenta Individual: ${contador2.getCuentaIndividual()}, Cuenta Global: ${contador2.getCuentaGlobal()}`);
  const contador = new Contador(nombreIngresado);

// Mostrar el responsable por consola
console.log(`Responsable: ${contador.getResponsable()}`);





