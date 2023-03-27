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
    try {
        const tarefa = await Tarefa.create(peticion.body)
        respuesta.setHeader("Content-Type", "application/json")
        respuesta.status(201)
        respuesta.send(tarefa.toJSON())
    } catch (error) {
        respuesta.status(500)
        respuesta.send('Error.')
    }
})

app.get("/tarefa/", async (peticion, respuesta)=>{
    if (peticion.query.id) {
        try {
            const tarefa = await Tarefa.findByPk(peticion.query.id)
            respuesta.setHeader("Content-Type", "application/json")
            respuesta.status(200)
            respuesta.send(tarefa.toJSON()) 
        } catch (error) {
            respuesta.status(500)
            respuesta.send('Error.')
        }
    } else  {
        try {
            const todasAsTarefas = await Tarefa.findAll()
            respuesta.setHeader("Content-Type", "application/json")
            respuesta.status(200)
            respuesta.send(JSON.stringify(todasAsTarefas))
        } catch (error) {
            respuesta.status(500)
            respuesta.send('Error.')
        }
    }
})

app.put("/tarefa/", async (peticion, respuesta)=>{
    try {
        const tarefa = await Tarefa.findByPk(peticion.body.id)
        await tarefa.update(peticion.body)
        respuesta.status(200)
        respuesta.send("Ok")        
    } catch (error) {
        respuesta.status(500)
        respuesta.send('Error.')
    }
})

app.delete("/tarefa/", async (peticion, respuesta)=>{
    try {
        const tarefa = await Tarefa.findByPk(peticion.body.id)
        await tarefa.destroy()
        respuesta.status(200)
        respuesta.send("Ok")        
    } catch (error) {
        respuesta.status(500)
        respuesta.send('Error.')
    }
})

app.listen( 8000,()=>{
    console.log("Express traballando...");
})