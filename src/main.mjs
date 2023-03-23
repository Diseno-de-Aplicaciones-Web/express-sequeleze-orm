import express from "express"
import cors from "cors"
import { Sequelize, DataTypes }  from 'sequelize';

const app = express()
app.use(cors())
app.use(express.json())

/**
 * CONFIGURAR TABLAS BASE DE DATOS
 */

/**
 * Creamos una instancia de sequelize apuntando a una
 * base de datos, en este caso un fichero de SQLite.
 * El fichero de SQLite se creará automáticamente.
 */
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

/**
 * Definimos nuestros "modelos".
 * Los modelos representan a los datos almacenados
 * en una tabla de la base de datos.
 */
const Tarefa = sequelize.define('Tarefa', {
  // id: Sequelize se ocupa del id de los modelos por nosotros.
  descripcion: {
    type: DataTypes.STRING
  },
  completada: {
    type: DataTypes.BOOLEAN
  }
});

/**
 * Pedimos a sequelize que adapte las tablas en la base
 * de datos a los modelos definidos.
 */
await sequelize.sync({ alter: true })

/**
 * FIN CONFIGURACION TABLAS BASE DE DATOS
 */

app.post("/tarefa/", async (peticion, respuesta)=>{
    const tarefa = await Tarefa.create(peticion.body)
    respuesta.status(201)
    respuesta.send(JSON.stringify(tarefa))
})

app.get("/tarefa/", async (peticion, respuesta)=>{
    if (peticion.query.id) {
        const tarefa = await Tarefa.findOne(
            {
                where: {
                    id: peticion.query.id
                }
            }
        )
        respuesta.status(200)
        respuesta.send(JSON.stringify(tarefa))
    } else  {
        const todasAsTarefas = await Tarefa.findAll()
        respuesta.status(200)
        respuesta.send(JSON.stringify(todasAsTarefas))
    }
})

app.listen( 8000,()=>{
    console.log("Express traballando...");
})