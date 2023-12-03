class Contador {
    
    static contadorGlobal = 0;
    
    constructor(nombre){
        this.nombre = nombre;
        this.cuentaIndividual = 0;
        Contador.contadorGlobal++;
        this.cuentaIndividual++;
    }
    contar() {
        this.cuentaIndividual++;
    }
           
    getCuentaIndividual() {
        return this.cuentaIndividual;
    }
}
const contar1 = new Contador("franco");
contar1.contar();
console.log(contar1.getCuentaIndividual())

/*/ 
class Contador {
    static cantidad = 0;
    
    constructor() {
        Contador.cantidad++;
    }
    
    obtenerCantidad() {
        return Contador.cantidad;
    }
}

const contador1 = new Contador();
const contador2 = new Contador();
const contador3 = new Contador();
const contador4 = new Contador();
const contador5 = new Contador();
const contador6 = new Contador();
const contador7 = new Contador();

console.log(contador1.obtenerCantidad());

/*/